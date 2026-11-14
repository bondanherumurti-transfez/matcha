# you-agent

A local research agent you chat with in a browser. It runs on Ollama (or Claude), searches the web with the you.com MCP server, logs every step to Langfuse, and has its coding sessions captured by OpenCrawl.

## The stack

| Piece | What it does | Where it runs |
|---|---|---|
| **Ollama** | Local LLM (`gpt-oss:20b` by default) | Host, `:11434` |
| **Agent** (`you_agent/`) | LangGraph ReAct agent with you.com search tools, exposed as an OpenAI-style API | Host, `:8010` |
| **Open WebUI** | Chat interface. Talks to the agent and to Ollama | Docker, `:3000` |
| **Langfuse** | Tracing. Every chat turn, model call and tool call shows up here | Docker, `:3001` |
| **OpenCrawl** | Captures Claude Code / Codex sessions and makes them searchable for the team | Docker, `:8092` |

```
Browser ─▶ Open WebUI (:3000) ─▶ Agent (:8010) ─▶ Ollama (:11434) or Claude
                                      │
                                      ├─▶ you.com MCP (web search)
                                      └─▶ Langfuse (:3001) traces
```

Docker Compose runs Open WebUI, Langfuse (plus its Postgres, ClickHouse, Redis, MinIO) and OpenCrawl (plus its Postgres, Temporal, SeaweedFS). Ollama and the agent run directly on your Mac.

## Start everything

```bash
# 1. one-time setup
uv sync
cp .env.example .env            # fill in the secrets, see below
ollama pull gpt-oss:20b
git submodule update --init     # pulls opencrawl-core

# 2. docker services (Open WebUI + Langfuse + OpenCrawl)
docker compose up -d --build    # first run builds OpenCrawl, takes a few minutes

# 3. the agent
uv run you-agent                # http://localhost:8010
```

Check it is alive:

```bash
docker compose ps
curl localhost:8010/health
```

## Ports and logins

| Service | URL | Login |
|---|---|---|
| Open WebUI | http://localhost:3000 | None. Auth is off for local dev (`WEBUI_AUTH=false`). |
| Langfuse | http://localhost:3001 | Email `LANGFUSE_INIT_USER_EMAIL`, password `LANGFUSE_INIT_USER_PASSWORD` from `.env` (default email `admin@example.com`). The user is created on first boot. |
| OpenCrawl | http://localhost:8092 | First admin signs up through a one-time setup link (see below). After that, normal email/password login. |
| Agent API | http://localhost:8010 | None. Open WebUI sends a placeholder key. |
| Ollama | http://localhost:11434 | None. |
| MinIO console (Langfuse storage) | http://localhost:9091 | User `minio`, password `MINIO_ROOT_PASSWORD` from `.env`. Rarely needed. |

Everything except Open WebUI is bound to `127.0.0.1`, so it is reachable only from this machine.

### OpenCrawl first login

Print the setup link, open it in a browser, and create the first admin account:

```bash
docker compose exec -T opencrawl-app node -e "console.log(process.env.OPENCRAWL_URL+'/auth/signup?setup='+encodeURIComponent(process.env.OPENCRAWL_SETUP_TOKEN))"
```

The link works once. Invite teammates from **Team** inside the UI.

Then connect Claude Code on your Mac so sessions get captured:

```bash
curl -fsSL https://raw.githubusercontent.com/getopencrawl/opencrawl-core/main/cli/install.sh | sh
opencrawl login --api http://localhost:8092 --json
opencrawl collect install --yes --backfill skip --api http://localhost:8092 --json
```

## Using it

1. Open http://localhost:3000.
2. Pick a model from the dropdown:
   - **you-agent** uses Ollama.
   - **you-agent-claude** uses Claude through the Claude Code CLI (needs `claude` installed and logged in; bills your subscription).
   - **you-agent-claude-api** appears only if `ANTHROPIC_API_KEY` is set.
3. Ask something. You will see `🔎 calling you-search…` lines while it works, then an answer with citations.
4. Open http://localhost:3001 to see the trace for that turn in Langfuse. Turns from the same chat are grouped as a session.

Terminal version, no UI needed:

```bash
uv run python -m you_agent.cli "What changed in LangGraph this month? Cite sources."
```

## The .env file

`.env` is gitignored. Copy `.env.example` and fill in the table below. The agent reads `.env` only at startup, so after changing it restart `uv run you-agent`. The Docker services need `docker compose up -d` again.

| Group | Variables | Notes |
|---|---|---|
| Langfuse | `LANGFUSE_PUBLIC_KEY`, `LANGFUSE_SECRET_KEY`, `LANGFUSE_INIT_*`, `NEXTAUTH_SECRET`, `SALT`, `ENCRYPTION_KEY`, `POSTGRES_PASSWORD`, `CLICKHOUSE_PASSWORD`, `MINIO_ROOT_PASSWORD`, `REDIS_AUTH` | The two `LANGFUSE_*_KEY` values must equal the matching `LANGFUSE_INIT_PROJECT_*` values. Generate secrets with `openssl rand -hex 32`. |
| OpenCrawl | `OPENCRAWL_*` | Generate each secret once. Changing `OPENCRAWL_ORGANIZATION_ID` later breaks the existing database. |
| you.com | `YDC_API_KEY` | Optional. Empty gives the free tier (search + discover, 100 queries/day). |
| Models | `OLLAMA_MODEL`, `CLAUDE_CODE_MODEL`, `MODEL_PROVIDER` | `MODEL_PROVIDER` sets the default for the CLI (`ollama`, `claude` or `claude-api`). |

## Stop and reset

```bash
docker compose stop              # stop containers, keep data
docker compose down              # remove containers, keep data
docker compose down -v           # remove containers AND all data (Langfuse, OpenCrawl, Open WebUI)
```

## Project layout

```
you_agent/
  config.py       # env parsing, model menu, you.com MCP connection
  agent.py        # LangGraph agent for Ollama / Anthropic API
  claude_code.py  # Claude Code CLI provider (`claude -p`)
  tracing.py      # Langfuse helpers
  runner.py       # one event stream for all providers
  server.py       # FastAPI, OpenAI-compatible API for Open WebUI
  cli.py          # terminal runner
docker-compose.yml  # Open WebUI + Langfuse + OpenCrawl
opencrawl-core/     # git submodule, OpenCrawl source
.env.example
```

## Known issues

- `qwen3.8:27b` fails on the second tool turn and runs mostly on CPU on a 24 GB Mac. Stick with `gpt-oss:20b`.
- Agent memory is in-process. Restarting the agent server resets conversations.
- The free you.com tier is capped at 100 queries a day, and the agent sometimes makes two searches per question.
