"""LangGraph agent: Ollama or Claude-API model + you.com MCP tools, traced by Langfuse.

The default Claude provider (`claude`) does not go through here: it runs the
Claude Code CLI, see claude_code.py.
"""
from __future__ import annotations

import asyncio
import logging
import os

import anthropic
from langchain.agents import create_agent
from langchain_anthropic import ChatAnthropic
from langchain_core.language_models import BaseChatModel
from langchain_mcp_adapters.client import MultiServerMCPClient
from langchain_ollama import ChatOllama
from langgraph.checkpoint.memory import InMemorySaver

from . import config

log = logging.getLogger(__name__)

_agents: dict[str, object] = {}
_tools: list = []
_lock = asyncio.Lock()


def build_model(provider: str | None = None) -> BaseChatModel:
    """Return the chat model for a LangGraph provider ("ollama" or "claude-api")."""
    provider = provider or config.DEFAULT_PROVIDER
    if provider == "claude-api":
        # Claude Opus 5.5: thinking is always on; depth is controlled by effort.
        # Credentials come from ANTHROPIC_API_KEY or the `ant auth login` profile.
        model = ChatAnthropic(
            model=config.ANTHROPIC_MODEL,
            max_tokens=config.CLAUDE_MAX_TOKENS,
            thinking={"type": "adaptive"},
            output_config={"effort": config.CLAUDE_EFFORT},
            streaming=True,
        )
        if not os.getenv("ANTHROPIC_API_KEY"):
            # No key in env: let the official SDK resolve credentials itself
            # (ANTHROPIC_AUTH_TOKEN, `ant auth login` profile, WIF). The LangChain
            # wrapper would otherwise send an empty bearer header.
            model._client = anthropic.Anthropic(max_retries=2)
            model._async_client = anthropic.AsyncAnthropic(max_retries=2)
        return model
    if provider == "ollama":
        return ChatOllama(
            model=config.OLLAMA_MODEL,
            base_url=config.OLLAMA_BASE_URL,
            num_ctx=config.OLLAMA_NUM_CTX,
            temperature=0.2,
        )
    raise ValueError(f"unknown provider {provider!r}; expected one of {list(config.PROVIDERS)}")


async def load_you_tools() -> list:
    client = MultiServerMCPClient({"youdotcom": config.you_mcp_connection()})
    tools = await client.get_tools()
    log.info("you.com MCP tools: %s", [t.name for t in tools])
    return tools


async def get_agent(provider: str | None = None):
    """Lazily build (once per provider) and return the compiled agent graph.

    MCP tools are loaded once and shared; each provider gets its own graph and
    its own checkpointer so switching models in Open WebUI starts a clean thread.
    """
    global _tools
    provider = provider or config.DEFAULT_PROVIDER
    if provider in _agents:
        return _agents[provider]
    async with _lock:
        if provider in _agents:
            return _agents[provider]
        if not _tools:
            _tools = await load_you_tools()
        _agents[provider] = create_agent(
            model=build_model(provider),
            tools=_tools,
            system_prompt=config.SYSTEM_PROMPT,
            checkpointer=InMemorySaver(),
            name=f"{config.AGENT_NAME}-{provider}",
        )
        log.info("built agent provider=%s model=%s", provider, config.backend_model(provider))
        return _agents[provider]


def tool_names() -> list[str]:
    return [t.name for t in _tools]
