# Task: Implement Price Alerts (MVP)

Scope:
- CRUD for alerts and a periodic checker job
- Trigger notifications on condition met (email + in-app)

Read first:
- Backend/src/services/{AlertService.ts,MarketDataService.ts,NotificationService.ts}
- Backend/sql/init/* (alerts table)
- components/QuickAlertSetup.tsx, StockAlertsPanel.tsx

Implement:
1) Endpoints under /api/v1/alerts: create, list, delete, history
2) Cron job (node-cron) every 60s to evaluate active alerts
3) Notification hook on trigger
4) Idempotency: avoid duplicate triggers
5) Tests for evaluation logic and CRUD

Acceptance Criteria:
- Users can create and delete alerts via API
- Alerts evaluate against live prices and record history
- Notifications created when triggered
- All tests pass

