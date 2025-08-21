import { useState } from "react";
import { X, TrendingUp, TrendingDown, Bell, Percent, Volume2, Target } from "lucide-react";
import { Card } from "./ui/card";

interface QuickAlertSetupProps {
  stock: {
    ticker: string;
    name: string;
    price: number;
    changePercent: number;
    logo: string;
  };
  onClose?: () => void;
  onCreateAlert?: (alert: any) => void;
}

export default function QuickAlertSetup({ stock, onClose, onCreateAlert }: QuickAlertSetupProps) {
  const [selectedType, setSelectedType] = useState<'price_above' | 'price_below' | 'percent_change' | 'volume_spike'>('price_above');
  const [targetValue, setTargetValue] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const alertTypes = [
    {
      id: 'price_above',
      label: 'Price Above',
      icon: TrendingUp,
      color: 'text-green-600 bg-green-100',
      description: 'Alert when price goes above target',
      placeholder: `${(stock.price * 1.05).toFixed(2)}`
    },
    {
      id: 'price_below',
      label: 'Price Below',
      icon: TrendingDown,
      color: 'text-red-600 bg-red-100',
      description: 'Alert when price drops below target',
      placeholder: `${(stock.price * 0.95).toFixed(2)}`
    },
    {
      id: 'percent_change',
      label: '% Change',
      icon: Percent,
      color: 'text-purple-600 bg-purple-100',
      description: 'Alert on percentage change',
      placeholder: '5'
    },
    {
      id: 'volume_spike',
      label: 'Volume Spike',
      icon: Volume2,
      color: 'text-blue-600 bg-blue-100',
      description: 'Alert on unusual volume',
      placeholder: '200'
    }
  ];

  const handleCreateAlert = async () => {
    if (!targetValue) return;

    setIsCreating(true);
    if (navigator.vibrate) {
      navigator.vibrate([10, 50, 10]);
    }

    // Simulate API call
    setTimeout(() => {
      const newAlert = {
        id: Date.now().toString(),
        type: selectedType,
        targetValue: parseFloat(targetValue),
        stock: stock.ticker,
        createdAt: new Date()
      };

      onCreateAlert?.(newAlert);
      setIsCreating(false);
      onClose?.();
    }, 1000);
  };

  const getCurrentValue = () => {
    switch (selectedType) {
      case 'price_above':
      case 'price_below':
        return `$${stock.price.toFixed(2)}`;
      case 'percent_change':
        return `${stock.changePercent.toFixed(2)}%`;
      case 'volume_spike':
        return 'Normal';
      default:
        return '';
    }
  };

  const getTargetLabel = () => {
    switch (selectedType) {
      case 'price_above':
      case 'price_below':
        return 'Target Price ($)';
      case 'percent_change':
        return 'Change Percentage (%)';
      case 'volume_spike':
        return 'Volume Increase (%)';
      default:
        return 'Target Value';
    }
  };

  const selectedAlertType = alertTypes.find(type => type.id === selectedType);

  return (
    <div 
      className="fixed inset-0 bg-black/75 backdrop-blur-md flex items-end sm:items-center justify-center z-50 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <Card 
        className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-2xl rounded-t-3xl sm:rounded-2xl animate-in slide-in-from-bottom sm:zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with Drag Handle */}
        <div className="sm:hidden w-12 h-1.5 bg-gray-400 dark:bg-gray-600 rounded-full mx-auto mt-3 mb-2" />
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30 flex items-center justify-center text-xl">
              {stock.logo}
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Set Price Alert</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{stock.ticker} • ${stock.price.toFixed(2)}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="group p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all duration-200 active:scale-95"
          >
            <X className="h-5 w-5 text-gray-500 dark:text-gray-400 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[60vh] sm:max-h-[70vh] overflow-y-auto">
          {/* Alert Type Selection */}
          <div>
            <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">Alert Type</h3>
            <div className="grid grid-cols-2 gap-2">
              {alertTypes.map((type) => {
                const IconComponent = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => {
                      setSelectedType(type.id as any);
                      setTargetValue('');
                    }}
                    className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                      selectedType === type.id
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                        : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${type.color}`}>
                        <IconComponent className="h-3 w-3" />
                      </div>
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{type.label}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{type.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target Value Input */}
          <div>
            <label className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2 block">
              {getTargetLabel()}
            </label>
            <div className="relative">
              <Target className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
              <input
                type="number"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                placeholder={selectedAlertType?.placeholder}
                className="w-full pl-9 pr-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                step="0.01"
              />
            </div>
            <div className="flex items-center justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
              <span>Current: {getCurrentValue()}</span>
              {selectedType === 'price_above' && targetValue && (
                <span className="text-green-600">
                  +{(((parseFloat(targetValue) - stock.price) / stock.price) * 100).toFixed(1)}%
                </span>
              )}
              {selectedType === 'price_below' && targetValue && (
                <span className="text-red-600">
                  {(((parseFloat(targetValue) - stock.price) / stock.price) * 100).toFixed(1)}%
                </span>
              )}
            </div>
          </div>

          {/* Preview */}
          {targetValue && (
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-1">
                <Bell className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Alert Preview</span>
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                You'll be notified when {stock.ticker} {' '}
                {selectedType === 'price_above' && `reaches $${targetValue}`}
                {selectedType === 'price_below' && `drops to $${targetValue}`}
                {selectedType === 'percent_change' && `changes by ${targetValue}%`}
                {selectedType === 'volume_spike' && `volume increases by ${targetValue}%`}
              </p>
            </div>
          )}
        </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 font-medium active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateAlert}
              disabled={!targetValue || isCreating}
              className={`flex-1 px-4 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
                !targetValue || isCreating
                  ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-50'
                  : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98] shadow-lg shadow-blue-600/25'
              }`}
            >
              {isCreating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Bell className="h-4 w-4" />
                  Create Alert
                </>
              )}
            </button>
          </div>
      </Card>
    </div>
  );
}