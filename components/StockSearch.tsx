import { useState, useEffect } from "react";
import { Search, X, Plus, Clock, TrendingUp, TrendingDown, Loader2, ChevronLeft, Filter, Sparkles, ArrowUpRight, ArrowDownRight, Star, Activity, DollarSign, Zap } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";

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
    'META': '�',
    'NVDA': '🎯',
    'NFLX': '🎬',
    'DIS': '🏰',
    'JPM': '🏦',
    'JNJ': '💊',
    'V': '💳'
  };
  return logoMap[symbol] || '�';
};

// Interface for stock data
interface Stock {
  id?: number;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  logo: string;
  exchange: string;
  type?: string;
}

interface StockSearchProps {
  onBack?: () => void;
  onAddStock?: (stock: any) => void;
}

export default function StockSearch({ onBack, onAddStock }: StockSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [trendingStocks, setTrendingStocks] = useState<Stock[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "AAPL", "TSLA", "MSFT"
  ]);
  const [addingStock, setAddingStock] = useState<string | number | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [showFilters, setShowFilters] = useState(false);

  // Fetch trending stocks on component mount
  useEffect(() => {
    const fetchTrendingStocks = async () => {
      try {
        const symbols = ['AAPL', 'TSLA', 'MSFT', 'GOOGL', 'NVDA', 'META'];
        const stockPromises = symbols.map(async (symbol) => {
          const response = await fetch(`${API_BASE_URL}/api/v1/stocks/${symbol}`);
          if (response.ok) {
            const data = await response.json();
            return {
              id: Math.random(),
              symbol: data.stock.symbol,
              name: data.stock.name,
              price: data.stock.price,
              change: data.stock.change,
              changePercent: data.stock.changePercent,
              logo: getStockLogo(data.stock.symbol),
              exchange: data.stock.exchange || 'NASDAQ'
            };
          }
          return null;
        });
        
        const stocks = (await Promise.all(stockPromises)).filter(Boolean) as Stock[];
        setTrendingStocks(stocks);
      } catch (error) {
        console.error('Error fetching trending stocks:', error);
      }
    };

    fetchTrendingStocks();
  }, []);

  // Search stocks using API
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const timeoutId = setTimeout(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/stocks/search?q=${encodeURIComponent(searchQuery)}`);
        if (response.ok) {
          const data = await response.json();
          const formattedResults = data.results.map((result: any, index: number) => ({
            id: index + 1,
            symbol: result.symbol,
            name: result.name,
            price: 0, // Will be loaded when clicked
            change: 0,
            changePercent: 0,
            logo: getStockLogo(result.symbol),
            exchange: result.exchange,
            type: result.type
          }));
          setSearchResults(formattedResults);
        }
      } catch (error) {
        console.error('Error searching stocks:', error);
        setSearchResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const handleAddStock = (stock: any) => {
    // Set loading state for smooth animation
    setAddingStock(stock.id || stock.symbol);
    
    // Add native iOS-style haptic feedback
    if (navigator.vibrate) {
      navigator.vibrate(50); // Single, crisp haptic like iOS
    }
    
    // Add to recent searches if not already there
    if (!recentSearches.includes(stock.symbol)) {
      setRecentSearches(prev => [stock.symbol, ...prev.slice(0, 4)]);
    }
    
    // iOS-style spring animation timing
    setTimeout(() => {
      setAddingStock(null);
      onAddStock?.(stock);
    }, 600);
  };

  const handleRecentSearch = (ticker: string) => {
    setSearchQuery(ticker);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
  };

  return (
    <div className="relative h-full w-full bg-gradient-to-b from-background via-background to-muted/20 flex flex-col">
      {/* Enhanced Header with Glass Effect */}
      <header className="flex-shrink-0">
        {/* Top Section with Back Button */}
        <div className="px-4 pt-12 pb-3">
          <button 
            onClick={onBack}
            className="group flex items-center gap-2 p-2 -ml-2 rounded-full hover:bg-muted/30 active:bg-muted/50 transition-all duration-200"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
            <span className="text-foreground font-medium">Back</span>
          </button>
        </div>
        
        {/* Search Bar with Modern Design */}
        <div className="px-4 pb-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="flex items-center px-4 py-3.5">
                <Search className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-3 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Search stocks, symbols..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none text-base"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="ml-2 p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                  >
                    <X className="h-4 w-4 text-gray-400 dark:text-gray-500" />
                  </button>
                )}
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`ml-2 p-1.5 rounded-full transition-all duration-200 ${
                    showFilters 
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 dark:text-gray-500'
                  }`}
                >
                  <Filter className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Filter Pills */}
          {showFilters && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1 scrollbar-hide animate-in slide-in-from-top duration-200">
              {['All', 'Gainers', 'Losers', 'Most Active', 'Tech', 'Healthcare'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter.toLowerCase())}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    selectedFilter === filter.toLowerCase()
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        {searchQuery.trim() === "" ? (
          <>
            {/* Market Movers Section */}
            <div className="px-4 py-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Activity className="h-5 w-5 text-white" />
                    <h3 className="text-white font-semibold">Market Pulse</h3>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    <span className="text-xs text-white/80">Live</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/10 backdrop-blur rounded-lg p-2">
                    <p className="text-xs text-white/70">S&P 500</p>
                    <p className="text-sm font-bold text-white">4,536.19</p>
                    <p className="text-xs text-green-300">+0.84%</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-2">
                    <p className="text-xs text-white/70">NASDAQ</p>
                    <p className="text-sm font-bold text-white">14,229.91</p>
                    <p className="text-xs text-green-300">+1.14%</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur rounded-lg p-2">
                    <p className="text-xs text-white/70">DOW</p>
                    <p className="text-sm font-bold text-white">35,456.80</p>
                    <p className="text-xs text-red-300">-0.22%</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Trending Stocks with Modern Cards */}
            <div className="px-4 py-2">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Trending Now</h2>
                </div>
                <button className="text-sm text-blue-600 dark:text-blue-400 font-medium hover:underline">
                  View All
                </button>
              </div>
              <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                {trendingStocks.map((stock) => (
                  <button
                    key={stock.symbol}
                    onClick={() => handleAddStock(stock)}
                    className="group flex-shrink-0 relative overflow-hidden bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 min-w-[160px] hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] animate-in fade-in slide-in-from-bottom duration-500"
                    style={{ animationDelay: `${(stock.id || 0) * 50}ms` }}
                  >
                    {/* Gradient Background */}
                    <div className={`absolute inset-0 opacity-5 ${
                      stock.change >= 0 
                        ? 'bg-gradient-to-br from-green-400 to-green-600' 
                        : 'bg-gradient-to-br from-red-400 to-red-600'
                    }`} />
                    
                    <div className="relative">
                      {/* Stock Info */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-lg shadow-sm">
                            {stock.logo}
                          </div>
                          <div className="text-left">
                            <p className="font-bold text-gray-900 dark:text-gray-100">{stock.symbol}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">{stock.name}</p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Price */}
                      <div className="space-y-1">
                        <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                          ${stock.price.toFixed(2)}
                        </p>
                        <div className={`flex items-center gap-1 ${
                          stock.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {stock.change >= 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          <span className="text-sm font-medium">
                            {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                          </span>
                        </div>
                      </div>
                      
                      {/* Add Button Overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 dark:group-hover:bg-white/5 transition-colors duration-300 rounded-2xl" />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Recent Searches with Modern List */}
            {recentSearches.length > 0 && (
              <div className="px-4 py-4">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Recent Searches</h2>
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                  {recentSearches.map((ticker, index) => (
                    <button
                      key={index}
                      onClick={() => handleRecentSearch(ticker)}
                      className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-left border-b border-gray-100 dark:border-gray-800 last:border-0"
                    >
                      <div className="p-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <span className="font-medium text-gray-900 dark:text-gray-100">{ticker}</span>
                      </div>
                      <ChevronLeft className="h-4 w-4 text-gray-400 dark:text-gray-500 rotate-180" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State with Suggestions */}
            <div className="px-4 py-8">
              <div className="text-center mb-8">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full flex items-center justify-center">
                  <Search className="h-10 w-10 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">Search stocks instantly</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Find any stock by name or symbol</p>
              </div>
              
              {/* Popular Categories with Icons */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Popular Categories</p>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { name: 'Tech Giants', icon: '💻', color: 'from-blue-500 to-cyan-500', count: '15 stocks' },
                    { name: 'Healthcare', icon: '🏥', color: 'from-green-500 to-emerald-500', count: '23 stocks' },
                    { name: 'Finance', icon: '🏦', color: 'from-purple-500 to-pink-500', count: '18 stocks' },
                    { name: 'Energy', icon: '⚡', color: 'from-yellow-500 to-orange-500', count: '12 stocks' }
                  ].map((category, index) => (
                    <button
                      key={index}
                      className="group relative bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 text-left hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                      <div className="relative">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-2xl">{category.icon}</span>
                          <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                        </div>
                        <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{category.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{category.count}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Top Movers Mini Section */}
              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-yellow-500" />
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Today's Top Movers</p>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center text-sm">🚀</div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">NVDA</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">NVIDIA Corp</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-green-600 dark:text-green-400">+8.42%</p>
                      <p className="text-xs text-gray-500">$875.30</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-white dark:bg-gray-800 rounded-lg flex items-center justify-center text-sm">📉</div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-gray-100 text-sm">TSLA</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Tesla, Inc.</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-red-600 dark:text-red-400">-5.23%</p>
                      <p className="text-xs text-gray-500">$248.50</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Loading State with Skeleton */}
            {isLoading && (
              <div className="px-4 py-4">
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 animate-pulse">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-gray-200 dark:bg-gray-700" />
                        <div className="flex-1">
                          <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded" />
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-gray-200 dark:bg-gray-700" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Search Results with Enhanced Cards */}
            {!isLoading && searchResults.length > 0 && (
              <div className="px-4 py-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {searchResults.length} Result{searchResults.length > 1 ? 's' : ''}
                  </h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    for "{searchQuery}"
                  </span>
                </div>
                <div className="space-y-3">
                  {searchResults.map((stock) => (
                    <div
                      key={stock.symbol}
                      className="group bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 hover:shadow-lg transition-all duration-300 hover:scale-[1.01] active:scale-[0.99]"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <div className="relative">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-xl shadow-sm">
                              {stock.logo}
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-gray-900 ${
                              stock.change >= 0 ? 'bg-green-500' : 'bg-red-500'
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-bold text-gray-900 dark:text-gray-100">{stock.symbol}</span>
                              <span className="text-xs px-2 py-0.5 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full font-medium">
                                {stock.exchange}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{stock.name}</p>
                            <div className="flex items-center gap-3 mt-2">
                              <span className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                ${stock.price.toFixed(2)}
                              </span>
                              <div className={`flex items-center gap-1 px-2 py-1 rounded-lg ${
                                stock.change >= 0 
                                  ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' 
                                  : 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                              }`}>
                                {stock.change >= 0 ? (
                                  <TrendingUp className="h-3 w-3" />
                                ) : (
                                  <TrendingDown className="h-3 w-3" />
                                )}
                                <span className="text-sm font-medium">
                                  {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAddStock(stock)}
                          disabled={addingStock === (stock.id || stock.symbol)}
                          className={`relative flex items-center justify-center transition-all duration-300 ${
                            addingStock === (stock.id || stock.symbol)
                              ? 'w-10 h-10' 
                              : 'w-10 h-10 hover:scale-110 active:scale-95'
                          }`}
                        >
                          {addingStock === (stock.id || stock.symbol) ? (
                            <div className="w-full h-full rounded-xl bg-green-500 flex items-center justify-center">
                              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none">
                                <path 
                                  d="M20 6L9 17l-5-5" 
                                  stroke="currentColor" 
                                  strokeWidth="2.5" 
                                  strokeLinecap="round" 
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                          ) : (
                            <div className="w-full h-full rounded-xl bg-blue-600 hover:bg-blue-700 flex items-center justify-center transition-colors">
                              <Plus className="h-5 w-5 text-white" />
                            </div>
                          )}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results State */}
            {!isLoading && searchResults.length === 0 && searchQuery.trim() !== "" && (
              <div className="flex-1 flex items-center justify-center px-6 py-12">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                    <Search className="h-10 w-10 text-gray-400 dark:text-gray-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">No results found</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">No stocks match "{searchQuery}"</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try searching with a different term</p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
