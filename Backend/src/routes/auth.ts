import { Router, Request, Response, NextFunction } from 'express';
import passport from '../config/passport.js';
import { AuthService } from '../services/AuthService.js';
import { authMiddleware } from '../middleware/auth.js';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    isVerified: boolean;
    isPremium: boolean;
  };
}

const router = Router();

// Local registration
router.post('/register', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password, fullName } = req.body;

    if (!email || !password || !fullName) {
      res.status(400).json({
        error: 'Email, password, and full name are required',
        code: 'VALIDATION_ERROR'
      });
      return;
    }

    const result = await AuthService.register({ email, password, fullName });

    res.status(201).json({
      message: 'Registration successful',
      ...result
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    
    res.status(400).json({
      error: error.message || 'Registration failed',
      code: 'REGISTRATION_ERROR'
    });
  }
});

// Local login
router.post('/login', async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        error: 'Email and password are required',
        code: 'VALIDATION_ERROR'
      });
      return;
    }

    const result = await AuthService.login({ email, password });

    res.json({
      message: 'Login successful',
      ...result
    });
  } catch (error: any) {
    console.error('Login error:', error);
    
    res.status(401).json({
      error: error.message || 'Login failed',
      code: 'LOGIN_ERROR'
    });
  }
});

// Logout
router.post('/logout', authMiddleware, async (req: any, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    
    if (userId) {
      await AuthService.logout(userId);
    }

    res.json({
      message: 'Logout successful'
    });
  } catch (error: any) {
    console.error('Logout error:', error);
    res.status(500).json({
      error: 'Logout failed',
      code: 'LOGOUT_ERROR'
    });
  }
});

// Refresh token
router.post('/refresh', async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({
        error: 'Refresh token is required',
        code: 'VALIDATION_ERROR'
      });
      return;
    }

    const result = await AuthService.refreshAccessToken(refreshToken);

    res.json({
      message: 'Token refreshed successfully',
      ...result
    });
  } catch (error: any) {
    console.error('Token refresh error:', error);
    
    res.status(401).json({
      error: error.message || 'Token refresh failed',
      code: 'TOKEN_REFRESH_ERROR'
    });
  }
});

// Forgot password
router.post('/forgot-password', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        error: 'Email is required',
        code: 'VALIDATION_ERROR'
      });
      return;
    }

    await AuthService.requestPasswordReset(email);

    res.json({
      message: 'If an account with that email exists, a password reset link has been sent'
    });
  } catch (error: any) {
    console.error('Password reset request error:', error);
    
    res.status(500).json({
      error: 'Password reset request failed',
      code: 'PASSWORD_RESET_ERROR'
    });
  }
});

// Reset password
router.post('/reset-password', async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      res.status(400).json({
        error: 'Token and new password are required',
        code: 'VALIDATION_ERROR'
      });
      return;
    }

    await AuthService.resetPassword(token, password);

    res.json({
      message: 'Password reset successful'
    });
  } catch (error: any) {
    console.error('Password reset error:', error);
    
    res.status(400).json({
      error: error.message || 'Password reset failed',
      code: 'PASSWORD_RESET_ERROR'
    });
  }
});

// Verify email
router.post('/verify-email', async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;

    if (!token) {
      res.status(400).json({
        error: 'Verification token is required',
        code: 'VALIDATION_ERROR'
      });
      return;
    }

    await AuthService.verifyEmail(token);

    res.json({
      message: 'Email verified successfully'
    });
  } catch (error: any) {
    console.error('Email verification error:', error);
    
    res.status(400).json({
      error: error.message || 'Email verification failed',
      code: 'EMAIL_VERIFICATION_ERROR'
    });
  }
});

// Resend verification email
router.post('/resend-verification', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        error: 'Email is required',
        code: 'VALIDATION_ERROR'
      });
      return;
    }

    await AuthService.resendVerificationEmail(email);

    res.json({
      message: 'Verification email sent'
    });
  } catch (error: any) {
    console.error('Resend verification error:', error);
    
    res.status(400).json({
      error: error.message || 'Failed to send verification email',
      code: 'EMAIL_SEND_ERROR'
    });
  }
});

// Get current user
router.get('/me', authMiddleware, async (req: any, res: Response): Promise<void> => {
  try {
    const user = req.user;
    
    res.json({
      user
    });
  } catch (error: any) {
    console.error('Get user error:', error);
    
    res.status(500).json({
      error: 'Failed to get user information',
      code: 'USER_FETCH_ERROR'
    });
  }
});

// Google OAuth routes
router.get('/google', 
  passport.authenticate('google', { 
    scope: ['profile', 'email'] 
  })
);

router.get('/google/callback',
  passport.authenticate('google', { 
    session: false,
    failureRedirect: '/login?error=oauth_failed' 
  }),
  async (req: Request, res: Response) => {
    try {
      const user = req.user as any;
      
      // Generate tokens for OAuth user
      const tokens = await AuthService.generateTokens(user);
      
      // Redirect to frontend with tokens
      const redirectUrl = new URL('/oauth/callback', process.env.FRONTEND_URL || 'http://localhost:5173');
      redirectUrl.searchParams.set('access_token', tokens.accessToken);
      redirectUrl.searchParams.set('refresh_token', tokens.refreshToken);
      
      res.redirect(redirectUrl.toString());
    } catch (error: any) {
      console.error('OAuth callback error:', error);
      res.redirect('/login?error=oauth_callback_failed');
    }
  }
);

// Change password (for authenticated users)
router.post('/change-password', authMiddleware, async (req: any, res: Response): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.id;

    if (!currentPassword || !newPassword) {
      res.status(400).json({
        error: 'Current password and new password are required',
        code: 'VALIDATION_ERROR'
      });
      return;
    }

    await AuthService.changePassword(userId, currentPassword, newPassword);

    res.json({
      message: 'Password changed successfully'
    });
  } catch (error: any) {
    console.error('Change password error:', error);
    
    res.status(400).json({
      error: error.message || 'Password change failed',
      code: 'PASSWORD_CHANGE_ERROR'
    });
  }
});

export default router;
