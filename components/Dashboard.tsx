import { useState, useEffect } from "react";
import { Bell, Plus, TrendingUp, TrendingDown, BarChart3, Compass, Lightbulb, User, Settings, Eye } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, AreaChart, Area, CartesianGrid, Tooltip } from "recharts";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

// API Configuration
const API_BASE_URL = 'http://localhost:3000';

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
interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  logo: string;
}

// Portfolio chart data - showing overall portfolio performance over time
const portfolioChartData = [
  { time: '9:30', value: 45200 },
  { time: '10:00', value: 45800 },
  { time: '10:30', value: 45600 },
  { time: '11:00', value: 46200 },
  { time: '11:30', value: 46800 },
  { time: '12:00', value: 46500 },
  { time: '12:30', value: 47100 },
  { time: '1:00', value: 47300 },
  { time: '1:30', value: 47000 },
  { time: '2:00', value: 47600 },
  { time: '2:30', value: 47800 },
  { time: '3:00', value: 47542.85 }
];

const aiInsights = [
  {
    id: 1,
    title: "Strong Buy Signal",
    subtitle: "AAPL showing momentum",
    confidence: "95%"
  },
  {
    id: 2,
    title: "Market Volatility",
    subtitle: "Tech sector watch",
    confidence: "87%"
  },
  {
    id: 3,
    title: "Earnings Season",
    subtitle: "Q4 results incoming",
    confidence: "92%"
  }
];

interface DashboardProps {
  onStockClick?: (symbol: string) => void;
  onOpenStockSearch?: () => void;
  onOpenSettings?: () => void;
  onOpenProfile?: () => void;
  onOpenNotifications?: () => void;
  onOpenInsights?: () => void;
  onOpenDiscover?: () => void;
  onOpenWatchlist?: () => void;
}

export default function Dashboard({ onStockClick, onOpenStockSearch, onOpenSettings, onOpenProfile, onOpenNotifications, onOpenInsights, onOpenDiscover, onOpenWatchlist }: DashboardProps) {
  const [portfolioStocks, setPortfolioStocks] = useState<Stock[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch portfolio stocks from API
  useEffect(() => {
    const fetchPortfolioStocks = async () => {
      try {
        setIsLoading(true);
        const symbols = ['AAPL', 'TSLA', 'MSFT', 'NVDA'];
        const stockPromises = symbols.map(async (symbol) => {
          const response = await fetch(`${API_BASE_URL}/api/v1/stocks/${symbol}`);
          if (response.ok) {
            const data = await response.json();
            return {
              symbol: data.stock.symbol,
              name: data.stock.name,
              price: data.stock.price,
              change: data.stock.change,
              changePercent: data.stock.changePercent,
              logo: getStockLogo(data.stock.symbol)
            };
          }
          return null;
        });
        
        const stocks = (await Promise.all(stockPromises)).filter(Boolean) as Stock[];
        setPortfolioStocks(stocks);
      } catch (error) {
        console.error('Error fetching portfolio stocks:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPortfolioStocks();
  }, []);

  const totalValue = 47542.85;
  const totalChange = 1284.42;
  const totalChangePercent = 2.78;

  return (
    <div className="relative h-full w-full bg-background flex flex-col">
      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto pb-4">
        {/* Header */}
        <header className="flex items-center justify-between px-6 pt-12 pb-6">
          <div>
            <h1 className="text-2xl text-foreground">Good morning, Alex</h1>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={onOpenWatchlist}
              className="group rounded-full p-2 hover:bg-muted active:bg-muted/70 transition-all duration-200 ease-out active:scale-95"
              onMouseEnter={() => navigator.vibrate && navigator.vibrate(3)}
            >
              <Eye className="h-6 w-6 text-foreground transition-transform duration-200 ease-out group-hover:scale-110 group-active:scale-90" />
            </button>
            <button 
              onClick={onOpenNotifications}
              className="group rounded-full p-2 hover:bg-muted active:bg-muted/70 transition-all duration-200 ease-out active:scale-95"
              onMouseEnter={() => navigator.vibrate && navigator.vibrate(3)}
            >
              <Bell className="h-6 w-6 text-foreground transition-transform duration-200 ease-out group-hover:rotate-12 group-active:scale-90" />
            </button>
            <button 
              onClick={onOpenSettings}
              className="group rounded-full p-2 hover:bg-muted active:bg-muted/70 transition-all duration-200 ease-out active:scale-95"
              onMouseEnter={() => navigator.vibrate && navigator.vibrate(3)}
            >
              <Settings className="h-6 w-6 text-foreground transition-transform duration-200 ease-out group-hover:rotate-45 group-active:scale-90" />
            </button>
          </div>
        </header>

      {/* Portfolio Value Card */}
      <div className="px-6 mb-8">
        <Card className="p-6 border border-border bg-card">
          <div className="space-y-2">
            <p className="text-muted-foreground">Total Portfolio Value</p>
            <div className="flex items-end gap-3">
              <span className="text-3xl text-foreground">${totalValue.toLocaleString()}</span>
              <div className={`flex items-center gap-1 ${totalChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalChange >= 0 ? (
                  <TrendingUp className="h-4 w-4" />
                ) : (
                  <TrendingDown className="h-4 w-4" />
                )}
                <span className="text-sm">
                  ${Math.abs(totalChange).toLocaleString()} ({totalChangePercent > 0 ? '+' : ''}{totalChangePercent}%)
                </span>
              </div>
            </div>
          </div>
          
          {/* Portfolio Chart */}
          <div className="mt-8">
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={portfolioChartData}>
                  <defs>
                    <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fill="url(#portfolioGradient)"
                    dot={false}
                  />
                  <Tooltip 
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 rounded-lg shadow-lg border">
                            <p className="text-sm text-gray-600">{label}</p>
                            <p className="font-semibold text-blue-600">
                              ${payload[0].value?.toLocaleString()}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            
            {/* Time Period Buttons */}
            <div className="flex justify-center gap-2 mt-4">
              {['1D', '1W', '1M', '3M', '1Y'].map((period) => (
                <button
                  key={period}
                  className={`px-3 py-1 text-xs rounded-full transition-all ${
                    period === '1D' 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-sm' 
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* AI Insights Section */}
      <div className="mb-8">
        <div className="px-6 mb-4">
          <h2 className="text-xl text-foreground">AI Insights</h2>
        </div>
        <div className="flex gap-4 px-6 pb-2 overflow-x-auto scrollbar-hide">
          {aiInsights.map((insight) => (
            <Card key={insight.id} className="flex-shrink-0 w-64 p-4 border border-border bg-card">
              <div className="space-y-2">
                <h3 className="text-foreground">{insight.title}</h3>
                <p className="text-sm text-muted-foreground">{insight.subtitle}</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-xs text-muted-foreground">{insight.confidence} confidence</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Stocks List */}
      <div className="px-6 space-y-4">
        <h2 className="text-xl text-foreground">Your Stocks</h2>
        <div className="space-y-3">
          {portfolioStocks.map((stock) => (
            <Card 
              key={stock.symbol} 
              className="p-4 border border-border bg-card cursor-pointer hover:bg-muted/50 transition-colors active:scale-[0.98] min-h-[80px] flex items-center"
              onClick={() => onStockClick?.(stock.symbol)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Company Logo */}
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg flex-shrink-0">
                    {stock.logo}
                  </div>
                  {/* Stock Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-foreground font-medium">{stock.symbol}</span>
                      <span className="text-sm text-muted-foreground truncate">{stock.name}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 flex-shrink-0">
                  {/* Mini Sparkline */}
                  <div className="w-16 h-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={[
                        { value: 100 }, { value: 120 }, { value: 115 }, 
                        { value: 134 }, { value: 125 }, { value: 140 }
                      ]}>
                        <Line 
                          type="monotone" 
                          dataKey="value" 
                          stroke={stock.change >= 0 ? "#16a34a" : "#dc2626"}
                          strokeWidth={1.5}
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Price and Change */}
                  <div className="text-right min-w-[80px]">
                    <div className="text-foreground font-medium">${stock.price}</div>
                    <div className={`text-sm flex items-center justify-end gap-1 ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stock.change >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {stock.change > 0 ? '+' : ''}{stock.change} ({stock.changePercent > 0 ? '+' : ''}{stock.changePercent}%)
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
      </div>
      
      {/* Floating Add Button - positioned relative to scrollable area */}
      <button 
        onClick={onOpenStockSearch}
        className="absolute bottom-6 right-6 w-14 h-14 bg-foreground text-background rounded-full shadow-lg flex items-center justify-center hover:bg-foreground/90 active:scale-95 transition-all z-10"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}