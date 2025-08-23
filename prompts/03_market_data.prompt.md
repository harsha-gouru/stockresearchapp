# Task: Harden Market Data Service

Scope:
- Consolidate Yahoo Finance access behind MarketDataService
- Add caching (Redis) with sensible TTLs
- Add batch endpoints for multiple symbols

Read first:
- Backend/src/services/{YahooFinanceService.ts,YahooFinanceService-clean.ts,MarketDataService.ts}
- Backend/src/server-yahoo-finance.ts (for examples)
- components/StockSearch.tsx, StockAnalysis.tsx (frontend needs)

Implement:
1) Service methods: getQuote(symbol), getBatchQuotes(symbols[]), getChart(symbol, range), search(query)
2) Redis cache: prices (60s), search (120s), chart (300s)
3) Routes under /api/v1/stocks: /:symbol, /batch, /:symbol/chart, /search
4) Normalize response shapes for frontend consumption
5) Tests for service caching behavior

Acceptance Criteria:
- Batch quote endpoint returns consistent shape
- Cache hit rate improves; fallback on provider errors with clear messages
- Load tests show acceptable latency (<250ms p95 for cached paths)

