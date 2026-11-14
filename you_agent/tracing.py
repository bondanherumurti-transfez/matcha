"""Langfuse tracing (optional: off when LANGFUSE_TRACING is not true).

Enabled when LANGFUSE_TRACING=true and LANGFUSE_PUBLIC_KEY / LANGFUSE_SECRET_KEY
are set; LANGFUSE_BASE_URL points at the self-hosted stack (langfuse/) or Cloud.

- LangGraph providers: a `CallbackHandler` in the run config traces the graph,
  every model call and every you.com MCP tool call.
- Claude Code provider: `@observe` wraps the chat and `tool_observation` mirrors
  each tool_use / tool_result pair as a child "tool" observation.
- `trace_attributes` tags the whole trace with session (= chat thread), user,
  provider and model so chats group into sessions in the Langfuse UI.
"""
from __future__ import annotations

import logging
from contextlib import nullcontext
from typing import Any, ContextManager

from . import config

log = logging.getLogger(__name__)
_client: Any = None


def enabled() -> bool:
    return config.LANGFUSE_ENABLED


def client():
    """The Langfuse singleton, or None when tracing is off."""
    global _client
    if not enabled():
        return None
    if _client is None:
        from langfuse import get_client
        _client = get_client()
    return _client


def auth_check() -> bool | None:
    """True/False when enabled (does one request), None when disabled."""
    c = client()
    if c is None:
        return None
    try:
        return bool(c.auth_check())
    except Exception as e:  # unreachable host etc. — tracing just drops events
        log.warning("langfuse auth check failed: %s", e)
        return False


def langchain_callbacks() -> list:
    if not enabled():
        return []
    from langfuse.langchain import CallbackHandler
    return [CallbackHandler()]


def trace_attributes(*, name: str, user: str, thread_id: str, tags: list[str],
                     metadata: dict[str, Any] | None = None) -> ContextManager:
    """Context manager: everything traced inside gets these trace-level attributes."""
    if not enabled():
        return nullcontext()
    from langfuse import propagate_attributes
    # metadata values must be strings for propagation
    meta = {k: str(v) for k, v in (metadata or {}).items() if v is not None}
    return propagate_attributes(trace_name=name, user_id=user, session_id=thread_id,
                                tags=tags, metadata=meta or None)


def observe(**kwargs):
    """`langfuse.observe` when enabled, otherwise a no-op decorator."""
    if not enabled():
        return lambda f: f
    from langfuse import observe as _observe
    return _observe(**kwargs)


def tool_observation(name: str, inputs: Any):
    """Start a child 'tool' observation under the current trace; returns None when off.

    Finish it with `obs.update(output=..., level=..., status_message=...)` + `obs.end()`.
    """
    c = client()
    if c is None:
        return None
    try:
        return c.start_observation(name=name, as_type="tool", input=inputs)
    except Exception as e:
        log.debug("langfuse tool observation failed: %s", e)
        return None


def flush() -> None:
    c = client()
    if c is not None:
        c.flush()


def shutdown() -> None:
    c = client()
    if c is not None:
        c.shutdown()
