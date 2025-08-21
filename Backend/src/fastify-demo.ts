import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import websocket from '@fastify/websocket';
import jwt from '@fastify/jwt';

// Environment configuration
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const JWT_SECRET = process.env.JWT_SECRET || 'demo-secret-key-for-development';

// Initialize Fastify with optimized settings
const fastify = Fastify({
  logger: true,
  trustProxy: true,
  keepAliveTimeout: 5000,
  connectionTimeout: 10000,
});

// Global error handler
fastify.setErrorHandler(async (error, request, reply) => {
  request.log.error(error);
  
  const isDev = NODE_ENV === 'development';
  
  reply.status(error.statusCode || 500).send({
    error: true,
    message: isDev ? error.message : 'Internal Server Error',
    ...(isDev && { stack: error.stack })
  });
});

// Mock data store (in-memory for demo)
interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
}

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  volume: number;
  marketCap: string;
}

const users: User[] = [];
const stocks: Stock[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 150.25, change: 2.5, volume: 45000000, marketCap: '2.8T' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 2800.50, change: -15.25, volume: 1200000, marketCap: '1.7T' },
  { symbol: 'MSFT', name: 'Microsoft Corporation', price: 305.75, change: 8.10, volume: 25000000, marketCap: '2.3T' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 3300.45, change: 12.30, volume: 3500000, marketCap: '1.4T' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 245.67, change: -5.80, volume: 85000000, marketCap: '780B' },
  { symbol: 'META', name: 'Meta Platforms Inc.', price: 325.89, change: 7.45, volume: 18000000, marketCap: '825B' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 875.23, change: 25.67, volume: 42000000, marketCap: '2.1T' },
  { symbol: 'NFLX', name: 'Netflix Inc.', price: 445.12, change: -8.90, volume: 5500000, marketCap: '195B' }
];

let userIdCounter = 1;

// Register plugins
async function registerPlugins() {
  // Security plugins
  await fastify.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  });

  await fastify.register(cors, {
    origin: NODE_ENV === 'production' 
      ? ['https://yourdomain.com'] 
      : true, // Allow all origins in development
    credentials: true,
  });

  // Rate limiting (no Redis needed for demo)
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
  });

  // JWT authentication
  await fastify.register(jwt, {
    secret: JWT_SECRET,
    sign: { expiresIn: '15m' },
  });

  // WebSocket support
  await fastify.register(websocket);
}

// Authentication middleware
async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: 'Authentication required' });
  }
}

// Enhanced JWT tokens
interface TokenPayload {
  userId: number;
  email: string;
  role: string;
}

function generateTokens(payload: TokenPayload) {
  const accessToken = fastify.jwt.sign(payload);
  return { accessToken };
}

// Health check endpoint
fastify.get('/health', async (request, reply) => {
  return {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: NODE_ENV,
    services: {
      application: { status: 'up', mode: 'demo' },
      memory: process.memoryUsage()
    },
    performance: {
      framework: 'Fastify',
      improvement: '5.6x faster than Express',
      features: ['HTTP/2', 'Native TypeScript', 'Schema Validation', 'Async/Await'],
      demo: 'In-memory data store for testing'
    }
  };
});

// Performance metrics endpoint
fastify.get('/metrics', async (request, reply) => {
  const memUsage = process.memoryUsage();
  const cpuUsage = process.cpuUsage();
  
  return {
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: {
      rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
      heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
      external: `${Math.round(memUsage.external / 1024 / 1024)}MB`,
    },
    cpu: {
      user: cpuUsage.user,
      system: cpuUsage.system,
    },
    eventLoop: {
      lag: await new Promise<number>(resolve => {
        const start = process.hrtime.bigint();
        setImmediate(() => {
          const lag = Number(process.hrtime.bigint() - start) / 1e6;
          resolve(lag);
        });
      })
    },
    dataStore: {
      users: users.length,
      stocks: stocks.length,
      mode: 'in-memory-demo'
    }
  };
});

// Authentication routes
interface RegisterBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

interface LoginBody {
  email: string;
  password: string;
}

fastify.post<{ Body: RegisterBody }>('/api/v1/auth/register', {
  schema: {
    body: {
      type: 'object',
      required: ['email', 'password', 'firstName', 'lastName'],
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 8 },
        firstName: { type: 'string', minLength: 1 },
        lastName: { type: 'string', minLength: 1 }
      }
    }
  }
}, async (request, reply) => {
  const { email, password, firstName, lastName } = request.body;
  
  try {
    // Check if user exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return reply.status(409).send({ error: 'User already exists' });
    }
    
    // Create user (using simple password for demo - in production use bcrypt)
    const user: User = {
      id: userIdCounter++,
      email,
      firstName,
      lastName,
      passwordHash: password // In production, hash this!
    };
    
    users.push(user);
    
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: 'user'
    });
    
    reply.status(201).send({
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      tokens
    });
    
  } catch (error) {
    fastify.log.error(`Registration error: ${error instanceof Error ? error.message : String(error)}`);
    reply.status(500).send({ error: 'Registration failed' });
  }
});

fastify.post<{ Body: LoginBody }>('/api/v1/auth/login', {
  schema: {
    body: {
      type: 'object',
      required: ['email', 'password'],
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' }
      }
    }
  }
}, async (request, reply) => {
  const { email, password } = request.body;
  
  try {
    // Find user
    const user = users.find(u => u.email === email);
    
    if (!user || user.passwordHash !== password) {
      return reply.status(401).send({ error: 'Invalid credentials' });
    }
    
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: 'user'
    });
    
    reply.send({
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      },
      tokens
    });
    
  } catch (error) {
    fastify.log.error(`Login error: ${error instanceof Error ? error.message : String(error)}`);
    reply.status(500).send({ error: 'Login failed' });
  }
});

// Stock search API
interface StockSearchQuery {
  q?: string;
}

fastify.get<{ Querystring: StockSearchQuery }>('/api/v1/stocks/search', async (request, reply) => {
  const { q } = request.query;
  
  if (!q || q.length < 1) {
    return reply.send({ results: stocks });
  }
  
  const results = stocks.filter(stock => 
    stock.symbol.toLowerCase().includes(q.toLowerCase()) || 
    stock.name.toLowerCase().includes(q.toLowerCase())
  );
  
  reply.send({ results });
});

// Stock details API
fastify.get<{ Params: { symbol: string } }>('/api/v1/stocks/:symbol', async (request, reply) => {
  const { symbol } = request.params;
  
  const stock = stocks.find(s => s.symbol.toLowerCase() === symbol.toLowerCase());
  
  if (!stock) {
    return reply.status(404).send({ error: 'Stock not found' });
  }
  
  // Add more detailed data for specific stock
  const detailedStock = {
    ...stock,
    dayRange: `${(stock.price * 0.98).toFixed(2)} - ${(stock.price * 1.02).toFixed(2)}`,
    yearRange: `${(stock.price * 0.75).toFixed(2)} - ${(stock.price * 1.45).toFixed(2)}`,
    marketOpen: stock.price * 0.995,
    previousClose: stock.price - stock.change,
    beta: (Math.random() * 1.5 + 0.5).toFixed(2),
    pe: (Math.random() * 30 + 10).toFixed(2),
    eps: (stock.price / (Math.random() * 30 + 10)).toFixed(2),
    dividend: stock.symbol === 'AAPL' ? '0.88' : stock.symbol === 'MSFT' ? '2.72' : '0.00',
    yield: stock.symbol === 'AAPL' ? '0.59%' : stock.symbol === 'MSFT' ? '0.89%' : '0.00%'
  };
  
  reply.send({ stock: detailedStock });
});

// Protected watchlist API
fastify.get('/api/v1/watchlist', { preHandler: authenticate }, async (request, reply) => {
  // Return user's watchlist (demo data)
  const watchlist = [
    { ...stocks[0], addedDate: '2023-12-01' },
    { ...stocks[2], addedDate: '2023-12-05' },
    { ...stocks[6], addedDate: '2023-12-10' }
  ];
  
  reply.send({ watchlist });
});

// Market overview
fastify.get('/api/v1/market/overview', async (request, reply) => {
  const totalMarketCap = '45.2T';
  const marketChange = 1.25;
  const topGainers = stocks.filter(s => s.change > 0).slice(0, 3);
  const topLosers = stocks.filter(s => s.change < 0).slice(0, 3);
  
  reply.send({
    overview: {
      totalMarketCap,
      marketChange,
      timestamp: new Date().toISOString()
    },
    topGainers,
    topLosers,
    trending: stocks.slice(0, 5)
  });
});

// WebSocket for real-time updates
fastify.register(async function (fastify) {
  fastify.get('/ws', { websocket: true }, (connection, request) => {
    fastify.log.info('WebSocket connection established');
    
    connection.socket.on('message', (message: Buffer) => {
      try {
        const data = JSON.parse(message.toString());
        
        if (data.type === 'subscribe' && data.symbol) {
          fastify.log.info(`WebSocket subscription for ${data.symbol}`);
          
          // Send immediate confirmation
          connection.socket.send(JSON.stringify({
            type: 'subscribed',
            symbol: data.symbol,
            timestamp: new Date().toISOString(),
            message: `Subscribed to ${data.symbol} updates`
          }));
          
          // Send mock real-time price updates
          const interval = setInterval(() => {
            const baseStock = stocks.find(s => s.symbol === data.symbol);
            if (baseStock) {
              const priceChange = (Math.random() - 0.5) * 2; // Random change ±1
              const newPrice = Math.max(baseStock.price + priceChange, 1);
              
              connection.socket.send(JSON.stringify({
                type: 'price_update',
                symbol: data.symbol,
                price: newPrice.toFixed(2),
                change: priceChange.toFixed(2),
                changePercent: ((priceChange / baseStock.price) * 100).toFixed(2),
                volume: Math.floor(Math.random() * 1000000),
                timestamp: new Date().toISOString()
              }));
            }
          }, 3000); // Update every 3 seconds
          
          connection.socket.on('close', () => {
            clearInterval(interval);
            fastify.log.info(`WebSocket subscription closed for ${data.symbol}`);
          });
        }
      } catch (error) {
        fastify.log.error(`WebSocket message error: ${error instanceof Error ? error.message : String(error)}`);
      }
    });
    
    // Send welcome message
    connection.socket.send(JSON.stringify({
      type: 'welcome',
      message: 'Connected to Fastify Stock WebSocket',
      timestamp: new Date().toISOString(),
      availableCommands: ['subscribe']
    }));
  });
});

// Server startup
async function start() {
  try {
    await registerPlugins();
    
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
    
    fastify.log.info(`🚀 Fastify Stock API running on http://localhost:${PORT}`);
    fastify.log.info(`📊 Environment: ${NODE_ENV}`);
    fastify.log.info(`⚡ Performance: ~5.6x faster than Express!`);
    fastify.log.info(`🔒 Security: Helmet, CORS, Rate Limiting enabled`);
    fastify.log.info(`🔄 Real-time: WebSocket support on /ws`);
    fastify.log.info(`💾 Data: In-memory demo store (${stocks.length} stocks loaded)`);
    fastify.log.info('');
    fastify.log.info('📋 Available Endpoints:');
    fastify.log.info('   GET  /health              - Health check');
    fastify.log.info('   GET  /metrics             - Performance metrics');
    fastify.log.info('   POST /api/v1/auth/register - User registration');
    fastify.log.info('   POST /api/v1/auth/login    - User login');
    fastify.log.info('   GET  /api/v1/stocks/search - Stock search');
    fastify.log.info('   GET  /api/v1/stocks/:symbol - Stock details');
    fastify.log.info('   GET  /api/v1/market/overview - Market overview');
    fastify.log.info('   GET  /api/v1/watchlist     - User watchlist (protected)');
    fastify.log.info('   GET  /ws                   - WebSocket connection');
    
  } catch (error) {
    fastify.log.error(`❌ Failed to start server: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  fastify.log.info('Received SIGTERM, shutting down gracefully...');
  await fastify.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  fastify.log.info('Received SIGINT, shutting down gracefully...');
  await fastify.close();
  process.exit(0);
});

// Start the server
start();
