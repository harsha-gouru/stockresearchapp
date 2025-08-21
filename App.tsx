import { useState, useEffect } from "react";
import OnboardingScreen from "./components/OnboardingScreen";
import Dashboard from "./components/Dashboard";
import StockAnalysis from "./components/StockAnalysis";
import AIAnalysisDetail from "./components/AIAnalysisDetail";
import StockSearch from "./components/StockSearch";
import Settings from "./components/Settings";
import Profile from "./components/Profile";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import ForgotPassword from "./components/ForgotPassword";
import NotificationsCenter from "./components/NotificationsCenter";
import NotificationSettings from "./components/NotificationSettings";
import Insights from "./components/Insights";
import Discover from "./components/Discover";
import AIInsightsHistory from "./components/AIInsightsHistory";
import Watchlist from "./components/Watchlist";
import TabBar from "./components/TabBar";
import api from "./utils/api";

type Screen = 'login' | 'signUp' | 'forgotPassword' | 'onboarding' | 'dashboard' | 'stockAnalysis' | 'aiAnalysisDetail' | 'stockSearch' | 'settings' | 'profile' | 'notifications' | 'notificationSettings' | 'insights' | 'discover' | 'aiInsightsHistory' | 'watchlist';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('login');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedStock, setSelectedStock] = useState<string>('AAPL'); // Track selected stock symbol
  
  // Track which main tab is active for persistent navigation
  const mainTabs = ['dashboard', 'discover', 'insights', 'profile'] as const;
  type MainTab = typeof mainTabs[number];
  const isMainTab = (screen: Screen): screen is MainTab => {
    return mainTabs.includes(screen as MainTab);
  };

  // Check authentication on page load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const isLoggedIn = await api.auth.checkAuth();
        if (isLoggedIn) {
          setIsAuthenticated(true);
          setCurrentScreen('dashboard');
        } else {
          setCurrentScreen('login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setCurrentScreen('login');
      }
    };
    checkAuth();
  }, []);

  const handleGetStarted = () => {
    setCurrentScreen('dashboard');
  };

  const handleStockClick = (symbol: string) => {
    setSelectedStock(symbol);
    setCurrentScreen('stockAnalysis');
  };

  const handleBackToDashboard = () => {
    setCurrentScreen('dashboard');
  };

  const handleViewDetailedAnalysis = () => {
    setCurrentScreen('aiAnalysisDetail');
  };

  const handleBackToStockAnalysis = () => {
    setCurrentScreen('stockAnalysis');
  };

  const handleOpenStockSearch = () => {
    setCurrentScreen('stockSearch');
  };

  const handleAddStock = (stock: any) => {
    console.log('Adding stock:', stock);
    // Here you would typically add the stock to user's portfolio
    setCurrentScreen('dashboard');
  };

  const handleOpenSettings = () => {
    setCurrentScreen('settings');
  };

  const handleOpenProfile = () => {
    setCurrentScreen('profile');
  };

  const handleOpenNotifications = () => {
    setCurrentScreen('notifications');
  };

  const handleOpenNotificationSettings = () => {
    setCurrentScreen('notificationSettings');
  };

  const handleOpenInsights = () => {
    setCurrentScreen('insights');
  };

  const handleOpenDiscover = () => {
    setCurrentScreen('discover');
  };

  const handleOpenAIInsightsHistory = () => {
    setCurrentScreen('aiInsightsHistory');
  };

  const handleBackToInsights = () => {
    setCurrentScreen('insights');
  };

  const handleOpenWatchlist = () => {
    setCurrentScreen('watchlist');
  };

  // Authentication handlers
  const handleLogin = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    setCurrentScreen('onboarding');
  };

  const handleSignUp = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    setCurrentScreen('onboarding');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    setCurrentScreen('login');
  };

  // iPhone 16 Pro dimensions: 393x852 points
  const iPhoneContainer = "w-[393px] h-[852px] mx-auto bg-black border-2 border-gray-800 rounded-[40px] overflow-hidden shadow-2xl relative";
  
  // Add Dynamic Island
  const DynamicIsland = () => (
    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-black rounded-full z-10"></div>
  );
  
  // iPhone status bar component
  const StatusBar = () => (
    <div className="w-full h-[44px] bg-black flex items-center justify-between px-6 text-white text-sm font-semibold">
      <div className="flex items-center">
        <span>9:41</span>
      </div>
      <div className="flex items-center space-x-2">
        {/* Signal bars */}
        <div className="flex space-x-0.5">
          <div className="w-1 h-2 bg-white rounded-full"></div>
          <div className="w-1 h-3 bg-white rounded-full"></div>
          <div className="w-1 h-4 bg-white rounded-full"></div>
          <div className="w-1 h-3 bg-white rounded-full opacity-50"></div>
        </div>
        {/* WiFi icon */}
        <div className="relative">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="white">
            <path d="M12 16L8 12C9.79 10.21 11.21 10.21 13 12L12 16ZM12 8C8.69 8 5.58 9.69 3.5 12.5L2 11C4.93 7.93 8.93 6 12 6S19.07 7.93 22 11L20.5 12.5C18.42 9.69 15.31 8 12 8Z"/>
          </svg>
        </div>
        {/* Battery */}
        <div className="relative">
          <div className="w-6 h-3 border border-white rounded-sm">
            <div className="w-4 h-1.5 bg-white rounded-sm m-0.5"></div>
          </div>
          <div className="absolute -right-0.5 top-1 w-0.5 h-1 bg-white rounded-r"></div>
        </div>
      </div>
    </div>
  );

  // Authentication screens
  if (currentScreen === 'login') {
    return (
      <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4">
        <div className={iPhoneContainer}>
          <DynamicIsland />
          <StatusBar />
          <div className="w-full h-[808px] bg-white">
            <Login 
              onLogin={handleLogin}
              onSignUp={() => setCurrentScreen('signUp')}
              onForgotPassword={() => setCurrentScreen('forgotPassword')}
              onSkip={() => setCurrentScreen('dashboard')}
            />
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'signUp') {
    return (
      <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4">
        <div className={iPhoneContainer}>
          <DynamicIsland />
          <StatusBar />
          <div className="w-full h-[808px] bg-white">
            <SignUp 
              onSignUp={handleSignUp}
              onLogin={() => setCurrentScreen('login')}
              onBack={() => setCurrentScreen('login')}
            />
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'forgotPassword') {
    return (
      <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4">
        <div className={iPhoneContainer}>
          <DynamicIsland />
          <StatusBar />
          <div className="w-full h-[808px] bg-white">
            <ForgotPassword 
              onBack={() => setCurrentScreen('login')}
              onEmailSent={() => {}}
            />
          </div>
        </div>
      </div>
    );
  }


  if (currentScreen === 'onboarding') {
    return (
      <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4">
        <div className={iPhoneContainer}>
          <DynamicIsland />
          <StatusBar />
          <div className="w-full h-[808px] bg-white">
            <OnboardingScreen onGetStarted={handleGetStarted} />
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'aiAnalysisDetail') {
    return (
      <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4">
        <div className={iPhoneContainer}>
          <DynamicIsland />
          <StatusBar />
          <div className="w-full h-[808px] bg-white">
            <AIAnalysisDetail onBack={handleBackToStockAnalysis} />
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'stockAnalysis') {
    return (
      <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4">
        <div className={iPhoneContainer}>
          <DynamicIsland />
          <StatusBar />
          <div className="w-full h-[808px] bg-white">
            <StockAnalysis 
              onBack={handleBackToDashboard}
              onViewDetailedAnalysis={handleViewDetailedAnalysis}
              symbol={selectedStock}
            />
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'stockSearch') {
    return (
      <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4">
        <div className={iPhoneContainer}>
          <DynamicIsland />
          <StatusBar />
          <div className="w-full h-[808px] bg-white">
            <StockSearch 
              onBack={handleBackToDashboard}
              onAddStock={handleAddStock}
            />
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'settings') {
    return (
      <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4">
        <div className={iPhoneContainer}>
          <DynamicIsland />
          <StatusBar />
          <div className="w-full h-[808px] bg-white">
            <Settings onBack={handleBackToDashboard} onLogout={handleLogout} />
          </div>
        </div>
      </div>
    );
  }


  if (currentScreen === 'notifications') {
    return (
      <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4">
        <div className={iPhoneContainer}>
          <DynamicIsland />
          <StatusBar />
          <div className="w-full h-[808px] bg-white">
            <NotificationsCenter 
              onBack={handleBackToDashboard}
              onOpenNotificationSettings={handleOpenNotificationSettings}
            />
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'notificationSettings') {
    return (
      <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4">
        <div className={iPhoneContainer}>
          <DynamicIsland />
          <StatusBar />
          <div className="w-full h-[808px] bg-white">
            <NotificationSettings onBack={() => setCurrentScreen('notifications')} />
          </div>
        </div>
      </div>
    );
  }

  // Render main tab screens with persistent tab bar
  if (isMainTab(currentScreen)) {
    return (
      <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4">
        <div className={iPhoneContainer}>
          <DynamicIsland />
          <StatusBar />
          <div className="w-full h-[808px] bg-white flex flex-col">
            <div className="flex-1 overflow-hidden">
              {currentScreen === 'dashboard' && (
                <Dashboard 
                  onStockClick={handleStockClick}
                  onOpenStockSearch={handleOpenStockSearch}
                  onOpenSettings={handleOpenSettings}
                  onOpenProfile={handleOpenProfile}
                  onOpenNotifications={handleOpenNotifications}
                  onOpenInsights={handleOpenInsights}
                  onOpenDiscover={handleOpenDiscover}
                  onOpenWatchlist={handleOpenWatchlist}
                />
              )}
              {currentScreen === 'discover' && <Discover />}
              {currentScreen === 'insights' && (
                <Insights 
                  onOpenAIInsightsHistory={handleOpenAIInsightsHistory}
                />
              )}
              {currentScreen === 'profile' && <Profile />}
            </div>
            <TabBar 
              activeTab={currentScreen as 'dashboard' | 'discover' | 'insights' | 'profile'}
              onTabChange={(tab) => setCurrentScreen(tab)}
            />
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'aiInsightsHistory') {
    return (
      <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4">
        <div className={iPhoneContainer}>
          <DynamicIsland />
          <StatusBar />
          <div className="w-full h-[808px] bg-white">
            <AIInsightsHistory onBack={handleBackToInsights} />
          </div>
        </div>
      </div>
    );
  }

  if (currentScreen === 'watchlist') {
    return (
      <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4">
        <div className={iPhoneContainer}>
          <DynamicIsland />
          <StatusBar />
          <div className="w-full h-[808px] bg-white">
            <Watchlist 
              onBack={handleBackToDashboard}
              onStockClick={(symbol) => handleStockClick(symbol || 'AAPL')}
              onAddStock={() => handleOpenStockSearch()}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gray-100 flex items-center justify-center p-4">
      <div className={iPhoneContainer}>
        <DynamicIsland />
        <StatusBar />
        <div className="w-full h-[808px] bg-white">
          <Dashboard 
            onStockClick={handleStockClick}
            onOpenStockSearch={handleOpenStockSearch}
            onOpenSettings={handleOpenSettings}
            onOpenProfile={handleOpenProfile}
            onOpenNotifications={handleOpenNotifications}
            onOpenInsights={handleOpenInsights}
            onOpenDiscover={handleOpenDiscover}
            onOpenWatchlist={handleOpenWatchlist}
          />
        </div>
      </div>
    </div>
  );
}