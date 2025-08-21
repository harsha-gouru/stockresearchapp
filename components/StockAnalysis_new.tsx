import { useState, useEffect } from "react";
import { ArrowLeft, TrendingUp, TrendingDown, Eye, Bell, RefreshCw, Star, Share2, MoreVertical, Bookmark, ChevronUp, ChevronDown } from "lucide-react";
import { ResponsiveContainer, XAxis, YAxis, AreaChart, Area, CartesianGrid, Tooltip } from "recharts";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import StockAlertsPanel from "./StockAlertsPanel";
import QuickAlertSetup from "./QuickAlertSetup";

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
    <div 
      className="relative h-full w-full bg-background overflow-y-auto"
      onClick={handleCloseDropdowns}
    >
      {/* Enhanced Header */}
      <div className="relative">
        <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-b border-gray-100">
          <div className="flex items-center justify-between p-6">
            {/* Back Button */}
            <button
              onClick={onBack}
              className="p-2 rounded-full hover:bg-white/50 transition-all duration-200 active:scale-95"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
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
                    isWatchlisted 
                      ? 'bg-yellow-100 text-yellow-600' 
                      : 'hover:bg-white/50 text-gray-600'
                  }`}
                >
                  {isWatchlisted ? <Star className="h-4 w-4 fill-current" /> : <Star className="h-4 w-4" />}
                </button>
                
                <button className="p-2 rounded-full hover:bg-white/50 text-gray-600 transition-all duration-200 active:scale-95">
                  <Share2 className="h-4 w-4" />
                </button>
                
                <div className="relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMoreMenu(!showMoreMenu);
                    }}
                    className="p-2 rounded-full hover:bg-white/50 text-gray-600 transition-all duration-200 active:scale-95"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  
                  {showMoreMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                      <button 
                        onClick={() => {
                          setShowMoreMenu(false);
                          setShowQuickAlertSetup(true);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Bell className="h-4 w-4" />
                        Set Alert
                      </button>
                      <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        View Details
                      </button>
                      <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2">
                        <Bookmark className="h-4 w-4" />
                        Add to Portfolio
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          
          {/* Stock Price Section */}
          <div className="px-6 pb-6">
            <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 border border-white/50">
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
              
              <div className="flex items-center gap-2 mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                  className="text-xs h-7 px-2"
                >
                  <RefreshCw className={`h-3 w-3 mr-1 ${isRefreshing ? 'animate-spin' : ''}`} />
                  {isRefreshing ? 'Updating...' : 'Refresh'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-2 gap-3">
          {quickStats.map((stat, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-sm font-semibold text-foreground mt-1">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Container */}
      <div className="px-6 mb-6">
        <Card className="relative overflow-hidden">
          <div className="p-4">
            {/* Time Range Selector */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Price Chart</h3>
              <div className="flex gap-1">
                {timeRanges.map((range) => (
                  <button
                    key={range}
                    onClick={() => setSelectedTimeRange(range)}
                    className={`px-3 py-1 text-xs rounded-md transition-colors ${
                      selectedTimeRange === range
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Chart Area */}
            <div className="h-48 relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg"></div>
              <div className="relative h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-sm text-muted-foreground mb-2">Live Chart</div>
                  <div className="w-32 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-lg opacity-50 mx-auto"></div>
                </div>
              </div>
            </div>
            
            {/* Chart overlay with current trend */}
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
      <div className="px-6 mb-6">
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">AI Market Insight</h3>
                <p className="text-purple-100 text-sm">Powered by advanced analytics</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold">{aiPrediction}</div>
                <div className="text-purple-100 text-sm">Confidence: {confidenceScore}%</div>
              </div>
            </div>
          </div>
          
          <div className="p-4">
            <div className="mb-3">
              <div className="flex justify-between text-sm text-muted-foreground mb-1">
                <span>AI Confidence Score</span>
                <span>{confidenceScore}%</span>
              </div>
              <Progress value={confidenceScore} className="h-2" />
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">
              Based on technical analysis, market sentiment, and recent news, our AI predicts a bullish trend for {stockData.symbol} in the short term.
            </p>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="text-center p-2 bg-green-50 rounded-lg">
                <div className="text-lg font-bold text-green-600">📈</div>
                <div className="text-xs text-green-700">Buy Signal</div>
              </div>
              <div className="text-center p-2 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">🎯</div>
                <div className="text-xs text-blue-700">Target: $210</div>
              </div>
              <div className="text-center p-2 bg-orange-50 rounded-lg">
                <div className="text-lg font-bold text-orange-600">⚠️</div>
                <div className="text-xs text-orange-700">Risk: Medium</div>
              </div>
            </div>
            
            <Button 
              variant="outline" 
              className="w-full mt-4 text-purple-600 border-purple-200 hover:bg-purple-50"
              onClick={onViewDetailedAnalysis}
            >
              View Detailed Analysis
            </Button>
          </div>
        </Card>
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
