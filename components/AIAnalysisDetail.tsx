import { useState } from "react";
import { ArrowLeft, Share2, ChevronDown, ChevronUp, TrendingUp, TrendingDown } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, PieChart, Pie, Cell, BarChart, Bar } from "recharts";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

// Mock data
const mockStock = {
  ticker: "AAPL",
  name: "Apple Inc.",
  currentPrice: 195.76,
  logo: "🍎"
};

const predictionData = {
  oneWeekPrediction: {
    target: 208.50,
    low: 202.30,
    high: 214.70,
    confidence: 87
  },
  targetPrice: 225.00,
  riskScore: 3.2
};

const technicalIndicators = [
  { name: "RSI", value: 68.4, status: "neutral", description: "Slightly overbought territory" },
  { name: "MACD", value: 2.15, status: "bullish", description: "Positive momentum signal" },
  { name: "MA (50)", value: 189.25, status: "bullish", description: "Price above moving average" },
  { name: "MA (200)", value: 182.40, status: "bullish", description: "Strong uptrend confirmed" }
];

const sentimentData = {
  news: 78, // percentage positive
  social: 65, // percentage positive
  analysts: [
    { rating: "Strong Buy", count: 12, color: "#16a34a" },
    { rating: "Buy", count: 8, color: "#22c55e" },
    { rating: "Hold", count: 5, color: "#eab308" },
    { rating: "Sell", count: 2, color: "#ef4444" },
    { rating: "Strong Sell", count: 1, color: "#dc2626" }
  ]
};

const historicalAccuracy = [
  { month: "Sep", accuracy: 82 },
  { month: "Oct", accuracy: 78 },
  { month: "Nov", accuracy: 85 },
  { month: "Dec", accuracy: 91 },
  { month: "Jan", accuracy: 87 }
];

const predictionReasons = [
  "Strong quarterly earnings growth exceeding analyst expectations by 8.2%",
  "iPhone 15 sales momentum continuing into Q2 with 12% year-over-year growth",
  "Services revenue showing consistent 15% quarterly growth pattern",
  "Technical breakout above key resistance level at $195 with high volume",
  "Positive analyst revisions with 3 recent price target upgrades",
  "Market sentiment improving with reduced concerns about supply chain disruptions"
];

interface AIAnalysisDetailProps {
  onBack?: () => void;
}

export default function AIAnalysisDetail({ onBack }: AIAnalysisDetailProps) {
  const [isReasoningExpanded, setIsReasoningExpanded] = useState(false);

  const handleShare = () => {
    console.log("Share insights");
  };

  const getRiskColor = (score: number) => {
    if (score <= 3) return "text-green-600";
    if (score <= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getRiskLabel = (score: number) => {
    if (score <= 3) return "Low Risk";
    if (score <= 6) return "Medium Risk";
    return "High Risk";
  };

  return (
    <div className="relative h-full w-full bg-background overflow-y-auto">
      {/* Sticky Header */}
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur-sm border-b border-border">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-muted rounded-full transition-colors">
              <ArrowLeft className="h-6 w-6 text-foreground" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm">
                {mockStock.logo}
              </div>
              <span className="font-medium text-foreground">{mockStock.ticker}</span>
            </div>
          </div>
          <button onClick={handleShare} className="p-2 hover:bg-muted rounded-full transition-colors">
            <Share2 className="h-5 w-5 text-foreground" />
          </button>
        </div>
      </header>

      <div className="p-6 space-y-8">
        {/* AI Prediction Summary Card */}
        <Card className="p-6 shadow-sm border border-border bg-card">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl text-foreground">AI Prediction Summary</h2>
              <Badge variant="outline" className="text-green-600 border-green-600">
                Bullish
              </Badge>
            </div>

            {/* 1-Week Prediction */}
            <div className="space-y-4">
              <div>
                <h3 className="text-foreground mb-2">1-Week Price Prediction</h3>
                <div className="flex items-end gap-4">
                  <div>
                    <span className="text-2xl text-foreground">${predictionData.oneWeekPrediction.target}</span>
                    <span className="text-sm text-muted-foreground ml-2">Target</span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Range: ${predictionData.oneWeekPrediction.low} - ${predictionData.oneWeekPrediction.high}
                  </div>
                </div>
                
                {/* Confidence Interval Visual */}
                <div className="mt-4 relative">
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                      style={{ width: `${predictionData.oneWeekPrediction.confidence}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>${predictionData.oneWeekPrediction.low}</span>
                    <span>{predictionData.oneWeekPrediction.confidence}% Confidence</span>
                    <span>${predictionData.oneWeekPrediction.high}</span>
                  </div>
                </div>
              </div>

              {/* Target Price & Risk Score */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">12-Month Target</p>
                  <p className="text-xl text-foreground">${predictionData.targetPrice}</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">Risk Score</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-xl ${getRiskColor(predictionData.riskScore)}`}>
                      {predictionData.riskScore}/10
                    </span>
                    <span className={`text-sm ${getRiskColor(predictionData.riskScore)}`}>
                      {getRiskLabel(predictionData.riskScore)}
                    </span>
                  </div>
                  {/* Risk Scale Visual */}
                  <div className="flex gap-1">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-2 w-3 rounded-sm ${
                          i < Math.floor(predictionData.riskScore)
                            ? predictionData.riskScore <= 3 ? 'bg-green-500'
                            : predictionData.riskScore <= 6 ? 'bg-yellow-500'
                            : 'bg-red-500'
                            : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Why This Prediction? */}
        <Card className="p-6 shadow-sm border border-border bg-card">
          <Collapsible open={isReasoningExpanded} onOpenChange={setIsReasoningExpanded}>
            <CollapsibleTrigger className="flex items-center justify-between w-full">
              <h3 className="text-lg text-foreground">Why this prediction?</h3>
              {isReasoningExpanded ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <div className="space-y-3">
                {predictionReasons.map((reason, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    <p className="text-sm text-foreground">{reason}</p>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </Card>

        {/* Technical Indicators Dashboard */}
        <Card className="p-6 shadow-sm border border-border bg-card">
          <h3 className="text-lg text-foreground mb-6">Technical Indicators</h3>
          <div className="grid grid-cols-2 gap-4">
            {technicalIndicators.map((indicator, index) => (
              <div key={index} className="p-4 rounded-lg border border-border bg-background">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-foreground font-medium">{indicator.name}</span>
                  <div className={`w-3 h-3 rounded-full ${
                    indicator.status === 'bullish' ? 'bg-green-500' :
                    indicator.status === 'bearish' ? 'bg-red-500' : 'bg-yellow-500'
                  }`} />
                </div>
                <p className="text-xl text-foreground mb-1">{indicator.value}</p>
                <p className="text-xs text-muted-foreground">{indicator.description}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* Sentiment Analysis */}
        <Card className="p-6 shadow-sm border border-border bg-card">
          <h3 className="text-lg text-foreground mb-6">Sentiment Analysis</h3>
          
          <div className="space-y-6">
            {/* News & Social Sentiment */}
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="text-foreground">News Sentiment</h4>
                <div className="relative">
                  <div className="w-20 h-20 mx-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { value: sentimentData.news, fill: "#16a34a" },
                            { value: 100 - sentimentData.news, fill: "#e5e7eb" }
                          ]}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          innerRadius={25}
                          outerRadius={35}
                          startAngle={90}
                          endAngle={-270}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-lg text-foreground">{sentimentData.news}%</span>
                    <p className="text-xs text-muted-foreground">Positive</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-foreground">Social Buzz</h4>
                <div className="relative">
                  <div className="w-20 h-20 mx-auto">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={[
                            { value: sentimentData.social, fill: "#3b82f6" },
                            { value: 100 - sentimentData.social, fill: "#e5e7eb" }
                          ]}
                          dataKey="value"
                          cx="50%"
                          cy="50%"
                          innerRadius={25}
                          outerRadius={35}
                          startAngle={90}
                          endAngle={-270}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="text-center mt-2">
                    <span className="text-lg text-foreground">{sentimentData.social}%</span>
                    <p className="text-xs text-muted-foreground">Positive</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Analyst Ratings */}
            <div className="space-y-3">
              <h4 className="text-foreground">Analyst Ratings Distribution</h4>
              <div className="h-32">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sentimentData.analysts} layout="horizontal">
                    <XAxis type="number" axisLine={false} tickLine={false} />
                    <YAxis 
                      type="category" 
                      dataKey="rating" 
                      axisLine={false} 
                      tickLine={false}
                      tick={{ fontSize: 12 }}
                    />
                    <Bar dataKey="count" fill="#8884d8" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </Card>

        {/* Historical Accuracy */}
        <Card className="p-6 shadow-sm border border-border bg-card">
          <h3 className="text-lg text-foreground mb-6">Historical AI Accuracy</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalAccuracy}>
                <XAxis 
                  dataKey="month" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                />
                <YAxis 
                  domain={[70, 95]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: 'var(--color-muted-foreground)' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="accuracy" 
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center mt-4">
            <div className="text-center">
              <p className="text-2xl text-foreground">87%</p>
              <p className="text-sm text-muted-foreground">Average Accuracy</p>
            </div>
          </div>
        </Card>

        {/* Share Button */}
        <div className="pb-8">
          <Button 
            onClick={handleShare}
            className="w-full bg-foreground text-background hover:bg-foreground/90 shadow-sm"
            size="lg"
          >
            <Share2 className="h-5 w-5 mr-2" />
            Share AI Insights
          </Button>
        </div>
      </div>
    </div>
  );
}