# Prompts Quick Start

## With Ollama (local)
- Ensure Ollama is installed and running
- Export OLLAMA_BASE_URL if non-default
- Open each prompt and paste into your Ollama chat client or use a wrapper script

## With OpenAI
- export OPENAI_API_KEY={{OPENAI_API_KEY}}
- Use your preferred CLI/UI to send prompt content

## With Anthropic (Claude)
- export ANTHROPIC_API_KEY={{ANTHROPIC_API_KEY}}
- Use your preferred client to send prompt content

Notes:
- Avoid sending large file contents; refer to exact file paths
- Ask the model to request specific snippets it needs
- Keep responses deterministic by asking for JSON-first plans, then diffs

