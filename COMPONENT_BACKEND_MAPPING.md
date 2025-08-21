# 🔗 Component-Backend Mapping - iOS Stock Trading App

## Overview
This document provides a clear mapping between frontend components and the backend services/endpoints they require. This helps developers understand dependencies and prioritize backend implementation.

## Status Legend
- ✅ **Implemented** - Backend endpoint exists and works
- ⚠️ **Partial** - Backend endpoint exists but incomplete
- ❌ **Missing** - Backend endpoint not implemented
- 🔧 **In Progress** - Currently being developed

---

## Component Dependency Matrix

### Authentication Components

| Component | Required Endpoints | Status | Backend Services | Notes |
|-----------|-------------------|---------|------------------|-------|
| **Login.tsx** | POST /api/auth/login | ⚠️ | AuthService | Works but no email verification |
| | POST /api/auth/refresh | ❌ | AuthService | Token refresh not implemented |
| | GET /api/auth/validate | ❌ | AuthService | Token validation needed |
| **SignUp.tsx** | POST /api/auth/register | ⚠️ | AuthService, EmailService | Registration works, email verification missing |
| | POST /api/auth/verify-email | ❌ | EmailService | Email verification not connected |
| **ForgotPassword.tsx** | POST /api/auth/forgot-password | ❌ | AuthService, EmailService | Endpoint exists but no email sending |
| | POST /api/auth/reset-password | ❌ | AuthService | Reset logic not implemented |
| **BiometricSetup.tsx** | POST /api/user/biometric | ❌ | UserService | Not implemented |
| | GET /api/user/biometric-status | ❌ | UserService | Not implemented |

### Market Data Components

| Component | Required Endpoints | Status | Backend Services | Notes |
|-----------|-------------------|---------|------------------|-------|
| **Dashboard.tsx** | GET /api/portfolio | ❌ | PortfolioService | No portfolio service |
| | GET /api/portfolio/holdings | ❌ | PortfolioService | Missing |
| | GET /api/portfolio/performance | ❌ | PortfolioService | Missing |
| | GET /api/stocks/batch | ⚠️ | StockDataService | Can fetch individual stocks |
| | WS /portfolio-updates | ❌ | WebSocketService | Real-time updates missing |
| **StockSearch.tsx** | GET /api/stocks/search | ✅ | YahooFinanceService | Working with Yahoo Finance |
| | GET /api/stocks/trending | ❌ | StockDataService | Not implemented |
| | GET /api/stocks/suggestions | ❌ | StockDataService, AIService | Not implemented |
| **StockAnalysis.tsx** | GET /api/stocks/:symbol | ✅ | YahooFinanceService | Working with real data |
| | GET /api/stocks/:symbol/chart | ⚠️ | YahooFinanceService | Basic chart data available |
| | GET /api/stocks/:symbol/news | ❌ | NewsService | Not implemented |
| | GET /api/ai/analysis/:symbol | ❌ | AIService | AI service not implemented |
| | WS /price-updates | ❌ | WebSocketService | Real-time prices missing |
| **Watchlist.tsx** | GET /api/watchlist | ❌ | WatchlistService | Not implemented |
| | POST /api/watchlist/add | ❌ | WatchlistService | Not implemented |
| | DELETE /api/watchlist/:symbol | ❌ | WatchlistService | Not implemented |
| | PUT /api/watchlist/reorder | ❌ | WatchlistService | Not implemented |

### AI & Insights Components

| Component | Required Endpoints | Status | Backend Services | Notes |
|-----------|-------------------|---------|------------------|-------|
| **AIAnalysisDetail.tsx** | GET /api/ai/analysis/:symbol | ❌ | AIService | OpenAI integration missing |
| | POST /api/ai/generate-insight | ❌ | AIService | Not implemented |
| | GET /api/ai/history/:symbol | ❌ | AIService | Not implemented |
| **AIInsightsHistory.tsx** | GET /api/ai/insights | ❌ | AIService | Not implemented |
| | GET /api/ai/insights/:id | ❌ | AIService | Not implemented |
| | POST /api/ai/insights/feedback | ❌ | AIService | Not implemented |
| **Insights.tsx** | GET /api/ai/market-insights | ❌ | AIService | Not implemented |
| | GET /api/ai/portfolio-insights | ❌ | AIService, PortfolioService | Not implemented |
| | GET /api/ai/recommendations | ❌ | AIService | Not implemented |

### Alert Components

| Component | Required Endpoints | Status | Backend Services | Notes |
|-----------|-------------------|---------|------------------|-------|
| **StockAlertsPanel.tsx** | GET /api/alerts | ❌ | AlertService | Service exists but not connected |
| | GET /api/alerts/active | ❌ | AlertService | Not implemented |
| | GET /api/alerts/history | ❌ | AlertService | Not implemented |
| | DELETE /api/alerts/:id | ❌ | AlertService | Not implemented |
| | PUT /api/alerts/:id | ❌ | AlertService | Not implemented |
| **QuickAlertSetup.tsx** | POST /api/alerts | ❌ | AlertService | Not implemented |
| | GET /api/alerts/types | ❌ | AlertService | Not implemented |
| | POST /api/alerts/test | ❌ | AlertService, NotificationService | Not implemented |

### User Management Components

| Component | Required Endpoints | Status | Backend Services | Notes |
|-----------|-------------------|---------|------------------|-------|
| **Profile.tsx** | GET /api/user/profile | ❌ | UserService | Not implemented |
| | PUT /api/user/profile | ❌ | UserService | Not implemented |
| | POST /api/user/avatar | ❌ | UserService, FileService | Not implemented |
| | GET /api/user/stats | ❌ | UserService, PortfolioService | Not implemented |
| **Settings.tsx** | GET /api/user/settings | ❌ | UserService | Not implemented |
| | PUT /api/user/settings | ❌ | UserService | Not implemented |
| | PUT /api/user/password | ❌ | AuthService | Not implemented |
| | DELETE /api/user/account | ❌ | UserService | Not implemented |
| **NotificationsCenter.tsx** | GET /api/notifications | ❌ | NotificationService | Not implemented |
| | PUT /api/notifications/:id/read | ❌ | NotificationService | Not implemented |
| | DELETE /api/notifications/:id | ❌ | NotificationService | Not implemented |
| | POST /api/notifications/mark-all-read | ❌ | NotificationService | Not implemented |
| **NotificationSettings.tsx** | GET /api/user/notification-preferences | ❌ | UserService | Not implemented |
| | PUT /api/user/notification-preferences | ❌ | UserService | Not implemented |
| | POST /api/notifications/test | ❌ | NotificationService | Not implemented |

### Discovery Components

| Component | Required Endpoints | Status | Backend Services | Notes |
|-----------|-------------------|---------|------------------|-------|
| **Discover.tsx** | GET /api/market/trending | ❌ | MarketDataService | Not implemented |
| | GET /api/market/movers | ❌ | MarketDataService | Not implemented |
| | GET /api/market/sectors | ❌ | MarketDataService | Not implemented |
| | GET /api/ai/discover | ❌ | AIService | Not implemented |

### Navigation Components

| Component | Required Endpoints | Status | Backend Services | Notes |
|-----------|-------------------|---------|------------------|-------|
| **TabBar.tsx** | GET /api/notifications/count | ❌ | NotificationService | Badge count |
| **TabBarLayout.tsx** | GET /api/user/session | ❌ | AuthService | Session validation |
| **OnboardingScreen.tsx** | POST /api/user/onboarding | ❌ | UserService | Track completion |

---

## Backend Service Requirements

### Priority 1: Core Functionality (Week 1)
These services are critical for basic app functionality:

| Service | Required By Components | Implementation Priority |
|---------|------------------------|------------------------|
| **PortfolioService** | Dashboard, Profile, Insights | 🔴 CRITICAL |
| **Complete AuthService** | All authenticated routes | 🔴 CRITICAL |
| **EmailService** | SignUp, ForgotPassword | 🔴 CRITICAL |

### Priority 2: Enhanced Features (Week 2)
These services enhance user experience:

| Service | Required By Components | Implementation Priority |
|---------|------------------------|------------------------|
| **AlertService** | StockAlertsPanel, QuickAlertSetup | 🟡 HIGH |
| **WatchlistService** | Watchlist, Dashboard | 🟡 HIGH |
| **NotificationService** | NotificationsCenter, Alerts | 🟡 HIGH |
| **WebSocketService** | Dashboard, StockAnalysis | 🟡 HIGH |

### Priority 3: Advanced Features (Week 3)
These services provide advanced functionality:

| Service | Required By Components | Implementation Priority |
|---------|------------------------|------------------------|
| **AIService** | AIAnalysisDetail, AIInsightsHistory, Insights | 🟢 MEDIUM |
| **MarketDataService** | Discover, Dashboard | 🟢 MEDIUM |
| **UserService** | Profile, Settings | 🟢 MEDIUM |
| **NewsService** | StockAnalysis, Discover | 🟢 MEDIUM |

---

## Missing Backend Services Detail

### 1. PortfolioService (Not Implemented)
```typescript
// Required methods
class PortfolioService {
  createPortfolio(userId: string, name: string)
  getPortfolio(userId: string)
  addHolding(portfolioId: string, holding: HoldingData)
  updateHolding(holdingId: string, updates: Partial<HoldingData>)
  removeHolding(holdingId: string)
  getPerformance(portfolioId: string)
  getHistoricalValue(portfolioId: string, period: string)
}
```

### 2. AlertService (Stub Only)
```typescript
// Required methods
class AlertService {
  createAlert(userId: string, alert: AlertData)
  getAlerts(userId: string)
  getActiveAlerts(userId: string)
  updateAlert(alertId: string, updates: Partial<AlertData>)
  deleteAlert(alertId: string)
  checkAlerts() // Cron job
  triggerAlert(alert: Alert)
}
```

### 3. AIService (Not Implemented)
```typescript
// Required methods
class AIService {
  generateStockAnalysis(symbol: string)
  generatePortfolioInsights(portfolio: Portfolio)
  getMarketSentiment()
  getRecommendations(userId: string)
  generatePricePrediction(symbol: string)
}
```

### 4. NotificationService (Not Implemented)
```typescript
// Required methods
class NotificationService {
  sendEmail(to: string, subject: string, body: string)
  sendPush(userId: string, notification: NotificationData)
  sendSMS(phone: string, message: string)
  createInAppNotification(userId: string, notification: NotificationData)
  getNotifications(userId: string)
  markAsRead(notificationId: string)
}
```

### 5. WebSocketService (Basic Only)
```typescript
// Required enhancements
class WebSocketService {
  broadcastPriceUpdate(symbol: string, price: number)
  broadcastPortfolioUpdate(userId: string, portfolio: Portfolio)
  broadcastAlert(userId: string, alert: Alert)
  subscribeToSymbols(userId: string, symbols: string[])
  unsubscribeFromSymbols(userId: string, symbols: string[])
}
```

---

## API Coverage Summary

### Overall Implementation Status
- **Total Endpoints Required**: 89
- **Fully Implemented**: 3 (3.4%)
- **Partially Implemented**: 5 (5.6%)
- **Not Implemented**: 81 (91%)

### By Category
| Category | Total | Implemented | Partial | Missing |
|----------|-------|-------------|---------|---------|
| Authentication | 10 | 0 | 2 | 8 |
| Stock Data | 12 | 2 | 2 | 8 |
| Portfolio | 8 | 0 | 0 | 8 |
| Alerts | 9 | 0 | 0 | 9 |
| AI Insights | 12 | 0 | 0 | 12 |
| Notifications | 8 | 0 | 0 | 8 |
| User Management | 15 | 0 | 0 | 15 |
| Market Data | 6 | 0 | 1 | 5 |
| WebSocket | 5 | 0 | 0 | 5 |
| Misc | 4 | 1 | 0 | 3 |

---

## Implementation Roadmap

### Week 1: Foundation
1. **Complete AuthService**
   - Email verification
   - Password reset
   - Token refresh
   
2. **Create PortfolioService**
   - CRUD operations
   - Performance calculations
   - Portfolio value tracking

3. **Setup EmailService**
   - SendGrid/Nodemailer integration
   - Email templates
   - Verification emails

### Week 2: Core Features
1. **Implement AlertService**
   - Alert CRUD
   - Alert monitoring job
   - Trigger notifications

2. **Build NotificationService**
   - In-app notifications
   - Email notifications
   - Notification preferences

3. **Enhance WebSocketService**
   - Real-time price updates
   - Portfolio updates
   - Alert notifications

### Week 3: Advanced Features
1. **Create AIService**
   - OpenAI integration
   - Stock analysis
   - Portfolio insights

2. **Build MarketDataService**
   - Market trends
   - Top movers
   - Sector performance

3. **Complete UserService**
   - Profile management
   - Settings
   - Statistics

---

## Testing Requirements

### Component Testing Needs
Each component needs mock data for its required endpoints:

```javascript
// Example mock for Dashboard.tsx
const mockPortfolioResponse = {
  portfolio: {
    id: "123",
    totalValue: 50000,
    holdings: [...],
    performance: {...}
  }
}

// Example mock for StockAnalysis.tsx
const mockStockResponse = {
  stock: {
    symbol: "AAPL",
    price: 226.01,
    change: 2.15,
    ...
  }
}
```

### Integration Testing Priority
1. Authentication flow (Login → Dashboard)
2. Stock search and selection (StockSearch → StockAnalysis)
3. Portfolio management (Dashboard → Add holding)
4. Alert creation (StockAnalysis → QuickAlertSetup)
5. Real-time updates (WebSocket → Dashboard)

---

## Developer Notes

### Quick Reference for Implementation
When implementing a new backend service:
1. Check this document for required endpoints
2. Implement service methods in `Backend/src/services/`
3. Create routes in `Backend/src/routes/`
4. Update this document's status column
5. Test with corresponding frontend component
6. Update integration tests

### Common Patterns
- All authenticated endpoints should use `authMiddleware`
- All responses should follow standard format: `{success: boolean, data?: any, error?: string}`
- All errors should be properly logged
- All database operations should use transactions where appropriate
- All external API calls should be cached in Redis
