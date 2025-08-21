import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const config = {
  node: {
    env: process.env.NODE_ENV || 'development',
  },
  server: {
    port: parseInt(process.env.PORT || '3000', 10),
    host: process.env.HOST || 'localhost',
  },
  database: {
    url: process.env.DATABASE_URL || '',
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT || '5432', 10),
    user: process.env.DATABASE_USER || '',
    password: process.env.DATABASE_PASSWORD || '',
    name: process.env.DATABASE_NAME || '',
    ssl: process.env.NODE_ENV === 'production',
    pool: {
      min: 2,
      max: 10,
      acquire: 30000,
      idle: 10000,
    },
  },
  redis: {
    url: process.env.REDIS_URL || 'redis://localhost:6379',
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB || '0', 10),
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-key',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
    expire: process.env.JWT_EXPIRE || '15m',
    refreshExpire: process.env.JWT_REFRESH_EXPIRE || '7d',
  },
  cors: {
    origins: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3001', 'http://localhost:5173'],
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW || '15', 10) * 60 * 1000, // minutes to ms
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880', 10), // 5MB
    path: process.env.UPLOAD_PATH || 'uploads/',
  },
  security: {
    bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),
  },
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    },
    apple: {
      clientId: process.env.APPLE_CLIENT_ID || '',
      keyId: process.env.APPLE_KEY_ID || '',
      teamId: process.env.APPLE_TEAM_ID || '',
      privateKey: process.env.APPLE_PRIVATE_KEY || '',
    },
  },
  session: {
    secret: process.env.SESSION_SECRET || 'fallback-session-secret',
    maxAge: parseInt(process.env.SESSION_MAX_AGE || '86400000', 10), // 24 hours
  },
  apis: {
    alphaVantage: {
      key: process.env.ALPHA_VANTAGE_API_KEY || '',
      baseUrl: 'https://www.alphavantage.co/query',
    },
    polygon: {
      key: process.env.POLYGON_API_KEY || '',
      baseUrl: 'https://api.polygon.io',
    },
    yahoo: {
      key: process.env.YAHOO_FINANCE_API_KEY || '',
      baseUrl: 'https://yfapi.net',
    },
    openai: {
      key: process.env.OPENAI_API_KEY || '',
      baseUrl: 'https://api.openai.com/v1',
    },
  },
  marketData: {
    provider: process.env.MARKET_DATA_PROVIDER || 'polygon',
  },
  notifications: {
    fcm: {
      serverKey: process.env.FCM_SERVER_KEY || '',
    },
    sendgrid: {
      apiKey: process.env.SENDGRID_API_KEY || '',
    },
    twilio: {
      accountSid: process.env.TWILIO_ACCOUNT_SID || '',
      authToken: process.env.TWILIO_AUTH_TOKEN || '',
    },
  },
  email: {
    from: process.env.EMAIL_FROM || 'noreply@stockapp.com',
    replyTo: process.env.EMAIL_REPLY_TO || 'support@stockapp.com',
  },
  websocket: {
    port: parseInt(process.env.WS_PORT || '3001', 10),
  },
  cache: {
    ttl: {
      quotes: parseInt(process.env.CACHE_TTL_QUOTES || '60', 10),
      news: parseInt(process.env.CACHE_TTL_NEWS || '300', 10),
      movers: parseInt(process.env.CACHE_TTL_MOVERS || '300', 10),
      search: parseInt(process.env.CACHE_TTL_SEARCH || '120', 10),
    },
  },
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || 'logs/app.log',
  },
  market: {
    openHour: parseInt(process.env.MARKET_OPEN_HOUR || '9', 10),
    openMinute: parseInt(process.env.MARKET_OPEN_MINUTE || '30', 10),
    closeHour: parseInt(process.env.MARKET_CLOSE_HOUR || '16', 10),
    closeMinute: parseInt(process.env.MARKET_CLOSE_MINUTE || '0', 10),
    timezone: 'America/New_York',
  },
  frontend: {
    url: process.env.FRONTEND_URL || 'http://localhost:5173',
  },
} as const;

// Validate critical environment variables
export function validateConfig() {
  const required = [
    'DATABASE_URL',
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  if (config.node.env === 'production') {
    const productionRequired = [
      'ALPHA_VANTAGE_API_KEY',
      'OPENAI_API_KEY',
    ];

    const missingProduction = productionRequired.filter(key => !process.env[key]);
    
    if (missingProduction.length > 0) {
      console.warn(`⚠️  Missing production environment variables: ${missingProduction.join(', ')}`);
    }
  }
}
