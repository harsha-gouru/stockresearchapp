# Prompts Runbook

This folder contains structured prompts that an AI agent can execute sequentially to implement the backend features for this repository with minimal human intervention.

## How to use

- Recommended model: gpt-4, claude-3, llama3 (via Ollama), mistral
- Drive each task with the corresponding prompt file, in the order defined by `plan.yaml`
- For each task prompt:
  1) Read the referenced files to gain context
  2) Propose minimal, incremental changes as diffs
  3) Add or update tests
  4) Run verification commands (lint/tests/dev server) and iterate until green
  5) Prepare a single, clear commit with an atomic message

Important rules:
- Never hardcode secrets; use env vars and .env files already defined
- Prefer small, reviewable diffs; keep existing code style and patterns
- Preserve any user edits; do not overwrite manual changes
- Update docs when public APIs change

## Execution order

See plan.yaml for task order, dependencies, acceptance criteria, and verification steps.

## Local model usage examples

- Ollama local (no secrets required):
  - Set OLLAMA_BASE_URL if needed (already set in this env)
  - Run model loop and paste prompt contents

- OpenAI API CLI (example):
  - export OPENAI_API_KEY={{OPENAI_API_KEY}}
  - Use your preferred CLI or UI to send prompt files as context

## Output expectations

Each task must output:
- Proposed code diffs (by file path) that apply cleanly
- New/updated tests
- A short verification plan and commands (read-only where applicable)
- A conventional commit message
- Notes on follow-ups or tech debt created

