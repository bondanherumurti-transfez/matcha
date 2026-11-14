"""OpenAI-compatible HTTP server so Open WebUI can use the agent as a model.

Open WebUI -> Settings -> Connections -> OpenAI API -> http://host:8010/v1
"""
from __future__ import annotations

import json
import logging
import time
import uuid
from contextlib import asynccontextmanager
from typing import Any

from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse
from pydantic import BaseModel

from . import config
from .agent import get_agent, tool_names
from .runner import stream_events

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
log = logging.getLogger("you_agent.server")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Build the Ollama graph eagerly (loads MCP tools); Claude Code spawns per request.
    await get_agent("ollama")
    log.info("agent ready: default=%s (%s) tools=%s langsmith=%s",
             config.DEFAULT_PROVIDER, config.backend_model(config.DEFAULT_PROVIDER),
             tool_names(), config.LANGSMITH_ENABLED)
    yield


app = FastAPI(title="you-agent", lifespan=lifespan)


class ChatMessage(BaseModel):
    role: str
    content: Any


class ChatRequest(BaseModel):
    model: str = config.AGENT_NAME
    messages: list[ChatMessage]
    stream: bool = False
    user: str | None = None
    # accepted and ignored so Open WebUI's extra params don't 422
    temperature: float | None = None
    max_tokens: int | None = None
    top_p: float | None = None


def _content_to_text(content: Any) -> str:
    if isinstance(content, str):
        return content
    if isinstance(content, list):  # OpenAI multi-part content
        return "\n".join(p.get("text", "") for p in content if isinstance(p, dict) and p.get("type") == "text")
    return str(content or "")


def _thread_id(req: ChatRequest) -> str:
    """Open WebUI doesn't send a conversation id, so key memory off the first user turn + user."""
    first = next((m for m in req.messages if m.role == "user"), None)
    seed = f"{req.user or 'anon'}::{_content_to_text(first.content)[:200] if first else ''}"
    return str(uuid.uuid5(uuid.NAMESPACE_URL, seed))


def _chunk(cid: str, delta: dict, finish: str | None = None, model: str = config.AGENT_NAME) -> str:
    body = {
        "id": cid, "object": "chat.completion.chunk", "created": int(time.time()),
        "model": model,
        "choices": [{"index": 0, "delta": delta, "finish_reason": finish}],
    }
    return f"data: {json.dumps(body)}\n\n"


@app.get("/health")
async def health():
    return {
        "ok": True,
        "default_provider": config.DEFAULT_PROVIDER,
        "models": {meta["id"]: config.backend_model(name) for name, meta in config.PROVIDERS.items()},
        "tools": tool_names(),
        "langsmith": config.LANGSMITH_ENABLED,
    }


@app.get("/v1/models")
async def models():
    """One entry per provider so Open WebUI's model picker switches the base model."""
    return {"object": "list", "data": [
        {"id": meta["id"], "object": "model", "created": 0,
         "owned_by": meta["label"].lower(), "name": f"{config.AGENT_NAME} ({meta['label']}: {config.backend_model(name)})"}
        for name, meta in config.PROVIDERS.items()
    ]}


@app.post("/v1/chat/completions")
async def chat(req: ChatRequest):
    if not req.messages:
        raise HTTPException(400, "messages required")
    provider = config.provider_for_model_id(req.model)
    model_id = config.PROVIDERS[provider]["id"]
    # Only the latest user turn is sent; each provider keeps the thread's history
    # (LangGraph checkpointer, or a resumed Claude Code session).
    prompt = _content_to_text(req.messages[-1].content)
    thread_id = _thread_id(req)
    user = req.user or "anon"
    cid = f"chatcmpl-{uuid.uuid4().hex[:24]}"

    def render(ev: dict) -> str:
        if ev["type"] == "text":
            return ev["text"]
        if ev["type"] == "tool_call":
            return f"\n\n> 🔎 calling `{ev['name']}`…\n\n"
        if ev["type"] == "tool_result":
            return f"> ✅ `{ev['name']}` returned\n\n"
        if ev["type"] == "error":
            return f"\n\n**Agent error:** {ev['message']}"
        return ""

    if not req.stream:
        parts: list[str] = []
        error = None
        try:
            async for ev in stream_events(provider, prompt, thread_id, user):
                if ev["type"] == "text":
                    parts.append(ev["text"])
                elif ev["type"] == "done" and not ev.get("emitted_text"):
                    parts.append(ev["text"])
                elif ev["type"] == "error":
                    error = ev["message"]
        except Exception as e:
            log.exception("agent failed (provider=%s)", provider)
            error = str(e)
        if error and not parts:
            return JSONResponse(status_code=502, content={"error": {
                "message": f"{provider} agent failed: {error}", "type": "upstream_error", "code": provider}})
        return {
            "id": cid, "object": "chat.completion", "created": int(time.time()),
            "model": model_id,
            "choices": [{"index": 0, "message": {"role": "assistant", "content": "".join(parts)},
                         "finish_reason": "stop"}],
            "usage": {"prompt_tokens": 0, "completion_tokens": 0, "total_tokens": 0},
        }

    async def gen():
        yield _chunk(cid, {"role": "assistant", "content": ""}, model=model_id)
        try:
            async for ev in stream_events(provider, prompt, thread_id, user):
                if ev["type"] == "done" and not ev.get("emitted_text") and ev.get("text"):
                    yield _chunk(cid, {"content": ev["text"]}, model=model_id)
                    continue
                out = render(ev)
                if out:
                    yield _chunk(cid, {"content": out}, model=model_id)
        except Exception as e:  # surface errors in the chat instead of a dead stream
            log.exception("agent stream failed (provider=%s)", provider)
            yield _chunk(cid, {"content": f"\n\n**Agent error:** {e}"}, model=model_id)
        yield _chunk(cid, {}, finish="stop", model=model_id)
        yield "data: [DONE]\n\n"

    return StreamingResponse(gen(), media_type="text/event-stream",
                             headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"})


def main():
    import uvicorn
    uvicorn.run("you_agent.server:app", host="0.0.0.0", port=config.AGENT_PORT, reload=False)


if __name__ == "__main__":
    main()
