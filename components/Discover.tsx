import { useState } from "react";
import { Search, TrendingUp, TrendingDown, Users, Heart, MessageCircle, Share, Star, Filter, Eye, Zap, Target, Globe, Clock, ChevronRight, Play } from "lucide-react";
import { Card } from "./ui/card";
import { LineChart, Line, ResponsiveContainer } from "recharts";

// Mock data for trending stocks
const trendingStocks = [
  {
    id: '1',
    ticker: 'NVDA',
    name: 'NVIDIA Corp',
    logo: '🎯',
    price: 875.30,
    change: 15.75,
    changePercent: 1.83,
    socialMentions: 142500,
    sentiment: 'Very Bullish',
    volume: '145M',
    reason: 'AI chip demand surge',
    chartData: [{ value: 850 }, { value: 860 }, { value: 870 }, { value: 875 }]
  },
  {
    id: '2',
    ticker: 'TSLA',
    name: 'Tesla, Inc.',
    logo: '🚗',
    price: 248.50,
    change: 8.20,
    changePercent: 3.41,
    socialMentions: 89200,
    sentiment: 'Bullish',
    volume: '89M',
    reason: 'Delivery numbers beat expectations',
    chartData: [{ value: 240 }, { value: 242 }, { value: 246 }, { value: 249 }]
  },
  {
    id: '3',
    ticker: 'META',
    name: 'Meta Platforms',
    logo: '📘',
    price: 412.85,
    change: 12.40,
    changePercent: 3.10,
    socialMentions: 67300,
    sentiment: 'Bullish',
    volume: '67M',
    reason: 'VR/AR momentum building',
    chartData: [{ value: 400 }, { value: 405 }, { value: 410 }, { value: 413 }]
  }
];

// Social trading feed data
const socialFeed = [
  {
    id: '1',
    user: { name: 'Alex Chen', avatar: '👨‍💻', followers: 1240, verified: true },
    action: 'bought',
    stock: { ticker: 'AAPL', logo: '🍎' },
    amount: '$25,000',
    reason: 'Strong Q4 earnings and iPhone demand',
    timestamp: '2m ago',
    likes: 47,
    comments: 12,
    performance: '+12.4%'
  },
  {
    id: '2',
    user: { name: 'Sarah Kim', avatar: '👩‍🚀', followers: 2180, verified: true },
    action: 'sold',
    stock: { ticker: 'NFLX', logo: '🎬' },
    amount: '$15,000',
    reason: 'Taking profits before earnings',
    timestamp: '5m ago',
    likes: 23,
    comments: 8,
    performance: '+8.7%'
  },
  {
    id: '3',
    user: { name: 'Mike Ross', avatar: '⚡', followers: 890, verified: false },
    action: 'watching',
    stock: { ticker: 'AMD', logo: '💎' },
    reason: 'Waiting for dip to $140 support level',
    timestamp: '12m ago',
    likes: 18,
    comments: 5
  }
];

// AI-powered recommendations
const aiRecommendations = [
  {
    id: '1',
    type: 'breakout',
    title: 'Technical Breakout Alert',
    stock: { ticker: 'CRM', name: 'Salesforce', logo: '☁️' },
    confidence: 89,
    timeframe: '1-2 weeks',
    reason: 'Breaking above 200-day MA with volume',
    expectedMove: '+15%'
  },
  {
    id: '2',
    type: 'value',
    title: 'Undervalued Opportunity',
    stock: { ticker: 'BABA', name: 'Alibaba', logo: '🛒' },
    confidence: 76,
    timeframe: '1-3 months',
    reason: 'Trading below fair value, China recovery',
    expectedMove: '+25%'
  },
  {
    id: '3',
    type: 'momentum',
    title: 'Momentum Play',
    stock: { ticker: 'PLTR', name: 'Palantir', logo: '🔮' },
    confidence: 82,
    timeframe: '2-4 weeks',
    reason: 'Government contracts acceleration',
    expectedMove: '+20%'
  }
];

// Market themes
const marketThemes = [
  {
    id: '1',
    title: 'AI & Machine Learning',
    description: '15 stocks riding the AI wave',
    performance: '+28.4%',
    stocks: ['NVDA', 'MSFT', 'GOOGL', 'AMZN'],
    color: 'from-purple-500 to-pink-500',
    icon: '🤖'
  },
  {
    id: '2',
    title: 'Clean Energy Revolution',
    description: '12 stocks powering the future',
    performance: '+18.7%',
    stocks: ['TSLA', 'NEE', 'ENPH', 'FSLR'],
    color: 'from-green-500 to-emerald-500',
    icon: '🌱'
  },
  {
    id: '3',
    title: 'Cybersecurity Leaders',
    description: '8 stocks protecting digital assets',
    performance: '+22.1%',
    stocks: ['CRM', 'PANW', 'CRWD', 'ZS'],
    color: 'from-blue-500 to-cyan-500',
    icon: '🛡️'
  }
];

interface DiscoverProps {}

export default function Discover({}: DiscoverProps) {
  const [selectedTab, setSelectedTab] = useState<'trending' | 'social' | 'ai' | 'themes'>('trending');
  const [searchQuery, setSearchQuery] = useState('');

  const tabs = [
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'social', label: 'Social', icon: Users },
    { id: 'ai', label: 'AI Picks', icon: Zap },
    { id: 'themes', label: 'Themes', icon: Target }
  ];

  const formatSocialMentions = (mentions: number) => {
    if (mentions >= 1000000) return `${(mentions / 1000000).toFixed(1)}M`;
    if (mentions >= 1000) return `${(mentions / 1000).toFixed(1)}K`;
    return mentions.toString();
  };

  const SocialAction = ({ action }: { action: string }) => {
    const colors = {
      bought: 'text-green-600 bg-green-100',
      sold: 'text-red-600 bg-red-100',
      watching: 'text-blue-600 bg-blue-100'
    };
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[action as keyof typeof colors] || 'text-gray-600 bg-gray-100'}`}>
        {action}
      </span>
    );
  };

  return (
    <div className="relative h-full w-full bg-background flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-foreground">Discover</h1>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-muted rounded-full transition-colors">
                <Filter className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stocks, themes, or traders..."
              className="w-full pl-9 pr-4 py-2.5 bg-muted/50 rounded-lg text-foreground placeholder-muted-foreground border-0 focus:outline-none focus:ring-1 focus:ring-foreground/20 focus:bg-muted transition-all duration-200"
            />
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
          
          {/* Trending Tab */}
          {selectedTab === 'trending' && (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">🔥 Trending Now</h3>
                  <span className="text-sm text-muted-foreground">Updated 2m ago</span>
                </div>
                
                {trendingStocks.map((stock, index) => (
                  <Card key={stock.id} className="p-4 bg-card border border-border/50">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <span className="text-2xl">{stock.logo}</span>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">{index + 1}</span>
                            </div>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-foreground">{stock.ticker}</span>
                              <span className="text-sm text-muted-foreground">{stock.name}</span>
                            </div>
                            <div className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded-full inline-block mt-1">
                              {stock.reason}
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="font-bold text-foreground">${stock.price}</div>
                          <div className={`text-sm flex items-center gap-1 ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {stock.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                            +{stock.change} ({stock.changePercent}%)
                          </div>
                        </div>
                      </div>

                      {/* Mini Chart */}
                      <div className="h-12">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={stock.chartData}>
                            <Line 
                              type="monotone" 
                              dataKey="value" 
                              stroke="#16a34a" 
                              strokeWidth={2}
                              dot={false}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3" />
                            {formatSocialMentions(stock.socialMentions)} mentions
                          </div>
                          <div className="flex items-center gap-1">
                            <Globe className="h-3 w-3" />
                            {stock.volume} volume
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <button className="p-1.5 hover:bg-muted rounded-full transition-colors">
                            <Heart className="h-4 w-4 text-muted-foreground" />
                          </button>
                          <button className="p-1.5 hover:bg-muted rounded-full transition-colors">
                            <Share className="h-4 w-4 text-muted-foreground" />
                          </button>
                          <button className="p-1.5 hover:bg-muted rounded-full transition-colors">
                            <Eye className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* Social Tab */}
          {selectedTab === 'social' && (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">👥 Community Feed</h3>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Follow Traders
                  </button>
                </div>
                
                {socialFeed.map((post) => (
                  <Card key={post.id} className="p-4 bg-card border border-border/50">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{post.user.avatar}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-foreground">{post.user.name}</span>
                              {post.user.verified && (
                                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                  <span className="text-white text-xs">✓</span>
                                </div>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {formatSocialMentions(post.user.followers)} followers • {post.timestamp}
                            </div>
                          </div>
                        </div>
                        
                        {post.performance && (
                          <div className="text-green-600 text-sm font-medium bg-green-100 px-2 py-1 rounded-full">
                            {post.performance} YTD
                          </div>
                        )}
                      </div>

                      <div className="pl-11 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <SocialAction action={post.action} />
                          <span className="text-2xl">{post.stock.logo}</span>
                          <span className="font-medium text-foreground">{post.stock.ticker}</span>
                          {post.amount && (
                            <span className="text-muted-foreground">{post.amount}</span>
                          )}
                        </div>
                        
                        <p className="text-sm text-foreground">{post.reason}</p>
                        
                        <div className="flex items-center gap-4 text-muted-foreground">
                          <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                            <Heart className="h-4 w-4" />
                            {post.likes}
                          </button>
                          <button className="flex items-center gap-1 hover:text-blue-500 transition-colors">
                            <MessageCircle className="h-4 w-4" />
                            {post.comments}
                          </button>
                          <button className="flex items-center gap-1 hover:text-foreground transition-colors">
                            <Share className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* AI Picks Tab */}
          {selectedTab === 'ai' && (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Zap className="h-5 w-5 text-yellow-500" />
                    AI-Powered Recommendations
                  </h3>
                  <span className="text-sm text-muted-foreground">Updated hourly</span>
                </div>
                
                {aiRecommendations.map((rec) => (
                  <Card key={rec.id} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200">
                    <div className="space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{rec.stock.logo}</span>
                          <div>
                            <div className="font-bold text-foreground">{rec.stock.ticker}</div>
                            <div className="text-sm text-muted-foreground">{rec.stock.name}</div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <div className="flex items-center gap-1 bg-purple-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                            <Zap className="h-3 w-3" />
                            {rec.confidence}% confidence
                          </div>
                          <div className="text-sm text-green-600 font-medium mt-1">
                            {rec.expectedMove} potential
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-medium text-purple-900">{rec.title}</h4>
                        <p className="text-sm text-purple-700">{rec.reason}</p>
                        
                        <div className="flex items-center gap-3 text-xs text-purple-600">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {rec.timeframe}
                          </div>
                          <div className={`px-2 py-1 rounded-full ${
                            rec.type === 'breakout' ? 'bg-green-100 text-green-700' :
                            rec.type === 'value' ? 'bg-blue-100 text-blue-700' :
                            'bg-orange-100 text-orange-700'
                          }`}>
                            {rec.type.charAt(0).toUpperCase() + rec.type.slice(1)}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2">
                        <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                          View Analysis
                        </button>
                        <div className="flex gap-2">
                          <button className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs rounded-lg transition-colors">
                            Add to Watchlist
                          </button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* Themes Tab */}
          {selectedTab === 'themes' && (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-foreground">🎯 Market Themes</h3>
                  <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                    Create Custom Theme
                  </button>
                </div>
                
                {marketThemes.map((theme) => (
                  <Card key={theme.id} className="p-0 overflow-hidden bg-card border border-border/50">
                    <div className={`p-4 bg-gradient-to-r ${theme.color} text-white`}>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{theme.icon}</span>
                          <div>
                            <h4 className="font-bold">{theme.title}</h4>
                            <p className="text-sm opacity-90">{theme.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold">{theme.performance}</div>
                          <div className="text-sm opacity-90">30-day return</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Top Holdings:</span>
                        <button className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium">
                          View All <ChevronRight className="h-3 w-3" />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-2 flex-wrap">
                        {theme.stocks.map((ticker, index) => (
                          <span key={index} className="bg-muted text-foreground px-2 py-1 rounded-lg text-sm font-medium">
                            {ticker}
                          </span>
                        ))}
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        <button className="flex-1 bg-foreground text-background py-2 px-4 rounded-lg text-sm font-medium hover:bg-foreground/90 transition-colors">
                          Follow Theme
                        </button>
                        <button className="px-4 py-2 border border-border rounded-lg text-sm font-medium hover:bg-muted/50 transition-colors">
                          <Eye className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}