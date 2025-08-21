import winston from 'winston';
import { config } from './environment.js';

let logger: winston.Logger;

export function setupLogger(): winston.Logger {
  const logFormat = winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.json(),
    winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
      let log = `${timestamp} [${level.toUpperCase()}]: ${message}`;
      
      if (Object.keys(meta).length > 0) {
        log += ` ${JSON.stringify(meta)}`;
      }
      
      if (stack) {
        log += `\n${stack}`;
      }
      
      return log;
    })
  );

  const transports: winston.transport[] = [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    })
  ];

  // Add file transport in production
  if (config.node.env === 'production') {
    transports.push(
      new winston.transports.File({
        filename: config.logging.file,
        format: logFormat,
        maxsize: 10 * 1024 * 1024, // 10MB
        maxFiles: 5,
      })
    );
  }

  logger = winston.createLogger({
    level: config.logging.level,
    format: logFormat,
    transports,
    defaultMeta: {
      service: 'stock-app-backend',
      environment: config.node.env,
    },
  });

  // Handle uncaught exceptions and unhandled rejections
  logger.exceptions.handle(
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/exceptions.log' })
  );

  logger.rejections.handle(
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'logs/rejections.log' })
  );

  return logger;
}

export function getLogger(): winston.Logger {
  if (!logger) {
    throw new Error('Logger not initialized. Call setupLogger() first.');
  }
  return logger;
}

// Create directories if they don't exist
if (config.node.env === 'production') {
  import('fs').then(fs => {
    const logDir = 'logs';
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
  });
}
