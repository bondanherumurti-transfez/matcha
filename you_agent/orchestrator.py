"""Four-role research workflow with optional OpenCrawl handoffs."""
from __future__ import annotations

import asyncio
import logging
import os
import shutil
import tempfile
import uuid
from pathlib import Path
from typing import AsyncIterator

from . import config, opencrawl, tracing
from .agent import get_you_tools

log = logging.getLogger(__name__)
_ROLE_ORDER = ("detective", "bull", "bear", "judge")
_PROMPT_DIR = Path(__file__).with_name("prompts")


def _prompt(role: str) -> str:
    return (_PROMPT_DIR / f"{role}.md").read_text(encoding="utf-8").split("\n", 1)[-1].strip()


async def _run_role(provider: str, role: str, prompt: str, thread_id: str, user: str) -> str:
    tools = await get_you_tools()
    search = next((tool for tool in tools if tool.name == "you-search"), None)
    if search is None:
        raise RuntimeError("you-search is unavailable; role cannot research the web")
    query = prompt.split("User question:", 1)[-1].split("\n\n", 1)[0][:380].strip()
    with tracing.observation(
        name=f"{config.AGENT_NAME}-{role}", as_type="agent", input={"prompt": prompt},
        metadata={"role": role, "provider": "codex-cli", "model": config.CODEX_MODEL or "codex-default",
                  "thread_id": thread_id, "user": user},
    ) as agent_observation:
        with tracing.observation(name=f"{config.AGENT_NAME}-{role}-web-search", as_type="tool",
                                 input={"query": query}, metadata={"role": role, "tool": "you-search"}) as search_observation:
            results = await search.ainvoke({"query": query, "count": 5})
            if search_observation is not None:
                search_observation.update(output=str(results)[:3000])
        research_prompt = (
            f"{_prompt(role)}\n\nUser question and earlier team findings:\n{prompt}\n\n"
            "Fresh web search results (use them as evidence and cite the provided URLs):\n"
            f"{str(results)[:9000]}\n\n"
            "Return concise, source-grounded findings for the next investigation role."
        )
        answer = await _codex_exec(research_prompt)
        if agent_observation is not None:
            agent_observation.update(output=answer[:6000])
        return answer


async def _board_context(refs: list[str], workspace: str | None) -> str:
    if not refs:
        return ""
    if not workspace:
        raise RuntimeError("OpenCrawl board workspace was not returned during registration")
    entries = await opencrawl.fetch(workspace, *refs)
    if len(entries) != len(refs) or any(not entry.get("text") for entry in entries):
        raise RuntimeError("OpenCrawl board did not return all prior role findings")
    return "\n\n".join(f"[{entry.get('ref')} from {entry.get('name')}]:\n{entry.get('text', '')}" for entry in entries)


async def _publish(role: str, topic: str, text: str) -> str | None:
    session = f"{config.AGENT_NAME}-{role}"
    message_id = await opencrawl.publish(session, topic, text, f"{topic}-{role}")
    if not message_id:
        raise RuntimeError(f"OpenCrawl did not accept the {role} findings")
    return f"message:{message_id}"


async def _codex_exec(prompt: str) -> str:
    """Run a read-only, ephemeral Codex CLI task and return its final response."""
    binary = shutil.which(config.CODEX_BIN)
    if binary is None:
        raise RuntimeError(f"Codex CLI {config.CODEX_BIN!r} was not found on PATH")
    workdir = Path(config.CODEX_WORKDIR).expanduser()
    workdir.mkdir(parents=True, exist_ok=True)
    fd, output_path = tempfile.mkstemp(prefix="you-agent-codex-", suffix=".txt")
    os.close(fd)
    os.unlink(output_path)
    cmd = [binary, "exec", "--sandbox", "read-only", "--ephemeral", "--skip-git-repo-check",
           "--cd", str(workdir), "--color", "never", "--output-last-message", output_path]
    if config.CODEX_PROFILE:
        cmd += ["--profile", config.CODEX_PROFILE]
    if config.CODEX_MODEL:
        cmd += ["--model", config.CODEX_MODEL]
    cmd.append("-")  # Codex exec reads the prompt from stdin.
    proc = await asyncio.create_subprocess_exec(
        *cmd, cwd=workdir, env=os.environ.copy(), stdin=asyncio.subprocess.PIPE,
        stdout=asyncio.subprocess.PIPE, stderr=asyncio.subprocess.PIPE)
    try:
        _stdout, stderr = await asyncio.wait_for(
            proc.communicate(prompt.encode("utf-8")), timeout=config.CODEX_TIMEOUT_SECS)
        if proc.returncode != 0:
            detail = stderr.decode("utf-8", "replace").strip().splitlines()
            raise RuntimeError(detail[-1] if detail else f"codex exec exited with {proc.returncode}")
        answer = Path(output_path).read_text(encoding="utf-8").strip()
        if not answer:
            raise RuntimeError("codex exec returned an empty final answer")
        return answer
    except asyncio.TimeoutError as exc:
        proc.kill()
        await proc.wait()
        raise RuntimeError(f"codex exec timed out after {config.CODEX_TIMEOUT_SECS}s") from exc
    finally:
        Path(output_path).unlink(missing_ok=True)


async def stream_events(provider: str, question: str, thread_id: str, user: str = "anon") -> AsyncIterator[dict]:
    """Run detective, bull, bear and judge; publish/read handoffs when the board works."""
    case = uuid.uuid4().hex[:16]
    topic = f"you-agent-{case}"
    workspace: str | None = None
    refs: list[str] = []
    findings: dict[str, str] = {}

    if not opencrawl.available():
        raise RuntimeError("OpenCrawl board is required: check OPENCRAWL_BOARD, OPENCRAWL_BIN, login, and OPENCRAWL_URL")
    # Every role has its own registered board identity and subscribes to this case.
    for role in _ROLE_ORDER:
        session = f"{config.AGENT_NAME}-{role}"
        result = await opencrawl.register(session, session, f"Sherlock Capital research role: {role}")
        current_workspace = result.get("workspace") or result.get("workspaceId")
        if not current_workspace:
            raise RuntimeError(f"OpenCrawl did not return a workspace for {session}")
        if workspace and current_workspace != workspace:
            raise RuntimeError("OpenCrawl roles registered in different workspaces")
        workspace = current_workspace
        yield {"type": "board_activity", "action": "registered", "role": role,
               "session": session, "topic": topic}
        await opencrawl.subscribe(session, topic)
        yield {"type": "board_activity", "action": "subscribed", "role": role,
               "session": session, "topic": topic}

    for role in _ROLE_ORDER:
        yield {"type": "tool_call", "name": f"research:{role}", "args": {"topic": topic}}
        context = await _board_context(refs, workspace)
        yield {"type": "board_activity", "action": "read", "role": role,
               "topic": topic, "refs": list(refs), "count": len(refs)}
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
        yield {"type": "board_activity", "action": "posted", "role": role,
               "topic": topic, "ref": ref}
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
        content = await _codex_exec(final_prompt)
    except Exception:
        log.exception("Codex final synthesis failed; falling back to the judge's answer")
        content = findings["judge"]
    yield {"type": "text", "text": content}
    yield {"type": "done", "text": content, "emitted_text": True,
           "meta": {"provider": provider, "model": config.backend_model(provider), "workflow": list(_ROLE_ORDER)}}
