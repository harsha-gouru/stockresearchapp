// API client for frontend-backend communication
const API_BASE = 'http://localhost:3000';

class ApiClient {
  private getAuthHeaders() {
    const token = localStorage.getItem('accessToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${API_BASE}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Authentication methods
  auth = {
    login: async (email: string, password: string) => {
      const response = await this.request('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      
      if (response.token) {
        localStorage.setItem('accessToken', response.token);
        localStorage.setItem('isAuthenticated', 'true');
      }
      
      return response;
    },

    register: async (userData: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
    }) => {
      const response = await this.request('/api/v1/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      
      if (response.token) {
        localStorage.setItem('accessToken', response.token);
        localStorage.setItem('isAuthenticated', 'true');
      }
      
      return response;
    },

    logout: () => {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('isAuthenticated');
    },

    checkAuth: async () => {
      const token = localStorage.getItem('accessToken');
      if (!token) return false;
      
      try {
        // Simple token validation - try a protected endpoint
        await this.request('/api/v1/portfolio');
        return true;
      } catch {
        this.auth.logout();
        return false;
      }
    }
  };

  // Stock methods
  stocks = {
    search: async (query: string) => {
      return this.request(`/api/v1/stocks/search?q=${encodeURIComponent(query)}`);
    },

    getQuote: async (symbol: string) => {
      return this.request(`/api/v1/stocks/${symbol}`);
    }
  };

  // Portfolio methods
  portfolio = {
    get: async () => {
      return this.request('/api/v1/portfolio');
    }
  };

  // Watchlist methods
  watchlist = {
    get: async () => {
      return this.request('/api/v1/watchlist');
    }
  };

  // Market data
  market = {
    getOverview: async () => {
      return this.request('/api/v1/market/overview');
    }
  };
}

export const api = new ApiClient();
export default api;
