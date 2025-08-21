import bcrypt from 'bcryptjs';
import jwt, { JwtPayload } from 'jsonwebtoken';
import crypto from 'crypto';
import { query } from '../config/database.js';
import { config } from '../config/environment.js';

export interface UserRegistrationData {
  email: string;
  password: string;
  fullName: string;
}

export interface UserLoginData {
  email: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  is_verified: boolean;
  is_premium: boolean;
  avatar_url?: string;
  created_at: Date;
  google_id?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: Omit<User, 'password_hash'>;
}

export interface JWTPayload extends JwtPayload {
  userId: string;
  email: string;
  type: 'access' | 'refresh';
}

export class AuthService {
  
  /**
   * Register a new user with email and password
   */
  static async register(userData: UserRegistrationData): Promise<AuthTokens> {
    const { email, password, fullName } = userData;
    
    // Validate input
    if (!email || !password || !fullName) {
      throw new Error('Email, password, and full name are required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Invalid email format');
    }

    // Validate password strength
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      throw new Error('Password must contain uppercase, lowercase, and number');
    }

    // Check if user already exists
    const existingUser = await query(
      `SELECT id FROM users WHERE email = $1`,
      [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, config.security.bcryptRounds);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    // Create user
    const userResult = await query(
      `INSERT INTO users (
        email, password_hash, full_name, verification_token, 
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, NOW(), NOW())
      RETURNING id, email, full_name, is_verified, is_premium, 
                avatar_url, created_at`,
      [email.toLowerCase(), hashedPassword, fullName, verificationToken]
    );

    const user = userResult.rows[0];

    // Generate tokens
    const tokens = await this.generateTokens(user);

    // TODO: Send verification email
    // await EmailService.sendVerificationEmail(user.email, verificationToken);

    return tokens;
  }

  /**
   * Login user with email and password
   */
  static async login(loginData: UserLoginData): Promise<AuthTokens> {
    const { email, password } = loginData;

    if (!email || !password) {
      throw new Error('Email and password are required');
    }

    // Find user
    const userResult = await query(
      `SELECT * FROM users WHERE email = $1`,
      [email.toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      throw new Error('Invalid email or password');
    }

    const user = userResult.rows[0];

    // Check if user has password (OAuth users might not)
    if (!user.password_hash) {
      throw new Error('Please sign in with Google or reset your password');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Update last login
    await query(
      `UPDATE users SET last_login_at = NOW() WHERE id = $1`,
      [user.id]
    );

    // Remove password from user object
    const { password_hash, verification_token, reset_token, reset_token_expires, ...userWithoutSensitiveData } = user;

    // Generate tokens
    return await this.generateTokens(userWithoutSensitiveData);
  }

  /**
   * Generate JWT access and refresh tokens
   */
  static async generateTokens(user: User): Promise<AuthTokens> {
    const payload = {
      userId: user.id,
      email: user.email,
      type: 'access' as const
    };

    const refreshPayload = {
      userId: user.id,
      email: user.email,
      type: 'refresh' as const
    };

    const accessToken = jwt.sign(
      payload,
      config.jwt.secret as string,
      { expiresIn: config.jwt.expire as string }
    );

    const refreshToken = jwt.sign(
      refreshPayload,
      config.jwt.refreshSecret as string,
      { expiresIn: config.jwt.refreshExpire as string }
    );

    // Store refresh token in database
    await query(
      `UPDATE users SET refresh_token = $1 WHERE id = $2`,
      [refreshToken, user.id]
    );

    return {
      accessToken,
      refreshToken,
      user
    };
  }

  /**
   * Refresh access token using refresh token
   */
  static async refreshAccessToken(refreshToken: string): Promise<AuthTokens> {
    if (!refreshToken) {
      throw new Error('Refresh token is required');
    }

    try {
      // Verify refresh token
      const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as JWTPayload;

      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      // Check if refresh token exists in database
      const userResult = await query(
        `SELECT id, email, full_name, is_verified, is_premium, 
                avatar_url, created_at, google_id
         FROM users 
         WHERE id = $1 AND refresh_token = $2`,
        [decoded.userId, refreshToken]
      );

      if (userResult.rows.length === 0) {
        throw new Error('Invalid refresh token');
      }

      const user = userResult.rows[0];

      // Generate new tokens
      return await this.generateTokens(user);

    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Refresh token expired');
      }
      throw new Error('Invalid refresh token');
    }
  }

  /**
   * Logout user by invalidating refresh token
   */
  static async logout(userId: string): Promise<void> {
    await query(
      `UPDATE users SET refresh_token = NULL WHERE id = $1`,
      [userId]
    );
  }

  /**
   * Request password reset
   */
  static async requestPasswordReset(email: string): Promise<void> {
    const userResult = await query(
      `SELECT id, email FROM users WHERE email = $1`,
      [email.toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      // Don't reveal if email exists or not
      return;
    }

    const user = userResult.rows[0];
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    await query(
      `UPDATE users 
       SET reset_token = $1, reset_token_expires = $2, updated_at = NOW()
       WHERE id = $3`,
      [resetToken, resetExpires, user.id]
    );

    // TODO: Send password reset email
    // await EmailService.sendPasswordResetEmail(user.email, resetToken);
  }

  /**
   * Reset password using reset token
   */
  static async resetPassword(token: string, newPassword: string): Promise<void> {
    if (!token || !newPassword) {
      throw new Error('Token and new password are required');
    }

    // Validate password strength
    if (newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      throw new Error('Password must contain uppercase, lowercase, and number');
    }

    const userResult = await query(
      `SELECT id FROM users 
       WHERE reset_token = $1 AND reset_token_expires > NOW()`,
      [token]
    );

    if (userResult.rows.length === 0) {
      throw new Error('Invalid or expired reset token');
    }

    const user = userResult.rows[0];
    const hashedPassword = await bcrypt.hash(newPassword, config.security.bcryptRounds);

    await query(
      `UPDATE users 
       SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL,
           updated_at = NOW()
       WHERE id = $2`,
      [hashedPassword, user.id]
    );
  }

  /**
   * Verify email using verification token
   */
  static async verifyEmail(token: string): Promise<void> {
    if (!token) {
      throw new Error('Verification token is required');
    }

    const userResult = await query(
      `SELECT id FROM users WHERE verification_token = $1`,
      [token]
    );

    if (userResult.rows.length === 0) {
      throw new Error('Invalid verification token');
    }

    const user = userResult.rows[0];

    await query(
      `UPDATE users 
       SET is_verified = true, verification_token = NULL, updated_at = NOW()
       WHERE id = $1`,
      [user.id]
    );
  }

  /**
   * Resend verification email
   */
  static async resendVerificationEmail(email: string): Promise<void> {
    const userResult = await query(
      `SELECT id, email, is_verified FROM users WHERE email = $1`,
      [email.toLowerCase()]
    );

    if (userResult.rows.length === 0) {
      throw new Error('User not found');
    }

    const user = userResult.rows[0];

    if (user.is_verified) {
      throw new Error('Email is already verified');
    }

    const verificationToken = crypto.randomBytes(32).toString('hex');

    await query(
      `UPDATE users SET verification_token = $1, updated_at = NOW() WHERE id = $2`,
      [verificationToken, user.id]
    );

    // TODO: Send verification email
    // await EmailService.sendVerificationEmail(user.email, verificationToken);
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<User | null> {
    const userResult = await query(
      `SELECT id, email, full_name, is_verified, is_premium, 
              avatar_url, created_at, google_id
       FROM users WHERE id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return null;
    }

    return userResult.rows[0];
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId: string, updates: Partial<Pick<User, 'full_name' | 'avatar_url'>>): Promise<User> {
    const setClauses = [];
    const values = [];
    let paramCount = 1;

    if (updates.full_name !== undefined) {
      setClauses.push(`full_name = $${paramCount++}`);
      values.push(updates.full_name);
    }

    if (updates.avatar_url !== undefined) {
      setClauses.push(`avatar_url = $${paramCount++}`);
      values.push(updates.avatar_url);
    }

    if (setClauses.length === 0) {
      throw new Error('No valid updates provided');
    }

    setClauses.push(`updated_at = NOW()`);
    values.push(userId);

    const userResult = await query(
      `UPDATE users 
       SET ${setClauses.join(', ')}
       WHERE id = $${paramCount}
       RETURNING id, email, full_name, is_verified, is_premium, 
                 avatar_url, created_at, google_id`,
      values
    );

    return userResult.rows[0];
  }

  /**
   * Change password for authenticated user
   */
  static async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    if (!currentPassword || !newPassword) {
      throw new Error('Current password and new password are required');
    }

    // Validate new password
    if (newPassword.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }

    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      throw new Error('Password must contain uppercase, lowercase, and number');
    }

    // Get current user
    const userResult = await query(
      `SELECT password_hash FROM users WHERE id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      throw new Error('User not found');
    }

    const user = userResult.rows[0];

    if (!user.password_hash) {
      throw new Error('Cannot change password for OAuth-only accounts');
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, config.security.bcryptRounds);

    // Update password
    await query(
      `UPDATE users 
       SET password_hash = $1, updated_at = NOW()
       WHERE id = $2`,
      [hashedPassword, userId]
    );
  }
}
