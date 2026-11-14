"""Quick terminal test.

    uv run python -m you_agent.cli "what happened in AI this week?"
    uv run python -m you_agent.cli --provider claude "what happened in AI this week?"
"""
import asyncio
import sys
import uuid

from . import config, tracing
from .runner import stream_events


async def main(q: str, provider: str | None = None):
    provider = provider or config.DEFAULT_PROVIDER
    print(f"provider: {provider} ({config.backend_model(provider)})\n")
    async for ev in stream_events(provider, q, str(uuid.uuid4()), user="cli"):
        if ev["type"] == "tool_call":
            print(f"\n-> {ev['name']}({ev.get('args')})")
        elif ev["type"] == "tool_result":
            print(f"<- {ev['name']}: {ev['content'][:200]}...")
        elif ev["type"] == "text":
            print(ev["text"], end="", flush=True)
        elif ev["type"] == "done":
            if not ev.get("emitted_text"):
                print(ev["text"])
            print(f"\n\n[done] {ev['meta']}")
        elif ev["type"] == "error":
            print(f"\n[error] {ev['message']}")
    if tracing.enabled():
        tracing.shutdown()   # short-lived process: push queued events to Langfuse now
        print(f"[langfuse] trace sent to {config.LANGFUSE_BASE_URL}")


if __name__ == "__main__":
    args = sys.argv[1:]
    provider = None
    if args[:1] == ["--provider"] and len(args) >= 2:
        provider, args = args[1], args[2:]
    asyncio.run(main(" ".join(args) or "What are the top AI news stories today? Cite sources.", provider))
