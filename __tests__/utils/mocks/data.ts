// Mock data for testing
export const mockStockData = [
  {
    id: 1,
    ticker: "AAPL",
    name: "Apple Inc.",
    price: 193.42,
    change: 2.34,
    changePercent: 1.23,
    logo: "🍎",
    sparklineData: [
      { value: 100 }, { value: 120 }, { value: 115 }, { value: 134 }, { value: 125 }, { value: 140 }
    ]
  },
  {
    id: 2,
    ticker: "TSLA",
    name: "Tesla, Inc.",
    price: 248.50,
    change: -5.20,
    changePercent: -2.05,
    logo: "🚗",
    sparklineData: [
      { value: 150 }, { value: 140 }, { value: 135 }, { value: 130 }, { value: 125 }, { value: 120 }
    ]
  },
  {
    id: 3,
    ticker: "GOOGL",
    name: "Alphabet Inc.",
    price: 138.21,
    change: 1.87,
    changePercent: 1.37,
    logo: "🔍",
    sparklineData: [
      { value: 110 }, { value: 115 }, { value: 118 }, { value: 122 }, { value: 125 }, { value: 128 }
    ]
  }
]

export const mockUserData = {
  id: 1,
  email: 'test@example.com',
  name: 'Test User',
  avatar: null,
  preferences: {
    notifications: true,
    darkMode: false,
    biometric: true,
    language: 'en',
    currency: 'USD'
  },
  portfolio: {
    totalValue: 25420.50,
    dayChange: 342.10,
    dayChangePercent: 1.36
  }
}

export const mockInsightsData = [
  {
    id: '1',
    type: 'buy_signal',
    title: 'Strong Buy Opportunity',
    description: 'AAPL showing bullish momentum with 94% confidence',
    stock: { ticker: 'AAPL', logo: '🍎' },
    confidence: 94,
    timeframe: '1-2 weeks',
    factors: ['Technical breakout', 'Volume surge', 'Positive earnings'],
    createdAt: '2025-08-20T10:00:00Z'
  },
  {
    id: '2',
    type: 'portfolio_rebalance',
    title: 'Portfolio Rebalancing',
    description: 'Consider rebalancing your tech allocation',
    confidence: 87,
    timeframe: 'This week',
    factors: ['Sector concentration', 'Risk management'],
    createdAt: '2025-08-19T15:30:00Z'
  },
  {
    id: '3',
    type: 'risk_alert',
    title: 'Market Volatility Alert',
    description: 'Increased volatility expected in tech sector',
    confidence: 78,
    timeframe: 'Next 3 days',
    factors: ['Fed announcement', 'Earnings season'],
    createdAt: '2025-08-18T09:15:00Z'
  }
]

export const mockWatchlistData = mockStockData.slice(0, 2)

export const mockAlertsData = [
  {
    id: '1',
    stockTicker: 'AAPL',
    type: 'price_above',
    targetPrice: 200.00,
    currentPrice: 193.42,
    isActive: true,
    createdAt: '2025-08-15T10:00:00Z'
  },
  {
    id: '2',
    stockTicker: 'TSLA',
    type: 'price_below',
    targetPrice: 240.00,
    currentPrice: 248.50,
    isActive: true,
    createdAt: '2025-08-16T14:30:00Z'
  }
]

export const mockNotificationsData = [
  {
    id: '1',
    title: 'Price Alert Triggered',
    message: 'AAPL reached your target price of $195',
    type: 'price_alert',
    isRead: false,
    createdAt: '2025-08-20T09:30:00Z'
  },
  {
    id: '2',
    title: 'New AI Insight',
    message: 'Strong buy signal detected for TSLA',
    type: 'ai_insight',
    isRead: true,
    createdAt: '2025-08-19T16:45:00Z'
  },
  {
    id: '3',
    title: 'Weekly Portfolio Report',
    message: 'Your portfolio gained 2.4% this week',
    type: 'portfolio_update',
    isRead: false,
    createdAt: '2025-08-18T08:00:00Z'
  }
]
