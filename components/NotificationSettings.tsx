import { useState } from "react";
import { ChevronLeft, Bell, TrendingUp, Brain, Info, User, Plus, Search } from "lucide-react";
import { Card } from "./ui/card";

interface Stock {
  ticker: string;
  name: string;
  logo: string;
}

interface StockNotificationSettings {
  ticker: string;
  priceAlerts: {
    enabled: boolean;
    targetPrice?: number;
    stopLoss?: number;
    percentChange?: number;
  };
  aiInsights: {
    enabled: boolean;
    confidenceThreshold: number;
    predictionTypes: string[];
  };
  marketNews: boolean;
  earnings: boolean;
  dividends: boolean;
}

interface NotificationSettingsProps {
  onBack?: () => void;
}

export default function NotificationSettings({ onBack }: NotificationSettingsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddStock, setShowAddStock] = useState(false);
  
  const [globalSettings, setGlobalSettings] = useState({
    pushNotifications: true,
    emailNotifications: false,
    quietHours: {
      enabled: true,
      start: '22:00',
      end: '08:00'
    },
    weekendNotifications: false
  });

  const [stockSettings, setStockSettings] = useState<StockNotificationSettings[]>([
    {
      ticker: 'AAPL',
      priceAlerts: {
        enabled: true,
        targetPrice: 200,
        stopLoss: 180,
        percentChange: 5
      },
      aiInsights: {
        enabled: true,
        confidenceThreshold: 80,
        predictionTypes: ['buy_signal', 'sell_signal', 'volatility']
      },
      marketNews: true,
      earnings: true,
      dividends: true
    },
    {
      ticker: 'TSLA',
      priceAlerts: {
        enabled: true,
        targetPrice: 300,
        percentChange: 8
      },
      aiInsights: {
        enabled: true,
        confidenceThreshold: 85,
        predictionTypes: ['buy_signal', 'volatility']
      },
      marketNews: true,
      earnings: true,
      dividends: false
    },
    {
      ticker: 'MSFT',
      priceAlerts: {
        enabled: false
      },
      aiInsights: {
        enabled: true,
        confidenceThreshold: 75,
        predictionTypes: ['buy_signal', 'sell_signal']
      },
      marketNews: false,
      earnings: true,
      dividends: true
    },
    {
      ticker: 'NVDA',
      priceAlerts: {
        enabled: true,
        percentChange: 10
      },
      aiInsights: {
        enabled: true,
        confidenceThreshold: 90,
        predictionTypes: ['volatility']
      },
      marketNews: true,
      earnings: true,
      dividends: false
    }
  ]);

  const stocks: Stock[] = [
    { ticker: 'AAPL', name: 'Apple Inc.', logo: '🍎' },
    { ticker: 'TSLA', name: 'Tesla, Inc.', logo: '🚗' },
    { ticker: 'MSFT', name: 'Microsoft Corp', logo: '💻' },
    { ticker: 'NVDA', name: 'NVIDIA Corp', logo: '🎯' }
  ];

  const handleBack = () => {
    if (navigator.vibrate) {
      navigator.vibrate(5);
    }
    onBack?.();
  };

  const updateStockSetting = (ticker: string, category: string, field: string, value: any) => {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    setStockSettings(prev =>
      prev.map(stock =>
        stock.ticker === ticker
          ? {
              ...stock,
              [category]: {
                ...stock[category as keyof StockNotificationSettings],
                [field]: value
              }
            }
          : stock
      )
    );
  };

  const updateGlobalSetting = (field: string, value: any) => {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    setGlobalSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getFilteredStocks = () => {
    if (!searchQuery) return stocks;
    return stocks.filter(stock =>
      stock.ticker.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const getStockSettings = (ticker: string) => {
    return stockSettings.find(s => s.ticker === ticker);
  };

  const ToggleSwitch = ({ enabled, onToggle }: { enabled: boolean; onToggle: () => void }) => (
    <button
      onClick={onToggle}
      className={`relative w-12 h-7 rounded-full transition-all duration-300 ease-out ${
        enabled ? 'bg-blue-500' : 'bg-muted'
      }`}
    >
      <div
        className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-all duration-300 ease-out ${
          enabled ? 'translate-x-5' : 'translate-x-0.5'
        }`}
      />
    </button>
  );

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
            <h1 className="text-lg font-semibold text-foreground">Notification Settings</h1>
          </div>
          <div className="w-[88px]"></div>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-6 space-y-8">
          
          {/* Global Settings */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground px-2">GLOBAL SETTINGS</h2>
            <Card className="p-0 overflow-hidden bg-card border border-border/50">
              <div className="divide-y divide-border/50">
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <Bell className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="text-foreground">Push Notifications</span>
                  </div>
                  <ToggleSwitch
                    enabled={globalSettings.pushNotifications}
                    onToggle={() => updateGlobalSetting('pushNotifications', !globalSettings.pushNotifications)}
                  />
                </div>
                
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-foreground">Email Notifications</span>
                  </div>
                  <ToggleSwitch
                    enabled={globalSettings.emailNotifications}
                    onToggle={() => updateGlobalSetting('emailNotifications', !globalSettings.emailNotifications)}
                  />
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-foreground">Quiet Hours</span>
                    <ToggleSwitch
                      enabled={globalSettings.quietHours.enabled}
                      onToggle={() => updateGlobalSetting('quietHours', { ...globalSettings.quietHours, enabled: !globalSettings.quietHours.enabled })}
                    />
                  </div>
                  {globalSettings.quietHours.enabled && (
                    <div className="flex items-center gap-3 mt-3">
                      <div className="flex-1">
                        <label className="text-xs text-muted-foreground">From</label>
                        <input
                          type="time"
                          value={globalSettings.quietHours.start}
                          onChange={(e) => updateGlobalSetting('quietHours', { ...globalSettings.quietHours, start: e.target.value })}
                          className="w-full mt-1 p-2 bg-muted/50 rounded-lg text-foreground border-0 focus:outline-none focus:ring-1 focus:ring-foreground/20"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs text-muted-foreground">To</label>
                        <input
                          type="time"
                          value={globalSettings.quietHours.end}
                          onChange={(e) => updateGlobalSetting('quietHours', { ...globalSettings.quietHours, end: e.target.value })}
                          className="w-full mt-1 p-2 bg-muted/50 rounded-lg text-foreground border-0 focus:outline-none focus:ring-1 focus:ring-foreground/20"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-4 flex items-center justify-between">
                  <span className="text-foreground">Weekend Notifications</span>
                  <ToggleSwitch
                    enabled={globalSettings.weekendNotifications}
                    onToggle={() => updateGlobalSetting('weekendNotifications', !globalSettings.weekendNotifications)}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Stock-Specific Settings */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-sm font-medium text-muted-foreground">STOCK NOTIFICATIONS</h2>
              <button
                onClick={() => setShowAddStock(!showAddStock)}
                className="p-1 hover:bg-muted rounded-full transition-colors"
              >
                <Plus className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search stocks..."
                className="w-full pl-9 pr-4 py-2.5 bg-muted/50 rounded-lg text-foreground placeholder-muted-foreground border-0 focus:outline-none focus:ring-1 focus:ring-foreground/20 focus:bg-muted transition-all duration-200"
              />
            </div>

            {/* Stock Settings List */}
            <div className="space-y-4">
              {getFilteredStocks().map((stock) => {
                const settings = getStockSettings(stock.ticker);
                if (!settings) return null;

                return (
                  <Card key={stock.ticker} className="p-0 overflow-hidden bg-card border border-border/50">
                    {/* Stock Header */}
                    <div className="p-4 border-b border-border/50 bg-muted/20">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{stock.logo}</span>
                        <div>
                          <h3 className="font-semibold text-foreground">{stock.ticker}</h3>
                          <p className="text-sm text-muted-foreground">{stock.name}</p>
                        </div>
                      </div>
                    </div>

                    <div className="divide-y divide-border/50">
                      {/* Price Alerts */}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="h-4 w-4 text-green-600" />
                            <span className="text-foreground font-medium">Price Alerts</span>
                          </div>
                          <ToggleSwitch
                            enabled={settings.priceAlerts.enabled}
                            onToggle={() => updateStockSetting(stock.ticker, 'priceAlerts', 'enabled', !settings.priceAlerts.enabled)}
                          />
                        </div>
                        
                        {settings.priceAlerts.enabled && (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <label className="text-xs text-muted-foreground">Target Price</label>
                                <input
                                  type="number"
                                  value={settings.priceAlerts.targetPrice || ''}
                                  onChange={(e) => updateStockSetting(stock.ticker, 'priceAlerts', 'targetPrice', Number(e.target.value))}
                                  placeholder="$0.00"
                                  className="w-full mt-1 p-2 bg-muted/50 rounded-lg text-foreground border-0 focus:outline-none focus:ring-1 focus:ring-foreground/20"
                                />
                              </div>
                              <div>
                                <label className="text-xs text-muted-foreground">Stop Loss</label>
                                <input
                                  type="number"
                                  value={settings.priceAlerts.stopLoss || ''}
                                  onChange={(e) => updateStockSetting(stock.ticker, 'priceAlerts', 'stopLoss', Number(e.target.value))}
                                  placeholder="$0.00"
                                  className="w-full mt-1 p-2 bg-muted/50 rounded-lg text-foreground border-0 focus:outline-none focus:ring-1 focus:ring-foreground/20"
                                />
                              </div>
                            </div>
                            <div>
                              <label className="text-xs text-muted-foreground">% Change Alert</label>
                              <input
                                type="number"
                                value={settings.priceAlerts.percentChange || ''}
                                onChange={(e) => updateStockSetting(stock.ticker, 'priceAlerts', 'percentChange', Number(e.target.value))}
                                placeholder="5%"
                                className="w-full mt-1 p-2 bg-muted/50 rounded-lg text-foreground border-0 focus:outline-none focus:ring-1 focus:ring-foreground/20"
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* AI Insights */}
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Brain className="h-4 w-4 text-purple-600" />
                            <span className="text-foreground font-medium">AI Insights</span>
                          </div>
                          <ToggleSwitch
                            enabled={settings.aiInsights.enabled}
                            onToggle={() => updateStockSetting(stock.ticker, 'aiInsights', 'enabled', !settings.aiInsights.enabled)}
                          />
                        </div>
                        
                        {settings.aiInsights.enabled && (
                          <div className="space-y-3">
                            <div>
                              <label className="text-xs text-muted-foreground">Confidence Threshold: {settings.aiInsights.confidenceThreshold}%</label>
                              <input
                                type="range"
                                min="50"
                                max="99"
                                value={settings.aiInsights.confidenceThreshold}
                                onChange={(e) => updateStockSetting(stock.ticker, 'aiInsights', 'confidenceThreshold', Number(e.target.value))}
                                className="w-full mt-1 slider"
                                style={{
                                  background: `linear-gradient(to right, #007AFF 0%, #007AFF ${((settings.aiInsights.confidenceThreshold - 50) / 49) * 100}%, #f1f2f6 ${((settings.aiInsights.confidenceThreshold - 50) / 49) * 100}%, #f1f2f6 100%)`
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Other Notifications */}
                      <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Info className="h-4 w-4 text-blue-600" />
                            <span className="text-foreground">Market News</span>
                          </div>
                          <ToggleSwitch
                            enabled={settings.marketNews}
                            onToggle={() => updateStockSetting(stock.ticker, 'marketNews', '', !settings.marketNews)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-foreground">Earnings Reports</span>
                          <ToggleSwitch
                            enabled={settings.earnings}
                            onToggle={() => updateStockSetting(stock.ticker, 'earnings', '', !settings.earnings)}
                          />
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-foreground">Dividend Alerts</span>
                          <ToggleSwitch
                            enabled={settings.dividends}
                            onToggle={() => updateStockSetting(stock.ticker, 'dividends', '', !settings.dividends)}
                          />
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}