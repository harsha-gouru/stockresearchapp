import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ArrowLeft, TrendingUp, TrendingDown, Bell, BellOff, MoreVertical, 
         RefreshCw, Target, ChevronUp, ChevronDown, ExternalLink, 
         Calendar, Users, Zap, BarChart3, Bookmark, BookmarkCheck, Share, 
         ShoppingCart, Eye, AlertCircle, Cpu } from "lucide-react";
import QuickAlertSetup from "./QuickAlertSetup";
import StockAlertsPanel from "./StockAlertsPanel";

// API Configuration
const API_BASE_URL = "http://localhost:3000";

// Stock Data Interface
interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  dayRange: string;
  yearRange: string;
  logo: string;
}

// Helper function to get stock logo
const getStockLogo = (symbol: string): string => {
  const logos: { [key: string]: string } = {
    'AAPL': '🍎',
    'TSLA': '🚗',
    'MSFT': '💻',
    'GOOGL': '🔍',
    'AMZN': '📦',
    'META': '👥',
    'NVDA': '🎮',
    'NFLX': '🎬'
  };
  return logos[symbol] || '📈';
};

// Helper function to generate chart data
const generateChartData = (basePrice: number) => {
  const data = [];
  const timeLabels = [];
  let currentPrice = basePrice;
  
  // Generate 24 hours of hourly data
  for (let i = 0; i < 24; i++) {
    const variation = (Math.random() - 0.5) * (basePrice * 0.02); // 2% max variation
    currentPrice += variation;
    data.push(currentPrice);
    
    const hour = (new Date().getHours() - (24 - i)) % 24;
    timeLabels.push(`${hour.toString().padStart(2, '0')}:00`);
  }
  
  return {
    labels: timeLabels,
    datasets: [{
      data: data,
      borderColor: data[data.length - 1] > data[0] ? '#22c55e' : '#ef4444',
      backgroundColor: 'transparent',
      tension: 0.4
    }]
  };
};

import { useState, useEffect } from "react";
import { ArrowLeft, TrendingUp, TrendingDown, Eye, Bell, RefreshCw, Star, Share2, MoreVertical, Bookmark, ChevronUp, ChevronDown } from "lucide-react";
import { ResponsiveContainer, XAxis, YAxis, AreaChart, Area, CartesianGrid, Tooltip } from "recharts";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import StockAlertsPanel from "./StockAlertsPanel";
import QuickAlertSetup from "./QuickAlertSetup";

// Stock logo mapping
const getStockLogo = (symbol: string) => {
  const logoMap: { [key: string]: string } = {
    'AAPL': '🍎',
    'MSFT': '💻',
    'GOOGL': '🔍',
    'AMZN': '📦',
    'TSLA': '🚗',
    'META': '📘',
    'NVDA': '🎯',
    'NFLX': '🎬',
    'DIS': '🏰',
    'JPM': '🏦',
    'JNJ': '💊',
    'V': '💳'
  };
  return logoMap[symbol] || '📈';
};

// Interface for stock data
interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: number;
  dayRange: string;
  yearRange: string;
  logo: string;
}

// Generate mock chart data based on current price
const generateChartData = (currentPrice: number) => {
  const priceVariation = currentPrice * 0.05; // 5% variation
  
  return {
    "1D": Array.from({ length: 8 }, (_, i) => ({
      time: `${9 + i}:${i % 2 === 0 ? '30' : '00'}`,
      price: currentPrice + (Math.random() - 0.5) * priceVariation
    })),
    "1W": ["Mon", "Tue", "Wed", "Thu", "Fri"].map(day => ({
      time: day,
      price: currentPrice + (Math.random() - 0.5) * priceVariation
    })),
    "1M": Array.from({ length: 4 }, (_, i) => ({
      time: `Week ${i + 1}`,
      price: currentPrice + (Math.random() - 0.5) * priceVariation * 2
    })),
    "3M": ["Nov", "Dec", "Jan"].map(month => ({
      time: month,
      price: currentPrice + (Math.random() - 0.5) * priceVariation * 3
    })),
    "1Y": ["Q1", "Q2", "Q3", "Q4"].map(quarter => ({
      time: quarter,
      price: currentPrice + (Math.random() - 0.5) * priceVariation * 4
    }))
  };
};

const newsItems = [
  {
    id: 1,
    title: "Apple Reports Strong Q4 Earnings",
    sentiment: "positive",
    source: "Bloomberg",
    time: "2h ago"
  },
  {
    id: 2,
    title: "iPhone Sales Beat Expectations", 
    sentiment: "positive",
    source: "Reuters",
    time: "4h ago"
  },
  {
    id: 3,
    title: "Supply Chain Concerns Rising",
    sentiment: "negative", 
    source: "WSJ",
    time: "6h ago"
  }
];

interface StockAnalysisProps {
  onBack?: () => void;
  onViewDetailedAnalysis?: () => void;
  symbol?: string; // Add symbol prop to specify which stock to display
}

export default function StockAnalysis({ onBack, onViewDetailedAnalysis, symbol = "AAPL" }: StockAnalysisProps) {
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [chartData, setChartData] = useState<any>({});
  const [selectedTimeRange, setSelectedTimeRange] = useState<string>("1D");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showQuickAlertSetup, setShowQuickAlertSetup] = useState(false);
  const [isWatchlisted, setIsWatchlisted] = useState(false);
  const [showMoreMenu, setShowMoreMenu] = useState(false);

  // Fetch stock data from API
  useEffect(() => {
    const fetchStockData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`${API_BASE_URL}/api/v1/stocks/${symbol}`);
        if (response.ok) {
          const data = await response.json();
          const stock = data.stock;
          
          const stockInfo: StockData = {
            symbol: stock.symbol,
            name: stock.name,
            price: stock.price,
            change: stock.change,
            changePercent: stock.changePercent,
            volume: stock.volume || 0,
            marketCap: stock.marketCap || 0,
            dayRange: stock.dayRange || `${(stock.price * 0.98).toFixed(2)} - ${(stock.price * 1.02).toFixed(2)}`,
            yearRange: stock.yearRange || `${(stock.price * 0.75).toFixed(2)} - ${(stock.price * 1.45).toFixed(2)}`,
            logo: getStockLogo(stock.symbol)
          };
          
          setStockData(stockInfo);
          setChartData(generateChartData(stock.price));
        }
      } catch (error) {
        console.error('Error fetching stock data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStockData();
  }, [symbol]);

  // Generate quick stats from real data
  const quickStats = stockData ? [
    { 
      label: "Volume", 
      value: stockData.volume > 0 
        ? `${(stockData.volume / 1000000).toFixed(1)}M` 
        : "N/A"
    },
    { 
      label: "Market Cap", 
      value: stockData.marketCap > 0 
        ? `$${(stockData.marketCap / 1000000000000).toFixed(2)}T` 
        : "N/A"
    },
    { label: "P/E Ratio", value: "N/A" }, // Would need additional API data
    { label: "52W Range", value: stockData.yearRange }
  ] : [];

  const timeRanges = ["1D", "1W", "1M", "3M", "1Y"];

  if (isLoading || !stockData) {
    return (
      <div className="relative h-full w-full bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">Loading {symbol} data...</p>
        </div>
      </div>
    );
  }

  // Close dropdown when clicking outside
  const handleCloseDropdowns = () => {
    setShowMoreMenu(false);
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const aiPrediction = "Bullish";
  const confidenceScore = 87;

  return (
    <div className="relative h-full w-full bg-background flex flex-col" onClick={handleCloseDropdowns}>
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        {/* Enhanced Header */}
        <header className="bg-gradient-to-b from-background to-background/95 backdrop-blur-sm sticky top-0 z-10 border-b border-border/50">
          <div className="px-4 pt-12 pb-4">
            {/* Top Navigation Bar */}
            <div className="flex items-center justify-between mb-4">
              <button 
                onClick={onBack} 
                className="group flex items-center gap-2 p-2 hover:bg-muted/50 rounded-full transition-all duration-200 active:scale-95"
              >
                <ArrowLeft className="h-5 w-5 text-foreground group-hover:-translate-x-0.5 transition-transform" />
              </button>
              
              {/* Stock Info Center */}
              <div className="flex items-center gap-3">
                <div className="text-2xl">{stockData.logo}</div>
                <div className="text-center">
                  <div className="flex items-center gap-2">
                    <h1 className="text-lg font-bold text-foreground">{stockData.symbol}</h1>
                    <Badge className="text-[10px] px-1.5 py-0 bg-green-100 text-green-700 border-0">
                      {stockData.changePercent > 0 ? <ChevronUp className="h-3 w-3 inline" /> : <ChevronDown className="h-3 w-3 inline" />}
                      {Math.abs(stockData.changePercent)}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{stockData.name}</p>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsWatchlisted(!isWatchlisted)}
                  className={`p-2 rounded-full transition-all duration-200 active:scale-95 ${
                    isWatchlisted ? 'bg-yellow-100 text-yellow-600' : 'hover:bg-muted/50 text-muted-foreground'
                  }`}
                >
                  <Star className={`h-4 w-4 ${isWatchlisted ? 'fill-current' : ''}`} />
                </button>
                <button 
                  onClick={handleRefresh}
                  className="p-2 hover:bg-muted/50 rounded-full transition-all duration-200 active:scale-95"
                >
                  <RefreshCw className={`h-4 w-4 text-muted-foreground ${isRefreshing ? 'animate-spin' : ''}`} />
                </button>
                <div className="relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMoreMenu(!showMoreMenu);
                    }}
                    className="p-2 hover:bg-muted/50 rounded-full transition-all duration-200 active:scale-95"
                  >
                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                  </button>
                  {showMoreMenu && (
                    <div 
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl py-1 z-50 overflow-hidden"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button 
                        onClick={() => {
                          console.log('Share');
                          setShowMoreMenu(false);
                        }}
                        className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 transition-all duration-150"
                      >
                        <Share2 className="h-4 w-4 text-gray-500 dark:text-gray-400" /> 
                        <span className="font-medium text-gray-700 dark:text-gray-200">Share</span>
                      </button>
                      <button 
                        onClick={() => {
                          setShowQuickAlertSetup(true);
                          setShowMoreMenu(false);
                        }}
                        className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 transition-all duration-150"
                      >
                        <Bell className="h-4 w-4 text-gray-500 dark:text-gray-400" /> 
                        <span className="font-medium text-gray-700 dark:text-gray-200">Set Alert</span>
                      </button>
                      <button 
                        onClick={() => {
                          console.log('Save Analysis');
                          setShowMoreMenu(false);
                        }}
                        className="w-full px-4 py-3 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center gap-3 transition-all duration-150"
                      >
                        <Bookmark className="h-4 w-4 text-gray-500 dark:text-gray-400" /> 
                        <span className="font-medium text-gray-700 dark:text-gray-200">Save Analysis</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Price Display */}
            <div className="flex items-center justify-between px-2">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-foreground">${stockData.price}</span>
                  <div className={`flex items-center gap-1 text-sm ${stockData.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {stockData.change >= 0 ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3" />
                    )}
                    <span>
                      {stockData.change > 0 ? '+' : ''}${stockData.change}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">Last updated: Just now</p>
              </div>
              
              {/* Quick Stats */}
              <div className="flex gap-4">
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Volume</p>
                  <p className="text-sm font-medium text-foreground">52.3M</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Mkt Cap</p>
                  <p className="text-sm font-medium text-foreground">$3.01T</p>
                </div>
              </div>
            </div>
          </div>
        </header>

      {/* Price Chart - Increased gap with mt-12 instead of mb-8 */}
      <div className="px-6 mt-12 mb-8">
        <Card className="p-6 border border-border bg-card shadow-lg">
          <div className="mb-6">
            <div className="flex gap-2 overflow-x-auto">
              {timeRanges.map((range) => (
                <button
                  key={range}
                  onClick={() => setSelectedTimeRange(range)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex-shrink-0 ${
                    selectedTimeRange === range
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-md'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
          
          {/* Enhanced chart with gradient background and better styling */}
          <div className="h-64 relative rounded-xl bg-gradient-to-br from-gray-50/50 to-gray-100/50 p-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData[selectedTimeRange]} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#16a34a" stopOpacity={0.4}/>
                    <stop offset="100%" stopColor="#16a34a" stopOpacity={0.1}/>
                  </linearGradient>
                  <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#16a34a" floodOpacity="0.3"/>
                  </filter>
                </defs>
                
                {/* Subtle grid lines */}
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="#e5e7eb" 
                  strokeOpacity={0.3}
                  horizontal={true}
                  vertical={false}
                />
                
                <XAxis 
                  dataKey="time" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 500 }}
                  tickMargin={12}
                />
                <YAxis 
                  domain={['dataMin - 2', 'dataMax + 2']}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: '#6b7280', fontWeight: 500 }}
                  tickMargin={8}
                  tickFormatter={(value) => `$${value.toFixed(2)}`}
                />
                
                {/* Custom tooltip */}
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                  formatter={(value: any) => [`$${value}`, 'Price']}
                  labelStyle={{ color: '#6b7280', fontWeight: '500' }}
                />
                
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#16a34a"
                  strokeWidth={3}
                  fill="url(#priceGradient)"
                  dot={false}
                  activeDot={{ 
                    r: 6, 
                    fill: '#16a34a', 
                    stroke: '#ffffff', 
                    strokeWidth: 3, 
                    filter: 'url(#shadow)' 
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
            
            {/* Price change indicator overlay */}
            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 shadow-sm">
              <div className={`flex items-center gap-1 text-sm font-medium ${
                stockData.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {stockData.change >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span>{stockData.changePercent}%</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Stock Alerts Panel */}
      <div className="px-6 mb-8">
        <StockAlertsPanel 
          stock={{
            ticker: stockData.symbol,
            name: stockData.name,
            price: stockData.price,
            change: stockData.change,
            changePercent: stockData.changePercent,
            logo: stockData.logo
          }}
          onCreateAlert={() => setShowQuickAlertSetup(true)}
          onManageAlerts={() => console.log('Manage alerts')}
        />
      </div>

      {/* AI Insights Card */}
      <div className="px-6 mb-8">
        <Card className="p-6 border border-border bg-card">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg text-foreground">AI Insights</h3>
              <Badge 
                variant="outline" 
                className={`${
                  aiPrediction === 'Bullish' ? 'text-green-600 border-green-600' : 
                  aiPrediction === 'Bearish' ? 'text-red-600 border-red-600' : 
                  'text-yellow-600 border-yellow-600'
                }`}
              >
                {aiPrediction}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Confidence Score</span>
                <span className="text-sm text-foreground">{confidenceScore}%</span>
              </div>
              <Progress value={confidenceScore} className="h-2" />
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Key Factors:</p>
              <ul className="space-y-1 text-sm text-foreground">
                <li>• Strong quarterly earnings growth</li>
                <li>• Positive analyst sentiment</li>
                <li>• Technical indicators show upward momentum</li>
              </ul>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={onViewDetailedAnalysis}
            >
              View Detailed Analysis
            </Button>
          </div>
        </Card>
      </div>

      {/* Quick Stats Grid */}
      <div className="px-6 mb-8">
        <h3 className="text-lg text-foreground mb-4">Quick Stats</h3>
        <div className="grid grid-cols-2 gap-4">
          {quickStats.map((stat, index) => (
            <Card key={index} className="p-4 border border-border bg-card">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-foreground">{stat.value}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* News Sentiment */}
      <div className="px-6 mb-8">
        <h3 className="text-lg text-foreground mb-4">News Sentiment</h3>
        <div className="space-y-3">
          {newsItems.map((news) => (
            <Card key={news.id} className="p-4 border border-border bg-card">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h4 className="text-sm text-foreground pr-2">{news.title}</h4>
                  <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                    news.sentiment === 'positive' ? 'bg-green-500' : 
                    news.sentiment === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                  }`} />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{news.source}</span>
                  <span>•</span>
                  <span>{news.time}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      </div>

      {/* Bottom Action Buttons - Fixed at bottom */}
      <div className="flex-shrink-0 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg p-6">
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Add to Watchlist
          </Button>
          <Button 
            className="flex-1 flex items-center gap-2 bg-foreground text-background hover:bg-foreground/90"
            onClick={() => setShowQuickAlertSetup(true)}
          >
            <Bell className="h-4 w-4" />
            Set Alert
          </Button>
        </div>
      </div>

      {/* Quick Alert Setup Modal */}
      {showQuickAlertSetup && (
        <QuickAlertSetup
          stock={{
            ticker: stockData.symbol,
            name: stockData.name,
            price: stockData.price,
            changePercent: stockData.changePercent,
            logo: stockData.logo
          }}
          onClose={() => setShowQuickAlertSetup(false)}
          onCreateAlert={(alert) => {
            console.log('Alert created:', alert);
            // Here you would typically save the alert to your state/backend
          }}
        />
      )}
    </div>
  );
}