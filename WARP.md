# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Architecture Overview

This is an iOS-styled stock trading application with a React frontend and Node.js backend.

### Tech Stack
- **Frontend**: React 18 + TypeScript + Vite + Radix UI + Tailwind CSS
  - Located in root directory
  - iOS-like UI with 18+ components
  - Tab-based navigation with persistent state
  
- **Backend**: Express/Fastify + TypeScript + PostgreSQL + Redis
  - Located in `Backend/` directory  
  - Multiple server implementations (Express, Fastify, Yahoo Finance integration)
  - JWT authentication with refresh tokens
  - WebSocket support via Socket.IO for real-time features
  - External APIs: Yahoo Finance, Alpha Vantage, OpenAI

### Data Flow
```
Frontend (port 3001) → HTTP/WebSocket → Backend (port 3000)
                                         ↓
                    PostgreSQL (5432) + Redis (6379) + External APIs
```

## Common Development Commands

### Frontend Development
```bash
# Development
npm run dev              # Start Vite dev server (port 3000)
npm run build           # Build for production
npm run preview         # Preview production build

# Testing
npm run test            # Run Vitest tests
npm run test:ui         # Vitest UI mode
npm run test:watch      # Watch mode
npm run test:coverage   # Coverage report
npm run test:ci         # CI mode with coverage

# Code Quality
npm run lint            # ESLint check
```

### Backend Development
```bash
cd Backend

# Development Servers (multiple implementations)
npm run dev              # Express server with tsx watch
npm run dev:fastify      # Fastify server
npm run dev:demo         # Demo server with mock data
npm run dev:yahoo        # Yahoo Finance integration
npm run dev:db           # Database integration server

# Production
npm run build           # TypeScript compilation
npm run start           # Production server
npm run start:fastify   # Production Fastify
npm run start:yahoo     # Yahoo Finance server

# Docker Database Management
npm run docker:start    # Start PostgreSQL + Redis
npm run docker:app      # Start full stack with Docker
npm run docker:tools    # Start with pgAdmin + Redis Commander
npm run docker:stop     # Stop all containers
npm run docker:logs     # View logs
npm run docker:reset    # Reset databases (removes data!)
npm run docker:shell app # Shell into app container

# Code Quality
npm run lint            # ESLint
npm run lint:fix        # Auto-fix issues
npm run format          # Prettier
```

### Full Stack Docker Operations
```bash
# Using docker-stack.sh helper script
./docker-stack.sh start    # Build and start all services
./docker-stack.sh stop     # Stop all services
./docker-stack.sh restart  # Restart everything
./docker-stack.sh status   # Show service status
./docker-stack.sh logs     # View all logs
./docker-stack.sh test     # Test integration
./docker-stack.sh clean    # Remove containers/volumes

# Integration Testing
./test-integration.sh         # Test frontend-backend integration
./test-frontend-integration.sh # Test with real Yahoo Finance data
```

## Service URLs

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **API Health**: http://localhost:3000/health
- **PostgreSQL**: localhost:5432 (database: stock_trading_app)
- **Redis**: localhost:6379
- **pgAdmin**: http://localhost:8080 (when using docker:tools)
- **Redis Commander**: http://localhost:8081 (when using docker:tools)

## Project Structure

```
iOS Onboarding Screen/
├── components/           # React components (18+ screens)
│   ├── Dashboard.tsx
│   ├── StockAnalysis.tsx
│   ├── AIInsightsHistory.tsx
│   └── ... (Authentication, Settings, etc.)
├── Backend/
│   ├── src/
│   │   ├── config/      # Database, Redis, Logger configs
│   │   ├── middleware/  # Auth, CORS, error handling
│   │   ├── routes/      # API endpoints (8+ modules)
│   │   ├── services/    # Business logic services
│   │   └── server*.ts   # Multiple server implementations
│   ├── docker-db.sh     # Docker database helper
│   └── docker-compose.yml
├── __tests__/           # Frontend test files
├── utils/               # Frontend utilities
│   └── api.ts          # API client
├── docker-stack.sh      # Full stack Docker management
└── vite.config.ts      # Vite configuration
```

## Implementation Status

### ✅ Completed
- Frontend UI components (all 18+ screens)
- Backend server foundation with multiple implementations
- Database schema (14 tables)
- API endpoint specifications (100+ endpoints)
- Docker containerization
- Authentication middleware
- Real-time WebSocket setup

### 🚧 In Progress / Needs Implementation
- Complete authentication flow (register, login, JWT refresh)
- Stock data API integration (Yahoo Finance partially done)
- Portfolio management services
- Alert system implementation
- AI insights integration (OpenAI)
- Real-time price updates via WebSocket
- Email/SMS notifications

### Key Backend Services to Implement
Located in `Backend/src/services/`:
- `AuthService.ts` - User authentication logic
- `StockDataService.ts` - Stock market data fetching
- `PortfolioService.ts` - Portfolio CRUD operations
- `NotificationService.ts` - Push/email/SMS alerts
- `AIService.ts` - OpenAI integration for insights
- `CacheService.ts` - Redis caching layer

## Testing Strategy

### Frontend Testing
- Unit tests with Vitest + React Testing Library
- Coverage thresholds: 90% (branches, functions, lines, statements)
- Test files in `__tests__/` directory
- Mock Service Worker (MSW) for API mocking

### Backend Testing
- Jest for unit/integration tests
- Test database with Docker
- API endpoint testing with Supertest

### Integration Testing
- Use `test-integration.sh` for full stack testing
- Validates authentication, CORS, stock APIs, portfolio access

## Environment Configuration

### Frontend (.env)
```bash
VITE_API_URL=http://localhost:3000
```

### Backend (Backend/.env)
```bash
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=stock_app_user
DATABASE_PASSWORD=stock_app_password
DATABASE_NAME=stock_trading_app

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

# External APIs (get free keys)
ALPHA_VANTAGE_API_KEY=your-key-from-alphavantage.co
OPENAI_API_KEY=your-key-from-openai.com
YAHOO_FINANCE_API_KEY=optional
```

## Quick Start Workflow

1. **Start Backend with Docker**:
   ```bash
   cd Backend
   npm run docker:start  # Starts PostgreSQL + Redis
   npm run dev:yahoo     # Start server with Yahoo Finance
   ```

2. **Start Frontend**:
   ```bash
   npm run dev  # In root directory
   ```

3. **Test Integration**:
   ```bash
   ./test-integration.sh
   ```

4. **Access Application**:
   - Open http://localhost:3001 for frontend
   - API health check: http://localhost:3000/health

## Development Tips

- The backend has multiple server implementations - use `dev:yahoo` for real stock data
- Frontend components use mock data by default but can connect to backend API
- Docker is preferred for database setup to avoid local PostgreSQL/Redis installation
- Use `docker-stack.sh` for full stack development with hot reloading
- Authentication is required for most API endpoints (JWT in Authorization header)
- CORS is configured for localhost:3001 (frontend default port)

## Database Schema

14 tables covering:
- Users & Authentication (`users`, `auth_tokens`, `social_auth`)
- Stock Data (`stocks`, `stock_prices`, `stock_categories`)
- Portfolio Management (`portfolios`, `portfolio_holdings`, `transactions`)
- Alerts & Notifications (`alerts`, `notifications`, `notification_settings`)
- AI Insights (`ai_insights`, `user_ai_insights`)
- User Activity (`watchlists`, `user_search_history`)
