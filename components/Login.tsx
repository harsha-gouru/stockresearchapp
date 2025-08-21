import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Apple } from "lucide-react";
import { Card } from "./ui/card";
import api from "../utils/api";

interface LoginProps {
  onLogin?: () => void;
  onSignUp?: () => void;
  onForgotPassword?: () => void;
  onSkip?: () => void;
}

export default function Login({ onLogin, onSignUp, onForgotPassword, onSkip }: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});

  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    // Prevent double submission
    if (isLoading) return;
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      if (navigator.vibrate) {
        navigator.vibrate(10);
      }
      
      // Real API call
      await api.auth.login(email, password);
      onLogin?.();
    } catch (error) {
      console.error('Login failed:', error);
      setErrors({ email: error instanceof Error ? error.message : 'Login failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    if (navigator.vibrate) {
      navigator.vibrate(5);
    }
    console.log(`Login with ${provider}`);
    // Handle social login
    setTimeout(() => {
      onLogin?.();
    }, 1000);
  };


  return (
    <div className="relative h-full w-full bg-background flex flex-col">
      {/* Header */}
      <header className="flex-shrink-0 pt-12 pb-8">
        <div className="px-6">
          <div className="flex items-center justify-between mb-6">
            <div></div>
            <button
              onClick={onSkip}
              className="px-4 py-2 text-muted-foreground hover:text-foreground text-sm font-medium transition-colors duration-200"
            >
              Skip for Testing
            </button>
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Welcome Back</h1>
            <p className="text-muted-foreground">Sign in to continue to your portfolio</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-6">
        
        {/* Login Form */}
        <Card className="p-5 space-y-4 bg-card border border-border/50">
          
          {/* Email Field */}
          <div className="space-y-1.5">
            <label htmlFor="email-input" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(prev => ({...prev, email: undefined}));
                }}
                placeholder="Enter your email"
                className={`w-full pl-9 pr-4 py-2.5 bg-muted/50 rounded-lg text-foreground placeholder-muted-foreground border-0 focus:outline-none focus:ring-1 transition-all duration-200 ${
                  errors.email ? 'focus:ring-red-500/20 bg-red-50' : 'focus:ring-foreground/20 focus:bg-muted'
                }`}
                autoComplete="email"
                aria-describedby={errors.email ? "email-error" : undefined}
                aria-invalid={errors.email ? "true" : "false"}
              />
            </div>
            {errors.email && (
              <p id="email-error" className="text-xs text-red-600" role="alert" aria-live="polite">{errors.email}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-1.5">
            <label htmlFor="password-input" className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <input
                id="password-input"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors(prev => ({...prev, password: undefined}));
                }}
                placeholder="Enter your password"
                className={`w-full pl-9 pr-10 py-2.5 bg-muted/50 rounded-lg text-foreground placeholder-muted-foreground border-0 focus:outline-none focus:ring-1 transition-all duration-200 ${
                  errors.password ? 'focus:ring-red-500/20 bg-red-50' : 'focus:ring-foreground/20 focus:bg-muted'
                }`}
                autoComplete="current-password"
                aria-describedby={errors.password ? "password-error" : undefined}
                aria-invalid={errors.password ? "true" : "false"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-background/50 rounded-full transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-pressed={showPassword}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                )}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="text-xs text-red-600" role="alert" aria-live="polite">{errors.password}</p>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <button
              onClick={onForgotPassword}
              className="text-foreground/60 hover:text-foreground text-xs font-medium transition-colors duration-200"
            >
              Forgot Password?
            </button>
          </div>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            disabled={isLoading}
            className={`w-full py-3 rounded-lg font-medium transition-all duration-200 ease-out active:scale-[0.98] ${
              isLoading
                ? 'bg-muted text-muted-foreground cursor-not-allowed'
                : 'bg-foreground hover:bg-foreground/90 active:bg-foreground/80 text-background'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                Signing In...
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </Card>


        {/* Divider */}
        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-border"></div>
          <span className="text-xs text-muted-foreground">or</span>
          <div className="flex-1 h-px bg-border"></div>
        </div>

        {/* Social Login */}
        <div className="space-y-2">
          <button
            onClick={() => handleSocialLogin('Apple')}
            className="group w-full flex items-center justify-center gap-2 py-2.5 bg-black hover:bg-gray-800 active:bg-gray-900 rounded-lg transition-all duration-200 ease-out active:scale-[0.98]"
          >
            <Apple className="h-4 w-4 text-white" />
            <span className="text-white text-sm font-medium">Continue with Apple</span>
          </button>
          
          <button
            onClick={() => handleSocialLogin('Google')}
            className="group w-full flex items-center justify-center gap-2 py-2.5 bg-white hover:bg-gray-50 active:bg-gray-100 border border-border rounded-lg transition-all duration-200 ease-out active:scale-[0.98]"
          >
            <div className="w-4 h-4 bg-gradient-to-r from-red-500 via-yellow-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">G</span>
            </div>
            <span className="text-foreground text-sm font-medium">Continue with Google</span>
          </button>
        </div>

        {/* Sign Up Link */}
        <div className="text-center pt-2">
          <p className="text-muted-foreground text-sm">
            Don't have an account?{' '}
            <button
              onClick={onSignUp}
              className="text-foreground hover:text-foreground/80 font-medium transition-colors duration-200"
            >
              Sign Up
            </button>
          </p>
        </div>
        
        </div>
      </div>
    </div>
  );
}