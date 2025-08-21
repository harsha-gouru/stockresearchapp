# Backend Implementation Guide for Enhanced UI Features

## Overview
This document provides step-by-step instructions for implementing the backend to support all the enhanced UI features in the stock trading application. Follow these instructions carefully to ensure full compatibility with the frontend.

## Table of Contents
1. [New Features Requiring Backend Support](#new-features-requiring-backend-support)
2. [Updated API Endpoints](#updated-api-endpoints)
3. [Database Schema Updates](#database-schema-updates)
4. [Implementation Instructions](#implementation-instructions)
5. [Sample Code Templates](#sample-code-templates)
6. [Testing Checklist](#testing-checklist)

---

## 1. New Features Requiring Backend Support

### A. Enhanced Stock Search Screen
- **Market Pulse**: Real-time market indices (S&P 500, NASDAQ, DOW)
- **Filters**: Gainers, Losers, Most Active, Tech, Healthcare categories
- **Top Movers**: Daily biggest gainers and losers
- **Categories**: Stock categories with counts
- **Recent Searches**: User-specific search history

### B. Enhanced Stock Analysis Screen
- **Dropdown Actions**: Share, Set Alert, Save Analysis
- **Quick Stats**: Volume, Market Cap, P/E Ratio, 52W Range
- **Real-time Updates**: Live price refresh indicator

### C. Enhanced Alert System (QuickAlertSetup)
- **Alert Types**: Price Above/Below, Percent Change, Volume Spike
- **Alert Preview**: Real-time preview of alert conditions
- **Alert History**: Track triggered alerts
- **Notification Delivery**: Push, Email, SMS

---

## 2. Updated API Endpoints

### A. Market Data Endpoints

```typescript
// NEW: Market Indices
GET /api/market/indices
Response: {
  "sp500": {
    "value": 4536.19,
    "change": 37.88,
    "changePercent": 0.84,
    "lastUpdated": "2024-01-20T15:30:00Z"
  },
  "nasdaq": {
    "value": 14229.91,
    "change": 160.69,
    "changePercent": 1.14,
    "lastUpdated": "2024-01-20T15:30:00Z"
  },
  "dow": {
    "value": 35456.80,
    "change": -78.12,
    "changePercent": -0.22,
    "lastUpdated": "2024-01-20T15:30:00Z"
  }
}

// NEW: Top Movers
GET /api/market/movers
Query params: ?type=gainers|losers|active&limit=10
Response: {
  "movers": [
    {
      "symbol": "NVDA",
      "name": "NVIDIA Corp",
      "price": 875.30,
      "change": 69.42,
      "changePercent": 8.42,
      "volume": 45234567,
      "logo": "https://..."
    }
  ]
}

// NEW: Stock Categories
GET /api/stocks/categories
Response: {
  "categories": [
    {
      "id": "tech",
      "name": "Tech Giants",
      "icon": "💻",
      "stockCount": 15,
      "topStocks": ["AAPL", "MSFT", "GOOGL"],
      "performance": 2.3
    },
    {
      "id": "healthcare",
      "name": "Healthcare",
      "icon": "🏥",
      "stockCount": 23,
      "topStocks": ["JNJ", "PFE", "UNH"],
      "performance": -0.8
    }
  ]
}

// NEW: Stocks by Category
GET /api/stocks/category/:categoryId
Response: {
  "category": "Tech Giants",
  "stocks": [...]
}
```

### B. Enhanced Search Endpoints

```typescript
// UPDATED: Search with Filters
GET /api/stocks/search
Query params: ?q=AAPL&filter=gainers|losers|active|tech|healthcare&limit=20
Response: {
  "results": [...],
  "totalCount": 45,
  "filters": ["gainers", "tech"]
}

// NEW: Search History
POST /api/users/search-history
Body: { "query": "AAPL", "ticker": "AAPL" }

GET /api/users/search-history
Response: {
  "recent": ["AAPL", "TSLA", "MSFT"],
  "trending": ["NVDA", "META", "AMZN"]
}

DELETE /api/users/search-history/:ticker
```

### C. Enhanced Alert Endpoints

```typescript
// UPDATED: Create Alert with Multiple Types
POST /api/alerts/create
Body: {
  "stockSymbol": "AAPL",
  "alertType": "price_above|price_below|percent_change|volume_spike",
  "targetValue": 200.00,
  "notificationChannels": ["push", "email", "sms"],
  "notes": "Target price for profit taking"
}

// NEW: Alert Templates
GET /api/alerts/templates/:symbol
Response: {
  "templates": [
    {
      "type": "price_above",
      "suggestedValue": 205.55, // 5% above current
      "reason": "5% gain target"
    },
    {
      "type": "price_below",
      "suggestedValue": 185.97, // 5% below current
      "reason": "Stop loss level"
    }
  ]
}

// NEW: Bulk Alert Operations
POST /api/alerts/bulk-create
Body: {
  "alerts": [...]
}

DELETE /api/alerts/bulk-delete
Body: {
  "alertIds": ["id1", "id2", "id3"]
}
```

### D. Stock Analysis Enhancements

```typescript
// NEW: Quick Stats
GET /api/stocks/:symbol/quick-stats
Response: {
  "volume": "52.3M",
  "avgVolume": "48.2M",
  "marketCap": "3.01T",
  "peRatio": 29.4,
  "eps": 6.57,
  "beta": 1.25,
  "dividendYield": 0.5,
  "week52High": 199.62,
  "week52Low": 164.08,
  "dayRange": "193.42 - 196.38"
}

// NEW: Share Stock Analysis
POST /api/stocks/:symbol/share
Body: {
  "method": "email|sms|link",
  "recipient": "email@example.com",
  "message": "Check out this stock analysis"
}
Response: {
  "shareLink": "https://app.com/shared/abc123",
  "expiresAt": "2024-01-27T15:30:00Z"
}

// NEW: Save Analysis
POST /api/users/saved-analysis
Body: {
  "stockSymbol": "AAPL",
  "notes": "Good entry point",
  "priceAtSave": 195.76,
  "analysis": {...}
}

GET /api/users/saved-analysis
DELETE /api/users/saved-analysis/:id
```

---

## 3. Database Schema Updates

### A. New Tables

```sql
-- Market Indices Table
CREATE TABLE market_indices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(20) UNIQUE NOT NULL, -- 'SP500', 'NASDAQ', 'DOW'
    name VARCHAR(100),
    value DECIMAL(10,2),
    change DECIMAL(10,2),
    change_percent DECIMAL(5,2),
    previous_close DECIMAL(10,2),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Stock Categories Table
CREATE TABLE stock_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100),
    icon VARCHAR(10),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Stock Category Mappings
CREATE TABLE stock_category_mappings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stock_symbol VARCHAR(10) REFERENCES stocks(symbol),
    category_id UUID REFERENCES stock_categories(id),
    UNIQUE(stock_symbol, category_id)
);

-- User Search History
CREATE TABLE user_search_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    search_query VARCHAR(255),
    ticker VARCHAR(10),
    searched_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_user_search (user_id, searched_at DESC)
);

-- Saved Analysis
CREATE TABLE saved_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    stock_symbol VARCHAR(10) NOT NULL,
    notes TEXT,
    price_at_save DECIMAL(10,2),
    analysis_data JSONB,
    saved_at TIMESTAMP DEFAULT NOW(),
    INDEX idx_user_saved (user_id, saved_at DESC)
);

-- Shared Analysis
CREATE TABLE shared_analysis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    share_code VARCHAR(20) UNIQUE NOT NULL,
    stock_symbol VARCHAR(10) NOT NULL,
    analysis_data JSONB,
    shared_by UUID REFERENCES users(id),
    shared_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP,
    view_count INTEGER DEFAULT 0
);
```

### B. Updated Tables

```sql
-- Add new columns to alerts table
ALTER TABLE alerts 
ADD COLUMN notification_channels JSONB DEFAULT '["push"]',
ADD COLUMN notes TEXT,
ADD COLUMN last_checked TIMESTAMP;

-- Add indices for performance
CREATE INDEX idx_alerts_active ON alerts(user_id, is_active) WHERE is_active = true;
CREATE INDEX idx_alerts_symbol ON alerts(stock_symbol);

-- Add market data caching
CREATE TABLE market_data_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cache_key VARCHAR(255) UNIQUE NOT NULL,
    data JSONB,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 4. Implementation Instructions

### Step 1: Set Up Real-time Market Data Service

```javascript
// services/marketDataService.js
class MarketDataService {
  constructor() {
    this.dataProvider = process.env.MARKET_DATA_PROVIDER; // 'alphavantage' | 'polygon' | 'yahoo'
    this.updateInterval = 60000; // 1 minute
    this.cache = new Map();
  }

  async startRealtimeUpdates() {
    // 1. Connect to market data provider WebSocket
    // 2. Subscribe to index updates (S&P 500, NASDAQ, DOW)
    // 3. Update database and broadcast to connected clients
    
    setInterval(async () => {
      await this.updateMarketIndices();
      await this.updateTopMovers();
    }, this.updateInterval);
  }

  async updateMarketIndices() {
    const indices = ['SPX', 'IXIC', 'DJI'];
    for (const index of indices) {
      const data = await this.fetchIndexData(index);
      await db.query(
        `INSERT INTO market_indices (symbol, value, change, change_percent, updated_at) 
         VALUES ($1, $2, $3, $4, NOW()) 
         ON CONFLICT (symbol) DO UPDATE 
         SET value = $2, change = $3, change_percent = $4, updated_at = NOW()`,
        [index, data.value, data.change, data.changePercent]
      );
    }
  }

  async getTopMovers(type = 'gainers', limit = 10) {
    const cacheKey = `movers_${type}_${limit}`;
    
    // Check cache first
    if (this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (cached.expires > Date.now()) {
        return cached.data;
      }
    }

    // Fetch fresh data
    const movers = await this.fetchTopMovers(type, limit);
    
    // Cache for 5 minutes
    this.cache.set(cacheKey, {
      data: movers,
      expires: Date.now() + 300000
    });

    return movers;
  }
}
```

### Step 2: Implement Enhanced Alert System

```javascript
// services/alertService.js
class AlertService {
  constructor() {
    this.checkInterval = 30000; // 30 seconds
    this.notificationService = new NotificationService();
  }

  async startMonitoring() {
    setInterval(async () => {
      await this.checkAllActiveAlerts();
    }, this.checkInterval);
  }

  async checkAllActiveAlerts() {
    const alerts = await db.query(
      `SELECT a.*, s.price as current_price 
       FROM alerts a 
       JOIN stock_prices s ON a.stock_symbol = s.symbol 
       WHERE a.is_active = true AND a.is_triggered = false`
    );

    for (const alert of alerts.rows) {
      if (this.shouldTrigger(alert)) {
        await this.triggerAlert(alert);
      }
    }
  }

  shouldTrigger(alert) {
    const { alert_type, target_value, current_price } = alert;
    
    switch (alert_type) {
      case 'price_above':
        return current_price >= target_value;
      case 'price_below':
        return current_price <= target_value;
      case 'percent_change':
        const changePercent = ((current_price - alert.created_price) / alert.created_price) * 100;
        return Math.abs(changePercent) >= Math.abs(target_value);
      case 'volume_spike':
        return alert.current_volume >= (alert.avg_volume * (1 + target_value / 100));
      default:
        return false;
    }
  }

  async triggerAlert(alert) {
    // 1. Mark alert as triggered
    await db.query(
      `UPDATE alerts SET is_triggered = true, triggered_at = NOW() WHERE id = $1`,
      [alert.id]
    );

    // 2. Create alert history record
    await db.query(
      `INSERT INTO alert_history (alert_id, triggered_at, stock_price) VALUES ($1, NOW(), $2)`,
      [alert.id, alert.current_price]
    );

    // 3. Send notifications through all channels
    const channels = alert.notification_channels || ['push'];
    for (const channel of channels) {
      await this.notificationService.send(channel, {
        userId: alert.user_id,
        title: `Alert: ${alert.stock_symbol}`,
        message: this.getAlertMessage(alert),
        data: { alertId: alert.id, stockSymbol: alert.stock_symbol }
      });
    }
  }

  getAlertMessage(alert) {
    const messages = {
      'price_above': `${alert.stock_symbol} reached $${alert.current_price} (target: $${alert.target_value})`,
      'price_below': `${alert.stock_symbol} dropped to $${alert.current_price} (target: $${alert.target_value})`,
      'percent_change': `${alert.stock_symbol} moved ${alert.change_percent}% (target: ${alert.target_value}%)`,
      'volume_spike': `${alert.stock_symbol} volume spike detected`
    };
    return messages[alert.alert_type];
  }
}
```

### Step 3: Implement Category Service

```javascript
// services/categoryService.js
class CategoryService {
  async initializeCategories() {
    const categories = [
      { slug: 'tech', name: 'Tech Giants', icon: '💻', stocks: ['AAPL', 'MSFT', 'GOOGL', 'META', 'NVDA'] },
      { slug: 'healthcare', name: 'Healthcare', icon: '🏥', stocks: ['JNJ', 'PFE', 'UNH', 'CVS', 'ABBV'] },
      { slug: 'finance', name: 'Finance', icon: '🏦', stocks: ['JPM', 'BAC', 'WFC', 'GS', 'MS'] },
      { slug: 'energy', name: 'Energy', icon: '⚡', stocks: ['XOM', 'CVX', 'COP', 'SLB', 'EOG'] },
      { slug: 'retail', name: 'Retail', icon: '🛍️', stocks: ['AMZN', 'WMT', 'HD', 'COST', 'TGT'] },
      { slug: 'automotive', name: 'Automotive', icon: '🚗', stocks: ['TSLA', 'F', 'GM', 'RIVN', 'NIO'] }
    ];

    for (const category of categories) {
      // Insert category
      const result = await db.query(
        `INSERT INTO stock_categories (slug, name, icon) 
         VALUES ($1, $2, $3) 
         ON CONFLICT (slug) DO UPDATE SET name = $2, icon = $3
         RETURNING id`,
        [category.slug, category.name, category.icon]
      );

      // Map stocks to category
      for (const stock of category.stocks) {
        await db.query(
          `INSERT INTO stock_category_mappings (stock_symbol, category_id) 
           VALUES ($1, $2) 
           ON CONFLICT DO NOTHING`,
          [stock, result.rows[0].id]
        );
      }
    }
  }

  async getCategoriesWithCounts() {
    const result = await db.query(
      `SELECT 
        sc.*, 
        COUNT(scm.stock_symbol) as stock_count,
        ARRAY_AGG(scm.stock_symbol ORDER BY RANDOM() LIMIT 3) as top_stocks
       FROM stock_categories sc
       LEFT JOIN stock_category_mappings scm ON sc.id = scm.category_id
       GROUP BY sc.id
       ORDER BY stock_count DESC`
    );
    return result.rows;
  }

  async getStocksByCategory(categorySlug) {
    const result = await db.query(
      `SELECT s.*, sp.price, sp.change, sp.change_percent
       FROM stocks s
       JOIN stock_category_mappings scm ON s.symbol = scm.stock_symbol
       JOIN stock_categories sc ON scm.category_id = sc.id
       LEFT JOIN stock_prices sp ON s.symbol = sp.symbol
       WHERE sc.slug = $1
       ORDER BY sp.change_percent DESC`,
      [categorySlug]
    );
    return result.rows;
  }
}
```

### Step 4: Implement Search History

```javascript
// services/searchHistoryService.js
class SearchHistoryService {
  async addSearchHistory(userId, query, ticker = null) {
    await db.query(
      `INSERT INTO user_search_history (user_id, search_query, ticker, searched_at) 
       VALUES ($1, $2, $3, NOW())`,
      [userId, query, ticker]
    );

    // Keep only last 20 searches per user
    await db.query(
      `DELETE FROM user_search_history 
       WHERE user_id = $1 AND id NOT IN (
         SELECT id FROM user_search_history 
         WHERE user_id = $1 
         ORDER BY searched_at DESC 
         LIMIT 20
       )`,
      [userId]
    );
  }

  async getRecentSearches(userId, limit = 5) {
    const result = await db.query(
      `SELECT DISTINCT ticker 
       FROM user_search_history 
       WHERE user_id = $1 AND ticker IS NOT NULL
       ORDER BY MAX(searched_at) DESC 
       LIMIT $2`,
      [userId, limit]
    );
    return result.rows.map(row => row.ticker);
  }

  async getTrendingSearches(limit = 10) {
    const result = await db.query(
      `SELECT ticker, COUNT(*) as search_count
       FROM user_search_history
       WHERE ticker IS NOT NULL 
         AND searched_at > NOW() - INTERVAL '24 hours'
       GROUP BY ticker
       ORDER BY search_count DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  }
}
```

### Step 5: Implement WebSocket for Real-time Updates

```javascript
// websocket/stockWebSocket.js
class StockWebSocketServer {
  constructor(server) {
    this.io = require('socket.io')(server, {
      cors: {
        origin: process.env.FRONTEND_URL,
        methods: ['GET', 'POST']
      }
    });

    this.subscriptions = new Map(); // userId -> Set of symbols
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('authenticate', async (token) => {
        const userId = await this.verifyToken(token);
        if (userId) {
          socket.userId = userId;
          socket.join(`user_${userId}`);
          socket.emit('authenticated', { success: true });
        }
      });

      socket.on('subscribe', (data) => {
        const { symbols, channels } = data;
        
        // Subscribe to stock prices
        if (symbols && symbols.length > 0) {
          symbols.forEach(symbol => {
            socket.join(`stock_${symbol}`);
          });
        }

        // Subscribe to channels (alerts, market_indices, etc.)
        if (channels && channels.length > 0) {
          channels.forEach(channel => {
            socket.join(channel);
          });
        }
      });

      socket.on('unsubscribe', (data) => {
        const { symbols, channels } = data;
        
        if (symbols) {
          symbols.forEach(symbol => {
            socket.leave(`stock_${symbol}`);
          });
        }

        if (channels) {
          channels.forEach(channel => {
            socket.leave(channel);
          });
        }
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });
  }

  // Broadcast price updates
  broadcastPriceUpdate(symbol, priceData) {
    this.io.to(`stock_${symbol}`).emit('price_update', {
      symbol,
      ...priceData,
      timestamp: new Date().toISOString()
    });
  }

  // Broadcast market indices
  broadcastMarketIndices(indices) {
    this.io.to('market_indices').emit('market_update', {
      indices,
      timestamp: new Date().toISOString()
    });
  }

  // Send alert notification
  sendAlertNotification(userId, alert) {
    this.io.to(`user_${userId}`).emit('alert_triggered', alert);
  }

  // Broadcast top movers
  broadcastTopMovers(movers) {
    this.io.to('top_movers').emit('movers_update', {
      gainers: movers.gainers,
      losers: movers.losers,
      active: movers.active,
      timestamp: new Date().toISOString()
    });
  }
}
```

---

## 5. Sample Code Templates

### A. Express Route Implementation

```javascript
// routes/market.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const marketService = require('../services/marketDataService');
const categoryService = require('../services/categoryService');

// Get market indices
router.get('/indices', async (req, res) => {
  try {
    const indices = await marketService.getMarketIndices();
    res.json(indices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get top movers
router.get('/movers', async (req, res) => {
  try {
    const { type = 'gainers', limit = 10 } = req.query;
    const movers = await marketService.getTopMovers(type, parseInt(limit));
    res.json({ movers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get stock categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await categoryService.getCategoriesWithCounts();
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get stocks by category
router.get('/category/:categoryId', authenticate, async (req, res) => {
  try {
    const stocks = await categoryService.getStocksByCategory(req.params.categoryId);
    res.json({ 
      category: req.params.categoryId,
      stocks 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
```

### B. Cron Jobs for Data Updates

```javascript
// jobs/marketDataJobs.js
const cron = require('node-cron');
const marketService = require('../services/marketDataService');
const alertService = require('../services/alertService');

// Update market indices every minute during market hours
cron.schedule('* 9-16 * * 1-5', async () => {
  if (await marketService.isMarketOpen()) {
    await marketService.updateMarketIndices();
    await marketService.updateTopMovers();
  }
}, {
  timezone: "America/New_York"
});

// Check alerts every 30 seconds during market hours
cron.schedule('*/30 * * * * *', async () => {
  if (await marketService.isMarketOpen()) {
    await alertService.checkAllActiveAlerts();
  }
});

// Calculate daily movers at market close
cron.schedule('0 16 * * 1-5', async () => {
  await marketService.calculateDailyMovers();
  await marketService.sendMarketCloseSummary();
}, {
  timezone: "America/New_York"
});

// Clean up old search history weekly
cron.schedule('0 0 * * 0', async () => {
  await db.query(
    `DELETE FROM user_search_history 
     WHERE searched_at < NOW() - INTERVAL '30 days'`
  );
});
```

### C. Environment Variables

```bash
# .env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/stockapp

# API Keys
ALPHA_VANTAGE_API_KEY=your_key_here
POLYGON_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here

# Redis
REDIS_URL=redis://localhost:6379

# WebSocket
WS_PORT=3001

# Market Data Provider
MARKET_DATA_PROVIDER=polygon # alphavantage | polygon | yahoo

# Notification Services
FCM_SERVER_KEY=your_fcm_key
SENDGRID_API_KEY=your_sendgrid_key
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token

# Frontend
FRONTEND_URL=http://localhost:5173

# Cache Settings
CACHE_TTL_QUOTES=60 # seconds
CACHE_TTL_NEWS=300 # seconds
CACHE_TTL_MOVERS=300 # seconds
```

---

## 6. Testing Checklist

### API Endpoint Tests

- [ ] Market indices endpoint returns current data
- [ ] Top movers endpoint supports all filter types
- [ ] Categories endpoint returns correct stock counts
- [ ] Search endpoint supports filtering
- [ ] Alert creation validates all alert types
- [ ] WebSocket connections authenticate properly
- [ ] Real-time price updates broadcast correctly

### Database Tests

- [ ] All new tables created successfully
- [ ] Indices improve query performance
- [ ] Foreign key constraints work properly
- [ ] Data cleanup jobs run correctly

### Integration Tests

- [ ] Market data updates during market hours
- [ ] Alerts trigger at correct thresholds
- [ ] Notifications sent through all channels
- [ ] Search history tracks user searches
- [ ] Categories populate correctly

### Performance Tests

- [ ] API responses under 200ms for cached data
- [ ] WebSocket handles 1000+ concurrent connections
- [ ] Database queries optimized with proper indices
- [ ] Cache invalidation works correctly

### Security Tests

- [ ] Authentication required for user-specific endpoints
- [ ] Rate limiting prevents abuse
- [ ] Input validation prevents SQL injection
- [ ] CORS configured correctly

---

## Deployment Instructions

### 1. Database Migration

```bash
# Run migrations
npm run migrate:up

# Seed initial data
npm run seed:categories
npm run seed:stocks
```

### 2. Start Services

```bash
# Start Redis
redis-server

# Start main server
npm run start

# Start WebSocket server
npm run ws:start

# Start background jobs
npm run jobs:start
```

### 3. Monitor Services

```bash
# Check logs
pm2 logs

# Monitor performance
pm2 monit

# Check database connections
npm run db:status
```

---

## Additional Notes

1. **Rate Limiting**: Implement rate limiting for all public endpoints
2. **Caching Strategy**: Use Redis for frequently accessed data
3. **Error Handling**: Implement comprehensive error logging
4. **Monitoring**: Set up alerts for service failures
5. **Backup**: Regular database backups every 6 hours
6. **Scaling**: Use load balancer for multiple server instances

This guide provides complete instructions for implementing the backend. Follow each section carefully and test thoroughly before deployment.
