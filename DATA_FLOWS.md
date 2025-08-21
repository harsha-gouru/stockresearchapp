# 📊 Data Flows - iOS Stock Trading App

## Overview
This document maps all data flows in the application, showing how data moves between frontend components, backend services, databases, and external APIs.

## Table of Contents
- [Authentication Flows](#authentication-flows)
- [Stock Data Flows](#stock-data-flows)
- [Portfolio Management Flows](#portfolio-management-flows)
- [Alert System Flows](#alert-system-flows)
- [AI Insights Flows](#ai-insights-flows)
- [Real-time Data Flows](#real-time-data-flows)
- [Notification Flows](#notification-flows)

---

## Authentication Flows

### User Registration Flow
```mermaid
sequenceDiagram
    participant U as User
    participant FE as SignUp.tsx
    participant API as /api/auth/register
    participant AS as AuthService
    participant DB as PostgreSQL
    participant ES as EmailService
    
    U->>FE: Enter credentials
    FE->>FE: Validate input
    FE->>API: POST {email, password, name}
    API->>AS: register(userData)
    AS->>AS: Hash password (bcrypt)
    AS->>DB: INSERT user
    DB-->>AS: User created
    AS->>ES: Send verification email
    AS->>AS: Generate JWT tokens
    AS-->>API: {tokens, user}
    API-->>FE: 201 Created
    FE->>FE: Store tokens in localStorage
    FE->>U: Navigate to Dashboard
```

### User Login Flow
```mermaid
sequenceDiagram
    participant U as User
    participant FE as Login.tsx
    participant API as /api/auth/login
    participant AS as AuthService
    participant DB as PostgreSQL
    participant R as Redis
    
    U->>FE: Enter credentials
    FE->>API: POST {email, password}
    API->>AS: login(credentials)
    AS->>DB: SELECT user BY email
    AS->>AS: Verify password
    AS->>AS: Generate tokens
    AS->>R: Store session
    AS-->>API: {tokens, user}
    API-->>FE: 200 OK
    FE->>FE: Store tokens
    FE->>U: Navigate to Dashboard
```

### Token Refresh Flow
```mermaid
sequenceDiagram
    participant FE as App.tsx
    participant API as /api/auth/refresh
    participant AS as AuthService
    participant R as Redis
    
    FE->>API: POST {refreshToken}
    API->>AS: refreshToken(token)
    AS->>R: Validate refresh token
    AS->>AS: Generate new access token
    AS->>R: Update session
    AS-->>API: {accessToken}
    API-->>FE: 200 OK
    FE->>FE: Update stored token
```

---

## Stock Data Flows

### Stock Search Flow
```mermaid
sequenceDiagram
    participant U as User
    participant FE as StockSearch.tsx
    participant API as /api/stocks/search
    participant SS as StockService
    participant YF as Yahoo Finance
    participant R as Redis
    
    U->>FE: Type search query
    FE->>FE: Debounce input (300ms)
    FE->>API: GET /search?q=AAPL
    API->>SS: searchStocks(query)
    SS->>R: Check cache
    alt Cache Hit
        R-->>SS: Cached results
    else Cache Miss
        SS->>YF: Search stocks
        YF-->>SS: Stock results
        SS->>R: Cache results (60s)
    end
    SS-->>API: Search results
    API-->>FE: 200 OK {results}
    FE->>FE: Update UI
    FE->>U: Display results
```

### Stock Details Flow
```mermaid
sequenceDiagram
    participant U as User
    participant FE as StockAnalysis.tsx
    participant API as /api/stocks/:symbol
    participant SS as StockService
    participant YF as Yahoo Finance
    participant AI as AIService
    participant R as Redis
    
    U->>FE: Click on stock
    FE->>API: GET /stocks/AAPL
    API->>SS: getStockDetails(AAPL)
    
    par Fetch Stock Data
        SS->>R: Check price cache
        SS->>YF: Get quote
        YF-->>SS: Price data
    and Fetch AI Insights
        SS->>AI: getInsights(AAPL)
        AI-->>SS: AI analysis
    end
    
    SS->>R: Cache data
    SS-->>API: Complete stock data
    API-->>FE: 200 OK {stock, insights}
    FE->>FE: Render charts & data
    FE->>U: Display analysis
```

---

## Portfolio Management Flows

### Create Portfolio Entry Flow
```mermaid
sequenceDiagram
    participant U as User
    participant FE as Dashboard.tsx
    participant API as /api/portfolio/holdings
    participant PS as PortfolioService
    participant SS as StockService
    participant DB as PostgreSQL
    participant WS as WebSocket
    
    U->>FE: Add stock to portfolio
    FE->>API: POST {symbol, quantity, price}
    API->>API: Authenticate user
    API->>PS: addHolding(data)
    PS->>SS: getCurrentPrice(symbol)
    PS->>DB: INSERT holding
    PS->>DB: UPDATE portfolio value
    PS->>WS: Broadcast update
    PS-->>API: {holding, portfolio}
    API-->>FE: 201 Created
    FE->>FE: Update portfolio state
    FE->>U: Show updated portfolio
```

### Portfolio Performance Flow
```mermaid
sequenceDiagram
    participant FE as Dashboard.tsx
    participant API as /api/portfolio/performance
    participant PS as PortfolioService
    participant SS as StockService
    participant DB as PostgreSQL
    participant R as Redis
    
    FE->>API: GET /performance
    API->>PS: getPerformance(userId)
    PS->>DB: SELECT holdings
    
    loop For each holding
        PS->>SS: getCurrentPrice(symbol)
        SS->>R: Check cache
        SS->>SS: Calculate gain/loss
    end
    
    PS->>PS: Calculate totals
    PS-->>API: Performance metrics
    API-->>FE: 200 OK {performance}
    FE->>FE: Render charts
```

---

## Alert System Flows

### Create Alert Flow
```mermaid
sequenceDiagram
    participant U as User
    participant FE as QuickAlertSetup.tsx
    participant API as /api/alerts
    participant AS as AlertService
    participant DB as PostgreSQL
    participant JS as JobScheduler
    
    U->>FE: Set alert parameters
    FE->>API: POST {symbol, type, target}
    API->>AS: createAlert(alertData)
    AS->>DB: INSERT alert
    AS->>JS: Schedule monitoring
    AS-->>API: {alertId}
    API-->>FE: 201 Created
    FE->>U: Alert created confirmation
```

### Alert Monitoring Flow
```mermaid
sequenceDiagram
    participant JS as JobScheduler
    participant AS as AlertService
    participant SS as StockService
    participant DB as PostgreSQL
    participant NS as NotificationService
    participant WS as WebSocket
    
    loop Every 60 seconds
        JS->>AS: checkAlerts()
        AS->>DB: SELECT active alerts
        
        loop For each alert
            AS->>SS: getCurrentPrice(symbol)
            AS->>AS: Check condition
            
            alt Condition Met
                AS->>DB: UPDATE alert triggered
                AS->>NS: sendNotification(user, alert)
                AS->>WS: Push real-time alert
            end
        end
    end
```

---

## AI Insights Flows

### Generate AI Analysis Flow
```mermaid
sequenceDiagram
    participant U as User
    participant FE as AIAnalysisDetail.tsx
    participant API as /api/ai/analysis
    participant AI as AIService
    participant SS as StockService
    participant OAI as OpenAI API
    participant DB as PostgreSQL
    participant R as Redis
    
    U->>FE: Request AI analysis
    FE->>API: POST {symbol, timeframe}
    API->>AI: generateAnalysis(params)
    AI->>SS: getHistoricalData(symbol)
    AI->>AI: Prepare prompt
    AI->>OAI: Generate completion
    OAI-->>AI: AI response
    AI->>DB: Store insight
    AI->>R: Cache (5 min)
    AI-->>API: {analysis}
    API-->>FE: 200 OK
    FE->>U: Display insights
```

### Portfolio AI Recommendations Flow
```mermaid
sequenceDiagram
    participant FE as Dashboard.tsx
    participant API as /api/ai/recommendations
    participant AI as AIService
    participant PS as PortfolioService
    participant OAI as OpenAI API
    participant R as Redis
    
    FE->>API: GET /recommendations
    API->>AI: getRecommendations(userId)
    AI->>PS: getPortfolio(userId)
    AI->>AI: Analyze portfolio
    AI->>OAI: Generate suggestions
    OAI-->>AI: Recommendations
    AI->>R: Cache (30 min)
    AI-->>API: {recommendations}
    API-->>FE: 200 OK
    FE->>FE: Display cards
```

---

## Real-time Data Flows

### WebSocket Connection Flow
```mermaid
sequenceDiagram
    participant FE as App.tsx
    participant WS as WebSocket Server
    participant AS as AuthService
    participant PS as PriceService
    
    FE->>WS: Connect with JWT
    WS->>AS: Validate token
    AS-->>WS: User authenticated
    WS->>WS: Create user room
    WS-->>FE: Connected
    
    FE->>WS: Subscribe {symbols: [AAPL, TSLA]}
    WS->>PS: Start price monitoring
    
    loop Every second
        PS->>PS: Fetch prices
        PS->>WS: Price update
        WS->>FE: Broadcast prices
        FE->>FE: Update UI
    end
```

### Live Portfolio Updates Flow
```mermaid
sequenceDiagram
    participant FE as Dashboard.tsx
    participant WS as WebSocket
    participant PS as PortfolioService
    participant SS as StockService
    
    Note over FE,WS: Already connected
    
    loop Real-time updates
        SS->>WS: Price change event
        WS->>PS: Calculate portfolio impact
        PS->>WS: Portfolio value update
        WS->>FE: {portfolioValue, changes}
        FE->>FE: Update dashboard
    end
```

---

## Notification Flows

### Email Notification Flow
```mermaid
sequenceDiagram
    participant AS as AlertService
    participant NS as NotificationService
    participant ES as EmailService
    participant SG as SendGrid API
    participant DB as PostgreSQL
    
    AS->>NS: sendNotification(alert)
    NS->>DB: Get user preferences
    
    alt Email Enabled
        NS->>ES: sendEmail(data)
        ES->>ES: Format template
        ES->>SG: Send email
        SG-->>ES: Email sent
        ES->>DB: Log notification
    end
    
    NS-->>AS: Notification sent
```

### Push Notification Flow (Future)
```mermaid
sequenceDiagram
    participant AS as AlertService
    participant NS as NotificationService
    participant PN as PushService
    participant FCM as Firebase Cloud Messaging
    participant APP as Mobile App
    
    AS->>NS: sendNotification(alert)
    NS->>PN: sendPush(userId, message)
    PN->>FCM: Send to device token
    FCM->>APP: Push notification
    APP->>APP: Display notification
```

---

## State Management Flows

### Frontend State Updates
```
Component State Flow:
1. User Action → Component Event Handler
2. API Call → Loading State
3. API Response → Update Local State
4. Update Context/Global State (if needed)
5. Re-render Component → Update UI
```

### Authentication State
```javascript
// Central auth state management
AuthContext
├── user: User | null
├── tokens: {access, refresh}
├── isAuthenticated: boolean
├── login(): Promise<void>
├── logout(): void
└── refreshToken(): Promise<void>

// Components consuming auth state
Login.tsx → setUser() → All components re-render
Logout → clearUser() → Navigate to login
```

### Portfolio State
```javascript
// Portfolio state management
PortfolioContext
├── holdings: Holding[]
├── totalValue: number
├── performance: PerformanceMetrics
├── addHolding(): Promise<void>
├── removeHolding(): Promise<void>
└── refreshPortfolio(): Promise<void>

// Real-time updates
WebSocket → updateHolding() → Dashboard re-renders
```

---

## Error Handling Flows

### API Error Flow
```mermaid
sequenceDiagram
    participant FE as Component
    participant API as API Endpoint
    participant EH as Error Handler
    participant LOG as Logger
    participant UI as Error UI
    
    FE->>API: Request
    API->>API: Process
    
    alt Error Occurs
        API->>EH: Catch error
        EH->>LOG: Log error
        EH->>EH: Format error response
        EH-->>FE: Error response
        FE->>UI: Show error toast
        FE->>FE: Retry logic (if applicable)
    else Success
        API-->>FE: Success response
    end
```

### Retry Logic Flow
```javascript
// Exponential backoff retry
async function retryableRequest(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await sleep(Math.pow(2, i) * 1000) // 1s, 2s, 4s
    }
  }
}
```

---

## Cache Strategy Flows

### Multi-layer Cache
```
Request → Redis Cache → Database → External API
   ↓         ↓              ↓            ↓
   Hit       Miss           Miss        Fetch
   ↓         ↓              ↓            ↓
Return    Check DB      Check API    Store in all
```

### Cache Invalidation
```javascript
// Cache TTL Strategy
Stock Prices: 60 seconds
Search Results: 2 minutes
AI Insights: 5 minutes
User Profile: 30 minutes
Portfolio: Real-time (WebSocket)

// Cache Invalidation Events
User Action → Update DB → Invalidate Cache
Price Change → Update Cache → Broadcast via WebSocket
```

---

## Data Synchronization Flows

### Offline-First Strategy (Future)
```mermaid
sequenceDiagram
    participant APP as App
    participant LS as LocalStorage
    participant API as Backend API
    participant SW as Service Worker
    
    APP->>LS: Save action offline
    APP->>SW: Queue sync request
    
    Note over APP,SW: When online
    
    SW->>API: Sync queued actions
    API-->>SW: Responses
    SW->>LS: Update local data
    SW->>APP: Notify sync complete
```

---

## Performance Optimization Flows

### Lazy Loading Flow
```javascript
// Component lazy loading
const Dashboard = lazy(() => import('./Dashboard'))
const StockAnalysis = lazy(() => import('./StockAnalysis'))

// Data lazy loading
function useInfiniteScroll() {
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  
  // Load more when scrolled to bottom
  onScroll → checkPosition → loadMore → setPage(page + 1)
}
```

### Debounced Search Flow
```javascript
// Search input debouncing
const [query, setQuery] = useState('')
const debouncedQuery = useDebounce(query, 300)

useEffect(() => {
  if (debouncedQuery) {
    searchStocks(debouncedQuery)
  }
}, [debouncedQuery])
```

---

## Security Flows

### Request Authentication Flow
```
Every API Request:
1. Extract JWT from Authorization header
2. Verify JWT signature
3. Check token expiration
4. Validate user permissions
5. Process request OR return 401/403
```

### Data Sanitization Flow
```
User Input → Validation → Sanitization → Database
    ↓            ↓            ↓            ↓
Raw Input    Joi Schema   XSS Clean   Parameterized Query
```
