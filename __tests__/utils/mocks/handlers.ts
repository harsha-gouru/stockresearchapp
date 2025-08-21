import { http, HttpResponse } from 'msw'

// Mock stock data
const mockStocks = [
  {
    id: 1,
    ticker: "AAPL",
    name: "Apple Inc.",
    price: 193.42,
    change: 2.34,
    changePercent: 1.23,
    logo: "🍎"
  },
  {
    id: 2,
    ticker: "TSLA",
    name: "Tesla, Inc.",
    price: 248.50,
    change: -5.20,
    changePercent: -2.05,
    logo: "🚗"
  },
  {
    id: 3,
    ticker: "GOOGL",
    name: "Alphabet Inc.",
    price: 138.21,
    change: 1.87,
    changePercent: 1.37,
    logo: "🔍"
  }
]

// Mock AI insights data
const mockInsights = [
  {
    id: '1',
    type: 'buy_signal',
    title: 'Strong Buy Opportunity',
    description: 'AAPL showing bullish momentum with 94% confidence',
    stock: { ticker: 'AAPL', logo: '🍎' },
    confidence: 94,
    timeframe: '1-2 weeks',
    factors: ['Technical breakout', 'Volume surge', 'Positive earnings']
  },
  {
    id: '2',
    type: 'portfolio_rebalance',
    title: 'Portfolio Rebalancing',
    description: 'Consider rebalancing your tech allocation',
    confidence: 87,
    timeframe: 'This week',
    factors: ['Sector concentration', 'Risk management']
  }
]

export const handlers = [
  // Authentication endpoints
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as { email: string; password: string }
    
    if (body.email === 'test@example.com' && body.password === 'password123') {
      return HttpResponse.json({
        success: true,
        user: {
          id: 1,
          email: 'test@example.com',
          name: 'Test User'
        },
        token: 'mock-jwt-token'
      })
    }
    
    return HttpResponse.json(
      { success: false, message: 'Invalid credentials' },
      { status: 401 }
    )
  }),

  http.post('/api/auth/register', async ({ request }) => {
    const body = await request.json() as { email: string; password: string; name: string }
    
    return HttpResponse.json({
      success: true,
      user: {
        id: 2,
        email: body.email,
        name: body.name
      },
      token: 'mock-jwt-token'
    })
  }),

  http.post('/api/auth/forgot-password', async ({ request }) => {
    const body = await request.json() as { email: string }
    
    // Validate email format
    if (!body.email || !/\S+@\S+\.\S+/.test(body.email)) {
      return HttpResponse.json(
        { 
          success: false, 
          message: 'Valid email is required' 
        },
        { status: 400 }
      )
    }
    
    return HttpResponse.json({
      success: true,
      message: 'Password reset email sent'
    })
  }),

  // Stock data endpoints
  http.get('/api/stocks', () => {
    return HttpResponse.json({
      success: true,
      data: mockStocks
    })
  }),

  http.get('/api/stocks/:ticker', ({ params }) => {
    const { ticker } = params
    const stock = mockStocks.find(s => s.ticker === ticker)
    
    if (!stock) {
      return HttpResponse.json(
        { success: false, message: 'Stock not found' },
        { status: 404 }
      )
    }
    
    return HttpResponse.json({
      success: true,
      data: stock
    })
  }),

  // AI insights endpoints
  http.get('/api/ai/insights', () => {
    return HttpResponse.json({
      success: true,
      data: mockInsights
    })
  }),

  http.get('/api/ai/insights/:id', ({ params }) => {
    const { id } = params
    const insight = mockInsights.find(i => i.id === id)
    
    if (!insight) {
      return HttpResponse.json(
        { success: false, message: 'Insight not found' },
        { status: 404 }
      )
    }
    
    return HttpResponse.json({
      success: true,
      data: insight
    })
  }),

  // Watchlist endpoints
  http.get('/api/watchlist', () => {
    return HttpResponse.json({
      success: true,
      data: mockStocks.slice(0, 2) // Return first 2 stocks as watchlist
    })
  }),

  http.post('/api/watchlist', async ({ request }) => {
    const body = await request.json() as { ticker: string }
    
    return HttpResponse.json({
      success: true,
      message: `Added ${body.ticker} to watchlist`
    })
  }),

  http.delete('/api/watchlist/:ticker', ({ params }) => {
    const { ticker } = params
    
    return HttpResponse.json({
      success: true,
      message: `Removed ${ticker} from watchlist`
    })
  }),

  // User profile endpoints
  http.get('/api/users/profile', () => {
    return HttpResponse.json({
      success: true,
      data: {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        avatar: null,
        preferences: {
          notifications: true,
          darkMode: false,
          biometric: true
        }
      }
    })
  }),

  http.put('/api/users/profile', async ({ request }) => {
    const body = await request.json() as any
    
    return HttpResponse.json({
      success: true,
      data: body
    })
  }),

  // Search endpoints
  http.get('/api/stocks/search', ({ request }) => {
    const url = new URL(request.url)
    const query = url.searchParams.get('q')
    
    if (!query) {
      return HttpResponse.json({
        success: true,
        data: []
      })
    }
    
    const filteredStocks = mockStocks.filter(stock => 
      stock.ticker.toLowerCase().includes(query.toLowerCase()) ||
      stock.name.toLowerCase().includes(query.toLowerCase())
    )
    
    return HttpResponse.json({
      success: true,
      data: filteredStocks
    })
  })
]
