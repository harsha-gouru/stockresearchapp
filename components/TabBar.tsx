import { BarChart3, Compass, Lightbulb, User } from "lucide-react";

interface TabBarProps {
  activeTab: 'dashboard' | 'discover' | 'insights' | 'profile';
  onTabChange: (tab: 'dashboard' | 'discover' | 'insights' | 'profile') => void;
}

export default function TabBar({ activeTab, onTabChange }: TabBarProps) {
  const tabs = [
    { id: 'dashboard' as const, label: 'Portfolio', icon: BarChart3 },
    { id: 'discover' as const, label: 'Discover', icon: Compass },
    { id: 'insights' as const, label: 'Insights', icon: Lightbulb },
    { id: 'profile' as const, label: 'Profile', icon: User }
  ];

  return (
    <div className="flex-shrink-0 bg-background/95 backdrop-blur-sm border-t border-border shadow-lg">
      <div className="flex items-center justify-around py-3">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`group flex flex-col items-center gap-1 p-2 rounded-lg transition-all duration-200 ease-out ${
                isActive 
                  ? '' 
                  : 'hover:bg-muted/50 active:bg-muted/70 active:scale-95'
              }`}
              onMouseEnter={() => navigator.vibrate && navigator.vibrate(3)}
            >
              <IconComponent 
                className={`h-6 w-6 transition-all duration-200 ease-out ${
                  isActive 
                    ? 'text-foreground' 
                    : 'text-muted-foreground group-hover:text-foreground group-active:scale-90'
                }`} 
              />
              <span 
                className={`text-xs transition-all duration-200 ease-out ${
                  isActive 
                    ? 'text-foreground font-medium' 
                    : 'text-muted-foreground group-hover:text-foreground'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
