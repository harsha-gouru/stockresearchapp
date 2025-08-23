# Task: Implement Notification Service

Scope:
- In-app notifications and email notifications
- User notification preferences

Read first:
- Backend/src/services/NotificationService.ts (create)
- Backend/sql/init/* (notifications, notification_settings)
- components/NotificationsCenter.tsx, NotificationSettings.tsx

Implement:
1) Service with methods: createInApp, list, markRead, markAllRead, sendEmail
2) Routes under /api/v1/notifications
3) Preference model and enforcement (email on/off, categories)
4) Email transport (Nodemailer dev transport acceptable)
5) Tests for service + routes

Acceptance Criteria:
- Notifications appear in UI and can be marked read
- Email sending works in dev; no secrets in repo
- Preferences respected by all senders

