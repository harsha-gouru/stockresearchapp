# Task: Database Migrations & Seeding

Scope:
- Ensure all tables exist as per docs; add migrations if missing
- Provide seed data for local dev

Read first:
- Backend/sql/init/*
- BACKEND_IMPLEMENTATION_ROADMAP.md (schema hints)

Implement:
1) Set up migration tool (e.g., node-pg-migrate or Knex) if absent
2) Create migrations for: portfolios, holdings, alerts, notifications, ai_insights
3) Add seed scripts for demo users and holdings
4) Update Backend/package.json with migrate/seed scripts

Acceptance Criteria:
- One command bootstraps DB for local dev
- Migrations idempotent and reversible
- Seed data enables dashboards to render meaningful info

