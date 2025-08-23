# Task: Implement Portfolio Management

Scope:
- Create PortfolioService.ts and routes under /api/v1/portfolio
- Features: get portfolio, add/update/remove holding, performance summary
- Inputs: symbol, quantity, purchasePrice, dates; compute current prices via MarketDataService

Read first:
- Backend/src/services/{YahooFinanceService.ts,MarketDataService.ts}
- Backend/src/routes/portfolio.ts (create if missing)
- Backend/sql/init/* (holdings, transactions)
- components/Dashboard.tsx (frontend expectations)

Implement:
1) Data model and queries for portfolios and holdings
2) Endpoints:
   - GET /api/v1/portfolio
   - GET /api/v1/portfolio/holdings
   - POST /api/v1/portfolio/holdings
   - PUT /api/v1/portfolio/holdings/:id
   - DELETE /api/v1/portfolio/holdings/:id
   - GET /api/v1/portfolio/performance
3) Performance metrics: total value, day P/L, overall P/L, allocation by symbol/sector
4) Caching of current prices to minimize API calls
5) Tests: service unit tests + integration (Supertest)

Acceptance Criteria:
- Endpoints return correct shapes for Dashboard.tsx
- Calculations are correct within tolerance; documented rounding
- Minimal rate of external API calls due to caching
- All tests pass

