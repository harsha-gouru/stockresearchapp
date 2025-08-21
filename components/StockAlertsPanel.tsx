import { useState } from "react";
import { Bell, TrendingUp, TrendingDown, Plus, ChevronRight, AlertTriangle, Check, X } from "lucide-react";
import { Card } from "./ui/card";

interface StockAlert {
  id: string;
  type: 'price_above' | 'price_below' | 'percent_change' | 'volume_spike';
  label: string;
  targetValue: number;
  currentValue: number;
  isActive: boolean;
  isTriggered: boolean;
  createdAt: Date;
}

interface StockNotification {
  id: string;
  type: 'alert_triggered' | 'price_movement' | 'volume_spike' | 'ai_insight';
  message: string;
  timestamp: Date;
  priority: 'high' | 'medium' | 'low';
  isRead: boolean;
}

interface StockAlertsPanelProps {
  stock: {
    ticker: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    logo: string;
  };
  onCreateAlert?: () => void;
  onManageAlerts?: () => void;
}

export default function StockAlertsPanel({ stock, onCreateAlert, onManageAlerts }: StockAlertsPanelProps) {
  const [activeAlerts, setActiveAlerts] = useState<StockAlert[]>([
    {
      id: '1',
      type: 'price_above',
      label: 'Price Above',
      targetValue: 200,
      currentValue: stock.price,
      isActive: true,
      isTriggered: false,
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      type: 'price_below',
      label: 'Stop Loss',
      targetValue: 180,
      currentValue: stock.price,
      isActive: true,
      isTriggered: false,
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)
    },
    {
      id: '3',
      type: 'percent_change',
      label: '5% Drop',
      targetValue: -5,
      currentValue: stock.changePercent,
      isActive: true,
      isTriggered: stock.changePercent <= -5,
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    }
  ]);

  const [recentNotifications, setRecentNotifications] = useState<StockNotification[]>([
    {
      id: '1',
      type: 'alert_triggered',
      message: `${stock.ticker} reached your target price of $195.00`,
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      priority: 'high',
      isRead: false
    },
    {
      id: '2',
      type: 'ai_insight',
      message: 'Strong buy signal detected with 92% confidence',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      priority: 'medium',
      isRead: false
    },
    {
      id: '3',
      type: 'volume_spike',
      message: 'Volume increased 340% in last hour',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      priority: 'medium',
      isRead: true
    }
  ]);

  const toggleAlert = (alertId: string) => {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    setActiveAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, isActive: !alert.isActive } : alert
      )
    );
  };

  const markNotificationRead = (notificationId: string) => {
    setRecentNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const getAlertProgress = (alert: StockAlert) => {
    if (alert.type === 'price_above') {
      return Math.min(100, (alert.currentValue / alert.targetValue) * 100);
    } else if (alert.type === 'price_below') {
      return Math.max(0, Math.min(100, ((alert.targetValue - alert.currentValue) / alert.targetValue) * 100));
    } else if (alert.type === 'percent_change') {
      return Math.abs(alert.currentValue / alert.targetValue) * 100;
    }
    return 0;
  };

  const getAlertStatus = (alert: StockAlert) => {
    if (!alert.isActive) return 'inactive';
    if (alert.isTriggered) return 'triggered';
    
    if (alert.type === 'price_above' && alert.currentValue >= alert.targetValue) return 'triggered';
    if (alert.type === 'price_below' && alert.currentValue <= alert.targetValue) return 'triggered';
    if (alert.type === 'percent_change' && Math.abs(alert.currentValue) >= Math.abs(alert.targetValue)) return 'triggered';
    
    return 'active';
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    return `${hours}h ago`;
  };

  const unreadNotifications = recentNotifications.filter(n => !n.isRead).length;
  const triggeredAlerts = activeAlerts.filter(a => getAlertStatus(a) === 'triggered').length;

  return (
    <div className="space-y-4">
      {/* Header with Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Alerts & Notifications</h3>
          {(unreadNotifications > 0 || triggeredAlerts > 0) && (
            <div className="flex items-center gap-1">
              {triggeredAlerts > 0 && (
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  {triggeredAlerts} triggered
                </span>
              )}
              {unreadNotifications > 0 && (
                <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full font-medium">
                  {unreadNotifications} new
                </span>
              )}
            </div>
          )}
        </div>
        <button
          onClick={onManageAlerts}
          className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
        >
          Manage All
        </button>
      </div>

      {/* Active Alerts */}
      <Card className="p-4 bg-card border border-border/50">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-foreground">Active Alerts</h4>
          <button
            onClick={onCreateAlert}
            className="group flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-all duration-200"
          >
            <Plus className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
            Add Alert
          </button>
        </div>
        
        <div className="space-y-3">
          {activeAlerts.map((alert) => {
            const status = getAlertStatus(alert);
            const progress = getAlertProgress(alert);
            
            return (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border transition-all duration-200 ${
                  status === 'triggered' 
                    ? 'bg-red-50 border-red-200' 
                    : status === 'inactive'
                    ? 'bg-gray-50 border-gray-200 opacity-60'
                    : 'bg-green-50 border-green-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {status === 'triggered' ? (
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    ) : status === 'inactive' ? (
                      <X className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Check className="h-4 w-4 text-green-600" />
                    )}
                    <span className="text-sm font-medium text-foreground">
                      {alert.label}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleAlert(alert.id)}
                    className={`relative w-10 h-6 rounded-full transition-all duration-300 ease-out ${
                      alert.isActive ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300 ease-out ${
                        alert.isActive ? 'translate-x-4' : 'translate-x-0.5'
                      }`}
                    />
                  </button>
                </div>
                
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    Target: {alert.type.includes('percent') ? `${alert.targetValue}%` : `$${alert.targetValue}`}
                  </span>
                  <span>
                    Current: {alert.type.includes('percent') ? `${alert.currentValue.toFixed(2)}%` : `$${alert.currentValue.toFixed(2)}`}
                  </span>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      status === 'triggered' 
                        ? 'bg-red-500' 
                        : 'bg-blue-500'
                    }`}
                    style={{ width: `${Math.min(100, progress)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Recent Notifications */}
      <Card className="p-4 bg-card border border-border/50">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-medium text-foreground">Recent Activity</h4>
          <button
            onClick={() => {/* Navigate to full notifications */}}
            className="flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
          >
            View All
            <ChevronRight className="h-3 w-3" />
          </button>
        </div>
        
        <div className="space-y-2">
          {recentNotifications.slice(0, 3).map((notification) => (
            <div
              key={notification.id}
              className={`p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-muted/50 ${
                notification.isRead ? 'opacity-70' : 'bg-blue-50/50'
              }`}
              onClick={() => markNotificationRead(notification.id)}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className={`text-sm leading-relaxed ${
                    notification.isRead ? 'text-muted-foreground' : 'text-foreground'
                  }`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formatTimestamp(notification.timestamp)}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {notification.priority === 'high' && !notification.isRead && (
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  )}
                  {!notification.isRead && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {recentNotifications.length === 0 && (
          <div className="text-center py-6">
            <Bell className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">No recent activity</p>
          </div>
        )}
      </Card>
    </div>
  );
}