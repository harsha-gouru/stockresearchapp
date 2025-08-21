import { useState } from "react";
import { ChevronRight, User, Bell, Brain, Shield, Palette, Info, LogOut, ChevronLeft } from "lucide-react";
import { Card } from "./ui/card";

interface SettingsProps {
  onBack?: () => void;
  onLogout?: () => void;
}

export default function Settings({ onBack, onLogout }: SettingsProps) {
  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    aiInsights: true,
    marketNews: false,
    weeklyReport: true
  });

  const [riskTolerance, setRiskTolerance] = useState(3);
  const [timeframe, setTimeframe] = useState("medium");
  const [focusAreas, setFocusAreas] = useState({
    technical: true,
    fundamental: true,
    sentiment: false
  });

  const [theme, setTheme] = useState("auto");

  const handleBack = () => {
    if (navigator.vibrate) {
      navigator.vibrate(5);
    }
    onBack?.();
  };

  const handleNavigation = (section: string) => {
    if (navigator.vibrate) {
      navigator.vibrate(3);
    }
    console.log(`Navigate to ${section}`);
  };

  const handleSignOut = () => {
    if (navigator.vibrate) {
      navigator.vibrate([10, 50, 10]);
    }
    onLogout?.();
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const toggleFocusArea = (key: keyof typeof focusAreas) => {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    setFocusAreas(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return (
    <div className="relative h-full w-full bg-background flex flex-col hide-scrollbar">
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
            <h1 className="text-lg font-semibold text-foreground">Settings</h1>
          </div>
          <div className="w-[88px]"></div> {/* Spacer for centering */}
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <div className="px-4 py-6 space-y-8">
          

          {/* Notifications Section */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground px-2">NOTIFICATIONS</h2>
            <Card className="p-0 overflow-hidden bg-card border border-border/50">
              <div className="divide-y divide-border/50">
                {[
                  { key: 'priceAlerts', label: 'Price Alerts', icon: Bell },
                  { key: 'aiInsights', label: 'AI Insights', icon: Brain },
                  { key: 'marketNews', label: 'Market News', icon: Info },
                  { key: 'weeklyReport', label: 'Weekly Report', icon: User }
                ].map((item, index) => (
                  <div key={item.key} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="text-foreground">{item.label}</span>
                    </div>
                    <button
                      onClick={() => toggleNotification(item.key as keyof typeof notifications)}
                      className={`relative w-12 h-7 rounded-full transition-all duration-300 ease-out ${
                        notifications[item.key as keyof typeof notifications]
                          ? 'bg-blue-500'
                          : 'bg-muted'
                      }`}
                    >
                      <div
                        className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-all duration-300 ease-out ${
                          notifications[item.key as keyof typeof notifications]
                            ? 'translate-x-5'
                            : 'translate-x-0.5'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* AI Settings Section */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground px-2">AI SETTINGS</h2>
            <Card className="p-0 overflow-hidden bg-card border border-border/50">
              <div className="divide-y divide-border/50">
                
                {/* Risk Tolerance */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-foreground">Risk Tolerance</span>
                    <span className="text-sm text-muted-foreground">
                      {['Conservative', 'Moderate', 'Balanced', 'Aggressive', 'High Risk'][riskTolerance - 1]}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={riskTolerance}
                      onChange={(e) => setRiskTolerance(Number(e.target.value))}
                      className="w-full h-2 bg-muted/50 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #007AFF 0%, #007AFF ${((riskTolerance - 1) / 4) * 100}%, #f1f2f6 ${((riskTolerance - 1) / 4) * 100}%, #f1f2f6 100%)`
                      }}
                    />
                  </div>
                </div>

                {/* Analysis Timeframe */}
                <button
                  onClick={() => handleNavigation("timeframe")}
                  className="group w-full p-4 flex items-center justify-between hover:bg-muted/30 active:bg-muted/50 transition-all duration-200 ease-out"
                >
                  <span className="text-foreground">Analysis Timeframe</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground capitalize">{timeframe}-term</span>
                    <ChevronRight className="h-5 w-5 text-muted-foreground transition-all duration-200 ease-out group-hover:translate-x-0.5 group-active:scale-90" />
                  </div>
                </button>

                {/* Focus Areas */}
                <div className="p-4">
                  <h3 className="text-foreground mb-3">Focus Areas</h3>
                  <div className="space-y-3">
                    {[
                      { key: 'technical', label: 'Technical Analysis' },
                      { key: 'fundamental', label: 'Fundamental Analysis' },
                      { key: 'sentiment', label: 'Sentiment Analysis' }
                    ].map((area) => (
                      <div key={area.key} className="flex items-center justify-between">
                        <span className="text-foreground text-sm">{area.label}</span>
                        <button
                          onClick={() => toggleFocusArea(area.key as keyof typeof focusAreas)}
                          className={`relative w-12 h-7 rounded-full transition-all duration-300 ease-out ${
                            focusAreas[area.key as keyof typeof focusAreas]
                              ? 'bg-blue-500'
                              : 'bg-muted'
                          }`}
                        >
                          <div
                            className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-sm transition-all duration-300 ease-out ${
                              focusAreas[area.key as keyof typeof focusAreas]
                                ? 'translate-x-5'
                                : 'translate-x-0.5'
                            }`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Data & Privacy Section */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground px-2">DATA & PRIVACY</h2>
            <Card className="p-0 overflow-hidden bg-card border border-border/50">
              <div className="divide-y divide-border/50">
                {[
                  { key: 'privacy', label: 'Privacy Policy', icon: Shield },
                  { key: 'data', label: 'Data Usage', icon: Info },
                  { key: 'export', label: 'Export Data', icon: User }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => handleNavigation(item.key)}
                    className="group w-full p-4 flex items-center justify-between hover:bg-muted/30 active:bg-muted/50 transition-all duration-200 ease-out"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="text-foreground">{item.label}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground transition-all duration-200 ease-out group-hover:translate-x-0.5 group-active:scale-90" />
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Theme Section */}
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground px-2">APPEARANCE</h2>
            <Card className="p-0 overflow-hidden bg-card border border-border/50">
              <button
                onClick={() => handleNavigation("theme")}
                className="group w-full p-4 flex items-center justify-between hover:bg-muted/30 active:bg-muted/50 transition-all duration-200 ease-out"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                    <Palette className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <span className="text-foreground">Theme</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground capitalize">{theme}</span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground transition-all duration-200 ease-out group-hover:translate-x-0.5 group-active:scale-90" />
                </div>
              </button>
            </Card>
          </div>

          {/* About Section */}
          <div className="space-y-3">
            <Card className="p-0 overflow-hidden bg-card border border-border/50">
              <div className="divide-y divide-border/50">
                {[
                  { key: 'about', label: 'About', icon: Info },
                  { key: 'version', label: 'Version', value: '1.0.0', icon: Info },
                  { key: 'support', label: 'Support', icon: Info }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => handleNavigation(item.key)}
                    className="group w-full p-4 flex items-center justify-between hover:bg-muted/30 active:bg-muted/50 transition-all duration-200 ease-out"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
                        <item.icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <span className="text-foreground">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.value && (
                        <span className="text-sm text-muted-foreground">{item.value}</span>
                      )}
                      <ChevronRight className="h-5 w-5 text-muted-foreground transition-all duration-200 ease-out group-hover:translate-x-0.5 group-active:scale-90" />
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Sign Out Section */}
          <div className="pb-8">
            <Card className="p-0 overflow-hidden bg-card border border-border/50">
              <button
                onClick={handleSignOut}
                className="group w-full p-4 flex items-center justify-center hover:bg-red-50 active:bg-red-100 transition-all duration-200 ease-out active:scale-[0.98]"
              >
                <div className="flex items-center gap-3">
                  <LogOut className="h-5 w-5 text-red-600 transition-all duration-200 ease-out group-active:scale-90" />
                  <span className="text-red-600 font-medium">Sign Out</span>
                </div>
              </button>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}