# 📈 Stock Research App

A modern, iOS-styled stock trading application built with React and Node.js, featuring real-time market data, AI-powered insights, and portfolio management.

![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.3-blue)
![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Docker](https://img.shields.io/badge/Docker-Ready-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🌟 Features

### Current Features
- 📱 **iOS-Style UI** - Beautiful, native iOS-like interface with 20+ components
- 🔍 **Real-Time Stock Search** - Search and track stocks with Yahoo Finance integration
- 📊 **Interactive Charts** - Visualize stock performance with dynamic charts
- 🔐 **Authentication System** - Secure JWT-based authentication
- 🐳 **Docker Ready** - Full containerization for easy deployment
- 📱 **Responsive Design** - Works seamlessly on all devices

### In Development
- 💼 Portfolio management and tracking
- 🤖 AI-powered stock analysis and recommendations
- 🔔 Smart price alerts and notifications
- 💬 Real-time updates via WebSocket
- 📧 Email notifications for important events

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Docker & Docker Compose
- Git

### Installation

1. **Clone the repository**
```bash
git clone git@github.com:harsha-gouru/stockresearchapp.git
cd stockresearchapp
```

2. **Install dependencies**
```bash
# Frontend dependencies
npm install

# Backend dependencies
cd Backend
npm install
```

3. **Set up environment variables**
```bash
cd Backend
cp .env.example .env
# Edit .env with your configuration
```

4. **Start the development environment**
```bash
# Start backend with Docker
cd Backend
npm run docker:start  # Starts PostgreSQL + Redis
npm run dev:yahoo     # Starts backend with Yahoo Finance

# In a new terminal, start frontend
cd ..
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- API Health: http://localhost:3000/health

## 🏗️ Architecture

```
┌─────────────────────────────────────────┐
│         React Frontend (3001)            │
│     20+ iOS-styled Components            │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│      Express/Fastify Backend (3000)      │
│         REST API + WebSocket              │
└─────────────────────────────────────────┘
                    ↓
┌──────────────┐    ┌────────────────────┐
│ PostgreSQL   │    │     Redis          │
│   (5432)     │    │     (6379)         │
└──────────────┘    └────────────────────┘
```

## 📁 Project Structure

```
stockresearchapp/
├── components/           # React components
│   ├── Dashboard.tsx
│   ├── StockAnalysis.tsx
│   ├── AIInsightsHistory.tsx
│   └── ... (20+ components)
├── Backend/
│   ├── src/
│   │   ├── services/    # Business logic
│   │   ├── routes/      # API endpoints
│   │   └── config/      # Configuration
│   └── docker-compose.yml
├── __tests__/           # Test files
├── docker-stack.sh      # Full stack Docker helper
└── ARCHITECTURE.md      # Detailed architecture docs
```

## 📊 Implementation Status

- ✅ Frontend UI (100% complete)
- ✅ Stock Search API
- ✅ Real-time stock prices
- ⚠️ Authentication (partial)
- ❌ Portfolio Management (0%)
- ❌ AI Integration (0%)
- ❌ Alert System (0%)
- ❌ Notifications (0%)

**Overall Backend Completion: ~10%**

See [BACKEND_IMPLEMENTATION_ROADMAP.md](./BACKEND_IMPLEMENTATION_ROADMAP.md) for detailed implementation plan.

## 🧪 Testing

```bash
# Run frontend tests
npm run test
npm run test:coverage

# Run backend tests
cd Backend
npm run test
```

## 🐳 Docker

### Using Docker Compose
```bash
# Start full stack
./docker-stack.sh start

# Stop all services
./docker-stack.sh stop

# View logs
./docker-stack.sh logs

# Reset databases
./docker-stack.sh clean
```

## 📖 Documentation

- [Architecture Overview](./ARCHITECTURE.md)
- [Data Flows](./DATA_FLOWS.md)
- [Component-Backend Mapping](./COMPONENT_BACKEND_MAPPING.md)
- [Backend Implementation Roadmap](./BACKEND_IMPLEMENTATION_ROADMAP.md)
- [Development Workflow](./WARP.md)

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - UI Framework
- **TypeScript 5.5.3** - Type Safety
- **Vite 5.4.1** - Build Tool
- **Tailwind CSS** - Styling
- **Radix UI** - Component Library
- **Recharts** - Data Visualization

### Backend
- **Node.js 18+** - Runtime
- **Express/Fastify** - Web Framework
- **TypeScript** - Type Safety
- **PostgreSQL** - Database
- **Redis** - Caching
- **Socket.IO** - Real-time
- **JWT** - Authentication

### DevOps
- **Docker** - Containerization
- **Docker Compose** - Orchestration
- **GitHub Actions** - CI/CD (planned)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

### Phase 1 (Current)
- [x] Frontend UI Components
- [x] Basic Stock Search
- [ ] Complete Authentication
- [ ] Portfolio Management

### Phase 2
- [ ] AI Integration (OpenAI)
- [ ] Alert System
- [ ] Real-time WebSocket Updates
- [ ] Email Notifications

### Phase 3
- [ ] Mobile App (React Native)
- [ ] Advanced Analytics
- [ ] Social Features
- [ ] Premium Subscriptions

## 👤 Author

**Sri Harsha Gouru**
- GitHub: [@harsha-gouru](https://github.com/harsha-gouru)
- Email: gourusriharsha1507@gmail.com

## 🙏 Acknowledgments

- Yahoo Finance for market data
- OpenAI for AI capabilities (planned)
- The React and Node.js communities

---

**Note:** This is a learning project currently in active development. Many features are still being implemented.
