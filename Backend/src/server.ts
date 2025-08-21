import Fastify, { FastifyReply, FastifyRequest } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import websocket from '@fastify/websocket';
import jwt from '@fastify/jwt';
import { Pool, PoolClient } from 'pg';
import Redis from 'ioredis';
import bcrypt from 'bcrypt';
import { Queue } from 'bullmq';
import dotenv from 'dotenv';

// Environment configuration
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'stock_tracker',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  max: 20, // Maximum number of connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
};

// Redis configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  ...(process.env.REDIS_PASSWORD && { password: process.env.REDIS_PASSWORD }),
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
};

// Initialize Fastify with optimized settings
const fastify = Fastify({
  logger: NODE_ENV === 'development',
  trustProxy: true,
  keepAliveTimeout: 5000,
  connectionTimeout: 10000,
});

// Global error handler
fastify.setErrorHandler(async (error, request, reply) => {
  request.log.error(error);
  
  // Don't leak error details in production
  const isDev = NODE_ENV === 'development';
  
  reply.status(error.statusCode || 500).send({
    error: true,
    message: isDev ? error.message : 'Internal Server Error',
    ...(isDev && { stack: error.stack })
  });
});

// Initialize connections
let db: Pool;
let redis: Redis;
let stockDataQueue: Queue;

async function initializeConnections() {
  try {
    // Initialize PostgreSQL
    db = new Pool(dbConfig);
    const client: PoolClient = await db.connect();
    await client.query('SELECT NOW()');
    client.release();
    fastify.log.info('✅ PostgreSQL connected successfully');

    // Initialize Redis
    redis = new Redis(redisConfig);
    await redis.ping();
    fastify.log.info('✅ Redis connected successfully');

    // Initialize BullMQ for background jobs
    stockDataQueue = new Queue('stock-data-processing', {
      connection: redisConfig,
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 50,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
      },
    });
    fastify.log.info('✅ BullMQ queue initialized');

    // Add database and redis to fastify instance
    fastify.decorate('db', db);
    fastify.decorate('redis', redis);
    fastify.decorate('stockQueue', stockDataQueue);

  } catch (error) {
    fastify.log.error(`❌ Failed to initialize connections: ${error instanceof Error ? error.message : String(error)}`);
    throw error;
  }
}

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
      : ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  });

  // Rate limiting
  await fastify.register(rateLimit, {
    max: 100,
    timeWindow: '1 minute',
    redis: redis,
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

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import stockRoutes from './routes/stocks.js';
import portfolioRoutes from './routes/portfolio.js';
import alertRoutes from './routes/alerts.js';
import notificationRoutes from './routes/notifications.js';
import marketRoutes from './routes/market.js';
import aiRoutes from './routes/ai.js';
import discoverRoutes from './routes/discover.js';
import watchlistRoutes from './routes/watchlist.js';

// Import services
import { MarketDataService } from './services/MarketDataService.js';
import { AlertService } from './services/AlertService.js';
import { WebSocketService } from './services/WebSocketService.js';

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: config.cors.origins,
    methods: ['GET', 'POST']
  }
});

// Initialize logger
const logger = setupLogger();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// CORS configuration
app.use(cors({
  origin: config.cors.origins,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequests,
  message: {
    error: 'Too many requests from this IP, please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session configuration (for Passport OAuth)
app.use(session({
  secret: config.session.secret,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: config.node.env === 'production',
    maxAge: config.session.maxAge,
    httpOnly: true
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Request logging
app.use(requestLogger);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.node.env
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/stocks', stockRoutes);
app.use('/api/portfolio', authMiddleware, portfolioRoutes);
app.use('/api/alerts', authMiddleware, alertRoutes);
app.use('/api/notifications', authMiddleware, notificationRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/ai', authMiddleware, aiRoutes);
app.use('/api/discover', discoverRoutes);
app.use('/api/watchlist', authMiddleware, watchlistRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Initialize services
let marketDataService: MarketDataService;
let alertService: AlertService;
let webSocketService: WebSocketService;

async function startServer() {
  try {
    // Connect to databases
    await connectDatabase();
    await connectRedis();
    
    logger.info('Database connections established');

    // Initialize services
    marketDataService = new MarketDataService();
    alertService = new AlertService();
    webSocketService = new WebSocketService(io);

    // Start background services
    if (config.node.env === 'production' || config.node.env === 'development') {
      await marketDataService.startRealtimeUpdates();
      await alertService.startMonitoring();
      logger.info('Background services started');
    }

    // Start server
    const PORT = config.server.port;
    server.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📊 Environment: ${config.node.env}`);
      logger.info(`🔗 API Base URL: http://localhost:${PORT}/api`);
      logger.info(`🌐 WebSocket URL: ws://localhost:${PORT}`);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Received SIGINT. Graceful shutdown...');
  
  try {
    if (marketDataService) {
      await marketDataService.stop();
    }
    if (alertService) {
      await alertService.stop();
    }
    
    server.close(() => {
      logger.info('Server closed');
      process.exit(0);
    });
  } catch (error) {
    logger.error('Error during shutdown:', error);
    process.exit(1);
  }
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Start the server
startServer();
