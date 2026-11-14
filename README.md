# you-agent

A local research agent you chat with in a browser. Its four specialist roles and final synthesis run through the signed-in Codex CLI. The roles search with you.com MCP, hand findings to one another on the required OpenCrawl board, and emit named Langfuse observations.

## The stack

| Piece | What it does | Where it runs |
|---|---|---|
| **Codex CLI** | Role reasoning and final synthesis | Host CLI login |
| **Agent** (`you_agent/`) | Four-role LangGraph research workflow with you.com search tools, exposed as an OpenAI-style API | Host, `:8010` |
| **Sherlock Capital UI** | Standalone investigation dashboard, uploads, case details and evidence room | Agent host, `:8010/app/` |
| **Open WebUI** | Agent chat interface | Docker, `:3000` |
| **Langfuse** | Tracing. Every chat turn, model call and tool call shows up here | Docker, `:3001` |
| **OpenCrawl** | Captures Claude Code / Codex sessions and makes them searchable for the team | Docker, `:8092` |

```
Browser ─▶ Sherlock UI (:8010/app) ─▶ Agent API (:8010) ─▶ Codex CLI
Browser ─▶ Open WebUI (:3000) ─▶ Agent API (:8010)
                                      │
                                      ├─▶ you.com MCP (web search)
                                      └─▶ Langfuse (:3001) traces
```

Docker Compose runs Open WebUI, Langfuse (plus its Postgres, ClickHouse, Redis, MinIO) and OpenCrawl (plus its Postgres, Temporal, SeaweedFS). The agent runs directly on your Mac and calls the Codex CLI.

## Start everything

```bash
# 1. one-time setup
uv sync
cp .env.example .env            # fill in the secrets, see below
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
| Codex | Local CLI | Sign in with `codex login`; set optional `CODEX_MODEL`. |
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
   - **sherlock-capital** uses Codex CLI plus you.com web search.
3. Ask something. The LangGraph workflow runs a detective, bull, bear and judge in sequence, then asks Codex CLI to write a concise answer with citations. It shows each role while it works. Role findings are published and fetched from an OpenCrawl case topic when the CLI is available; otherwise the workflow passes findings directly between roles. Codex runs in read-only mode; set `CODEX_PROFILE` or `CODEX_MODEL` to select its configuration.
4. Open http://localhost:3001 to see the trace for that turn in Langfuse. Turns from the same chat are grouped as a session.

Terminal version, no UI needed:

```bash
uv run python -m you_agent.cli "What changed in LangGraph this month? Cite sources."
```

## The .env file

`.env` is gitignored. Copy `.env.example` and fill in the table below. The agent reads `.env` only at startup, so after changing it restart `uv run you-agent`. Open the standalone Sherlock Capital app at `http://localhost:8010/app/`; Open WebUI remains available at `http://localhost:3000`. Investigation records and uploads are stored in the workspace (`investigations.sqlite3` and `uploads/`). Stripe is a visual demo only and never accesses a Stripe account or payment data. The Docker services need `docker compose up -d` again.

| Group | Variables | Notes |
|---|---|---|
| Langfuse | `LANGFUSE_PUBLIC_KEY`, `LANGFUSE_SECRET_KEY`, `LANGFUSE_INIT_*`, `NEXTAUTH_SECRET`, `SALT`, `ENCRYPTION_KEY`, `POSTGRES_PASSWORD`, `CLICKHOUSE_PASSWORD`, `MINIO_ROOT_PASSWORD`, `REDIS_AUTH` | The two `LANGFUSE_*_KEY` values must equal the matching `LANGFUSE_INIT_PROJECT_*` values. Generate secrets with `openssl rand -hex 32`. |
| OpenCrawl | `OPENCRAWL_*` | Generate each secret once. Changing `OPENCRAWL_ORGANIZATION_ID` later breaks the existing database. |
| you.com | `YDC_API_KEY` | Optional. Empty gives the free tier (search + discover, 100 queries/day). |
| Models | `CODEX_BIN`, `CODEX_PROFILE`, `CODEX_MODEL` | Codex CLI powers every specialist and final synthesis. |

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
  agent.py        # Codex CLI specialist roles and research tools
  orchestrator.py # research workflow, board handoffs, Codex final synthesis
  prompts/        # editable role instructions
  opencrawl.py    # optional board client
  claude_code.py  # (retained Claude Code utility)
  tracing.py      # Langfuse helpers
  runner.py       # event stream for the Codex-powered workflow
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
