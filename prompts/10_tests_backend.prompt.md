# Task: Backend Testing Suite

Scope:
- Add Jest unit tests and Supertest integration tests for all new services/routes

Read first:
- Backend/package.json (scripts)
- Existing tests in Backend (if any)
- DATA_FLOWS.md (flows to verify)

Implement:
1) Test setup (Jest config, test env .env)
2) Unit tests: Auth, Portfolio, MarketData, Alerts, Notifications, AI (mock clients)
3) Integration tests: Auth flow, Portfolio lifecycle, Alert trigger path
4) Use test DB container or transactions + rollback per test

Acceptance Criteria:
- `npm run test` green locally and in CI (when added)
- Coverage >= 80% for services
- Tests stable and independent

