import { useState } from "react";
import { Eye, Plus, TrendingUp, TrendingDown, Bell, Star, Filter, ChevronLeft } from "lucide-react";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";

// Mock watchlist data
const watchlistStocks = [
  {
    id: '1',
    ticker: 'GOOGL',
    name: 'Alphabet Inc',
    logo: '🔍',
    price: 142.58,
    change: 1.23,
    changePercent: 0.87,
    targetPrice: 150,
    alertSet: true,
    addedDate: '2024-01-10',
    notes: 'Waiting for dip below $140'
  },
  {
    id: '2',
    ticker: 'AMZN',
    name: 'Amazon.com',
    logo: '📦',
    price: 178.45,
    change: -2.15,
    changePercent: -1.19,
    targetPrice: 175,
    alertSet: true,
    addedDate: '2024-01-08',
    notes: 'Q4 earnings play'
  },
  {
    id: '3',
    ticker: 'META',
    name: 'Meta Platforms',
    logo: '📘',
    price: 495.12,
    change: 5.78,
    changePercent: 1.18,
    targetPrice: 500,
    alertSet: false,
    addedDate: '2024-01-05',
    notes: 'AI monetization potential'
  },
  {
    id: '4',
    ticker: 'NFLX',
    name: 'Netflix Inc',
    logo: '🎬',
    price: 485.23,
    change: -8.45,
    changePercent: -1.71,
    targetPrice: 475,
    alertSet: true,
    addedDate: '2024-01-03',
    notes: 'Password sharing impact'
  }
];

// Categories for filtering
const categories = [
  { id: 'all', label: 'All', count: watchlistStocks.length },
  { id: 'alerts', label: 'With Alerts', count: 3 },
  { id: 'near-target', label: 'Near Target', count: 2 },
  { id: 'recent', label: 'Recently Added', count: 2 }
];

interface WatchlistProps {
  onBack?: () => void;
  onStockClick?: (ticker: string) => void;
  onAddStock?: () => void;
}

export default function Watchlist({ onBack, onStockClick, onAddStock }: WatchlistProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'name' | 'change' | 'added'>('added');

  // Calculate distance to target price
  const getDistanceToTarget = (current: number, target: number) => {
    const distance = ((target - current) / current) * 100;
    return distance;
  };

  // Filter stocks based on category
  const filteredStocks = watchlistStocks.filter(stock => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'alerts') return stock.alertSet;
    if (selectedCategory === 'near-target') {
      const distance = Math.abs(getDistanceToTarget(stock.price, stock.targetPrice));
      return distance <= 5; // Within 5% of target
    }
    if (selectedCategory === 'recent') {
      const daysAgo = 7;
      const addedDate = new Date(stock.addedDate);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
      return addedDate >= cutoffDate;
    }
    return true;
  });

  // Sort stocks
  const sortedStocks = [...filteredStocks].sort((a, b) => {
    if (sortBy === 'name') return a.ticker.localeCompare(b.ticker);
    if (sortBy === 'change') return b.changePercent - a.changePercent;
    if (sortBy === 'added') return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
    return 0;
  });

  return (
    <div className="relative h-full w-full bg-background flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <button 
                onClick={onBack}
                className="group relative flex items-center gap-2 px-3 py-2 rounded-full hover:bg-muted/50 active:bg-muted/70 transition-all duration-300 ease-out active:scale-95"
              >
                <ChevronLeft className="h-5 w-5 text-foreground" />
                <span className="text-foreground font-medium">Back</span>
              </button>
              <div className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-muted-foreground" />
                <h1 className="text-2xl font-bold text-foreground">Watchlist</h1>
              </div>
            </div>
            <button 
              onClick={() => setSortBy(sortBy === 'name' ? 'change' : sortBy === 'change' ? 'added' : 'name')}
              className="p-2 hover:bg-muted rounded-full transition-colors"
            >
              <Filter className="h-5 w-5 text-muted-foreground" />
            </button>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                  selectedCategory === category.id
                    ? 'bg-foreground text-background'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted'
                }`}
              >
                {category.label}
                {category.count > 0 && (
                  <span className="ml-2 opacity-70">({category.count})</span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-4">
          {/* Summary Card */}
          <Card className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-700">Watching</p>
                <p className="text-2xl font-bold text-purple-900">{watchlistStocks.length} Stocks</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-purple-700">Alerts Active</p>
                <p className="text-2xl font-bold text-purple-900">
                  {watchlistStocks.filter(s => s.alertSet).length}
                </p>
              </div>
            </div>
          </Card>

          {/* Watchlist Items */}
          <div className="space-y-3">
            {sortedStocks.map((stock) => {
              const distanceToTarget = getDistanceToTarget(stock.price, stock.targetPrice);
              const isNearTarget = Math.abs(distanceToTarget) <= 5;
              
              return (
                <Card 
                  key={stock.id} 
                  className="p-4 border border-border bg-card cursor-pointer hover:bg-muted/50 transition-colors active:scale-[0.98]"
                  onClick={() => onStockClick?.(stock.ticker)}
                >
                  <div className="space-y-3">
                    {/* Stock Info Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-lg">
                          {stock.logo}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-foreground font-medium">{stock.ticker}</span>
                            {stock.alertSet && (
                              <Bell className="h-3 w-3 text-blue-500" />
                            )}
                            {isNearTarget && (
                              <Badge variant="outline" className="text-xs border-orange-500 text-orange-600">
                                Near Target
                              </Badge>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">{stock.name}</span>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className="text-foreground font-medium">${stock.price}</div>
                        <div className={`text-sm flex items-center justify-end gap-1 ${
                          stock.change >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {stock.change >= 0 ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {stock.change > 0 ? '+' : ''}{stock.changePercent}%
                        </div>
                      </div>
                    </div>

                    {/* Target Price & Notes */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                          <Target className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">Target:</span>
                          <span className="text-foreground font-medium">${stock.targetPrice}</span>
                          <span className={`text-xs ${
                            distanceToTarget > 0 ? 'text-green-600' : 'text-red-600'
                          }`}>
                            ({distanceToTarget > 0 ? '+' : ''}{distanceToTarget.toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Added {stock.addedDate}
                      </span>
                    </div>

                    {/* Notes */}
                    {stock.notes && (
                      <div className="pt-2 border-t border-border/50">
                        <p className="text-sm text-muted-foreground italic">
                          📝 {stock.notes}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Empty State */}
          {sortedStocks.length === 0 && (
            <div className="text-center py-12">
              <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No stocks in this view</h3>
              <p className="text-sm text-muted-foreground">
                Try changing the filter or add more stocks to watch
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Floating Add Button */}
      <button 
        onClick={onAddStock}
        className="absolute bottom-6 right-6 w-14 h-14 bg-foreground text-background rounded-full shadow-lg flex items-center justify-center hover:bg-foreground/90 active:scale-95 transition-all z-10"
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}
