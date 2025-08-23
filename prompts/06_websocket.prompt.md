# Task: Real-time via WebSocket

Scope:
- Broadcast price updates, portfolio value updates, and alert notifications

Read first:
- Backend/src/services/WebSocketService.ts
- Backend/src/server*.ts (where WS registered)
- components/Dashboard.tsx, StockAnalysis.tsx

Implement:
1) Namespaces/rooms per user; symbol subscriptions
2) Events: price_update, portfolio_update, alert_triggered
3) Backoff/retry strategy on the client (doc only)
4) Tests for event emission (mock Socket.IO)

Acceptance Criteria:
- Clients receive subscribed symbol updates
- Portfolio updates when holdings/prices change
- Alert notifications arrive in near real-time

