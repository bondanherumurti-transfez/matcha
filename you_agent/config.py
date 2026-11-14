import os
from dotenv import load_dotenv

load_dotenv()

# --- OpenCrawl board (optional collaboration between research roles) ---------
OPENCRAWL_BOARD = os.getenv("OPENCRAWL_BOARD", "true").lower() in ("1", "true", "yes")
OPENCRAWL_BIN = os.getenv("OPENCRAWL_BIN", "opencrawl")
OPENCRAWL_URL = os.getenv("OPENCRAWL_URL", "http://localhost:8092")

# --- you.com MCP ------------------------------------------------------------
# Free profile needs no key: you-search + you-discover, 100 queries/day.
# With a key (https://you.com/platform) you also get you-contents, you-research,
# you-finance, you-balance.
YDC_API_KEY = os.getenv("YDC_API_KEY", "").strip()
YDC_MCP_URL = os.getenv("YDC_MCP_URL", "https://api.you.com/mcp")
YDC_ALLOWED_TOOLS = os.getenv("YDC_ALLOWED_TOOLS", "").strip()  # e.g. "you-search,you-research"

# --- Final synthesis via Codex CLI (`codex exec`) ------------------------------
CODEX_BIN = os.getenv("CODEX_BIN", "codex")
CODEX_PROFILE = os.getenv("CODEX_PROFILE", "").strip()  # optional Codex config profile
CODEX_MODEL = os.getenv("CODEX_MODEL", "").strip()      # optional CLI model override
CODEX_WORKDIR = os.getenv("CODEX_WORKDIR", "~/.cache/you-agent/codex-workdir")
CODEX_TIMEOUT_SECS = int(os.getenv("CODEX_TIMEOUT_SECS", "300"))

# --- Single model provider ----------------------------------------------------
DEFAULT_PROVIDER = "codex"
PROVIDERS = {"codex": {"id": "sherlock-capital", "label": "Codex + web research"}}


def provider_for_model_id(model_id: str | None) -> str:
    for name, meta in PROVIDERS.items():
        if model_id == meta["id"]:
            return name
    return DEFAULT_PROVIDER


def backend_model(provider: str) -> str:
    if provider != "codex":
        raise ValueError(f"unknown provider {provider!r}; this agent only supports Codex")
    return CODEX_MODEL or "codex-default"


# --- Agent ------------------------------------------------------------------
AGENT_NAME = os.getenv("AGENT_NAME", "sherlock-capital")
AGENT_PORT = int(os.getenv("AGENT_PORT", "8010"))
SYSTEM_PROMPT = os.getenv(
    "SYSTEM_PROMPT",
    "You are sherlock-capital, a research assistant that answers questions using the you.com tools. "
    "Always call you-search before answering any question, even if you think you already "
    "know the answer; your own knowledge may be outdated, so ground every answer in what "
    "the search returns. For news or 'latest/recent' questions pass freshness='day' or 'week'. "
    "Use you-contents / you-research (when available) to read pages in depth. "
    "Base your answer on the search results and cite the URLs you relied on. "
    "If the results do not answer the question, say so instead of guessing. "
    "The only time you may skip searching is for pure conversation, such as greetings "
    "or questions about what you can do.",
)


# Langfuse (see tracing.py). The SDK reads LANGFUSE_PUBLIC_KEY / LANGFUSE_SECRET_KEY /
# LANGFUSE_BASE_URL itself; LANGFUSE_TRACING is our own on/off switch.
LANGFUSE_ENABLED = (
    os.getenv("LANGFUSE_TRACING", "").lower() in ("1", "true", "yes")
    and bool(os.getenv("LANGFUSE_PUBLIC_KEY"))
    and bool(os.getenv("LANGFUSE_SECRET_KEY"))
)
LANGFUSE_BASE_URL = os.getenv("LANGFUSE_BASE_URL") or os.getenv("LANGFUSE_HOST") or "https://cloud.langfuse.com"


def you_mcp_connection() -> dict:
    """Build the MultiServerMCPClient connection dict for you.com."""
    url = YDC_MCP_URL
    headers: dict[str, str] = {}
    if YDC_API_KEY:
        headers["Authorization"] = f"Bearer {YDC_API_KEY}"
    elif "profile=" not in url:
        url += ("&" if "?" in url else "?") + "profile=free"
    if YDC_ALLOWED_TOOLS:
        headers["X-Allowed-Tools"] = YDC_ALLOWED_TOOLS
    return {
        "transport": "streamable_http",
        "url": url,
        "headers": headers or None,
        "timeout": 60,
        "sse_read_timeout": 300,
    }
