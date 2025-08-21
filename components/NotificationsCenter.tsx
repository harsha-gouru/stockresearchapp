import { useState } from "react";
import { ChevronLeft, Bell, TrendingUp, TrendingDown, Brain, Info, Settings, Search, Filter, Check, Circle } from "lucide-react";
import { Card } from "./ui/card";

interface Notification {
  id: string;
  type: 'price_alert' | 'ai_prediction' | 'market_news' | 'portfolio_update';
  title: string;
  message: string;
  stock?: {
    ticker: string;
    name: string;
    logo: string;
  };
  timestamp: Date;
  isRead: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface NotificationsCenterProps {
  onBack?: () => void;
  onOpenNotificationSettings?: () => void;
  filterByStock?: string; // Optional filter by stock ticker
}

export default function NotificationsCenter({ onBack, onOpenNotificationSettings, filterByStock }: NotificationsCenterProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'price_alert' | 'ai_prediction' | 'market_news' | 'portfolio_update'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'price_alert',
      title: 'AAPL Price Alert',
      message: 'Apple reached your target price of $195.00',
      stock: { ticker: 'AAPL', name: 'Apple Inc.', logo: '🍎' },
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      isRead: false,
      priority: 'high'
    },
    {
      id: '2',
      type: 'ai_prediction',
      title: 'Strong Buy Signal',
      message: 'AI analysis suggests TSLA has 92% probability of upward movement',
      stock: { ticker: 'TSLA', name: 'Tesla, Inc.', logo: '🚗' },
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      isRead: false,
      priority: 'high'
    },
    {
      id: '3',
      type: 'market_news',
      title: 'Tech Sector Update',
      message: 'Major tech companies report strong Q4 earnings',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      isRead: true,
      priority: 'medium'
    },
    {
      id: '4',
      type: 'portfolio_update',
      title: 'Portfolio Performance',
      message: 'Your portfolio gained +2.4% today ($1,142.85)',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: true,
      priority: 'medium'
    },
    {
      id: '5',
      type: 'price_alert',
      title: 'MSFT Price Drop',
      message: 'Microsoft dropped 3% below your stop-loss threshold',
      stock: { ticker: 'MSFT', name: 'Microsoft Corp', logo: '💻' },
      timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
      isRead: false,
      priority: 'high'
    },
    {
      id: '6',
      type: 'ai_prediction',
      title: 'Volatility Warning',
      message: 'High volatility expected in tech sector next week',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      isRead: true,
      priority: 'medium'
    },
    {
      id: '7',
      type: 'market_news',
      title: 'Federal Reserve Update',
      message: 'Fed signals potential interest rate adjustments',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      isRead: false,
      priority: 'low'
    },
    {
      id: '8',
      type: 'portfolio_update',
      title: 'Rebalancing Suggestion',
      message: 'Consider rebalancing your portfolio for optimal risk distribution',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      isRead: true,
      priority: 'low'
    }
  ]);

  const handleBack = () => {
    if (navigator.vibrate) {
      navigator.vibrate(5);
    }
    onBack?.();
  };

  const toggleNotificationRead = (id: string) => {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: !notification.isRead }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const getFilteredNotifications = () => {
    let filtered = notifications;
    
    // Filter by stock if specified
    if (filterByStock) {
      filtered = filtered.filter(notification => 
        notification.stock?.ticker === filterByStock
      );
    }
    
    if (selectedFilter !== 'all') {
      filtered = filtered.filter(notification => notification.type === selectedFilter);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(notification =>
        notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
        notification.stock?.ticker.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    return filtered.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'price_alert':
        return Bell;
      case 'ai_prediction':
        return Brain;
      case 'market_news':
        return Info;
      case 'portfolio_update':
        return TrendingUp;
      default:
        return Bell;
    }
  };

  const getNotificationColor = (type: Notification['type'], priority: Notification['priority']) => {
    if (priority === 'high') return 'bg-red-100 text-red-600';
    if (priority === 'medium') return 'bg-blue-100 text-blue-600';
    return 'bg-gray-100 text-gray-600';
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  const filterOptions = [
    { value: 'all', label: 'All', count: notifications.length },
    { value: 'price_alert', label: 'Price Alerts', count: notifications.filter(n => n.type === 'price_alert').length },
    { value: 'ai_prediction', label: 'AI Insights', count: notifications.filter(n => n.type === 'ai_prediction').length },
    { value: 'market_news', label: 'News', count: notifications.filter(n => n.type === 'market_news').length }
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const filteredNotifications = getFilteredNotifications();

  return (
    <div className="relative h-full w-full bg-background flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center gap-3 px-6 py-4">
          <button 
            onClick={handleBack}
            className="group relative flex items-center gap-2 px-3 py-2 rounded-full hover:bg-muted/50 active:bg-muted/70 transition-all duration-300 ease-out active:scale-95"
            onMouseEnter={() => navigator.vibrate && navigator.vibrate(5)}
          >
            <div className="relative overflow-hidden">
              <ChevronLeft className="h-5 w-5 text-foreground transition-all duration-300 ease-out group-hover:-translate-x-0.5 group-active:scale-90" />
              <div className="absolute inset-0 bg-foreground/10 rounded-full scale-0 group-active:scale-150 transition-transform duration-200 ease-out" />
            </div>
            <span className="text-foreground font-medium transition-all duration-300 ease-out group-hover:translate-x-0.5 group-active:scale-95">
              Back
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-muted/20 to-transparent rounded-full scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out origin-left -z-10" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold text-foreground">
              {filterByStock ? `${filterByStock} Notifications` : 'Notifications'}
            </h1>
            {unreadCount > 0 && (
              <p className="text-xs text-muted-foreground">{unreadCount} unread</p>
            )}
          </div>
          <button
            onClick={onOpenNotificationSettings}
            className="group rounded-full p-2 hover:bg-muted active:bg-muted/70 transition-all duration-200 ease-out active:scale-95"
            onMouseEnter={() => navigator.vibrate && navigator.vibrate(3)}
          >
            <Settings className="h-5 w-5 text-foreground transition-transform duration-200 ease-out group-hover:rotate-45 group-active:scale-90" />
          </button>
        </div>
      </header>

      {/* Search Bar */}
      <div className="px-6 py-4 border-b border-border/30">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notifications..."
            className="w-full pl-9 pr-4 py-2.5 bg-muted/50 rounded-lg text-foreground placeholder-muted-foreground border-0 focus:outline-none focus:ring-1 focus:ring-foreground/20 focus:bg-muted transition-all duration-200"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 py-3 border-b border-border/30">
        <div className="flex gap-1">
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedFilter(option.value as any)}
              className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ease-out active:scale-95 ${
                selectedFilter === option.value
                  ? 'bg-foreground text-background'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              }`}
            >
              <div className="flex items-center justify-center gap-1">
                <span>{option.label}</span>
                {option.count > 0 && (
                  <span className={`px-1 rounded text-[10px] font-bold ${
                    selectedFilter === option.value
                      ? 'text-background/70'
                      : 'text-foreground/60'
                  }`}>
                    {option.count}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Mark All Read Button */}
      {unreadCount > 0 && (
        <div className="px-6 py-3 border-b border-border/30">
          <button
            onClick={markAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
          >
            Mark All as Read
          </button>
        </div>
      )}

      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotifications.length === 0 ? (
          <div className="flex-1 flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto">
                <Bell className="h-8 w-8 text-muted-foreground" />
              </div>
              <div>
                <h3 className="text-foreground font-medium">No Notifications</h3>
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? 'No notifications match your search.' : 'You\'re all caught up!'}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-1 p-4">
            {filteredNotifications.map((notification) => {
              const IconComponent = getNotificationIcon(notification.type);
              return (
                <Card
                  key={notification.id}
                  className={`p-4 border transition-all duration-200 ease-out active:scale-[0.98] cursor-pointer ${
                    notification.isRead
                      ? 'bg-card border-border/50 opacity-75'
                      : 'bg-card border-border shadow-sm'
                  }`}
                  onClick={() => toggleNotificationRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    {/* Notification Icon */}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      getNotificationColor(notification.type, notification.priority)
                    }`}>
                      <IconComponent className="h-4 w-4" />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className={`font-medium truncate ${
                              notification.isRead ? 'text-muted-foreground' : 'text-foreground'
                            }`}>
                              {notification.title}
                            </h3>
                            {notification.stock && (
                              <span className="text-xs text-muted-foreground bg-muted/50 px-2 py-0.5 rounded-full">
                                {notification.stock.ticker}
                              </span>
                            )}
                          </div>
                          <p className={`text-sm leading-relaxed ${
                            notification.isRead ? 'text-muted-foreground' : 'text-foreground/80'
                          }`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground mt-2">
                            {formatTimestamp(notification.timestamp)}
                          </p>
                        </div>
                        
                        {/* Read/Unread Indicator */}
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {notification.priority === 'high' && !notification.isRead && (
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleNotificationRead(notification.id);
                            }}
                            className="p-1 hover:bg-muted/50 rounded-full transition-colors"
                          >
                            {notification.isRead ? (
                              <Check className="h-4 w-4 text-green-600" />
                            ) : (
                              <Circle className="h-4 w-4 text-muted-foreground" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Stock Info (if applicable) */}
                      {notification.stock && (
                        <div className="flex items-center gap-2 mt-2 p-2 bg-muted/30 rounded-lg">
                          <span className="text-lg">{notification.stock.logo}</span>
                          <div>
                            <span className="text-sm font-medium text-foreground">{notification.stock.ticker}</span>
                            <span className="text-xs text-muted-foreground ml-2">{notification.stock.name}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}