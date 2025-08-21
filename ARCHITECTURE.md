# 🏗️ System Architecture - iOS Stock Trading App

## Overview
This document describes the complete architecture of the iOS Stock Trading Application, designed to help AI models and developers understand the system's structure, components, and relationships.

## Table of Contents
- [System Architecture Diagram](#system-architecture-diagram)
- [Tech Stack](#tech-stack)
- [Layer Architecture](#layer-architecture)
- [Component Architecture](#component-architecture)
- [Database Schema](#database-schema)
- [Design Patterns](#design-patterns)
- [Security Architecture](#security-architecture)
- [Deployment Architecture](#deployment-architecture)

---

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
├─────────────────────────────────────────────────────────────────┤
│  React Web App (Port 3001)                                       │
│  ├── Components (20+ iOS-styled components)                      │
│  ├── State Management (React Hooks + Context)                    │
│  ├── API Client (utils/api.ts)                                   │
│  └── WebSocket Client (Socket.IO)                                │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTPS/WSS
                                ↓
┌─────────────────────────────────────────────────────────────────┐
│                         API GATEWAY                              │
├─────────────────────────────────────────────────────────────────┤
│  Fastify/Express Server (Port 3000)                              │
│  ├── Authentication Middleware (JWT)                             │
│  ├── CORS Configuration                                          │
│  ├── Rate Limiting                                               │
│  ├── Request Validation                                          │
│  └── Error Handling                                              │
└─────────────────────────────────────────────────────────────────┘
                                │
                ┌───────────────┼───────────────┐
                ↓               ↓               ↓
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│  BUSINESS LOGIC  │ │   REAL-TIME      │ │  EXTERNAL APIs   │
├──────────────────┤ ├──────────────────┤ ├──────────────────┤
│  Services Layer  │ │  WebSocket       │ │  Yahoo Finance   │
│  ├── AuthService │ │  ├── Price Feed  │ │  Alpha Vantage   │
│  ├── Portfolio   │ │  ├── Alerts      │ │  OpenAI API      │
│  ├── Alerts      │ │  └── Notifications│ │  Twilio          │
│  ├── AI Insights │ │                  │ │  SendGrid        │
│  └── Market Data │ │                  │ │                  │
└──────────────────┘ └──────────────────┘ └──────────────────┘
                ↓               ↓               
┌──────────────────────────────────────────────────────────────┐
│                      DATA LAYER                              │
├──────────────────────────────────────────────────────────────┤
│  PostgreSQL (5432)           Redis (6379)                    │
│  ├── Users                   ├── Session Store               │
│  ├── Portfolios              ├── Price Cache                 │
│  ├── Transactions            ├── API Response Cache          │
│  ├── Alerts                  └── Rate Limit Counters         │
│  └── AI Insights                                             │
└──────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|------------|---------|----------|
| React | 18.3.1 | UI Framework |
| TypeScript | 5.5.3 | Type Safety |
| Vite | 5.4.1 | Build Tool & Dev Server |
| Tailwind CSS | 3.4.12 | Styling Framework |
| Radix UI | Latest | Component Library |
| Recharts | 3.1.2 | Data Visualization |
| Lucide React | 0.445.0 | Icon Library |
| Socket.IO Client | 4.7.4 | Real-time Communication |

### Backend
| Technology | Version | Purpose |
|------------|---------|----------|
| Node.js | 18+ | Runtime Environment |
| Fastify/Express | 5.5.0/4.18.2 | Web Framework |
| TypeScript | 5.3.3 | Type Safety |
| PostgreSQL | 15 | Primary Database |
| Redis | 7 | Caching & Sessions |
| Socket.IO | 4.7.4 | WebSocket Server |
| JWT | 9.0.2 | Authentication |
| Bcrypt | 6.0.0 | Password Hashing |
| Yahoo Finance API | 2.13.3 | Stock Data |

### DevOps
| Technology | Purpose |
|------------|----------|
| Docker | Containerization |
| Docker Compose | Multi-container Orchestration |
| GitHub Actions | CI/CD (planned) |
| Nginx | Reverse Proxy (production) |

---

## Layer Architecture

### 1. Presentation Layer (Frontend)
```
components/
├── Authentication/
│   ├── Login.tsx
│   ├── SignUp.tsx
│   ├── ForgotPassword.tsx
│   └── BiometricSetup.tsx
├── Market/
│   ├── Dashboard.tsx
│   ├── StockSearch.tsx
│   ├── StockAnalysis.tsx
│   └── Watchlist.tsx
├── AI/
│   ├── AIAnalysisDetail.tsx
│   └── AIInsightsHistory.tsx
├── Alerts/
│   ├── StockAlertsPanel.tsx
│   └── QuickAlertSetup.tsx
├── User/
│   ├── Profile.tsx
│   ├── Settings.tsx
│   └── NotificationsCenter.tsx
└── Layout/
    ├── TabBar.tsx
    └── TabBarLayout.tsx
```

### 2. Application Layer (Backend)
```
Backend/src/
├── routes/          # API Endpoints
│   ├── auth.ts
│   ├── stocks.ts
│   ├── portfolio.ts
│   ├── alerts.ts
│   ├── ai.ts
│   └── notifications.ts
├── services/        # Business Logic
│   ├── AuthService.ts
│   ├── PortfolioService.ts
│   ├── StockDataService.ts
│   ├── AlertService.ts
│   ├── AIService.ts
│   └── NotificationService.ts
├── middleware/      # Cross-cutting Concerns
│   ├── auth.ts
│   ├── validation.ts
│   ├── errorHandler.ts
│   └── requestLogger.ts
└── config/          # Configuration
    ├── database.ts
    ├── redis.ts
    ├── environment.ts
    └── passport.ts
```

### 3. Data Access Layer
```
Backend/src/
├── models/          # Data Models
│   ├── User.ts
│   ├── Portfolio.ts
│   ├── Stock.ts
│   ├── Transaction.ts
│   └── Alert.ts
├── repositories/    # Data Access
│   ├── UserRepository.ts
│   ├── PortfolioRepository.ts
│   └── AlertRepository.ts
└── migrations/      # Database Migrations
    └── *.sql
```

---

## Component Architecture

### Frontend Component Hierarchy
```
App.tsx
├── TabBarLayout.tsx
│   ├── Dashboard.tsx
│   │   ├── PortfolioSummary
│   │   ├── StockList
│   │   └── PerformanceChart
│   ├── StockSearch.tsx
│   │   ├── SearchBar
│   │   ├── SearchResults
│   │   └── StockCard
│   ├── StockAnalysis.tsx
│   │   ├── PriceChart
│   │   ├── StockMetrics
│   │   ├── AIInsights
│   │   └── AlertSetup
│   ├── Watchlist.tsx
│   │   └── WatchlistItem
│   └── Profile.tsx
│       ├── UserInfo
│       ├── Settings
│       └── NotificationPreferences
└── Authentication Flow
    ├── Login.tsx
    ├── SignUp.tsx
    └── ForgotPassword.tsx
```

### Backend Service Dependencies
```
Server
├── AuthService
│   ├── UserRepository
│   ├── JWT Library
│   ├── Bcrypt
│   └── EmailService
├── PortfolioService
│   ├── PortfolioRepository
│   ├── StockDataService
│   └── CacheService
├── StockDataService
│   ├── YahooFinanceAPI
│   ├── AlphaVantageAPI
│   └── CacheService
├── AlertService
│   ├── AlertRepository
│   ├── StockDataService
│   ├── NotificationService
│   └── JobScheduler
└── AIService
    ├── OpenAI API
    ├── StockDataService
    └── PortfolioService
```

---

## Database Schema

### Core Tables
```sql
-- Users & Authentication
users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  is_verified BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Portfolio Management
portfolios (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  name VARCHAR(255),
  total_value DECIMAL(15,2),
  created_at TIMESTAMP
)

portfolio_holdings (
  id UUID PRIMARY KEY,
  portfolio_id UUID REFERENCES portfolios(id),
  stock_symbol VARCHAR(10),
  quantity DECIMAL(10,4),
  purchase_price DECIMAL(10,2),
  current_price DECIMAL(10,2),
  purchase_date TIMESTAMP
)

-- Alerts
alerts (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  stock_symbol VARCHAR(10),
  alert_type ENUM('price_above', 'price_below', 'volume', 'percent_change'),
  target_value DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  triggered_at TIMESTAMP
)

-- AI Insights
ai_insights (
  id UUID PRIMARY KEY,
  stock_symbol VARCHAR(10),
  insight_type VARCHAR(50),
  content TEXT,
  confidence_score DECIMAL(3,2),
  generated_at TIMESTAMP
)
```

---

## Design Patterns

### 1. Repository Pattern
- Abstracts data access logic
- Provides consistent interface for data operations
- Enables easy testing with mock repositories

### 2. Service Layer Pattern
- Encapsulates business logic
- Provides reusable operations
- Maintains separation of concerns

### 3. Middleware Pattern
- Handles cross-cutting concerns
- Authentication, validation, logging
- Chainable request processing

### 4. Dependency Injection
- Services receive dependencies via constructor
- Enables testing with mocks
- Improves modularity

### 5. Observer Pattern (WebSocket)
- Real-time price updates
- Alert notifications
- Portfolio value changes

---

## Security Architecture

### Authentication & Authorization
```
Request Flow:
1. Client sends credentials
2. Server validates credentials
3. Server generates JWT tokens (access + refresh)
4. Client stores tokens securely
5. Client includes token in API requests
6. Server validates token on each request
```

### Security Measures
- **Password Security**: Bcrypt with salt rounds
- **JWT Security**: Short-lived access tokens (15min), longer refresh tokens (7d)
- **CORS**: Configured for specific origins
- **Rate Limiting**: 100 requests per minute per IP
- **Input Validation**: Joi schema validation
- **SQL Injection Prevention**: Parameterized queries
- **XSS Protection**: Content Security Policy headers
- **HTTPS**: SSL/TLS encryption in production

---

## Deployment Architecture

### Development Environment
```
Docker Compose Stack:
├── frontend (port 3001)
├── backend (port 3000)
├── postgres (port 5432)
└── redis (port 6379)
```

### Production Environment (Planned)
```
Cloud Infrastructure:
├── Frontend: Vercel/Netlify CDN
├── Backend: AWS EC2/ECS or Heroku
├── Database: AWS RDS PostgreSQL
├── Cache: AWS ElastiCache Redis
├── File Storage: AWS S3
└── Load Balancer: AWS ALB/Nginx
```

### Scaling Strategy
1. **Horizontal Scaling**: Multiple backend instances
2. **Database Replication**: Read replicas for queries
3. **Caching Strategy**: Redis for hot data
4. **CDN**: Static assets and API responses
5. **Queue System**: Bull/BullMQ for background jobs

---

## Performance Considerations

### Frontend Optimization
- Code splitting with React.lazy()
- Image optimization and lazy loading
- Service Worker for offline capability
- Browser caching strategies

### Backend Optimization
- Database indexing on frequent queries
- Redis caching for stock prices (60s TTL)
- Connection pooling for PostgreSQL
- Async/await for non-blocking operations

### Real-time Optimization
- WebSocket connection pooling
- Selective broadcasting (room-based)
- Message batching for high-frequency updates
- Fallback to polling if WebSocket fails

---

## Monitoring & Observability

### Metrics to Track
- API response times
- Database query performance
- Cache hit rates
- WebSocket connection count
- Error rates by endpoint
- User session duration

### Logging Strategy
- Application logs: Winston
- Error tracking: Sentry (planned)
- Performance monitoring: New Relic/DataDog (planned)
- Health checks: /health endpoint

---

## Future Enhancements

### Technical Debt
- [ ] Implement comprehensive test coverage
- [ ] Add API documentation (OpenAPI/Swagger)
- [ ] Implement database migrations system
- [ ] Add request tracing for debugging

### Feature Enhancements
- [ ] Machine Learning price predictions
- [ ] Social trading features
- [ ] Options trading support
- [ ] Cryptocurrency integration
- [ ] Advanced charting with TradingView

### Infrastructure Improvements
- [ ] Kubernetes deployment
- [ ] GraphQL API layer
- [ ] Event-driven architecture (Kafka/RabbitMQ)
- [ ] Microservices architecture migration
