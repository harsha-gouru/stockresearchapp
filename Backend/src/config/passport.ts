import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import bcrypt from 'bcryptjs';
import { query } from './database.js';
import { config } from './environment.js';

// User interface for Passport
interface User {
  id: string;
  email: string;
  full_name: string;
  is_verified: boolean;
  is_premium: boolean;
  created_at: Date;
  google_id?: string;
  avatar_url?: string;
}

// Local Strategy (Email/Password)
passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password'
  },
  async (email: string, password: string, done) => {
    try {
      // Find user by email
      const userResult = await query(
        `SELECT * FROM users WHERE email = $1`,
        [email.toLowerCase()]
      );

      if (userResult.rows.length === 0) {
        return done(null, false, { message: 'User not found' });
      }

      const user = userResult.rows[0];

      // Check if user has a password (for OAuth users)
      if (!user.password_hash) {
        return done(null, false, { 
          message: 'Please sign in with Google or reset your password' 
        });
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password_hash);
      
      if (!isValidPassword) {
        return done(null, false, { message: 'Incorrect password' });
      }

      // Return user without password hash
      const { password_hash, ...userWithoutPassword } = user;
      return done(null, userWithoutPassword);

    } catch (error) {
      console.error('Local authentication error:', error);
      return done(error);
    }
  }
));

// Google OAuth Strategy
passport.use(new GoogleStrategy(
  {
    clientID: config.oauth.google.clientId,
    clientSecret: config.oauth.google.clientSecret,
    callbackURL: '/api/auth/google/callback'
  },
  async (accessToken: string, refreshToken: string, profile: any, done) => {
    try {
      // Check if user already exists with this Google ID
      let userResult = await query(
        `SELECT * FROM users WHERE google_id = $1`,
        [profile.id]
      );

      if (userResult.rows.length > 0) {
        // User exists, update their info and return
        const user = userResult.rows[0];
        
        // Update user info from Google profile
        await query(
          `UPDATE users 
           SET full_name = $1, avatar_url = $2, is_verified = true, updated_at = NOW()
           WHERE id = $3`,
          [
            profile.displayName || user.full_name,
            profile.photos?.[0]?.value || user.avatar_url,
            user.id
          ]
        );

        const { password_hash, ...userWithoutPassword } = user;
        return done(null, userWithoutPassword);
      }

      // Check if user exists with same email
      userResult = await query(
        `SELECT * FROM users WHERE email = $1`,
        [profile.emails?.[0]?.value?.toLowerCase()]
      );

      if (userResult.rows.length > 0) {
        // Link Google account to existing user
        const user = userResult.rows[0];
        
        await query(
          `UPDATE users 
           SET google_id = $1, full_name = $2, avatar_url = $3, 
               is_verified = true, updated_at = NOW()
           WHERE id = $4`,
          [
            profile.id,
            profile.displayName || user.full_name,
            profile.photos?.[0]?.value || user.avatar_url,
            user.id
          ]
        );

        const { password_hash, ...userWithoutPassword } = user;
        return done(null, userWithoutPassword);
      }

      // Create new user
      const newUserResult = await query(
        `INSERT INTO users (
          email, full_name, google_id, avatar_url, is_verified, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, true, NOW(), NOW())
        RETURNING *`,
        [
          profile.emails?.[0]?.value?.toLowerCase(),
          profile.displayName,
          profile.id,
          profile.photos?.[0]?.value
        ]
      );

      const newUser = newUserResult.rows[0];
      const { password_hash, ...userWithoutPassword } = newUser;
      return done(null, userWithoutPassword);

    } catch (error) {
      console.error('Google authentication error:', error);
      return done(error);
    }
  }
));

// Serialize user for session
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id: string, done) => {
  try {
    const userResult = await query(
      `SELECT id, email, full_name, is_verified, is_premium, 
              avatar_url, created_at, google_id
       FROM users WHERE id = $1`,
      [id]
    );

    if (userResult.rows.length === 0) {
      return done(null, false);
    }

    const user = userResult.rows[0];
    done(null, user);
  } catch (error) {
    console.error('User deserialization error:', error);
    done(error);
  }
});

export default passport;
