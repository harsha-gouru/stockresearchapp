import Fastify, { FastifyRequest, FastifyReply } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import websocket from '@fastify/websocket';
import dotenv from 'dotenv';

// Import configurations
import { config } from './config/environment.js';
import { connectDatabase } from './config/database.js';
import { connectRedis } from './config/redis.js';
import { setupLogger } from './config/logger.js';

// Import services
import { MarketDataService } from './services/MarketDataService.js';
import { AlertService } from './services/AlertService.js';

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

// Authentication middleware
async function authenticateRequest(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    // TODO: Implement JWT verification
    // For now, just pass through
    return;
  } catch (error) {
    reply.code(401).send({ error: 'Unauthorized' });
    return;
  }
}

// Register API routes
async function registerRoutes() {
  // Health check endpoint
  fastify.get('/health', async (request, reply) => {
    return { 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      framework: 'Fastify'
    };
  });

  // API v1 routes
  fastify.register(async function (fastify) {
    
    // Auth routes (no authentication required)
    fastify.register(async function (fastify) {
      
      fastify.post('/auth/register', async (request, reply) => {
        // TODO: Implement registration
        return { message: 'Registration endpoint - to be implemented' };
      });

      fastify.post('/auth/login', async (request, reply) => {
        // TODO: Implement login with JWT
        return { message: 'Login endpoint - to be implemented' };
      });

      fastify.post('/auth/refresh', async (request, reply) => {
        // TODO: Implement token refresh
        return { message: 'Token refresh endpoint - to be implemented' };
      });
    });

    // Protected routes (add authentication later)
    fastify.register(async function (fastify) {
      // Add authentication hook for protected routes
      // fastify.addHook('preHandler', authenticateRequest);
      
      fastify.get('/users/profile', async (request, reply) => {
        return { message: 'User profile endpoint - to be implemented' };
      });

      fastify.get('/stocks/search', async (request, reply) => {
        const { q } = request.query as { q?: string };
        if (!q) {
          reply.code(400).send({ error: 'Query parameter "q" is required' });
          return;
        }
        
        // TODO: Implement stock search with Yahoo Finance
        return { 
          message: 'Stock search endpoint - to be implemented',
          query: q
        };
      });

      fastify.get('/stocks/:symbol', async (request, reply) => {
        const { symbol } = request.params as { symbol: string };
        
        // TODO: Implement stock details fetch
        return { 
          message: 'Stock details endpoint - to be implemented',
          symbol: symbol.toUpperCase()
        };
      });

      fastify.get('/portfolio', async (request, reply) => {
        // TODO: Implement portfolio fetch
        return { message: 'Portfolio endpoint - to be implemented' };
      });

      fastify.get('/alerts', async (request, reply) => {
        // TODO: Implement alerts fetch
        return { message: 'Alerts endpoint - to be implemented' };
      });

      fastify.post('/alerts', async (request, reply) => {
        // TODO: Implement alert creation
        return { message: 'Alert creation endpoint - to be implemented' };
      });

      fastify.get('/market/indices', async (request, reply) => {
        // TODO: Implement market indices
        return { message: 'Market indices endpoint - to be implemented' };
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
              // TODO: Handle stock price subscriptions
              connection.socket.send(JSON.stringify({
                type: 'subscribed',
                symbols: data.symbols || []
              }));
              break;
              
            case 'unsubscribe':
              // TODO: Handle unsubscriptions
              connection.socket.send(JSON.stringify({
                type: 'unsubscribed',
                symbols: data.symbols || []
              }));
              break;
              
            default:
              connection.socket.send(JSON.stringify({
                type: 'error',
                message: 'Unknown message type'
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
        // TODO: Clean up subscriptions
        fastify.log.info('WebSocket connection closed');
      });

      // Send welcome message
      connection.socket.send(JSON.stringify({
        type: 'welcome',
        message: 'Connected to Fastify stock trading WebSocket',
        timestamp: new Date().toISOString()
      }));
    });
  });
}

// Server startup
async function start() {
  try {
    // Setup logger
    setupLogger();
    
    // Connect to databases
    await connectDatabase();
    await connectRedis();
    
    // Register plugins and routes
    await registerPlugins();
    await registerRoutes();
    
    // Initialize services
    const marketDataService = new MarketDataService();
    const alertService = new AlertService();
    
    // Start the server
    const port = config.server.port;
    const host = config.node.env === 'production' ? '0.0.0.0' : 'localhost';
    
    await fastify.listen({ port, host });
    
    fastify.log.info(`🚀 Fastify server running on http://${host}:${port}`);
    fastify.log.info(`📊 WebSocket endpoint: ws://${host}:${port}/ws`);
    fastify.log.info(`🏥 Health check: http://${host}:${port}/health`);
    fastify.log.info(`⚡ Performance: ~5.6x faster than Express!`);
    
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
