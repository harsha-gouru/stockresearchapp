# Task: Watchlist Service

Scope:
- CRUD watchlist items for each user

Read first:
- Backend/src/routes/watchlist.ts (create)
- Backend/sql/init/* (watchlists)
- components/Watchlist.tsx

Implement:
- Endpoints: GET /api/v1/watchlist, POST /api/v1/watchlist, DELETE /api/v1/watchlist/:symbol, PUT /api/v1/watchlist/reorder
- Basic service with validation and tests

Acceptance Criteria:
- Watchlist reflects user operations and persists correctly
- Order preserved and reorder endpoint updates positions

