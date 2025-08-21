import { useState } from "react";
import { ChevronLeft, ChevronRight, Camera, User, Mail, Phone, MapPin, Calendar, Edit3, Shield, Bell } from "lucide-react";
import { Card } from "./ui/card";

interface ProfileProps {
  onBack?: () => void;
}

export default function Profile({ onBack }: ProfileProps) {
  const [isEditing, setIsEditing] = useState(false);

  const handleBack = () => {
    if (navigator.vibrate) {
      navigator.vibrate(5);
    }
    onBack?.();
  };

  const handleEdit = () => {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    setIsEditing(!isEditing);
  };

  const handleNavigation = (section: string) => {
    if (navigator.vibrate) {
      navigator.vibrate(3);
    }
    console.log(`Navigate to ${section}`);
  };

  return (
    <div className="relative h-full w-full bg-background flex flex-col hide-scrollbar">
      {/* Header */}
      <header className="flex-shrink-0 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <div className="flex items-center gap-3 px-6 py-4">
          {onBack ? (
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
          ) : (
            <div className="w-[88px]" />
          )}
          <div className="flex-1 text-center">
            <h1 className="text-lg font-semibold text-foreground">Profile</h1>
          </div>
          <button
            onClick={handleEdit}
            className="group relative flex items-center gap-2 px-3 py-2 rounded-full hover:bg-blue-50 active:bg-blue-100 transition-all duration-200 ease-out active:scale-95"
          >
            <Edit3 className="h-5 w-5 text-blue-600 transition-transform duration-200 ease-out group-hover:scale-110 group-active:scale-90" />
            <span className="text-blue-600 font-medium">Edit</span>
          </button>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <div className="px-4 py-6 space-y-8">
          
          {/* Profile Header */}
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <User className="h-16 w-16 text-white" />
              </div>
              {isEditing && (
                <button className="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 active:scale-95 transition-all duration-200">
                  <Camera className="h-5 w-5 text-white" />
                </button>
              )}
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-foreground">John Doe</h2>
              <p className="text-muted-foreground">Premium Member</p>
              <div className="flex items-center justify-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-muted-foreground">Active now</span>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground px-2">PERSONAL INFORMATION</h3>
            <Card className="p-0 overflow-hidden bg-card border border-border/50">
              <div className="divide-y divide-border/50">
                {[
                  { icon: Mail, label: 'Email', value: 'john.doe@example.com', key: 'email' },
                  { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567', key: 'phone' },
                  { icon: MapPin, label: 'Location', value: 'San Francisco, CA', key: 'location' },
                  { icon: Calendar, label: 'Member Since', value: 'January 2024', key: 'memberSince' }
                ].map((item) => (
                  <div key={item.key} className="p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                      <item.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      <p className="text-foreground">{item.value}</p>
                    </div>
                    {isEditing && item.key !== 'memberSince' && (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Account Statistics */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground px-2">ACCOUNT STATISTICS</h3>
            <Card className="p-4 bg-card border border-border/50">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center space-y-2">
                  <p className="text-2xl font-bold text-foreground">24</p>
                  <p className="text-sm text-muted-foreground">Stocks Owned</p>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-2xl font-bold text-green-600">+12.4%</p>
                  <p className="text-sm text-muted-foreground">Total Gain</p>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-2xl font-bold text-foreground">156</p>
                  <p className="text-sm text-muted-foreground">Trades Made</p>
                </div>
                <div className="text-center space-y-2">
                  <p className="text-2xl font-bold text-blue-600">Pro</p>
                  <p className="text-sm text-muted-foreground">Risk Level</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Account Management */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground px-2">ACCOUNT</h3>
            <Card className="p-0 overflow-hidden bg-card border border-border/50">
              <div className="divide-y divide-border/50">
                {[
                  { icon: Shield, label: 'Privacy & Security', key: 'privacy' },
                  { icon: Bell, label: 'Notification Preferences', key: 'notifications' },
                  { icon: User, label: 'Account Settings', key: 'accountSettings' }
                ].map((item) => (
                  <button
                    key={item.key}
                    onClick={() => handleNavigation(item.key)}
                    className="group w-full p-4 flex items-center justify-between hover:bg-muted/30 active:bg-muted/50 transition-all duration-200 ease-out"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-muted/50 flex items-center justify-center">
                        <item.icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <span className="text-foreground">{item.label}</span>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground transition-all duration-200 ease-out group-hover:translate-x-0.5 group-active:scale-90" />
                  </button>
                ))}
              </div>
            </Card>
          </div>

          {/* Achievement Badges */}
          <div className="space-y-3 pb-8">
            <h3 className="text-sm font-medium text-muted-foreground px-2">ACHIEVEMENTS</h3>
            <Card className="p-4 bg-card border border-border/50">
              <div className="flex gap-4 overflow-x-auto hide-scrollbar">
                {[
                  { emoji: '🎯', title: 'First Investment', desc: 'Made your first trade' },
                  { emoji: '📈', title: 'Rising Star', desc: '10% portfolio gain' },
                  { emoji: '💎', title: 'Diamond Hands', desc: 'Held for 6 months' },
                  { emoji: '🚀', title: 'Rocket Trader', desc: '100 trades completed' }
                ].map((badge, index) => (
                  <div key={index} className="flex-shrink-0 w-24 text-center space-y-2">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-2xl mx-auto shadow-lg">
                      {badge.emoji}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-foreground">{badge.title}</p>
                      <p className="text-xs text-muted-foreground">{badge.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
}