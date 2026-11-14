import os
from dotenv import load_dotenv

load_dotenv()

# --- Ollama -----------------------------------------------------------------
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "gpt-oss:20b")
OLLAMA_NUM_CTX = int(os.getenv("OLLAMA_NUM_CTX", "16384"))

# --- you.com MCP ------------------------------------------------------------
# Free profile needs no key: you-search + you-discover, 100 queries/day.
# With a key (https://you.com/platform) you also get you-contents, you-research,
# you-finance, you-balance.
YDC_API_KEY = os.getenv("YDC_API_KEY", "").strip()
YDC_MCP_URL = os.getenv("YDC_MCP_URL", "https://api.you.com/mcp")
YDC_ALLOWED_TOOLS = os.getenv("YDC_ALLOWED_TOOLS", "").strip()  # e.g. "you-search,you-research"

# --- Claude via Claude Code CLI (`claude -p`) ---------------------------------
# Uses the user's Claude subscription; Claude Code loads the you.com MCP server itself.
CLAUDE_CODE_BIN = os.getenv("CLAUDE_CODE_BIN", "claude")
CLAUDE_CODE_MODEL = os.getenv("CLAUDE_CODE_MODEL", "opus")      # alias (opus|sonnet|fable) or full model id
CLAUDE_CODE_MAX_TURNS = int(os.getenv("CLAUDE_CODE_MAX_TURNS", "12"))
CLAUDE_CODE_WORKDIR = os.getenv("CLAUDE_CODE_WORKDIR", "~/.cache/you-agent/claude-workdir")

# --- Claude via Anthropic API (optional third provider, needs API credits) ------
# Enabled only when ANTHROPIC_API_KEY is set.
ANTHROPIC_MODEL = os.getenv("ANTHROPIC_MODEL", "claude-opus-5-5")
CLAUDE_EFFORT = os.getenv("CLAUDE_EFFORT_LEVEL", "medium")  # low | medium | high | xhigh | max
CLAUDE_MAX_TOKENS = int(os.getenv("CLAUDE_MAX_TOKENS", "16000"))

# --- Providers / model menu ----------------------------------------------------
# Which base model the agent runs on. Both are exposed to Open WebUI as separate
# models so the user can switch per chat from the model dropdown:
#   you-agent             -> Ollama            (OLLAMA_MODEL)
#   you-agent-claude      -> Claude Code CLI   (`claude -p`, CLAUDE_CODE_MODEL, subscription)
#   you-agent-claude-api  -> Anthropic API     (ANTHROPIC_MODEL; only if ANTHROPIC_API_KEY is set)
# DEFAULT_PROVIDER picks which one the CLI and unknown model names use.
DEFAULT_PROVIDER = os.getenv("MODEL_PROVIDER", "ollama").lower()  # "ollama" | "claude" | "claude-api"
PROVIDERS = {
    "ollama": {"id": "you-agent", "label": "Ollama"},
    "claude": {"id": "you-agent-claude", "label": "Claude Code"},
}
if os.getenv("ANTHROPIC_API_KEY"):
    PROVIDERS["claude-api"] = {"id": "you-agent-claude-api", "label": "Claude API"}


def provider_for_model_id(model_id: str | None) -> str:
    for name, meta in PROVIDERS.items():
        if model_id == meta["id"]:
            return name
    return DEFAULT_PROVIDER


def backend_model(provider: str) -> str:
    return {"claude": CLAUDE_CODE_MODEL, "claude-api": ANTHROPIC_MODEL}.get(provider, OLLAMA_MODEL)


# --- Agent ------------------------------------------------------------------
AGENT_NAME = os.getenv("AGENT_NAME", "you-agent")
AGENT_PORT = int(os.getenv("AGENT_PORT", "8010"))
SYSTEM_PROMPT = os.getenv(
    "SYSTEM_PROMPT",
    "You are a research assistant with live web access through you.com tools. "
    "Use you-search for anything that needs current or factual information; "
    "for news or 'latest/recent' questions pass freshness='day' or 'week'. "
    "Use you-contents / you-research (when available) for depth. "
    "Always cite the URLs you relied on. If you did not search, say so.",
)

# LangSmith is configured purely via env vars read by the langsmith SDK:
#   LANGSMITH_TRACING=true
#   LANGSMITH_API_KEY=lsv2_...
#   LANGSMITH_PROJECT=you-agent
LANGSMITH_ENABLED = os.getenv("LANGSMITH_TRACING", "").lower() in ("1", "true", "yes")


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
