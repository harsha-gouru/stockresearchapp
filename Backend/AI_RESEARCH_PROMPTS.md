# 🤖 AI Research Prompts for Backend Development

## 📋 How to Use These Prompts

### Step 1: Upload Files
Upload these 4 files to ChatGPT or Perplexity:
1. `PERPLEXITY_RESEARCH_REFERENCE.md`
2. `TECHNICAL_RESEARCH_SPECIFICATIONS.md` 
3. `IMPLEMENTATION_ROADMAP.md`
4. `API_INTEGRATION_RESEARCH_GUIDE.md`

### Step 2: Choose Your Research Focus
Select one of the prompts below based on what you want to research first.

---

## 🎯 Prompt 1: Overall Architecture & Technology Stack

```
I'm building a Node.js + TypeScript backend for an iOS stock trading app. I've uploaded 4 detailed reference files about my requirements and current implementation status.

**Project Context & Constraints:**
- Target: iOS app initially, considering web/Android expansion later
- Performance: Prioritizing sub-200ms latency for real-time updates over pure cost efficiency
- Infrastructure: Open to both serverless/microservices (AWS Lambda, GCP Cloud Run) and traditional VM/container deployments
- Redis: Considering managed solutions (AWS ElastiCache) vs self-hosted based on cost/performance trade-offs
- Scale: Must handle 1000+ concurrent users with real-time portfolio calculations
- Budget: Startup budget but willing to invest in performance-critical components

Based on these files and constraints, please:

1. **Technology Stack Recommendations**: Analyze my current tech stack (Node.js, Express, PostgreSQL, Redis) and recommend the best 2024 alternatives or improvements, especially for:
   - Stock data APIs (free vs paid options with sub-200ms latency requirements)
   - Real-time WebSocket architecture (Socket.io vs native WebSocket vs Server-Sent Events)
   - Database optimization for financial data (PostgreSQL vs TimescaleDB vs hybrid approach)
   - Caching strategies for high-frequency trading data (Redis clustering vs single instance)

2. **Architecture Decisions**: Given that I'm at 15% implementation and may expand to web later, should I:
   - Stick with monolithic architecture or move to microservices/serverless?
   - Use GraphQL instead of REST for complex financial queries (considering mobile-first but web expansion)?
   - Implement event-driven architecture with message queues (AWS SQS vs Redis pub/sub)?
   - Choose between traditional hosting vs serverless for different components?

3. **Modern Implementation Patterns**: What are the latest 2024/2025 best practices for:
   - JWT authentication with refresh token rotation (considering mobile-first design)
   - Financial data validation and error handling (real-time constraints)
   - Real-time portfolio calculation engines (sub-second performance requirements)
   - Multi-channel notification systems (iOS push, email, SMS integration)

4. **Infrastructure & Hosting Strategy**: Considering my constraints, what's the optimal approach for:
   - Managed vs self-hosted Redis (AWS ElastiCache vs Redis Cloud vs self-managed)
   - Serverless components (which parts benefit from Lambda/Cloud Functions)
   - Database hosting (managed PostgreSQL vs self-hosted vs cloud-native solutions)
   - CDN and edge computing for global low-latency access

5. **Priority Implementation Order**: Based on my roadmap and performance requirements, which components should I implement first for an MVP that can handle:
   - 1000+ concurrent users with sub-200ms response times
   - Real-time stock price updates with WebSocket streaming
   - Portfolio tracking with sub-second calculations
   - Smart alert system with multi-channel delivery

Please provide specific library recommendations, cost analysis, performance benchmarks, and implementation strategies based on the current state described in my files and the constraints above.
```

---

## 🎯 Prompt 2: Stock Data APIs & Real-Time Architecture

```
I'm building a financial application backend and need to implement real-time stock data integration. I've uploaded detailed requirement files.

Based on my requirements, please research and recommend:

1. **Stock Data API Selection**:
   - Compare Alpha Vantage vs Polygon.io vs IEX Cloud vs Yahoo Finance API for 2024
   - Which offers the best free tier for development?
   - Which is most cost-effective for production with 1000+ users?
   - Real-time data capabilities and WebSocket support

2. **Real-Time Architecture**:
   - Best practices for WebSocket implementation with Socket.io vs native WebSocket
   - How to handle 1000+ concurrent connections for live price updates
   - Redis pub/sub vs direct WebSocket for scaling across multiple servers
   - Data synchronization strategies for portfolio calculations

3. **Caching Strategy**:
   - Optimal TTL values for different types of financial data
   - Multi-layer caching (Memory, Redis, CDN) for stock prices
   - Cache invalidation strategies for real-time price updates
   - Memory management for high-frequency data

4. **Implementation Examples**:
   - Code examples for connecting to stock APIs with proper error handling
   - WebSocket event handling for price broadcasts
   - Efficient data structures for real-time calculations

Focus on 2024/2025 solutions that can scale and handle financial data requirements with low latency.
```

---

## 🎯 Prompt 3: Authentication & Security Architecture

```
I'm developing a financial application backend with sensitive user data and portfolio information. I've uploaded comprehensive requirement documents.

Please analyze my security needs and provide 2024 best practices for:

1. **Authentication System**:
   - JWT vs session-based authentication for financial apps
   - Refresh token rotation implementation with Redis
   - Google OAuth 2.0 and Apple Sign-In integration patterns
   - Biometric authentication server-side validation
   - 2FA implementation with SMS (Twilio) and email

2. **Security Architecture**:
   - OWASP compliance for financial applications
   - Data encryption strategies (at rest and in transit)
   - Input validation and sanitization for financial data
   - SQL injection and XSS prevention
   - Rate limiting strategies for different endpoints

3. **Compliance Requirements**:
   - GDPR compliance for EU users
   - Financial data protection regulations
   - Audit logging for all financial transactions
   - Data retention and "right to be forgotten" implementation

4. **Modern Security Patterns**:
   - Zero-trust architecture principles
   - API security headers and middleware configuration
   - Secrets management and environment variable security
   - Security monitoring and intrusion detection

Provide specific implementation examples and library recommendations that are production-ready for a financial application handling real money and personal data.
```

---

## 🎯 Prompt 4: AI Integration & Smart Features

```
I'm implementing AI-powered features for a stock trading app backend. I've uploaded detailed specifications about my requirements.

Based on my files, please research and recommend:

1. **AI Service Integration**:
   - OpenAI GPT-4 vs Claude vs Google Gemini for financial analysis
   - Cost optimization strategies for AI API usage
   - Prompt engineering best practices for stock analysis
   - Caching strategies for AI-generated insights

2. **Smart Features Implementation**:
   - Stock analysis and recommendation algorithms
   - Portfolio optimization using AI
   - Market sentiment analysis from news data
   - Personalized investment suggestions

3. **AI Architecture Patterns**:
   - Should I use direct API calls or build a dedicated AI microservice?
   - How to handle AI request queuing and rate limiting?
   - Error handling and fallback strategies for AI failures
   - A/B testing framework for AI recommendations

4. **Advanced AI Features**:
   - Real-time market sentiment analysis
   - Predictive analytics for portfolio performance
   - Risk assessment algorithms
   - Natural language query processing for financial data

5. **Cost Management**:
   - Token usage optimization techniques
   - Tiered AI features based on user subscription
   - Batch processing vs real-time AI analysis trade-offs

Please provide implementation examples and 2024/2025 best practices for integrating AI into financial applications responsibly and cost-effectively.
```

---

## 🎯 Prompt 5: Database Design & Performance Optimization

```
I'm designing a database architecture for a financial application that needs to handle real-time data, portfolio calculations, and user management. I've uploaded comprehensive requirement files.

Please analyze and recommend:

1. **Database Architecture**:
   - PostgreSQL optimization for financial data vs TimescaleDB for time-series
   - Schema design best practices for stock prices, portfolios, and transactions
   - Indexing strategies for high-frequency financial queries
   - Data partitioning for large-scale time-series data

2. **Performance Optimization**:
   - Query optimization for portfolio value calculations
   - Connection pooling strategies for high-concurrency
   - Read replica configuration for scaling reads
   - Database monitoring and performance tuning

3. **Data Management**:
   - Real-time data insertion patterns for stock prices
   - Batch vs streaming data processing for market data
   - Data retention policies for historical stock data
   - Backup and disaster recovery for financial data

4. **ORM and Query Patterns**:
   - Prisma vs Knex vs TypeORM for TypeScript financial applications
   - Raw SQL vs ORM for complex financial calculations
   - Transaction management for portfolio updates
   - Concurrent update handling for real-time data

5. **Scaling Strategies**:
   - Horizontal scaling patterns for financial databases
   - Sharding strategies for user data
   - Cache-aside vs write-through patterns for financial data
   - Multi-region deployment considerations

Focus on 2024 best practices that can handle financial-grade requirements for data consistency, performance, and reliability.
```

---

## 🎯 Prompt 6: Complete Implementation Guide

```
I'm at 15% implementation of a Node.js financial application backend and need a comprehensive implementation guide. I've uploaded 4 detailed requirement and analysis files.

Based on my current state and requirements, please create:

1. **Immediate Next Steps (Week 1-2)**:
   - Specific tasks to complete the database setup and migrations
   - Authentication system implementation priorities
   - Which external APIs to integrate first for MVP functionality

2. **Technical Implementation Guide**:
   - Step-by-step setup for chosen stock data API
   - WebSocket implementation for real-time features
   - Portfolio calculation engine architecture
   - Alert system with notification delivery

3. **Code Examples and Libraries**:
   - Updated package.json with 2024 best practice dependencies
   - TypeScript interfaces for financial data models
   - API route structure with proper validation
   - Error handling patterns for financial applications

4. **Testing and Quality Assurance**:
   - Testing strategy for financial calculations
   - Mock data patterns for development
   - CI/CD pipeline setup for financial applications
   - Performance testing for high-concurrency scenarios

5. **Deployment and Monitoring**:
   - Production deployment checklist
   - Monitoring and logging setup for financial data
   - Scaling strategies from MVP to production
   - Security hardening for production environment

Please provide actionable, current (2024/2025) implementation guidance that I can follow to complete my backend efficiently and securely.
```

---

## 💡 Tips for Better AI Responses

### For ChatGPT:
- Upload all 4 files at once for complete context
- Be specific about your current skill level and timeline
- Ask for code examples and specific library versions
- Request step-by-step implementation guides

### For Perplexity:
- Emphasize that you want the "latest 2024/2025" information
- Ask for comparisons between different tools/approaches
- Request links to documentation and resources
- Ask about pricing and scalability considerations

### Follow-up Questions:
After getting initial responses, you can ask:
- "Can you provide a complete code example for [specific feature]?"
- "What are the security implications of this approach?"
- "How does this scale to 10,000+ users?"
- "What are the cost implications of this solution?"
- "Can you show me the exact implementation steps?"

---

## 🔄 Iterative Research Strategy

1. **Start with Prompt 1** (Overall Architecture) to get the big picture
2. **Use Prompt 2** (Stock Data APIs) for immediate implementation needs
3. **Apply Prompt 3** (Security) before implementing user features
4. **Implement Prompt 4** (AI Integration) for advanced features
5. **Optimize with Prompt 5** (Database) for performance
6. **Complete with Prompt 6** (Implementation Guide) for final steps

Each prompt is designed to give you actionable, up-to-date information that you can immediately implement in your backend development process.
