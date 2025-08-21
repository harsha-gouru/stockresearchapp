# 🚀 Stock Trading App - Backend API

A comprehensive Node.js/TypeScript backend for the iOS Stock Trading Application with real-time features, AI integration, and sophisticated portfolio management.

## 📊 **Architecture Overview**

```
Backend Architecture
├── Express.js + TypeScript     # REST API Server
├── PostgreSQL                  # Primary Database
├── Redis                      # Caching & Sessions
├── Socket.IO                  # Real-time Features
├── JWT Authentication         # Security
└── External APIs              # Stock Data & AI
```

## ✨ **Features**

### **Core Features**
- 🔐 **JWT Authentication** - Secure user authentication with refresh tokens
- 📊 **Real-time Stock Data** - Live price updates via WebSocket
- 🤖 **AI-Powered Insights** - OpenAI integration for stock analysis
- 📱 **Push Notifications** - Firebase Cloud Messaging
- 📈 **Portfolio Management** - Complete portfolio tracking
- 🚨 **Smart Alerts** - Customizable price and volume alerts
- 🔍 **Advanced Search** - Stock discovery with filtering
- 📊 **Market Data** - Real-time indices and market movers

### **Technical Features**
- 🛡️ **Security** - CORS, Helmet, Rate Limiting, Input Validation
- 📝 **Logging** - Winston-based comprehensive logging
- 🔄 **Error Handling** - Centralized error management
- 🚀 **Performance** - Redis caching, database optimization
- 🧪 **Testing** - Jest unit and integration tests
- 🐳 **Docker** - Containerized development environment

## 🛠 **Technology Stack**

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Runtime** | Node.js 18+ | JavaScript runtime |
| **Framework** | Express.js | Web framework |
| **Language** | TypeScript | Type safety |
| **Database** | PostgreSQL 14 | Primary data storage |
| **Cache** | Redis 7 | Caching & sessions |
| **Real-time** | Socket.IO | WebSocket connections |
| **Authentication** | JWT | Token-based auth |
| **Validation** | Joi | Input validation |
| **Logging** | Winston | Application logging |
| **Testing** | Jest | Unit & integration tests |
| **Container** | Docker | Development environment |

## 🚀 **Quick Start**

### **Option 1: Docker (Recommended)**

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

### **Option 2: Local Development**

**Prerequisites:**
- Node.js 18+
- PostgreSQL 14+
- Redis 7+

**Setup:**
```bash
# 1. Install dependencies
npm install

# 2. Start PostgreSQL & Redis
brew services start postgresql@14
brew services start redis

# 3. Create database
createdb stockapp_dev

# 4. Set up environment
cp .env.example .env
# Edit .env with your configuration

# 5. Initialize database
npm run migrate:up

# 6. Start development server
npm run dev
```

## 📡 **API Endpoints**

### **Authentication** `/api/auth`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/register` | User registration |
| POST | `/login` | User login |
| POST | `/logout` | User logout |
| POST | `/refresh` | Refresh access token |
| POST | `/forgot-password` | Password reset request |
| POST | `/reset-password` | Reset password |
| POST | `/verify-email` | Email verification |
| POST | `/social/google` | Google OAuth |
| POST | `/social/apple` | Apple Sign In |

### **Stocks** `/api/stocks`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/search?q=AAPL` | Search stocks |
| GET | `/:symbol` | Get stock details |
| GET | `/:symbol/price` | Current price |
| GET | `/:symbol/chart` | Chart data |
| GET | `/:symbol/news` | Stock news |
| GET | `/categories` | Stock categories |

### **Portfolio** `/api/portfolio`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get user portfolio |
| GET | `/summary` | Portfolio summary |
| GET | `/performance` | Performance metrics |
| POST | `/holdings` | Add holding |
| PUT | `/holdings/:id` | Update holding |
| DELETE | `/holdings/:id` | Remove holding |

### **Alerts** `/api/alerts`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Get all alerts |
| GET | `/active` | Active alerts |
| GET | `/triggered` | Triggered alerts |
| POST | `/create` | Create alert |
| PUT | `/:id` | Update alert |
| DELETE | `/:id` | Delete alert |

### **Market Data** `/api/market`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/indices` | Market indices |
| GET | `/movers` | Top movers |
| GET | `/status` | Market status |
| GET | `/sectors` | Sector performance |

### **AI Insights** `/api/ai`
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/insights` | AI insights |
| GET | `/insights/:symbol` | Stock insights |
| GET | `/predictions/:symbol` | Price predictions |
| POST | `/analyze-portfolio` | Portfolio analysis |
| GET | `/recommendations` | Recommendations |

## 🔧 **Development Commands**

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server

# Database
npm run migrate:up       # Run migrations
npm run migrate:down     # Rollback migrations
npm run seed             # Seed database

# Testing
npm run test             # Run all tests
npm run test:watch       # Watch mode
npm run test:coverage    # Coverage report

# Code Quality
npm run lint             # ESLint
npm run format           # Prettier
npm run type-check       # TypeScript check
```

## 🔧 **Configuration**

### **Environment Variables**

```bash
# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/stockapp_dev

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret

# API Keys
ALPHA_VANTAGE_API_KEY=your-key
OPENAI_API_KEY=your-key
FCM_SERVER_KEY=your-key

# External Services
SENDGRID_API_KEY=your-key
TWILIO_ACCOUNT_SID=your-sid
TWILIO_AUTH_TOKEN=your-token
```

### **Database Schema**

The application uses **14 tables** for comprehensive functionality:

- **Users & Auth**: `users`, `auth_tokens`, `social_auth`
- **Stocks**: `stocks`, `stock_prices`, `stock_categories`, `stock_category_mappings`
- **Portfolio**: `portfolios`, `portfolio_holdings`, `transactions`
- **Social**: `watchlists`, `watchlist_items`
- **Alerts**: `alerts`, `alert_history`
- **Notifications**: `notifications`, `notification_settings`
- **AI**: `ai_insights`, `user_ai_insights`
- **Search**: `user_search_history`
- **Market**: `market_indices`

## 🔄 **Real-time Features**

### **WebSocket Events**

```javascript
// Connect to WebSocket
const socket = io('http://localhost:3000');

// Subscribe to price updates
socket.emit('subscribe', {
  symbols: ['AAPL', 'GOOGL', 'MSFT'],
  channels: ['market_indices', 'top_movers']
});

// Listen for updates
socket.on('price_update', (data) => {
  console.log('Price update:', data);
});

socket.on('alert_triggered', (alert) => {
  console.log('Alert triggered:', alert);
});
```

## 🔐 **Authentication**

### **JWT Token Flow**

```javascript
// Login request
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

// Response
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "isVerified": true
  }
}

// Authenticated requests
Authorization: Bearer {accessToken}
```

## 📊 **API Examples**

### **Stock Search**
```bash
curl "http://localhost:3000/api/stocks/search?q=AAPL"
```

### **Create Alert**
```bash
curl -X POST "http://localhost:3000/api/alerts/create" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "stockSymbol": "AAPL",
    "alertType": "price_above",
    "targetValue": 200.00,
    "notificationChannels": ["push", "email"]
  }'
```

### **Get Portfolio**
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "http://localhost:3000/api/portfolio"
```

## 🧪 **Testing**

```bash
# Run all tests
npm test

# Test specific file
npm test auth.test.ts

# Coverage report
npm run test:coverage

# Integration tests
npm run test:integration
```

## 📈 **Performance**

### **Caching Strategy**
- **Stock Prices**: 60 seconds TTL
- **Market Data**: 5 minutes TTL
- **News**: 5 minutes TTL
- **Search Results**: 2 minutes TTL

### **Database Optimization**
- Indexed queries for performance
- Connection pooling
- Query optimization
- Prepared statements

## 🔒 **Security**

### **Security Measures**
- ✅ HTTPS enforcement
- ✅ CORS configuration
- ✅ Rate limiting
- ✅ Input validation
- ✅ SQL injection prevention
- ✅ XSS protection
- ✅ JWT token security
- ✅ Password hashing (bcrypt)

## 🚀 **Deployment**

### **Production Deployment**

```bash
# Build application
npm run build

# Start production server
npm start

# Using PM2
pm2 start dist/server.js --name "stock-api"
pm2 startup
pm2 save
```

### **Docker Deployment**

```bash
# Build image
docker build -t stock-app-backend .

# Run container
docker run -p 3000:3000 stock-app-backend
```

## 📊 **Monitoring**

### **Health Checks**
- `GET /health` - Application health
- Database connectivity
- Redis connectivity
- External API status

### **Metrics**
- Request/response times
- Error rates
- Database query performance
- Cache hit rates
- WebSocket connections

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 **License**

MIT License - see LICENSE file for details.

## 🆘 **Support**

- 📧 Email: support@stockapp.com
- 📖 Documentation: `/docs`
- 🐛 Issues: GitHub Issues
- 💬 Discord: [Stock App Community]

---

**Built with ❤️ for the iOS Stock Trading Application**
