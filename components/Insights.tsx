import { useState } from "react";
import { TrendingUp, TrendingDown, Brain, Calendar, Users, Target, Eye, ChevronRight, Flame, Zap, Globe, BarChart3, PieChart, Activity, ChevronLeft, Clock } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, AreaChart, Area, PieChart as RechartsPieChart, Cell } from "recharts";
import { Card } from "./ui/card";

// Mock data for various insights
const aiInsights = [
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
    description: 'Consider reducing tech exposure by 15%',
    confidence: 87,
    impact: 'Risk Reduction',
    suggestion: 'Move funds to healthcare and utilities'
  },
  {
    id: '3',
    type: 'volatility_warning',
    title: 'Market Volatility Alert',
    description: 'Expect increased volatility in semiconductor stocks',
    confidence: 91,
    timeframe: 'Next 3-5 days',
    affected_stocks: ['NVDA', 'AMD', 'INTC']
  }
];

const marketHeatMap = [
  { sector: 'Technology', change: 2.4, color: '#16a34a', size: 25 },
  { sector: 'Healthcare', change: 1.8, color: '#16a34a', size: 20 },
  { sector: 'Finance', change: -0.8, color: '#dc2626', size: 18 },
  { sector: 'Energy', change: 3.2, color: '#16a34a', size: 15 },
  { sector: 'Consumer', change: -1.2, color: '#dc2626', size: 12 },
  { sector: 'Industrial', change: 0.6, color: '#16a34a', size: 10 }
];

const topMovers = {
  gainers: [
    { ticker: 'NVDA', name: 'NVIDIA Corp', change: 8.4, logo: '🎯', volume: '145M' },
    { ticker: 'TSLA', name: 'Tesla Inc', change: 6.2, logo: '🚗', volume: '89M' },
    { ticker: 'META', name: 'Meta Platforms', change: 4.7, logo: '📘', volume: '67M' }
  ],
  losers: [
    { ticker: 'NFLX', name: 'Netflix Inc', change: -3.8, logo: '🎬', volume: '23M' },
    { ticker: 'PYPL', name: 'PayPal Holdings', change: -2.9, logo: '💳', volume: '18M' },
    { ticker: 'UBER', name: 'Uber Technologies', change: -2.1, logo: '🚕', volume: '31M' }
  ]
};

const marketSentiment = {
  overall: 'Bullish',
  score: 72,
  social: { sentiment: 'Positive', mentions: '1.2M', change: 15 },
  news: { sentiment: 'Neutral', articles: '847', change: -3 },
  institutional: { sentiment: 'Bullish', flow: '+$2.4B', change: 8 }
};

const economicEvents = [
  { date: 'Today', time: '2:00 PM', event: 'Fed Interest Rate Decision', impact: 'High', type: 'monetary' },
  { date: 'Tomorrow', time: '8:30 AM', event: 'Jobs Report', impact: 'High', type: 'employment' },
  { date: 'Thu', time: '10:00 AM', event: 'Inflation Data (CPI)', impact: 'Medium', type: 'inflation' },
  { date: 'Fri', time: '9:30 AM', event: 'Consumer Confidence', impact: 'Medium', type: 'sentiment' }
];

const portfolioAnalytics = {
  performance: [
    { period: '1D', return: 1.2 },
    { period: '1W', return: 3.8 },
    { period: '1M', return: 7.4 },
    { period: '3M', return: 12.6 },
    { period: '1Y', return: 18.9 }
  ],
  allocation: [
    { name: 'Technology', value: 45, color: '#3b82f6' },
    { name: 'Healthcare', value: 20, color: '#10b981' },
    { name: 'Finance', value: 15, color: '#f59e0b' },
    { name: 'Energy', value: 12, color: '#ef4444' },
    { name: 'Other', value: 8, color: '#8b5cf6' }
  ],
  riskMetrics: {
    beta: 1.15,
    sharpeRatio: 1.8,
    volatility: 18.4,
    maxDrawdown: -8.2
  }
};

const trendingChartData = [
  { time: '9:30', value: 100 },
  { time: '10:00', value: 102 },
  { time: '10:30', value: 98 },
  { time: '11:00', value: 105 },
  { time: '11:30', value: 108 },
  { time: '12:00', value: 106 },
  { time: '12:30', value: 111 },
  { time: '1:00', value: 109 }
];

interface InsightsProps {
  onBack?: () => void;
  onOpenAIInsightsHistory?: () => void;
}

export default function Insights({ onBack, onOpenAIInsightsHistory }: InsightsProps) {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'ai' | 'market' | 'portfolio'>('overview');

  const handleBack = () => {
    if (navigator.vibrate) {
      navigator.vibrate(5);
    }
    onBack?.();
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'ai', label: 'AI Insights', icon: Brain },
    { id: 'market', label: 'Market', icon: Globe },
    { id: 'portfolio', label: 'Portfolio', icon: PieChart }
  ];

  const SentimentIndicator = ({ sentiment, score }: { sentiment: string, score: number }) => (
    <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
      sentiment === 'Bullish' || sentiment === 'Positive' 
        ? 'bg-green-100 text-green-700' 
        : sentiment === 'Bearish' || sentiment === 'Negative'
        ? 'bg-red-100 text-red-700'
        : 'bg-yellow-100 text-yellow-700'
    }`}>
      {sentiment === 'Bullish' || sentiment === 'Positive' ? (
        <TrendingUp className="h-3 w-3" />
      ) : sentiment === 'Bearish' || sentiment === 'Negative' ? (
        <TrendingDown className="h-3 w-3" />
      ) : (
        <Activity className="h-3 w-3" />
      )}
      {sentiment} {score && `${score}%`}
    </div>
  );

  return (
    <div className="relative h-full w-full bg-background flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {onBack && (
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
              )}
              <h1 className="text-2xl font-bold text-foreground">Market Insights</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                marketSentiment.overall === 'Bullish' ? 'bg-green-500' : 'bg-red-500'
              } animate-pulse`}></div>
              <span className="text-sm text-muted-foreground">Live</span>
            </div>
          </div>
          
          {/* Tab Navigation */}
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`flex-1 flex flex-col items-center justify-center gap-0.5 px-2 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    selectedTab === tab.id
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                  <span className="text-[10px] leading-none">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          
          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <>
              {/* Market Overview Cards */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">S&P 500</span>
                    </div>
                    <div className="text-2xl font-bold text-green-900">4,456.32</div>
                    <div className="text-sm text-green-700">+1.24% (+54.2)</div>
                  </div>
                </Card>

                <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Market Sentiment</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-900">{marketSentiment.score}%</div>
                    <SentimentIndicator sentiment={marketSentiment.overall} score={0} />
                  </div>
                </Card>
              </div>

              {/* Market Heat Map */}
              <Card className="p-4 bg-card border border-border/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">Sector Performance</h3>
                  <Flame className="h-5 w-5 text-orange-500" />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {marketHeatMap.map((sector, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg transition-all duration-300 hover:scale-105 ${
                        sector.change > 0 ? 'bg-green-100' : 'bg-red-100'
                      }`}
                      style={{ minHeight: `${sector.size * 3}px` }}
                    >
                      <div className="text-xs font-medium text-foreground">{sector.sector}</div>
                      <div className={`text-lg font-bold ${
                        sector.change > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {sector.change > 0 ? '+' : ''}{sector.change}%
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Top Movers */}
              <div className="grid grid-cols-1 gap-4">
                <Card className="p-4 bg-card border border-border/50">
                  <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    Top Gainers
                  </h3>
                  <div className="space-y-2">
                    {topMovers.gainers.map((stock, index) => (
                      <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-lg">{stock.logo}</span>
                          <div>
                            <div className="font-medium text-foreground">{stock.ticker}</div>
                            <div className="text-xs text-muted-foreground">{stock.name}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-green-600">+{stock.change}%</div>
                          <div className="text-xs text-muted-foreground">{stock.volume}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </>
          )}

          {/* AI Insights Tab */}
          {selectedTab === 'ai' && (
            <>
              <div className="space-y-4">
                {aiInsights.map((insight) => (
                  <Card key={insight.id} className="p-4 bg-card border border-border/50">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <Brain className="h-5 w-5 text-purple-600" />
                          <h3 className="font-semibold text-foreground">{insight.title}</h3>
                        </div>
                        <div className="flex items-center gap-1 bg-purple-100 px-2 py-1 rounded-full">
                          <Zap className="h-3 w-3 text-purple-600" />
                          <span className="text-xs font-medium text-purple-700">{insight.confidence}%</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground">{insight.description}</p>
                      
                      {insight.stock && (
                        <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
                          <span className="text-lg">{insight.stock.logo}</span>
                          <span className="font-medium text-foreground">{insight.stock.ticker}</span>
                        </div>
                      )}
                      
                      {insight.factors && (
                        <div className="space-y-1">
                          <span className="text-xs font-medium text-muted-foreground">Key Factors:</span>
                          <div className="flex flex-wrap gap-1">
                            {insight.factors.map((factor, index) => (
                              <span key={index} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                                {factor}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between pt-2">
                        {insight.timeframe && (
                          <span className="text-xs text-muted-foreground">⏱️ {insight.timeframe}</span>
                        )}
                        <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                          View Details <ChevronRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              {/* Performance History Button */}
              <button 
                onClick={onOpenAIInsightsHistory}
                className="w-full mt-4 p-4 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg hover:from-purple-100 hover:to-purple-200 transition-all duration-200 active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-200 rounded-full">
                      <Clock className="h-5 w-5 text-purple-700" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-purple-900">Performance History</h3>
                      <p className="text-sm text-purple-700">Track AI prediction accuracy</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-purple-600" />
                </div>
              </button>
            </>
          )}

          {/* Market Tab */}
          {selectedTab === 'market' && (
            <>
              {/* Market Sentiment */}
              <Card className="p-4 bg-card border border-border/50">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-blue-600" />
                  Market Sentiment Analysis
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <span className="font-medium text-foreground">Social Media</span>
                      <div className="text-sm text-muted-foreground">{marketSentiment.social.mentions} mentions</div>
                    </div>
                    <div className="text-right">
                      <SentimentIndicator sentiment={marketSentiment.social.sentiment} score={0} />
                      <div className="text-xs text-green-600">+{marketSentiment.social.change}%</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div>
                      <span className="font-medium text-foreground">News Articles</span>
                      <div className="text-sm text-muted-foreground">{marketSentiment.news.articles} articles</div>
                    </div>
                    <div className="text-right">
                      <SentimentIndicator sentiment={marketSentiment.news.sentiment} score={0} />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Economic Calendar */}
              <Card className="p-4 bg-card border border-border/50">
                <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-orange-600" />
                  Economic Calendar
                </h3>
                <div className="space-y-2">
                  {economicEvents.map((event, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border/30 rounded-lg">
                      <div className="flex-1">
                        <div className="font-medium text-foreground">{event.event}</div>
                        <div className="text-sm text-muted-foreground">{event.date} • {event.time}</div>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        event.impact === 'High' 
                          ? 'bg-red-100 text-red-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {event.impact}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}

          {/* Portfolio Tab */}
          {selectedTab === 'portfolio' && (
            <>
              {/* Performance Chart */}
              <Card className="p-4 bg-card border border-border/50">
                <h3 className="text-lg font-semibold text-foreground mb-4">Portfolio Performance</h3>
                <div className="h-32 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={trendingChartData}>
                      <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#16a34a" 
                        fill="url(#colorGreen)" 
                        strokeWidth={2}
                      />
                      <defs>
                        <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {portfolioAnalytics.performance.map((period, index) => (
                    <div key={index} className="text-center">
                      <div className="text-xs text-muted-foreground">{period.period}</div>
                      <div className={`font-bold ${period.return > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        +{period.return}%
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Risk Metrics */}
              <Card className="p-4 bg-card border border-border/50">
                <h3 className="text-lg font-semibold text-foreground mb-4">Risk Analysis</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Beta</span>
                      <span className="font-medium text-foreground">{portfolioAnalytics.riskMetrics.beta}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Sharpe Ratio</span>
                      <span className="font-medium text-foreground">{portfolioAnalytics.riskMetrics.sharpeRatio}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Volatility</span>
                      <span className="font-medium text-foreground">{portfolioAnalytics.riskMetrics.volatility}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Max Drawdown</span>
                      <span className="font-medium text-red-600">{portfolioAnalytics.riskMetrics.maxDrawdown}%</span>
                    </div>
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
}