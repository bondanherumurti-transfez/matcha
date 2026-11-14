"""One event stream for every provider, consumed by the server and the CLI.

Events: {"type": "text", "text"} | {"type": "tool_call", "name", "args"} |
        {"type": "tool_result", "name", "content"} | {"type": "done", "text", "meta"} |
        {"type": "error", "message"}
"""
from __future__ import annotations

from typing import Any, AsyncIterator

from langchain_core.messages import AIMessageChunk, HumanMessage, ToolMessage

from . import config, tracing
from .agent import get_agent


def _text(content: Any) -> str:
    if isinstance(content, str):
        return content
    if isinstance(content, list):
        return "".join(p.get("text", "") for p in content if isinstance(p, dict) and p.get("type") == "text")
    return str(content or "")


async def _langgraph_events(provider: str, prompt: str, thread_id: str, user: str) -> AsyncIterator[dict]:
    agent = await get_agent(provider)
    cfg = {
        "configurable": {"thread_id": thread_id},
        "run_name": "open-webui-chat",
        "tags": ["open-webui", provider, config.backend_model(provider)],
        "metadata": {"user": user, "provider": provider, "model": config.backend_model(provider)},
        "callbacks": tracing.langchain_callbacks(),   # Langfuse
    }
    full = []
    async for mode, data in agent.astream({"messages": [HumanMessage(prompt)]}, config=cfg,
                                          stream_mode=["messages"]):
        msg, _meta = data
        if isinstance(msg, AIMessageChunk):
            for tc in msg.tool_call_chunks or []:
                if tc.get("name"):
                    yield {"type": "tool_call", "name": tc["name"], "args": tc.get("args")}
            t = _text(msg.content)
            if t:
                full.append(t)
                yield {"type": "text", "text": t}
        elif isinstance(msg, ToolMessage):
            yield {"type": "tool_result", "name": msg.name, "content": _text(msg.content)}
    yield {"type": "done", "text": "".join(full), "emitted_text": bool(full),
           "meta": {"provider": provider, "model": config.backend_model(provider)}}


async def stream_events(provider: str, prompt: str, thread_id: str, user: str = "anon") -> AsyncIterator[dict]:
    model = config.backend_model(provider)
    # Langfuse: one trace per turn, grouped into a session per chat thread.
    with tracing.trace_attributes(name=f"{provider}-chat", user=user, thread_id=thread_id,
                                  tags=["open-webui", provider, model],
                                  metadata={"provider": provider, "model": model}):
        if provider == "claude":
            from .claude_code import stream_chat
            async for ev in stream_chat(prompt, thread_id):
                yield ev
            return
        from .orchestrator import stream_events as orchestrated_events
        async for ev in orchestrated_events(provider, prompt, thread_id, user):
            yield ev
        return
