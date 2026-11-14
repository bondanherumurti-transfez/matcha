"""One event stream for every provider, consumed by the server and the CLI.

Events: {"type": "text", "text"} | {"type": "tool_call", "name", "args"} |
        {"type": "tool_result", "name", "content"} | {"type": "done", "text", "meta"} |
        {"type": "error", "message"}
"""
from __future__ import annotations

from typing import AsyncIterator

from . import config, tracing


async def stream_events(provider: str, prompt: str, thread_id: str, user: str = "anon") -> AsyncIterator[dict]:
    model = config.backend_model(provider)
    # Langfuse: one trace per turn, grouped into a session per chat thread.
    with tracing.trace_attributes(name=f"{provider}-chat", user=user, thread_id=thread_id,
                                  tags=["open-webui", provider, model],
                                  metadata={"provider": provider, "model": model}):
        from .orchestrator import stream_events as orchestrated_events
        async for ev in orchestrated_events(provider, prompt, thread_id, user):
            yield ev
        return
