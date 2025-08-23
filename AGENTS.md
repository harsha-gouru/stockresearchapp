# AGENTS.md

Using AI agents ("Codex"-style) with this repository

This guide shows how to drive autonomous or semi‑autonomous code changes using modern code models (OpenAI GPT-4 family, Anthropic Claude, and open‑source coder models via Ollama) together with the prompts/ runbook in this repo.

Important: OpenAI Codex (2021–2022) has been sunset. Today, use GPT‑4/GPT‑4o families (or Claude, or OSS code models) for “Codex-like” assistance.

Quick links
- prompts/README.md – how to run tasks
- prompts/plan.yaml – execution order and dependencies
- prompts/* – task prompts for Auth, Portfolio, Market Data, Alerts, Notifications, WebSocket, AI, Watchlist, DB, Tests, Docs

Using “OpenAI Codex online” today
- OpenAI Codex has been sunset. To achieve the same outcome, use ChatGPT (GPT‑4/4o family) with GitHub repo access, or GitHub Copilot Chat in VS Code, or open‑source coder models via Ollama.
- The prompts/ runbook in this repo is designed to guide any of these models to make safe, incremental changes with tests and documentation.

How to link your GitHub repo to an agent
1) ChatGPT (GPT‑4/4o)
   - In ChatGPT (web), link your GitHub account and grant access to harsha-gouru/stockresearchapp.
   - Start a new chat and attach/select the repository (if your plan supports it), or paste the repo URL.
2) GitHub Copilot Chat (VS Code)
   - Install “GitHub Copilot” and “GitHub Copilot Chat”, sign in to GitHub, and open this repo folder locally.
3) Open‑source via Ollama
   - Use the scripts in AGENTS.md (below) or prompts/README.quick-start.md to feed prompt files to a local model.

Copy‑paste prompt templates (Codex‑style)

1) Bootstrap prompt (ChatGPT with repo access)
```text path=null start=null
Act as a senior full‑stack engineer working in the repository harsha-gouru/stockresearchapp (branch: main).
Follow the repo’s runbook in prompts/plan.yaml.
Rules:
- Output a JSON plan first (files to read, changes to make, tests to add, verification commands).
- Then produce minimal unified diffs per file, one file at a time.
- Add or update tests (Jest/Supertest for Backend; Vitest for frontend when applicable).
- Use environment variables (no secrets inline). Update docs (README/WARP) if public APIs change.
- Finish with a conventional commit message.
Context files to read first: WARP.md, ARCHITECTURE.md, prompts/plan.yaml, prompts/01_auth_service.prompt.md, Backend/src/routes/auth.ts, Backend/src/services/AuthService.ts.
Goal: Implement the MVP auth flow described in prompts/01_auth_service.prompt.md and open a PR.
```

2) JSON plan request (use this right after the bootstrap)
```text path=null start=null
Before changing any code, output only a JSON object with keys: read, changes, tests, verify.
Example shape:
{
  "read": ["Backend/src/routes/auth.ts", "Backend/src/services/AuthService.ts"],
  "changes": [
    { "file": "Backend/src/services/AuthService.ts", "reason": "Add refresh token rotation and email verification handling" },
    { "file": "Backend/src/routes/auth.ts", "reason": "Wire endpoints and validation" }
  ],
  "tests": [
    "Backend/tests/auth.login.test.ts",
    "Backend/tests/auth.refresh.test.ts",
    "Backend/tests/auth.reset-password.test.ts"
  ],
  "verify": [
    "(cd Backend && npm run lint)",
    "(cd Backend && npm run test)"
  ]
}
Return only JSON.
```

3) Diff‑only request (apply per file)
```text path=null start=null
Now provide a unified diff for Backend/src/services/AuthService.ts only.
Constraints:
- Minimal, atomic change
- Preserve existing user edits
- No secrets; use env vars
- Include robust error handling and input validation
Return only the diff.
```

4) Verification block request
```text path=null start=null
Provide a verification block listing exact commands to lint and test this change locally, and the expected outcomes (e.g., which tests should pass). Return a short, copy‑pasteable block.
```

5) Commit message request
```text path=null start=null
Provide a conventional commit message summarizing the change, scope, and tests.
Format: <type>(scope): <summary>\n\n<body>\n\n<tests>
```

6) PR request (if the tool can open a PR)
```text path=null start=null
Open a pull request titled: feat(auth): complete MVP auth (register/login/refresh/reset/verify)
Include a summary of changes, tests added, and verification steps.
```

Notes and limitations
- If the AI cannot access the repo directly, paste the relevant file snippets the model asks for (keep diffs small).
- Avoid sharing secrets. Use placeholders like {{OPENAI_API_KEY}} or configure repo secrets for CI.
- For large changes, iterate: JSON plan → single‑file diff → verify → repeat.

1) Choose a model provider

A. OpenAI (recommended for fastest results)
- Models: gpt-4.1, gpt-4o, gpt-4o-mini (cost‑effective), gpt-4.1-mini
- Setup (zsh):
  export OPENAI_API_KEY={{OPENAI_API_KEY}}

- Minimal Node.js example to run a prompt file through Chat Completions:
  (Adjust model to your preference.)
  
  ```js path=null start=null
  // scripts/run-openai.mjs
  import fs from 'node:fs/promises'
  import OpenAI from 'openai'
  
  const filePath = process.argv[2] || 'prompts/01_auth_service.prompt.md'
  const prompt = await fs.readFile(filePath, 'utf8')
  
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  
  const res = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'You are a senior full‑stack engineer. Output JSON plans first, then unified diffs when asked.' },
      { role: 'user', content: prompt }
    ],
    temperature: 0.2
  })
  
  console.log(res.choices[0].message.content)
  ```
  
  Run:
  node scripts/run-openai.mjs prompts/01_auth_service.prompt.md

B. Anthropic (Claude)
- Models: Claude 3 Opus/Sonnet/Haiku
- Setup (zsh):
  export ANTHROPIC_API_KEY={{ANTHROPIC_API_KEY}}

- Minimal Node example:
  ```js path=null start=null
  // scripts/run-claude.mjs
  import fs from 'node:fs/promises'
  import Anthropic from '@anthropic-ai/sdk'
  
  const filePath = process.argv[2] || 'prompts/01_auth_service.prompt.md'
  const prompt = await fs.readFile(filePath, 'utf8')
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
  
  const res = await client.messages.create({
    model: 'claude-3-sonnet-20240229',
    max_tokens: 1500,
    messages: [
      { role: 'user', content: prompt }
    ]
  })
  
  console.log(res.content?.[0]?.text || '')
  ```
  
  Run:
  node scripts/run-claude.mjs prompts/02_portfolio_service.prompt.md

C. Open‑source (local) via Ollama
- Your environment has OLLAMA_BASE_URL set to http://ollama:11434 (per repo rules). USE_OLLAMA_DOCKER=false
- Recommended coder models: deepseek-coder, codellama, starcoder2, qwen2.5-coder
- Pull a model:
  ollama pull deepseek-coder

- Simple Node example using fetch:
  ```js path=null start=null
  // scripts/run-ollama.mjs
  import fs from 'node:fs/promises'
  const filePath = process.argv[2] || 'prompts/03_market_data.prompt.md'
  const prompt = await fs.readFile(filePath, 'utf8')
  
  const res = await fetch(`${process.env.OLLAMA_BASE_URL || 'http://localhost:11434'}/api/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'deepseek-coder', prompt, stream: false })
  })
  const json = await res.json()
  console.log(json.response)
  ```
  
  Run:
  node scripts/run-ollama.mjs prompts/04_alerts.prompt.md

2) Drive tasks with the prompts runbook

- The prompts/plan.yaml file defines order and dependencies:
  00_overall_goals → 01_auth_service → 02_portfolio_service → 03_market_data → 04_alerts → 05_notifications → 06_websocket → 07_ai_service → 08_watchlist → 09_db_migrations → 10_tests_backend → 11_docs_update → 12_integration
- For each task, ask the model to:
  1. Output a JSON‑structured plan first (files to read, files to change, tests to add)
  2. Produce unified diffs only for changed files (atomic, minimal)
  3. Provide test additions (Jest/Supertest for backend, Vitest for frontend when applicable)
  4. Provide a verification block (commands already available in package.json)
  5. Provide a conventional commit message

- Useful verification commands:
  npm run lint
  (cd Backend && npm run lint)
  npm run test:coverage
  (cd Backend && npm run test)

3) “Codex”-style prompting patterns

Because Codex itself is deprecated, use these patterns with GPT‑4o/Claude/OSS coder models to emulate Codex workflows:
- Always show exact file paths and keep diffs small and isolated
- Ask for a JSON plan first:
  {
    "read": ["Backend/src/routes/auth.ts", "Backend/src/services/AuthService.ts"],
    "changes": [
      { "file": "Backend/src/services/AuthService.ts", "reason": "add refresh token rotation" }
    ],
    "tests": ["Backend/tests/auth.refresh.test.ts"],
    "verify": ["(cd Backend && npm run test)"]
  }
- Then ask for diffs only (no commentary), one file at a time if necessary
- Require tests and a commit message per task

4) Safety and secrets

- Never paste secrets in prompts. Use environment variables set in Backend/.env
- If a prompt references a redacted secret (****), replace with {{SECRET_NAME}} placeholders
- Use the existing Docker scripts to run PostgreSQL/Redis locally; do not embed credentials in code

5) Suggested models for tasks

- Auth & Portfolio (logic‑heavy): Claude 3 Sonnet, GPT‑4o, Qwen2.5‑Coder (OSS)
- Market Data (IO + caching): GPT‑4o‑mini, Mistral‑Nemo, DeepSeek‑Coder
- Alerts & Notifications (cron + email): GPT‑4o‑mini, Claude 3 Haiku
- WebSocket (eventing): GPT‑4o‑mini, DeepSeek‑Coder
- AI Insights (prompting): GPT‑4o (Stage 1), FinBERT + Llama3 via Ollama (Stage 2)

6) Example agent loop (manual)

- For prompts/01_auth_service.prompt.md:
  1. Ask model for a JSON plan
  2. Ask model for diffs (apply them)
  3. Run (cd Backend && npm run test)
  4. If red, paste errors back to the model
  5. Repeat until green
  6. Commit with the provided message

7) Troubleshooting

- The model proposes diffs that don’t apply
  - Ask it to re‑read the exact current file content (paste the relevant snippet only)
  - Ask for smaller, targeted diffs
- The model introduces secrets inline
  - Reject and ask it to use env variables from Backend/.env
- Tests flaky locally
  - Ensure DB is up: (cd Backend && npm run docker:start)
  - Use transactions/reset per test or run in a test DB

8) FAQ

Q: Can I still use the old OpenAI Codex?
A: No; it has been sunset. Use GPT‑4/4o families as modern replacements, or Claude, or open‑source coder models (DeepSeek‑Coder, CodeLlama, StarCoder2, Qwen2.5‑Coder) via Ollama.

Q: Can I fine‑tune an OSS model on my data?
A: Yes. Start with LoRA/QLoRA adapters on Llama 3 / Qwen2.5‑Coder using a curated dataset (e.g., (prompt, diff) pairs from your PR history). Serve with Ollama or vLLM once ready.

Q: How do I control AI cost?
A: Prefer gpt‑4o‑mini for iteration; cache intermediate outputs; use OSS locally for heavy refactors; only switch to higher‑end models for final reviews.

—

With this file and the prompts/ runbook, you (or an automated agent) can implement the backend piecemeal, with tests and docs, in a repeatable way.

