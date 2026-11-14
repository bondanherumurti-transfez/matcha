"""OpenCrawl board client: how the agents share findings with each other.

Every role has its own board session (`<AGENT_NAME>-<role>`). A role publishes
its findings as a message under the case topic; the roles after it read those
messages back from the board by reference (message:N) before they start. Humans
and other agents in the workspace see the same thread in the OpenCrawl UI.

Backed by the `opencrawl` CLI so the saved login (or OPENCRAWL_TOKEN) is reused.
Every call raises BoardError on failure; the orchestrator then falls back to
passing findings in memory so a board outage never blocks an answer.
"""
from __future__ import annotations

import asyncio
import json
import logging
import os
import shutil
from typing import Any

from . import config

log = logging.getLogger(__name__)


class BoardError(Exception):
    pass


def binary() -> str | None:
    found = shutil.which(config.OPENCRAWL_BIN)
    if found:
        return found
    fallback = os.path.expanduser("~/.local/bin/opencrawl")   # the native installer's default
    return fallback if os.access(fallback, os.X_OK) else None


def available() -> bool:
    return config.OPENCRAWL_BOARD and binary() is not None


async def _cli(*args: str, timeout: float = 60) -> dict[str, Any]:
    exe = binary()
    if exe is None:
        raise BoardError("opencrawl CLI not found (install it or set OPENCRAWL_BIN)")
    proc = await asyncio.create_subprocess_exec(
        exe, *args, "--api", config.OPENCRAWL_URL, "--json",
        stdin=asyncio.subprocess.DEVNULL, stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE)
    try:
        out, err = await asyncio.wait_for(proc.communicate(), timeout)
    except asyncio.TimeoutError:
        proc.kill()
        raise BoardError(f"opencrawl {' '.join(args[:2])} timed out")
    if proc.returncode != 0:
        lines = (err or out).decode("utf-8", "replace").strip().splitlines()
        raise BoardError(lines[-1] if lines else f"opencrawl exited {proc.returncode}")
    lines = [ln for ln in out.decode("utf-8", "replace").splitlines() if ln.strip()]
    try:
        body = json.loads(lines[-1])
    except (IndexError, json.JSONDecodeError):
        raise BoardError("invalid JSON from opencrawl")
    return body.get("data", body)


async def register(session: str, name: str, task: str) -> dict[str, Any]:
    """Register (or resume) a board session. Returns workspace, agent id, recent posts."""
    return await _cli("board", "register", "--session", session, "--name", name,
                      "--task", task[:200], "--harness", "other")


async def subscribe(session: str, *topics: str) -> dict[str, Any]:
    args = ["board", "subscribe", "--session", session]
    for t in topics:
        args += ["--topic", t]
    return await _cli(*args)


async def publish(session: str, topic: str, text: str, post_id: str) -> int | None:
    """Publish a message; returns the board message id (use `message:<id>` to fetch it)."""
    data = await _cli("board", "publish", "--session", session, "--id", post_id,
                      "--topic", topic, "--text", text)
    accepted = data.get("accepted") or []
    return accepted[0] if accepted else None


async def fetch(workspace: str, *refs: str) -> list[dict[str, Any]]:
    """Read board messages by reference. Returns [{ref, name, text}] in input order."""
    if not refs:
        return []
    out = []
    for ref in refs:
        data = await _cli("board", "fetch", "--id", ref, "--workspace", workspace)
        out.append({"ref": data.get("id", ref), "name": (data.get("message") or {}).get("name"),
                    "text": data.get("text") or ""})
    return out


async def leave(session: str) -> None:
    await _cli("board", "leave", "--session", session)
