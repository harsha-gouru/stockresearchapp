import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import websocket from '@fastify/websocket';
import dotenv from 'dotenv';

// Import configurations
import { config } from './config/environment.js';

// Load environment variables
dotenv.config();

// Create Fastify instance with simplified logging
const fastify = Fastify({
  logger: config.node.env === 'development'
});

// Global error handler
fastify.setErrorHandler((error, request, reply) => {
  fastify.log.error(error);
  
  // Don't leak error details in production
  if (config.node.env === 'production') {
    reply.status(500).send({ 
      error: 'Internal Server Error',
      statusCode: 500
    });
  } else {
    reply.status(500).send({
      error: error.message,
      statusCode: 500,
      stack: error.stack
    });
  }
});

// Register plugins
async function registerPlugins() {
  // Security middleware
  await fastify.register(helmet, {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"]
      }
    }
  });

  // CORS configuration
  await fastify.register(cors, {
    origin: config.cors.origins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  });

  // Rate limiting
  await fastify.register(rateLimit, {
    max: config.rateLimit.maxRequests,
    timeWindow: config.rateLimit.windowMs,
    keyGenerator: (request: FastifyRequest) => {
      return request.ip;
    }
  });

  // WebSocket support
  await fastify.register(websocket, {
    options: {
      maxPayload: 1048576, // 1MB
      verifyClient: (info: any) => {
        // Add WebSocket authentication logic here
        return true;
      }
    }
  });
}

// Register API routes
async function registerRoutes() {
  // Health check endpoint
  fastify.get('/health', async (request, reply) => {
    return { 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      framework: 'Fastify',
      performance: '5.6x faster than Express',
      uptime: process.uptime()
    };
  });

  // Performance comparison endpoint
  fastify.get('/performance', async (request, reply) => {
    const start = process.hrtime.bigint();
    
    // Simulate some work
    const data = {
      framework: 'Fastify',
      benchmark: {
        'express': '20,309 req/sec',
        'fastify': '114,195 req/sec',
        'improvement': '5.6x faster'
      },
      features: [
        'Native TypeScript support',
        'Built-in JSON schema validation',
        'Automatic async error handling',
        'Plugin system with proper encapsulation',
        'WebSocket support'
      ],
      memory: {
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB'
      }
    };
    
    const end = process.hrtime.bigint();
    const duration = Number(end - start) / 1000000; // Convert to milliseconds
    
    return {
      ...data,
      responseTime: `${duration.toFixed(3)}ms`,
      pid: process.pid
    };
  });

  // API v1 routes
  fastify.register(async function (fastify) {
    
    // Auth routes (no authentication required)
    fastify.register(async function (fastify) {
      
      fastify.post('/auth/register', async (request, reply) => {
        return { 
          message: 'Registration endpoint - ready for implementation',
          features: ['JWT with refresh tokens', 'Google OAuth', 'Apple Sign-In', 'Password hashing with bcrypt']
        };
      });

      fastify.post('/auth/login', async (request, reply) => {
        return { 
          message: 'Login endpoint - ready for implementation',
          security: ['Rate limiting active', 'Helmet security headers', 'CORS configured']
        };
      });

      fastify.post('/auth/refresh', async (request, reply) => {
        return { 
          message: 'Token refresh endpoint - ready for implementation',
          pattern: 'Refresh token rotation for enhanced security'
        };
      });
    });

    // Stock data routes
    fastify.register(async function (fastify) {
      
      fastify.get('/stocks/search', async (request, reply) => {
        const { q } = request.query as { q?: string };
        if (!q) {
          reply.code(400).send({ error: 'Query parameter "q" is required' });
          return;
        }
        
        return { 
          message: 'Stock search endpoint - ready for Yahoo Finance integration',
          query: q.toUpperCase(),
          provider: 'Yahoo Finance API (free)',
          features: ['Real-time quotes', 'Historical data', 'Company fundamentals']
        };
      });

      fastify.get('/stocks/:symbol', async (request, reply) => {
        const { symbol } = request.params as { symbol: string };
        
        return { 
          message: 'Stock details endpoint - ready for implementation',
          symbol: symbol.toUpperCase(),
          dataPoints: ['Current price', 'Daily change', 'Volume', 'Market cap', 'P/E ratio']
        };
      });

      fastify.get('/stocks/:symbol/chart', async (request, reply) => {
        const { symbol } = request.params as { symbol: string };
        const { range = '1D' } = request.query as { range?: string };
        
        return {
          message: 'Chart data endpoint - ready for implementation',
          symbol: symbol.toUpperCase(),
          range,
          cachingStrategy: 'Redis with TTL based on timeframe'
        };
      });
    });

    // Portfolio routes
    fastify.register(async function (fastify) {
      
      fastify.get('/portfolio', async (request, reply) => {
        return { 
          message: 'Portfolio endpoint - ready for implementation',
          calculations: ['Real-time valuation', 'P&L tracking', 'Performance metrics'],
          database: 'PostgreSQL with TimescaleDB for time-series data'
        };
      });

      fastify.post('/portfolio/holdings', async (request, reply) => {
        return {
          message: 'Add holding endpoint - ready for implementation',
          features: ['Transaction recording', 'Cost basis calculation', 'Real-time updates']
        };
      });
    });

    // Alert routes
    fastify.register(async function (fastify) {
      
      fastify.get('/alerts', async (request, reply) => {
        return { 
          message: 'Alerts endpoint - ready for BullMQ implementation',
          types: ['Price above/below', 'Percent change', 'Volume spike', 'Technical indicators']
        };
      });

      fastify.post('/alerts', async (request, reply) => {
        return { 
          message: 'Alert creation endpoint - ready for implementation',
          processing: 'BullMQ background jobs for monitoring',
          notifications: ['Push (OneSignal)', 'Email (SendGrid)', 'SMS (Twilio)']
        };
      });
    });

    // Market data routes
    fastify.register(async function (fastify) {
      
      fastify.get('/market/indices', async (request, reply) => {
        return { 
          message: 'Market indices endpoint - ready for implementation',
          indices: ['S&P 500', 'NASDAQ', 'DOW'],
          updateFrequency: 'Real-time via WebSocket'
        };
      });

      fastify.get('/market/movers', async (request, reply) => {
        const { type = 'gainers' } = request.query as { type?: string };
        
        return {
          message: 'Market movers endpoint - ready for implementation',
          type,
          categories: ['gainers', 'losers', 'most_active'],
          caching: 'Redis with 1-minute TTL'
        };
      });
    });

  }, { prefix: '/api/v1' });

  // WebSocket route for real-time updates
  fastify.register(async function (fastify) {
    fastify.get('/ws', { websocket: true }, (connection, req) => {
      connection.socket.on('message', (message: any) => {
        try {
          const data = JSON.parse(message.toString());
          
          // Handle different message types
          switch (data.type) {
            case 'subscribe':
              connection.socket.send(JSON.stringify({
                type: 'subscribed',
                symbols: data.symbols || [],
                message: 'Ready for real-time price updates',
                implementation: 'Redis pub/sub + WebSocket broadcasting'
              }));
              break;
              
            case 'unsubscribe':
              connection.socket.send(JSON.stringify({
                type: 'unsubscribed',
                symbols: data.symbols || [],
                message: 'Unsubscribed from price updates'
              }));
              break;
              
            case 'ping':
              connection.socket.send(JSON.stringify({
                type: 'pong',
                timestamp: new Date().toISOString(),
                latency: 'Sub-50ms expected'
              }));
              break;
              
            default:
              connection.socket.send(JSON.stringify({
                type: 'error',
                message: 'Unknown message type',
                supportedTypes: ['subscribe', 'unsubscribe', 'ping']
              }));
          }
        } catch (error) {
          connection.socket.send(JSON.stringify({
            type: 'error',
            message: 'Invalid JSON message'
          }));
        }
      });

      connection.socket.on('close', () => {
        fastify.log.info('WebSocket connection closed');
      });

      // Send welcome message
      connection.socket.send(JSON.stringify({
        type: 'welcome',
        message: 'Connected to Fastify stock trading WebSocket',
        timestamp: new Date().toISOString(),
        performance: '5.6x faster than Express WebSocket',
        features: ['Real-time price updates', 'Portfolio streaming', 'Alert notifications']
      }));
    });
  });
}

// Server startup
async function start() {
  try {
    fastify.log.info('🚀 Starting Fastify server...');
    
    // Skip database connections for demo
    fastify.log.info('📊 Skipping database connections for performance demo');
    
    // Register plugins and routes
    await registerPlugins();
    await registerRoutes();
    
    // Start the server
    const port = config.server.port;
    const host = config.node.env === 'production' ? '0.0.0.0' : 'localhost';
    
    await fastify.listen({ port, host });
    
    fastify.log.info(`🚀 Fastify server running on http://${host}:${port}`);
    fastify.log.info(`📊 WebSocket endpoint: ws://${host}:${port}/ws`);
    fastify.log.info(`🏥 Health check: http://${host}:${port}/health`);
    fastify.log.info(`⚡ Performance demo: http://${host}:${port}/performance`);
    fastify.log.info(`🎯 API endpoints: http://${host}:${port}/api/v1/`);
    fastify.log.info(`⚡ Performance: ~5.6x faster than Express!`);
    fastify.log.info(`🔥 Features: Native TypeScript, JSON validation, WebSocket support`);
    
  } catch (error) {
    fastify.log.error('Error starting server:');
    fastify.log.error(error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  fastify.log.info('Received SIGINT, shutting down gracefully...');
  await fastify.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  fastify.log.info('Received SIGTERM, shutting down gracefully...');
  await fastify.close();
  process.exit(0);
});

// Start the server
start();
