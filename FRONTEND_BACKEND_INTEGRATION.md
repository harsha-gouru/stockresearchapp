# Frontend-Backend Connection Requirements

## **Current Frontend State**
- React TypeScript app with complete UI components
- Authentication simulation with localStorage
- Mock data for all screens (Dashboard, Portfolio, etc.)
- No actual API integration - everything is hardcoded

## **Essential Backend Endpoints Needed**

### 1. **Authentication (Priority 1)**
```
POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me (get current user)
```

### 2. **Basic Stock Data (Priority 2)**
```
GET /api/v1/stocks/search?q=AAPL
GET /api/v1/stocks/quote/:symbol
```

### 3. **User Portfolio (Priority 3)**
```
GET /api/v1/portfolio
POST /api/v1/portfolio/add-stock
```

## **Frontend Files That Need API Integration**

### Login.tsx (Lines 47-54)
```typescript
// Currently simulated:
// Simulate API call
await new Promise(resolve => setTimeout(resolve, 1500));
onLogin?.();

// Needs to become:
const response = await fetch('/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email, password })
});
```

### SignUp.tsx (Registration)
- Currently no API call implementation
- Needs registration endpoint integration

### Dashboard.tsx (Stock Data)
- Currently uses hardcoded `mockStocks` array
- Needs real stock data from Yahoo Finance API

### App.tsx (Authentication Check)
```typescript
// Currently:
const isLoggedIn = localStorage.getItem('isAuthenticated') === 'true';

// Needs to become:
const token = localStorage.getItem('accessToken');
if (token) {
  // Verify token with backend
  const user = await fetch('/api/v1/auth/me', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
}
```

## **Minimal Backend Solution**

### What's Actually Running (Docker Stack):
- ✅ Fastify server with full database integration
- ✅ PostgreSQL database with complete schema
- ✅ Redis for caching
- ✅ Yahoo Finance API integration
- ✅ JWT authentication (but has routing issue)

### What's Currently Broken:
- JWT middleware blocking registration endpoint
- Over-complex architecture for simple needs

## **Quick Fix Strategy**

### Option 1: Fix Current Docker Backend (Recommended)
1. Fix JWT routing issue in server-database-integration.ts
2. Enable CORS for frontend connection
3. Create simple API client in frontend

### Option 2: Minimal Standalone Server
Create a simple Express server with just essential endpoints:
- Authentication (register/login)
- Stock search proxy to Yahoo Finance
- Basic user data storage

## **Frontend Changes Needed**

### 1. Create API Client
```typescript
// utils/api.ts
const API_BASE = 'http://localhost:3000';

export const api = {
  auth: {
    login: (email: string, password: string) => 
      fetch(`${API_BASE}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      }),
    register: (userData) => 
      fetch(`${API_BASE}/api/v1/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      })
  },
  stocks: {
    search: (query: string) =>
      fetch(`${API_BASE}/api/v1/stocks/search?q=${query}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
      })
  }
};
```

### 2. Update Components
- Login.tsx: Replace mock API call with real authentication
- SignUp.tsx: Add actual registration
- Dashboard.tsx: Replace mockStocks with real API data
- App.tsx: Implement proper authentication check

## **Current Status Summary**

**Backend**: Over-engineered but functional - needs minor JWT routing fix
**Frontend**: Complete UI but no API integration
**Gap**: Missing API client and component updates to use real endpoints

**Recommendation**: Fix the existing Docker backend (5-minute fix) rather than rebuilding.
