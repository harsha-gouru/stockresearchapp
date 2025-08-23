# Mission: Bring backend to MVP to power the complete frontend

Context:
- Repo root: iOS Onboarding Screen
- Frontend: React 18 + TS (complete UI)
- Backend: Node + Fastify/Express (partial)
- DB/Cache: PostgreSQL + Redis via Docker
- Real data: Yahoo Finance integration exists

Primary goals (in order):
1) Complete Authentication: register, login, refresh, forgot/reset, verify email
2) Portfolio Management: CRUD, performance, summary endpoints
3) Market Data: stable services and caching primitives
4) Alerts: price alerts MVP + scheduled checks
5) Notifications: in-app + email (push optional)
6) WebSocket: real-time prices + portfolio updates + alert pushes
7) AI Insights: prompt-based insights (OpenAI initially), later OSS model
8) Tests and Docs: integration tests + README/WARP updates

Rules of engagement:
- Propose atomic diffs; stay consistent with existing code style
- Do not remove or override user-edited lines
- Use environment variables for secrets and external API keys
- Update docs (README/WARP) when endpoints change
- Add or update tests with each feature

Deliverables for this task:
- A 1–2 page plan detailing the exact files to change/create for all goals
- A risk assessment and fallback plan for each goal
- A checklist with acceptance criteria and verification commands
- Do not make code changes yet—produce the implementation plan only

