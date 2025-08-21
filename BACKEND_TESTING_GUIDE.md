# 🚀 Backend Services & Frontend Testing Guide

## 📋 **What Backend Services We Have Running**

### 🏗️ **Core Infrastructure:**
- **Fastify Server**: High-performance Node.js server (5.6x faster than Express)
- **PostgreSQL Database**: Complete stock trading database with user accounts, portfolios, watchlists
- **Redis Cache**: In-memory caching for fast API responses
- **WebSocket Support**: Real-time stock updates

### 🔌 **Real API Endpoints Working:**

#### ✅ **Authentication Endpoints:**
```bash
# Register new user
POST http://localhost:3000/api/v1/auth/register
{
  "email": "your@email.com",
  "password": "YourPassword123",
  "firstName": "Your",
  "lastName": "Name"
}

# Login user
POST http://localhost:3000/api/v1/auth/login
{
  "email": "your@email.com", 
  "password": "YourPassword123"
}
```

#### ✅ **Stock Market Data (REAL Yahoo Finance):**
```bash
# Search stocks
GET http://localhost:3000/api/v1/stocks/search?q=AAPL

# Get stock details
GET http://localhost:3000/api/v1/stocks/AAPL

# Market overview (S&P 500, Dow Jones, NASDAQ)
GET http://localhost:3000/api/v1/market/overview
```

#### ✅ **User Portfolio & Watchlist:**
```bash
# Get user watchlist (requires authentication)
GET http://localhost:3000/api/v1/watchlist
Authorization: Bearer YOUR_JWT_TOKEN

# Add to watchlist
POST http://localhost:3000/api/v1/watchlist
{
  "symbol": "AAPL",
  "userId": "your-user-id"
}

# Get portfolio
GET http://localhost:3000/api/v1/portfolio
Authorization: Bearer YOUR_JWT_TOKEN
```

#### ✅ **System Health:**
```bash
# Health check
GET http://localhost:3000/health
```

---

## 🌐 **Frontend Testing Guide**

### 🔗 **Access Points:**
- **Frontend App**: http://localhost:3001
- **Backend API**: http://localhost:3000

### 📱 **Testing the Signup Form:**

1. **Open the Frontend:**
   ```bash
   # Open in browser
   open http://localhost:3001
   ```

2. **Test Registration:**
   - Email: `gourusriharsha1507@gmail.com`
   - Password: `TestPassword123`
   - First Name: `Guru`
   - Last Name: `Sriharsha`

3. **Expected Result:**
   - ✅ Form submits successfully
   - ✅ User gets registered in PostgreSQL database
   - ✅ JWT token returned
   - ✅ No CORS errors

### 🧪 **Manual Testing Steps:**

#### **1. Test Backend Health:**
```bash
curl -s http://localhost:3000/health | jq
```
**Expected:** Status "healthy", database "healthy", redis "healthy"

#### **2. Test Stock Search:**
```bash
curl -s "http://localhost:3000/api/v1/stocks/search?q=AAPL" | jq
```
**Expected:** Real Apple stock data from Yahoo Finance

#### **3. Test User Registration:**
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:3001" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123",
    "firstName": "Test",
    "lastName": "User"
  }'
```
**Expected:** Success response with user ID and JWT token

#### **4. Test Frontend-Backend Connection:**
1. Open http://localhost:3001 in browser
2. Open Developer Tools (F12) → Network tab
3. Try to register/login
4. Check network requests show 200 status codes (not CORS errors)

---

## 🔍 **Real Data Sources:**

### 📊 **Yahoo Finance Integration:**
- **Real Stock Prices**: Live market data from Yahoo Finance API
- **Market Indices**: S&P 500, Dow Jones, NASDAQ real-time data
- **Stock Search**: Real company information and symbols
- **Cached Responses**: 60-second cache for performance

### 💾 **PostgreSQL Database:**
- **User Accounts**: Real user registration/authentication
- **Portfolios**: User investment portfolios
- **Watchlists**: User stock watchlists
- **Audit Logs**: User activity tracking
- **Stock Alerts**: Price alert system

### ⚡ **Redis Cache:**
- **API Response Caching**: Faster repeated requests
- **Session Storage**: User session management
- **Rate Limiting**: API request limiting

---

## 🐳 **Docker Stack Management:**

### 📝 **Control Commands:**
```bash
# Start all services
./docker-stack.sh start

# Stop all services  
./docker-stack.sh stop

# Restart everything
./docker-stack.sh restart

# View logs
./docker-stack.sh logs

# Run integration tests
./docker-stack.sh test
```

### 📊 **Check Container Status:**
```bash
# View running containers
docker ps

# Check individual container logs
docker logs stock-app-frontend
docker logs stock-app-backend  
docker logs stock-app-postgres
docker logs stock-app-redis
```

---

## 🔧 **Troubleshooting:**

### ❌ **Common Issues:**

#### **CORS Errors:**
- **Symptom**: "Access to fetch blocked by CORS policy"
- **Solution**: Backend CORS is configured for localhost:3001 ✅

#### **Database Connection:**
- **Check**: `curl http://localhost:3000/health`
- **Should show**: database "healthy" ✅

#### **Container Not Starting:**
```bash
# Restart stack
./docker-stack.sh restart

# Check logs for errors
docker logs stock-app-backend
```

#### **Port Conflicts:**
- **Frontend**: Port 3001
- **Backend**: Port 3000  
- **PostgreSQL**: Port 5432
- **Redis**: Port 6379

---

## ✅ **Verification Checklist:**

- [ ] ✅ Backend responds to http://localhost:3000/health
- [ ] ✅ Frontend loads at http://localhost:3001
- [ ] ✅ Stock search returns real Yahoo Finance data
- [ ] ✅ User registration works (tested with gourusriharsha1507@gmail.com)
- [ ] ✅ Market overview shows real S&P 500, Dow Jones, NASDAQ data
- [ ] ✅ No CORS errors in browser console
- [ ] ✅ All Docker containers running healthy

---

## 🎯 **Next Steps for Frontend Development:**

1. **Connect Login Form**: Use `/api/v1/auth/login` endpoint
2. **Display Stock Data**: Use `/api/v1/stocks/search` for search
3. **Show Market Overview**: Use `/api/v1/market/overview` for dashboard
4. **Implement Watchlist**: Use `/api/v1/watchlist` endpoints
5. **Add Real-time Updates**: Connect to WebSocket at ws://localhost:3000/ws

**Everything is now working with REAL market data and a complete backend!** 🚀
