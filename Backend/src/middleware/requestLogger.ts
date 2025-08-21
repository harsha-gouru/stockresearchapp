import { Request, Response, NextFunction } from 'express';
import { getLogger } from '../config/logger.js';

interface RequestWithStartTime extends Request {
  startTime?: number;
}

export function requestLogger(
  req: RequestWithStartTime,
  res: Response,
  next: NextFunction
): void {
  const logger = getLogger();
  
  // Record start time
  req.startTime = Date.now();
  
  // Log request
  logger.info('Request started', {
    method: req.method,
    url: req.url,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    contentType: req.get('Content-Type'),
    contentLength: req.get('Content-Length'),
  });

  // Override res.end to log response
  const originalEnd = res.end;
  res.end = function(this: Response, chunk?: any, encoding?: any, cb?: any): Response {
    const duration = req.startTime ? Date.now() - req.startTime : 0;
    
    // Log response
    logger.info('Request completed', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('Content-Length'),
    });

    // Call original end method
    return originalEnd.call(this, chunk, encoding, cb);
  };

  next();
}

// More detailed logging for development
export function detailedRequestLogger(
  req: RequestWithStartTime,
  res: Response,
  next: NextFunction
): void {
  const logger = getLogger();
  
  req.startTime = Date.now();
  
  logger.debug('Detailed request info', {
    method: req.method,
    url: req.url,
    originalUrl: req.originalUrl,
    path: req.path,
    query: req.query,
    params: req.params,
    headers: req.headers,
    ip: req.ip,
    ips: req.ips,
    protocol: req.protocol,
    secure: req.secure,
    xhr: req.xhr,
  });

  // Log request body for non-GET requests (be careful with sensitive data)
  if (req.method !== 'GET' && req.body) {
    const sanitizedBody = { ...req.body };
    
    // Remove sensitive fields
    delete sanitizedBody.password;
    delete sanitizedBody.confirmPassword;
    delete sanitizedBody.token;
    delete sanitizedBody.refreshToken;
    
    logger.debug('Request body', sanitizedBody);
  }

  const originalEnd = res.end;
  res.end = function(this: Response, chunk?: any, encoding?: any, cb?: any): Response {
    const duration = req.startTime ? Date.now() - req.startTime : 0;
    
    logger.debug('Detailed response info', {
      method: req.method,
      url: req.url,
      statusCode: res.statusCode,
      statusMessage: res.statusMessage,
      duration: `${duration}ms`,
      headers: res.getHeaders(),
    });

    return originalEnd.call(this, chunk, encoding, cb);
  };

  next();
}
