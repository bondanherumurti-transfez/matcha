"""Claude provider backed by the Claude Code CLI in print mode (`claude -p`).

Runs on the user's Claude subscription (no API credits needed). Claude Code
connects to the you.com MCP server itself and runs the tool loop; we stream its
`--output-format stream-json` events, keep one Claude Code session per chat
thread (`--session-id` on the first turn, `--resume` afterwards), and mirror
the run (with each tool call as a child) into Langfuse.
"""
from __future__ import annotations

import asyncio
import json
import logging
import os
import shutil
import uuid
from pathlib import Path
from typing import Any, AsyncIterator

from . import config, tracing

log = logging.getLogger(__name__)

# thread_id -> True once a Claude Code session with that id exists (so we --resume)
_known_sessions: set[str] = set()
_sessions_lock = asyncio.Lock()


def _workdir() -> Path:
    """Fixed cwd so Claude Code can find the session to --resume (sessions are stored per cwd)."""
    d = Path(config.CLAUDE_CODE_WORKDIR).expanduser()
    d.mkdir(parents=True, exist_ok=True)
    return d


def _mcp_config_path() -> Path:
    """Write the you.com MCP server config Claude Code should load."""
    conn = config.you_mcp_connection()
    server: dict[str, Any] = {"type": "http", "url": conn["url"]}
    if conn.get("headers"):
        server["headers"] = conn["headers"]
    p = _workdir() / "you-mcp.json"
    p.write_text(json.dumps({"mcpServers": {"youdotcom": server}}))
    return p


def _clean_env() -> dict[str, str]:
    """Drop nested-session markers so `claude -p` also works when launched from inside Claude Code."""
    env = {k: v for k, v in os.environ.items()
           if not (k == "CLAUDECODE" or k == "CLAUDE_PID" or k.startswith("CLAUDE_CODE_"))}
    return env


def _is_uuid(s: str) -> bool:
    try:
        uuid.UUID(s)
        return True
    except (ValueError, AttributeError):
        return False


def available() -> bool:
    return shutil.which(config.CLAUDE_CODE_BIN) is not None


def _build_cmd(prompt: str, thread_id: str, resume: bool) -> list[str]:
    cmd = [
        config.CLAUDE_CODE_BIN, "-p", prompt,
        "--output-format", "stream-json", "--verbose", "--include-partial-messages",
        "--mcp-config", str(_mcp_config_path()), "--strict-mcp-config",
        "--tools", "",                              # no built-in tools (Bash, Edit, ...)
        "--allowedTools", "mcp__youdotcom__*",      # you.com tools run without prompting
        "--setting-sources", "",                    # ignore the user's own settings/MCP servers
        "--model", config.CLAUDE_CODE_MODEL,
        "--max-turns", str(config.CLAUDE_CODE_MAX_TURNS),
    ]
    if resume:
        cmd += ["--resume", thread_id]
    else:
        cmd += ["--session-id", thread_id, "--system-prompt", config.SYSTEM_PROMPT]
    return cmd


@tracing.observe(name="claude-code-chat", as_type="agent", capture_output=False)
async def stream_chat(prompt: str, thread_id: str) -> AsyncIterator[dict[str, Any]]:
    """Yield normalized events: text / tool_call / tool_result / done / error."""
    if not available():
        yield {"type": "error", "message": f"`{config.CLAUDE_CODE_BIN}` CLI not found on PATH"}
        return
    if not _is_uuid(thread_id):
        thread_id = str(uuid.uuid5(uuid.NAMESPACE_URL, thread_id))

    async with _sessions_lock:
        resume = thread_id in _known_sessions
    async for ev in _run(prompt, thread_id, resume):
        # A previous turn that died mid-run still created the session on disk:
        # Claude Code then refuses `--session-id`; retry once as a resume.
        if ev["type"] == "error" and not resume and "already in use" in ev["message"]:
            async with _sessions_lock:
                _known_sessions.add(thread_id)
            async for ev2 in _run(prompt, thread_id, resume=True):
                yield ev2
            return
        yield ev


async def _run(prompt: str, thread_id: str, resume: bool) -> AsyncIterator[dict[str, Any]]:
    cmd = _build_cmd(prompt, thread_id, resume)
    log.info("claude -p (%s) thread=%s", "resume" if resume else "new", thread_id)

    proc = await asyncio.create_subprocess_exec(
        *cmd, cwd=_workdir(), env=_clean_env(),
        stdin=asyncio.subprocess.DEVNULL, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE,
        limit=64 * 1024 * 1024,  # stream-json lines carry whole tool results; default 64 KiB is too small
    )
    lf_tools: dict[str, Any] = {}       # tool_use_id -> Langfuse tool observation
    tool_names: dict[str, str] = {}     # tool_use_id -> tool name
    final: dict[str, Any] = {}
    emitted_text = False

    try:
        assert proc.stdout is not None
        async for raw in proc.stdout:
            line = raw.decode("utf-8", "replace").strip()
            if not line:
                continue
            try:
                ev = json.loads(line)
            except json.JSONDecodeError:
                continue
            t = ev.get("type")

            if t == "system" and ev.get("subtype") == "init":
                # Session exists on disk from here on: later turns must --resume it.
                async with _sessions_lock:
                    _known_sessions.add(thread_id)

            if t == "stream_event":
                e = ev.get("event", {})
                if e.get("type") == "content_block_delta" and e.get("delta", {}).get("type") == "text_delta":
                    emitted_text = True
                    yield {"type": "text", "text": e["delta"]["text"]}

            elif t == "assistant":
                for b in ev.get("message", {}).get("content", []):
                    if b.get("type") == "tool_use":
                        name = str(b.get("name", "")).removeprefix("mcp__youdotcom__")
                        tool_names[b.get("id", "")] = name
                        obs = tracing.tool_observation(name, b.get("input", {}))
                        if obs is not None:
                            lf_tools[b.get("id", "")] = obs
                        yield {"type": "tool_call", "name": name, "args": b.get("input", {})}

            elif t == "user":
                for b in ev.get("message", {}).get("content", []):
                    if b.get("type") == "tool_result":
                        tid = b.get("tool_use_id", "")
                        name = tool_names.get(tid, "tool")
                        content = b.get("content")
                        if isinstance(content, list):
                            content = "\n".join(c.get("text", "") for c in content if isinstance(c, dict))
                        if tid in lf_tools:
                            obs = lf_tools.pop(tid)
                            obs.update(output=str(content)[:20000],
                                       level="ERROR" if b.get("is_error") else None,
                                       status_message=str(content)[:2000] if b.get("is_error") else None)
                            obs.end()
                        yield {"type": "tool_result", "name": name, "content": str(content)}

            elif t == "result":
                final = ev

        stderr = (await proc.stderr.read()).decode("utf-8", "replace") if proc.stderr else ""
        rc = await proc.wait()
    finally:
        if proc.returncode is None:
            proc.kill()
        for obs in lf_tools.values():   # tool calls that never got a result
            obs.update(level="WARNING", status_message="no tool_result before exit")
            obs.end()

    lf = tracing.client()
    if final.get("is_error") or (rc != 0 and not final):
        msg = final.get("result") or stderr.strip().splitlines()[-1:] or f"claude exited with {rc}"
        if lf is not None:
            lf.update_current_span(level="ERROR", status_message=str(msg)[:2000], output=None)
        yield {"type": "error", "message": str(msg)}
        return

    text = final.get("result", "") or ""
    if lf is not None:
        lf.update_current_span(output=text, metadata={
            "session_id": final.get("session_id"), "cost_usd": final.get("total_cost_usd"),
            "duration_ms": final.get("duration_ms"), "num_turns": final.get("num_turns"),
            "usage": final.get("usage"), "model": config.CLAUDE_CODE_MODEL})
    yield {"type": "done", "text": text, "emitted_text": emitted_text, "meta": {
        "session_id": final.get("session_id"), "cost_usd": final.get("total_cost_usd"),
        "duration_ms": final.get("duration_ms"), "num_turns": final.get("num_turns"),
        "model": config.CLAUDE_CODE_MODEL, "provider": "claude",
    }}
