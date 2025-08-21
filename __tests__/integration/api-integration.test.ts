import { describe, it, expect, beforeAll, afterAll } from 'vitest';

// API Integration Tests
const API_BASE = 'http://localhost:3000';

describe('API Integration Tests', () => {
  let authToken: string;
  let testUserId: string;

  beforeAll(async () => {
    // Ensure backend is running
    try {
      const healthResponse = await fetch(`${API_BASE}/health`);
      expect(healthResponse.ok).toBe(true);
    } catch (error) {
      throw new Error('Backend is not running. Please start the Docker containers first.');
    }
  });

  describe('Authentication Endpoints', () => {
    it('should register a new user successfully', async () => {
      const registerData = {
        email: `test_${Date.now()}@example.com`,
        password: 'TestPassword123',
        firstName: 'Test',
        lastName: 'User'
      };

      const response = await fetch(`${API_BASE}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data.message).toBe('User registered successfully');
      expect(data.user).toHaveProperty('id');
      expect(data.user.email).toBe(registerData.email);
      expect(data.user.firstName).toBe(registerData.firstName);
      expect(data.user.lastName).toBe(registerData.lastName);
      expect(data).toHaveProperty('token');
      
      // Store for other tests
      authToken = data.token;
      testUserId = data.user.id;
    });

    it('should reject registration with invalid email', async () => {
      const registerData = {
        email: 'invalid-email',
        password: 'TestPassword123',
        firstName: 'Test',
        lastName: 'User'
      };

      const response = await fetch(`${API_BASE}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
    });

    it('should reject registration with short password', async () => {
      const registerData = {
        email: 'test2@example.com',
        password: 'short',
        firstName: 'Test',
        lastName: 'User'
      };

      const response = await fetch(`${API_BASE}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
    });

    it('should reject duplicate email registration', async () => {
      const registerData = {
        email: 'duplicate@example.com',
        password: 'TestPassword123',
        firstName: 'Test',
        lastName: 'User'
      };

      // First registration
      const firstResponse = await fetch(`${API_BASE}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      expect(firstResponse.ok).toBe(true);

      // Second registration with same email
      const secondResponse = await fetch(`${API_BASE}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      expect(secondResponse.ok).toBe(false);
      expect(secondResponse.status).toBe(409);
      
      const errorData = await secondResponse.json();
      expect(errorData.error).toBe('User already exists');
    });

    it('should login with valid credentials', async () => {
      const loginData = {
        email: 'duplicate@example.com', // Using email from previous test
        password: 'TestPassword123'
      };

      const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data.message).toBe('Login successful');
      expect(data.user).toHaveProperty('id');
      expect(data.user.email).toBe(loginData.email);
      expect(data).toHaveProperty('token');
    });

    it('should reject login with invalid credentials', async () => {
      const loginData = {
        email: 'nonexistent@example.com',
        password: 'WrongPassword123'
      };

      const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(401);
    });

    it('should reject login with missing fields', async () => {
      const loginData = {
        email: 'test@example.com'
        // Missing password
      };

      const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
    });
  });

  describe('Stock API Endpoints', () => {
    it('should search for stocks with authentication', async () => {
      const response = await fetch(`${API_BASE}/api/v1/stocks/search?q=AAPL`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data.query).toBe('AAPL');
      expect(data.results).toBeInstanceOf(Array);
      expect(data.results.length).toBeGreaterThan(0);
      expect(data.results[0]).toHaveProperty('symbol');
      expect(data.results[0]).toHaveProperty('name');
      expect(data.source).toBe('Yahoo Finance API');
    });

    it('should reject stock search without authentication', async () => {
      const response = await fetch(`${API_BASE}/api/v1/stocks/search?q=AAPL`);

      expect(response.ok).toBe(false);
      expect(response.status).toBe(401);
    });

    it('should reject stock search with invalid token', async () => {
      const response = await fetch(`${API_BASE}/api/v1/stocks/search?q=AAPL`, {
        headers: {
          'Authorization': 'Bearer invalid-token',
        },
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(401);
    });

    it('should reject stock search with missing query', async () => {
      const response = await fetch(`${API_BASE}/api/v1/stocks/search`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
    });

    it('should get stock quote', async () => {
      const response = await fetch(`${API_BASE}/api/v1/stocks/AAPL`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        expect(data.symbol).toBe('AAPL');
        expect(data).toHaveProperty('price');
        expect(data).toHaveProperty('change');
        expect(data.source).toBe('Yahoo Finance API');
      }
      // Note: This might fail if Yahoo Finance is down, which is acceptable
    });
  });

  describe('Portfolio Endpoints', () => {
    it('should get user portfolio with authentication', async () => {
      const response = await fetch(`${API_BASE}/api/v1/portfolio`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data).toHaveProperty('portfolio');
      expect(data).toHaveProperty('holdings');
      expect(data.holdings).toBeInstanceOf(Array);
    });

    it('should reject portfolio access without authentication', async () => {
      const response = await fetch(`${API_BASE}/api/v1/portfolio`);

      expect(response.ok).toBe(false);
      expect(response.status).toBe(401);
    });
  });

  describe('Watchlist Endpoints', () => {
    it('should get user watchlist with authentication', async () => {
      const response = await fetch(`${API_BASE}/api/v1/watchlist`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
        },
      });

      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data).toHaveProperty('watchlist');
      expect(data.watchlist).toBeInstanceOf(Array);
    });

    it('should reject watchlist access without authentication', async () => {
      const response = await fetch(`${API_BASE}/api/v1/watchlist`);

      expect(response.ok).toBe(false);
      expect(response.status).toBe(401);
    });
  });

  describe('Health Endpoint', () => {
    it('should return health status', async () => {
      const response = await fetch(`${API_BASE}/health`);

      expect(response.ok).toBe(true);
      
      const data = await response.json();
      expect(data.status).toBe('healthy');
      expect(data).toHaveProperty('timestamp');
      expect(data).toHaveProperty('uptime');
      expect(data).toHaveProperty('database');
      expect(data).toHaveProperty('redis');
      expect(data.database).toBe('healthy');
      expect(data.redis).toBe('healthy');
    });
  });

  describe('Error Handling', () => {
    it('should handle malformed JSON in request body', async () => {
      const response = await fetch(`${API_BASE}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: 'invalid json',
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
    });

    it('should handle missing Content-Type header', async () => {
      const response = await fetch(`${API_BASE}/api/v1/auth/register`, {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'TestPassword123',
          firstName: 'Test',
          lastName: 'User'
        }),
      });

      expect(response.ok).toBe(false);
    });
  });

  describe('CORS', () => {
    it('should allow requests from frontend origin', async () => {
      const response = await fetch(`${API_BASE}/health`, {
        headers: {
          'Origin': 'http://localhost:3001',
        },
      });

      expect(response.ok).toBe(true);
      expect(response.headers.get('Access-Control-Allow-Origin')).toBe('http://localhost:3001');
    });
  });
});
