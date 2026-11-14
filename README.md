# you-agent — LangGraph + you.com MCP + Ollama + Open WebUI, traced in Langfuse + LangSmith, sessions captured by OpenCrawl

A local research agent:

- **Model:** switchable base model: any tool-calling model on **Ollama** (default `gpt-oss:20b`) **or Claude via the Claude Code CLI** (`claude -p`, runs on your Claude subscription, default `opus`)
- **Tools:** the **you.com MCP server** (`https://api.you.com/mcp`) over streamable HTTP, loaded with `langchain-mcp-adapters`
- **Agent loop:** LangGraph `create_agent` (ReAct) with per-thread memory
- **Observability:** every run traced in **Langfuse** (self-hosted in Docker Compose) and/or **LangSmith** (model calls, tool calls, MCP results)
- **UI:** exposed as an **OpenAI-compatible API**, so **Open WebUI** sees two models: `you-agent` (Ollama) and `you-agent-claude` (Claude Code)

```
Open WebUI ──OpenAI API──▶ you-agent (FastAPI :8010) ──▶ LangGraph agent ──▶ Ollama (:11434)
                                                              │          └──▶ `claude -p` (Claude Code CLI, loads the you.com MCP itself)
                                                              │
                                                              └──MCP (HTTP)──▶ api.you.com/mcp
                                                              └──traces─────▶ Langfuse (:3001, self-hosted) / LangSmith
```

## 1. Setup

```bash
cd hackathon
uv sync                      # installs everything into .venv
cp .env.example .env         # then edit .env
ollama pull gpt-oss:20b      # or any tool-calling model that fits your GPU
```

Edit `.env`:

| Variable | What |
|---|---|
| `LANGFUSE_TRACING` / `LANGFUSE_PUBLIC_KEY` / `LANGFUSE_SECRET_KEY` / `LANGFUSE_BASE_URL` | Langfuse tracing. For the self-hosted stack, use the `LANGFUSE_INIT_PROJECT_*` keys in `.env` and `http://localhost:3001`; for Langfuse Cloud use the project keys and `https://us.cloud.langfuse.com` (or `eu.`). See §5. |
| `LANGSMITH_TRACING` / `LANGSMITH_API_KEY` / `LANGSMITH_PROJECT` | Get a key at https://smith.langchain.com → Settings → API Keys. Traces appear under the project name. |
| `YDC_API_KEY` | Optional. Empty = you.com **free profile** (`you-search`, `you-discover`, 100 queries/day, no key). A key from https://you.com/platform unlocks `you-contents`, `you-research`, `you-finance`, `you-balance`. |
| `YDC_ALLOWED_TOOLS` | Optional allowlist, e.g. `you-search,you-research`. |
| `OLLAMA_MODEL` | Must support tool calling. On a 24 GB Mac, `gpt-oss:20b` fits on GPU; 27B+ models spill to CPU and become very slow. |
| `CLAUDE_CODE_MODEL` | Model for `claude -p`: an alias (`opus`, `sonnet`, `fable`) or a full id. Needs the `claude` CLI installed and logged in. |
| `CLAUDE_CODE_MAX_TURNS` | Cap on agent turns per message (default 12). |
| `ANTHROPIC_API_KEY` | Optional. Adds a third model, `you-agent-claude-api`, that calls the Anthropic API directly (`ANTHROPIC_MODEL`, `CLAUDE_EFFORT_LEVEL`). Needs API credits. |
| `MODEL_PROVIDER` | `ollama`, `claude` or `claude-api`. Default base model for the CLI and for unknown model names. |

## Switching the base model (Ollama ⇄ Claude)

Three ways, pick whichever fits:

1. **In Open WebUI, per chat:** the model dropdown lists `you-agent` (Ollama) and `you-agent-claude` (Claude Code). Pick one; same tools, same tracing, different brain. Each provider keeps its own conversation memory.
2. **Server default:** set `MODEL_PROVIDER=claude` in `.env` and restart. The CLI and any client that sends an unknown model name get Claude.
3. **CLI, per run:** `uv run python -m you_agent.cli --provider claude "…"`.

### How the Claude provider works

`you_agent/claude_code.py` spawns `claude -p <prompt> --output-format stream-json` with `--mcp-config` pointing at the you.com MCP server and `--allowedTools "mcp__youdotcom__*"`, no built-in tools (`--tools ""`), and your personal Claude settings ignored (`--setting-sources ""`, `--strict-mcp-config`). Claude Code runs the tool loop itself; we stream its events into the chat. Each Open WebUI thread maps to one Claude Code session (`--session-id` on the first turn, `--resume` after), so follow-ups keep context. Tool calls are mirrored into LangSmith as child runs of a `claude-code-chat` run, with cost and turn count in the metadata.

Because this uses the CLI, it bills your Claude subscription, not API credits. If you prefer the API, set `ANTHROPIC_API_KEY` and a third model appears.

## 2. Try it in the terminal

```bash
uv run python -m you_agent.cli "What changed in LangGraph this month? Cite sources."
```

You'll see the tool calls (`-> you-search({...})`), the MCP results, and the final cited answer. If LangSmith is configured, the same run appears in your project with the full graph.

## 3. Run the agent server

```bash
uv run you-agent            # http://localhost:8010
curl localhost:8010/health  # shows model, loaded MCP tools, langsmith on/off
```

Endpoints: `GET /v1/models`, `POST /v1/chat/completions` (streaming + non-streaming), `GET /health`.

## 4. Open WebUI

### Option A — Docker (recommended)

Start Docker Desktop, then:

```bash
docker compose up -d        # Open WebUI :3000 and Langfuse :3001
```

`docker-compose.yml` already points Open WebUI at Ollama (`host.docker.internal:11434`) and registers the agent as an OpenAI connection (`host.docker.internal:8010/v1`). Open http://localhost:3000, pick **you-agent** in the model dropdown, and chat. Your plain Ollama models show up alongside it.

### Option B — existing Open WebUI install

**Admin Panel → Settings → Connections → OpenAI API → +**
- URL: `http://localhost:8010/v1` (or `http://host.docker.internal:8010/v1` if Open WebUI runs in Docker)
- API key: anything, e.g. `not-needed`

Save, then select **you-agent** as the model.

### What you'll see in chat

Pick **you-agent** for the local Ollama model or **you-agent-claude** for Claude.

While the agent works it streams `> 🔎 calling you-search…` / `> ✅ you-search returned` lines, then the answer with citations. Conversation memory is keyed per user + first message, so follow-ups in the same Open WebUI chat keep context (Open WebUI resends full history; the server only forwards the newest turn and lets the LangGraph checkpointer hold the rest).

## 5. Langfuse (self-hosted)

The root `docker-compose.yml` runs Langfuse v4 alongside Open WebUI (web + worker + Postgres + ClickHouse + Redis + MinIO, ~2 GB RAM idle). One `docker compose up -d` starts both stacks.

```bash
docker compose up -d
open http://localhost:3001               # login = LANGFUSE_INIT_USER_EMAIL / LANGFUSE_INIT_USER_PASSWORD from .env
```

Configure the Langfuse secrets and API key pair in the repo `.env` (the same file used by the agent). Generate secrets with `openssl rand -hex 32` (or the lengths shown in `.env.example`). On first boot Langfuse creates the org/project `you-agent`, the login user and the API key pair from the `LANGFUSE_INIT_*` values (headless init), so no clicking through signup. The `LANGFUSE_PUBLIC_KEY` and `LANGFUSE_SECRET_KEY` values must match the init project keys:

```
LANGFUSE_TRACING=true
LANGFUSE_PUBLIC_KEY=pk-lf-...      # same as LANGFUSE_INIT_PROJECT_PUBLIC_KEY
LANGFUSE_SECRET_KEY=sk-lf-...      # same as LANGFUSE_INIT_PROJECT_SECRET_KEY
LANGFUSE_BASE_URL=http://localhost:3001
```

Restart the agent server; `GET /health` reports `langfuse.enabled`. What you get per chat turn:

- **One trace per turn**, named `ollama-chat` / `claude-chat` / `claude-api-chat`, tagged `open-webui`, provider and model. Traces from the same Open WebUI chat share a **session** (the thread id) and carry the **user**, so the Sessions view shows whole conversations.
- **LangGraph providers** (Ollama, Claude API): the `langfuse.langchain.CallbackHandler` records the graph, every model generation (prompt, completion, token usage) and every you.com MCP tool call with its raw result.
- **Claude Code provider:** the `claude-code-chat` agent observation holds the final answer, cost, turns and token usage from the CLI's result event, with one child **tool** observation per you.com call.

To use **Langfuse Cloud** instead, set `LANGFUSE_BASE_URL=https://us.cloud.langfuse.com` (or `eu.`) with keys from a cloud project. To stop the local services, run `docker compose stop langfuse-web langfuse-worker postgres clickhouse redis minio`; adding `-v` to `docker compose down` also wipes all Compose data, including Open WebUI data.

## 6. LangSmith

Set the three `LANGSMITH_*` vars and restart the server. Each chat becomes a run named `open-webui-chat` tagged `open-webui` and the model name, with child runs for every Ollama call and every you.com MCP tool call (inputs, raw results, latency). Nothing else is needed — the `langsmith` SDK instruments LangChain/LangGraph automatically via those env vars.

## 7. OpenCrawl (self-hosted)

[OpenCrawl](https://github.com/getopencrawl/opencrawl-core) captures Claude Code / Codex / Cursor sessions and makes them searchable for the team (CLI + MCP). The root `docker-compose.yml` runs it from the pinned `opencrawl-core/` git submodule (app + worker + SeaweedFS S3 + Postgres + Temporal, SQLite FTS5 search, no Airbyte, ~1.5 GB RAM idle). UI: http://localhost:8092.

```bash
git submodule update --init             # once, after cloning
docker compose up -d --build            # first run builds the image from source (several minutes)
docker compose exec -T opencrawl-app node -e "console.log(process.env.OPENCRAWL_URL+'/auth/signup?setup='+encodeURIComponent(process.env.OPENCRAWL_SETUP_TOKEN))"
```

Fill the `OPENCRAWL_*` secrets in `.env` once (see `.env.example`); the setup link above creates the first admin and is consumed once. Teammates join via invite links from **Team** (no email is sent). Then connect your coding agents from the host:

```bash
curl -fsSL https://raw.githubusercontent.com/getopencrawl/opencrawl-core/main/cli/install.sh | sh   # native CLI in ~/.local/bin
opencrawl login  --api http://localhost:8092 --json                      # device-code sign-in
opencrawl collect install --yes --backfill skip --api http://localhost:8092 --json   # hooks + skill for Claude Code & Codex
opencrawl collect status --json
```

Agents reach search through the MCP server at `http://localhost:8092/mcp` (OAuth with PKCE; `claude mcp add --transport http opencrawl http://localhost:8092/mcp`). To upgrade, bump the submodule and rebuild; `OPENCRAWL_URL` is the token issuer, so changing it forces every CLI/MCP client to sign in again.

## Project layout

```
you_agent/
  config.py   # env, provider/model menu, builds the you.com MCP connection (free profile vs. Bearer key)
  agent.py    # ChatOllama | ChatAnthropic(API) + MultiServerMCPClient tools -> create_agent (LangGraph providers)
  claude_code.py  # Claude provider: `claude -p` subprocess, stream-json parsing, session resume, LangSmith/Langfuse child runs
  tracing.py  # Langfuse helpers: callback handler, trace attributes (session/user/tags), tool observations, flush
  runner.py   # one normalized event stream for all providers (used by server + cli)
  server.py   # FastAPI OpenAI-compatible API consumed by Open WebUI (SSE streaming)
  cli.py      # terminal smoke test
docker-compose.yml  # Open WebUI and self-hosted Langfuse services
langfuse/           # legacy local env backup (gitignored)
.env.example
```

## Notes / known issues

- **qwen3.8:27b on Ollama** returned `no user query found in messages (500)` on the second model turn (after tool results) and ran mostly on CPU on a 24 GB Mac. `gpt-oss:20b` works cleanly; `qwen3:8b`/`qwen3:14b` and `llama3.1` are other tool-calling options.
- Memory is in-process (`InMemorySaver`); restart the server and conversations reset. Swap in `langgraph-checkpoint-sqlite` for persistence.
- The free you.com profile is rate-limited to 100 queries/day; the agent sometimes makes 2 searches per question.
# matcha
