"""Compact you.com MCP search tool used by the Codex-powered research team."""
from __future__ import annotations

import asyncio
import logging
from langchain_core.tools import StructuredTool
from langchain_mcp_adapters.client import MultiServerMCPClient
from pydantic import BaseModel, Field

from . import config

log = logging.getLogger(__name__)

_tools: list = []
_lock = asyncio.Lock()


async def load_you_tools() -> list:
    client = MultiServerMCPClient({"youdotcom": config.you_mcp_connection()})
    tools = await client.get_tools()
    search = next((tool for tool in tools if tool.name == "you-search"), None)
    if search is None:
        raise RuntimeError("you.com MCP did not provide the you-search tool")

    class SearchInput(BaseModel):
        query: str = Field(description="Concise web search query")
        count: int = Field(default=5, description="Number of results, up to 10")
        freshness: str | None = Field(default=None, description="Optional day, week, month, or year filter")

    async def search_web(query: str, count: int = 5, freshness: str | None = None):
        args = {"query": query, "count": min(count, 10)}
        if freshness:
            args["freshness"] = freshness
        return await search.ainvoke(args)

    compact_search = StructuredTool.from_function(
        coroutine=search_web,
        name="you-search",
        description="Search the web for current facts and source URLs.",
        args_schema=SearchInput,
    )
    log.info("you.com tools exposed to model: %s", [compact_search.name])
    return [compact_search]


async def get_you_tools() -> list:
    """Return the shared you.com tool set, loading it once for all workflows."""
    global _tools
    if _tools:
        return _tools
    async with _lock:
        if not _tools:
            _tools = await load_you_tools()
        return _tools


def tool_names() -> list[str]:
    return [t.name for t in _tools]
