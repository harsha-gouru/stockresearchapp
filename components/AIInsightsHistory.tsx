import { useState, useMemo } from "react";
import { 
  ChevronLeft, 
  CheckCircle, 
  XCircle, 
  Activity, 
  Award, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Target,
  AlertCircle
} from "lucide-react";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";
import { Card } from "./ui/card";

// TypeScript interfaces
interface PredictionRecord {
  id: string;
  date: string;
  ticker: string;
  tickerLogo: string;
  predictedChange: number;
  actualChange: number;
  confidence: number;
  timeframe: string;
  type: 'buy' | 'sell' | 'hold';
  accuracy: number;
  result: 'correct' | 'incorrect' | 'partial';
}

interface HistoryMetrics {
  overallAccuracy: number;
  winRate: number;
  totalPredictions: number;
  correctPredictions: number;
  incorrectPredictions: number;
  partialPredictions: number;
  bestStock: { ticker: string; accuracy: number };
  worstStock: { ticker: string; accuracy: number };
  currentStreak: number;
  bestStreak: number;
}

interface AIInsightsHistoryProps {
  onBack?: () => void;
}

// Mock historical prediction data
const predictionHistory: PredictionRecord[] = [
  {
    id: '1',
    date: '2024-01-15',
    ticker: 'AAPL',
    tickerLogo: '🍎',
    predictedChange: 3.2,
    actualChange: 3.8,
    confidence: 92,
    timeframe: '1 week',
    type: 'buy',
    accuracy: 88,
    result: 'correct'
  },
  {
    id: '2',
    date: '2024-01-14',
    ticker: 'TSLA',
    tickerLogo: '🚗',
    predictedChange: -2.1,
    actualChange: -1.8,
    confidence: 85,
    timeframe: '3 days',
    type: 'sell',
    accuracy: 91,
    result: 'correct'
  },
  {
    id: '3',
    date: '2024-01-13',
    ticker: 'MSFT',
    tickerLogo: '💻',
    predictedChange: 1.5,
    actualChange: -0.5,
    confidence: 78,
    timeframe: '1 week',
    type: 'buy',
    accuracy: 0,
    result: 'incorrect'
  },
  {
    id: '4',
    date: '2024-01-12',
    ticker: 'NVDA',
    tickerLogo: '🎯',
    predictedChange: 4.2,
    actualChange: 5.1,
    confidence: 94,
    timeframe: '2 weeks',
    type: 'buy',
    accuracy: 85,
    result: 'correct'
  },
  {
    id: '5',
    date: '2024-01-11',
    ticker: 'GOOGL',
    tickerLogo: '🔍',
    predictedChange: 2.3,
    actualChange: 2.1,
    confidence: 88,
    timeframe: '1 week',
    type: 'buy',
    accuracy: 93,
    result: 'correct'
  },
  {
    id: '6',
    date: '2024-01-10',
    ticker: 'META',
    tickerLogo: '📘',
    predictedChange: -1.5,
    actualChange: -2.2,
    confidence: 82,
    timeframe: '5 days',
    type: 'sell',
    accuracy: 76,
    result: 'correct'
  },
  {
    id: '7',
    date: '2024-01-09',
    ticker: 'AAPL',
    tickerLogo: '🍎',
    predictedChange: 1.8,
    actualChange: 2.1,
    confidence: 90,
    timeframe: '3 days',
    type: 'buy',
    accuracy: 89,
    result: 'correct'
  },
  {
    id: '8',
    date: '2024-01-08',
    ticker: 'AMZN',
    tickerLogo: '📦',
    predictedChange: 2.5,
    actualChange: -1.3,
    confidence: 75,
    timeframe: '1 week',
    type: 'buy',
    accuracy: 0,
    result: 'incorrect'
  },
  {
    id: '9',
    date: '2024-01-07',
    ticker: 'TSLA',
    tickerLogo: '🚗',
    predictedChange: 3.7,
    actualChange: 4.2,
    confidence: 91,
    timeframe: '1 week',
    type: 'buy',
    accuracy: 91,
    result: 'correct'
  },
  {
    id: '10',
    date: '2024-01-06',
    ticker: 'NVDA',
    tickerLogo: '🎯',
    predictedChange: 0,
    actualChange: 0.3,
    confidence: 80,
    timeframe: '3 days',
    type: 'hold',
    accuracy: 92,
    result: 'correct'
  }
];

// Generate accuracy trend data
const generateAccuracyTrend = () => {
  const dates = ['Jan 1', 'Jan 5', 'Jan 10', 'Jan 15', 'Jan 20', 'Jan 25'];
  const accuracies = [68, 72, 75, 78, 76, 81];
  return dates.map((date, index) => ({
    date,
    accuracy: accuracies[index]
  }));
};

// Generate comparison data for bar chart
const generateComparisonData = () => {
  return predictionHistory.slice(0, 6).map(record => ({
    ticker: record.ticker,
    predicted: record.predictedChange,
    actual: record.actualChange
  }));
};

export default function AIInsightsHistory({ onBack }: AIInsightsHistoryProps) {
  const [selectedFilter, setSelectedFilter] = useState<'all' | '7d' | '30d' | '90d'>('30d');

  // Calculate metrics
  const metrics = useMemo<HistoryMetrics>(() => {
    const correct = predictionHistory.filter(p => p.result === 'correct').length;
    const incorrect = predictionHistory.filter(p => p.result === 'incorrect').length;
    const partial = predictionHistory.filter(p => p.result === 'partial').length;
    const total = predictionHistory.length;
    
    // Calculate per-stock accuracy
    const stockAccuracy = predictionHistory.reduce((acc, pred) => {
      if (!acc[pred.ticker]) {
        acc[pred.ticker] = { correct: 0, total: 0 };
      }
      acc[pred.ticker].total++;
      if (pred.result === 'correct') {
        acc[pred.ticker].correct++;
      }
      return acc;
    }, {} as Record<string, { correct: number; total: number }>);

    const stockAccuracyArray = Object.entries(stockAccuracy).map(([ticker, data]) => ({
      ticker,
      accuracy: (data.correct / data.total) * 100
    }));

    const bestStock = stockAccuracyArray.reduce((best, current) => 
      current.accuracy > best.accuracy ? current : best
    );
    
    const worstStock = stockAccuracyArray.reduce((worst, current) => 
      current.accuracy < worst.accuracy ? current : worst
    );

    return {
      overallAccuracy: Math.round((correct / total) * 100),
      winRate: Math.round((correct / (correct + incorrect)) * 100),
      totalPredictions: total,
      correctPredictions: correct,
      incorrectPredictions: incorrect,
      partialPredictions: partial,
      bestStock,
      worstStock,
      currentStreak: 3,
      bestStreak: 7
    };
  }, []);

  const accuracyTrend = generateAccuracyTrend();
  const comparisonData = generateComparisonData();

  const handleBack = () => {
    if (navigator.vibrate) {
      navigator.vibrate(5);
    }
    onBack?.();
  };

  return (
    <div className="relative h-full w-full bg-background flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={handleBack}
                className="group relative flex items-center gap-2 px-3 py-2 rounded-full hover:bg-muted/50 active:bg-muted/70 transition-all duration-300 ease-out active:scale-95"
                aria-label="Go back"
              >
                <div className="relative overflow-hidden">
                  <ChevronLeft className="h-5 w-5 text-foreground transition-all duration-300 ease-out group-hover:-translate-x-0.5 group-active:scale-90" />
                </div>
                <span className="text-foreground font-medium">Back</span>
              </button>
              <h1 className="text-2xl font-bold text-foreground">AI Performance</h1>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${
                metrics.overallAccuracy >= 70 ? 'bg-green-500' : 'bg-yellow-500'
              } animate-pulse`}></div>
              <span className="text-sm text-muted-foreground">
                {metrics.overallAccuracy}% Accurate
              </span>
            </div>
          </div>

          {/* Time Filter */}
          <div className="flex gap-2 mt-4">
            {(['7d', '30d', '90d', 'all'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedFilter === filter
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:bg-muted/50'
                }`}
              >
                {filter === 'all' ? 'All Time' : `Last ${filter}`}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 space-y-6">
          
          {/* Metrics Summary Cards */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700">Overall Accuracy</p>
                  <p className="text-2xl font-bold text-green-900">{metrics.overallAccuracy}%</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </Card>

            <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700">Win Rate</p>
                  <p className="text-2xl font-bold text-blue-900">{metrics.winRate}%</p>
                </div>
                <Award className="h-8 w-8 text-blue-600" />
              </div>
            </Card>

            <Card className="p-4 bg-card border border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Correct</p>
                  <p className="text-2xl font-bold text-green-600">{metrics.correctPredictions}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-500" />
              </div>
            </Card>

            <Card className="p-4 bg-card border border-border/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Incorrect</p>
                  <p className="text-2xl font-bold text-red-600">{metrics.incorrectPredictions}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-500" />
              </div>
            </Card>
          </div>

          {/* Accuracy Trend Chart */}
          <Card className="p-4 bg-card border border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-4">Accuracy Trend</h3>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={accuracyTrend}>
                  <defs>
                    <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#16a34a" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#16a34a" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#888" fontSize={10} />
                  <YAxis stroke="#888" fontSize={10} domain={[0, 100]} />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="accuracy" 
                    stroke="#16a34a" 
                    fill="url(#colorAccuracy)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Predicted vs Actual Chart */}
          <Card className="p-4 bg-card border border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Predictions</h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="ticker" stroke="#888" fontSize={10} />
                  <YAxis stroke="#888" fontSize={10} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="predicted" fill="#8b5cf6" name="Predicted %" />
                  <Bar dataKey="actual" fill="#3b82f6" name="Actual %" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* Best & Worst Performers */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4 bg-card border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-foreground">Best Performer</h4>
              </div>
              <div className="text-center py-2">
                <p className="text-2xl font-bold text-green-600">{metrics.bestStock.ticker}</p>
                <p className="text-sm text-muted-foreground">
                  {Math.round(metrics.bestStock.accuracy)}% accuracy
                </p>
              </div>
            </Card>

            <Card className="p-4 bg-card border border-border/50">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-5 w-5 text-red-600" />
                <h4 className="font-semibold text-foreground">Needs Improvement</h4>
              </div>
              <div className="text-center py-2">
                <p className="text-2xl font-bold text-red-600">{metrics.worstStock.ticker}</p>
                <p className="text-sm text-muted-foreground">
                  {Math.round(metrics.worstStock.accuracy)}% accuracy
                </p>
              </div>
            </Card>
          </div>

          {/* Detailed History List */}
          <Card className="p-4 bg-card border border-border/50">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              Prediction History
            </h3>
            <div className="space-y-2">
              {predictionHistory.map((record) => (
                <div 
                  key={record.id} 
                  className="flex items-center justify-between p-3 border border-border/30 rounded-lg hover:bg-muted/30 transition-all duration-200"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{record.tickerLogo}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{record.ticker}</span>
                        <span className="text-xs text-muted-foreground">{record.date}</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Predicted: {record.predictedChange > 0 ? '+' : ''}{record.predictedChange}% 
                        <span className="mx-2">→</span>
                        Actual: {record.actualChange > 0 ? '+' : ''}{record.actualChange}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {record.result === 'correct' ? (
                      <div className="flex items-center gap-1 px-2 py-1 bg-green-100 rounded-full">
                        <CheckCircle className="h-3 w-3 text-green-600" />
                        <span className="text-xs font-medium text-green-700">{record.accuracy}%</span>
                      </div>
                    ) : record.result === 'incorrect' ? (
                      <div className="flex items-center gap-1 px-2 py-1 bg-red-100 rounded-full">
                        <XCircle className="h-3 w-3 text-red-600" />
                        <span className="text-xs font-medium text-red-700">Miss</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 px-2 py-1 bg-yellow-100 rounded-full">
                        <AlertCircle className="h-3 w-3 text-yellow-600" />
                        <span className="text-xs font-medium text-yellow-700">Partial</span>
                      </div>
                    )}
                    
                    <div className={`px-2 py-1 rounded text-xs font-medium ${
                      record.type === 'buy' 
                        ? 'bg-green-100 text-green-700' 
                        : record.type === 'sell'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}>
                      {record.type.toUpperCase()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Insights Summary */}
          <Card className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200">
            <div className="flex items-start gap-3">
              <Target className="h-6 w-6 text-purple-600 mt-1" />
              <div>
                <h4 className="font-semibold text-purple-900 mb-2">AI Learning Progress</h4>
                <p className="text-sm text-purple-700 mb-2">
                  The AI model has shown consistent improvement, with accuracy increasing from 68% to {metrics.overallAccuracy}% over the past month.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
                    Best on tech stocks
                  </span>
                  <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
                    {metrics.currentStreak} day streak
                  </span>
                  <span className="text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full">
                    {metrics.totalPredictions} total predictions
                  </span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
