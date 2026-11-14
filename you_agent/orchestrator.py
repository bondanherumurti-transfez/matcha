"""Four-role research workflow with optional OpenCrawl handoffs."""
from __future__ import annotations

import asyncio
import logging
import uuid
from pathlib import Path
from typing import Any, AsyncIterator

from langchain_core.messages import HumanMessage

from . import config, opencrawl, tracing
from .agent import build_model, get_you_tools

log = logging.getLogger(__name__)
_ROLE_ORDER = ("detective", "bull", "bear", "judge")
_graphs: dict[str, Any] = {}
_lock = asyncio.Lock()
_PROMPT_DIR = Path(__file__).with_name("prompts")


def _prompt(role: str) -> str:
    return (_PROMPT_DIR / f"{role}.md").read_text(encoding="utf-8").split("\n", 1)[-1].strip()


async def _role_graph(provider: str, role: str):
    key = f"{provider}:{role}"
    if key in _graphs:
        return _graphs[key]
    async with _lock:
        if key not in _graphs:
            tools = await get_you_tools()
            from langchain.agents import create_agent
            _graphs[key] = create_agent(
                model=build_model(provider), tools=tools, system_prompt=_prompt(role),
                name=f"{config.AGENT_NAME}-{role}",
            )
    return _graphs[key]


async def _run_role(provider: str, role: str, prompt: str, thread_id: str, user: str) -> str:
    graph = await _role_graph(provider, role)
    result = await graph.ainvoke(
        {"messages": [HumanMessage(content=prompt)]},
        config={"run_name": f"{role}-research", "tags": ["you-agent", role, provider],
                "metadata": {"user": user, "thread_id": thread_id, "role": role},
                "callbacks": tracing.langchain_callbacks()},
    )
    messages = result.get("messages", [])
    for message in reversed(messages):
        if getattr(message, "type", None) == "ai":
            content = message.content
            if isinstance(content, str):
                return content
            if isinstance(content, list):
                return "\n".join(p.get("text", "") for p in content if isinstance(p, dict) and p.get("type") == "text")
            return str(content or "")
    return ""


async def _board_context(refs: list[str], workspace: str | None) -> str:
    if not workspace or not refs:
        return ""
    try:
        entries = await opencrawl.fetch(workspace, *refs)
        return "\n\n".join(f"[{entry.get('ref')} from {entry.get('name')}]:\n{entry.get('text', '')}" for entry in entries)
    except Exception as exc:
        log.info("OpenCrawl fetch unavailable; using in-memory handoff: %s", exc)
        return ""


async def _publish(role: str, topic: str, text: str) -> str | None:
    if not opencrawl.available():
        return None
    session = f"{config.AGENT_NAME}-{role}"
    try:
        await opencrawl.register(session, session, f"Research role: {role}")
        await opencrawl.subscribe(session, topic)
        message_id = await opencrawl.publish(session, topic, text, f"{topic}-{role}")
        return f"message:{message_id}" if message_id else None
    except Exception as exc:
        log.info("OpenCrawl publish unavailable for %s: %s", role, exc)
        return None


async def stream_events(provider: str, question: str, thread_id: str, user: str = "anon") -> AsyncIterator[dict]:
    """Run detective, bull, bear and judge; publish/read handoffs when the board works."""
    case = uuid.uuid4().hex[:16]
    topic = f"you-agent-{case}"
    workspace: str | None = None
    refs: list[str] = []
    findings: dict[str, str] = {}

    # Registration is best effort. Keep a local-only path when OpenCrawl is not installed.
    if opencrawl.available():
        try:
            result = await opencrawl.register(f"{config.AGENT_NAME}-detective", f"{config.AGENT_NAME}-detective", "Research detective role")
            workspace = result.get("workspace") or result.get("workspaceId")
            await opencrawl.subscribe(f"{config.AGENT_NAME}-detective", topic)
        except Exception as exc:
            log.info("OpenCrawl registration unavailable; using local handoffs: %s", exc)

    for role in _ROLE_ORDER:
        yield {"type": "tool_call", "name": f"research:{role}", "args": {"topic": topic}}
        context = await _board_context(refs, workspace)
        if not context:
            context = "\n\n".join(f"[{prior} findings]\n{findings[prior]}" for prior in _ROLE_ORDER if prior in findings)
        role_input = f"User question:\n{question}"
        if context:
            role_input += f"\n\nEarlier findings from the OpenCrawl case thread:\n{context}"
        try:
            findings[role] = await _run_role(provider, role, role_input, thread_id, user)
        except Exception as exc:
            log.exception("research role failed: %s", role)
            yield {"type": "error", "message": f"{role} role failed: {exc}"}
            return
        ref = await _publish(role, topic, findings[role])
        if ref:
            refs.append(ref)
        yield {"type": "tool_result", "name": f"research:{role}", "content": findings[role]}

    final_prompt = (
        f"User question:\n{question}\n\n"
        f"Detective facts:\n{findings['detective']}\n\n"
        f"Bull case:\n{findings['bull']}\n\n"
        f"Bear case:\n{findings['bear']}\n\n"
        f"Judge's verdict:\n{findings['judge']}\n\n"
        "Write the final concise answer following your instructions. Preserve source URLs and uncertainty."
    )
    try:
        answer = await build_model(provider).ainvoke(
            [HumanMessage(content=final_prompt)], config={"callbacks": tracing.langchain_callbacks(),
                                                          "run_name": "research-synthesis"})
        content = answer.content
        if not isinstance(content, str):
            content = "\n".join(p.get("text", "") for p in content if isinstance(p, dict) and p.get("type") == "text")
    except Exception:
        log.exception("final synthesis failed; returning the judge's answer")
        content = findings["judge"]
    yield {"type": "text", "text": content}
    yield {"type": "done", "text": content, "emitted_text": True,
           "meta": {"provider": provider, "model": config.backend_model(provider), "workflow": list(_ROLE_ORDER)}}
