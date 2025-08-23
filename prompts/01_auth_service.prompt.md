# Task: Complete Authentication System

Scope:
- Implement robust AuthService and routes under /api/v1/auth
- Features: register, login, logout, refresh, forgot-password, reset-password, verify-email
- Persistence: PostgreSQL for users, Redis for sessions/refresh tokens (if used)
- Email: Nodemailer (or SendGrid) for verification and reset links

Read these files first:
- Backend/src/routes/auth.ts
- Backend/src/services/AuthService.ts
- Backend/src/middleware/auth.ts
- Backend/src/config/{environment.ts,redis.ts,database.ts}
- Backend/sql/init/* (existing schema)
- WARP.md, ARCHITECTURE.md, DATA_FLOWS.md

Implement:
1) Refresh tokens with rotation and invalidation
2) Email verification flow (issue token, verify endpoint)
3) Forgot/reset password (issue token, reset endpoint)
4) Harden validation (Joi or express-validator) and error mapping
5) Unit tests (Jest) and integration tests (Supertest) for all endpoints

Endpoints (mounted at /api/v1/auth):
- POST /register
- POST /login
- POST /logout
- POST /refresh
- POST /forgot-password
- POST /reset-password
- POST /verify-email

Output:
- Proposed diffs for service + routes + tests + minimal email templates
- Updated .env.example entries (SMTP or SENDGRID)
- Verification commands and expected outputs
- Conventional commit message

Acceptance Criteria:
- All auth routes return correct status codes and JSON shape
- Passwords hashed (bcrypt), tokens signed with configured secrets
- Refresh tokens invalidated after use (rotation)
- Emails sent via configured provider in dev (log transport acceptable)
- Tests cover success and error paths (>= 80% for service)

