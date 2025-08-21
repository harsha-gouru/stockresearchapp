import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/environment.js';
import { query } from '../config/database.js';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    isVerified: boolean;
    isPremium: boolean;
  };
}

interface JWTPayload {
  userId: string;
  email: string;
  isVerified: boolean;
  isPremium: boolean;
  type: 'access' | 'refresh';
}

export async function authMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ 
        error: 'Access token required',
        code: 'MISSING_TOKEN' 
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    try {
      const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;
      
      if (decoded.type !== 'access') {
        res.status(401).json({ 
          error: 'Invalid token type',
          code: 'INVALID_TOKEN_TYPE' 
        });
        return;
      }

      // Verify user still exists and is active
      const userResult = await query(
        `SELECT id, email, is_verified, is_premium, created_at 
         FROM users 
         WHERE id = $1`,
        [decoded.userId]
      );

      if (userResult.rows.length === 0) {
        res.status(401).json({ 
          error: 'User not found',
          code: 'USER_NOT_FOUND' 
        });
        return;
      }

      const user = userResult.rows[0];
      
      // Attach user info to request
      req.user = {
        id: user.id,
        email: user.email,
        isVerified: user.is_verified,
        isPremium: user.is_premium,
      };

      next();
    } catch (jwtError) {
      if (jwtError instanceof jwt.TokenExpiredError) {
        res.status(401).json({ 
          error: 'Token expired',
          code: 'TOKEN_EXPIRED' 
        });
        return;
      }
      
      if (jwtError instanceof jwt.JsonWebTokenError) {
        res.status(401).json({ 
          error: 'Invalid token',
          code: 'INVALID_TOKEN' 
        });
        return;
      }
      
      throw jwtError;
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      error: 'Authentication failed',
      code: 'AUTH_ERROR' 
    });
  }
}

// Optional auth middleware - doesn't fail if no token provided
export async function optionalAuthMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // No token provided, continue without user
    next();
    return;
  }

  // Token provided, try to authenticate
  await authMiddleware(req, res, next);
}

// Admin middleware - requires user to be premium/admin
export async function adminMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ 
      error: 'Authentication required',
      code: 'AUTH_REQUIRED' 
    });
    return;
  }

  if (!req.user.isPremium) {
    res.status(403).json({ 
      error: 'Premium account required',
      code: 'PREMIUM_REQUIRED' 
    });
    return;
  }

  next();
}

// Verified user middleware - requires email verification
export async function verifiedUserMiddleware(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  if (!req.user) {
    res.status(401).json({ 
      error: 'Authentication required',
      code: 'AUTH_REQUIRED' 
    });
    return;
  }

  if (!req.user.isVerified) {
    res.status(403).json({ 
      error: 'Email verification required',
      code: 'EMAIL_VERIFICATION_REQUIRED' 
    });
    return;
  }

  next();
}

export type { AuthenticatedRequest };
