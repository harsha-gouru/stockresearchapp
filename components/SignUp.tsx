import { useState } from "react";
import { ChevronLeft, Eye, EyeOff, User, Mail, Lock, Check, Apple } from "lucide-react";
import { Card } from "./ui/card";
import api from "../utils/api";

interface SignUpProps {
  onSignUp?: () => void;
  onLogin?: () => void;
  onBack?: () => void;
}

export default function SignUp({ onSignUp, onLogin, onBack }: SignUpProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const handleBack = () => {
    if (navigator.vibrate) {
      navigator.vibrate(5);
    }
    onBack?.();
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }
    
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number";
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    if (!acceptTerms) {
      newErrors.terms = "You must accept the terms and conditions";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
    
    try {
      // Real API call
      await api.auth.register({
        email: formData.email,
        password: formData.password,
        firstName: formData.fullName.split(' ')[0] || formData.fullName,
        lastName: formData.fullName.split(' ').slice(1).join(' ') || ''
      });
      onSignUp?.();
    } catch (error) {
      console.error('Registration failed:', error);
      setErrors({ email: error instanceof Error ? error.message : 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignUp = (provider: string) => {
    if (navigator.vibrate) {
      navigator.vibrate(5);
    }
    console.log(`Sign up with ${provider}`);
    setTimeout(() => {
      onSignUp?.();
    }, 1000);
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({...prev, [field]: value}));
    if (errors[field]) {
      setErrors(prev => ({...prev, [field]: undefined}));
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return 0;
    
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    return strength;
  };

  const passwordStrength = getPasswordStrength();
  const strengthColors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];

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
            <h1 className="text-lg font-semibold text-foreground">Create Account</h1>
          </div>
          <div className="w-[88px]"></div>
        </div>
      </header>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto hide-scrollbar">
        <div className="px-6 py-6 space-y-6">
          
          {/* Welcome Text */}
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-foreground">Join StockTrader</h2>
            <p className="text-muted-foreground">Create your account to start investing</p>
          </div>

          {/* Sign Up Form */}
          <Card className="p-6 space-y-5 bg-card border border-border/50">
            
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  placeholder="Enter your full name"
                  className={`w-full pl-10 pr-4 py-3 bg-muted/50 rounded-xl text-foreground placeholder-muted-foreground border-0 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.fullName ? 'focus:ring-red-500/20 bg-red-50' : 'focus:ring-blue-500/20 focus:bg-muted'
                  }`}
                  autoComplete="name"
                />
              </div>
              {errors.fullName && (
                <p className="text-sm text-red-600">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="Enter your email"
                  className={`w-full pl-10 pr-4 py-3 bg-muted/50 rounded-xl text-foreground placeholder-muted-foreground border-0 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.email ? 'focus:ring-red-500/20 bg-red-50' : 'focus:ring-blue-500/20 focus:bg-muted'
                  }`}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  placeholder="Create a strong password"
                  className={`w-full pl-10 pr-12 py-3 bg-muted/50 rounded-xl text-foreground placeholder-muted-foreground border-0 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.password ? 'focus:ring-red-500/20 bg-red-50' : 'focus:ring-blue-500/20 focus:bg-muted'
                  }`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-background/50 rounded-full transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {formData.password && (
                <div className="space-y-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i < passwordStrength ? strengthColors[passwordStrength - 1] : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs ${passwordStrength >= 4 ? 'text-green-600' : passwordStrength >= 2 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {strengthLabels[passwordStrength - 1] || 'Enter password'}
                  </p>
                </div>
              )}
              
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                  placeholder="Confirm your password"
                  className={`w-full pl-10 pr-12 py-3 bg-muted/50 rounded-xl text-foreground placeholder-muted-foreground border-0 focus:outline-none focus:ring-2 transition-all duration-200 ${
                    errors.confirmPassword ? 'focus:ring-red-500/20 bg-red-50' : 'focus:ring-blue-500/20 focus:bg-muted'
                  }`}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-background/50 rounded-full transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <Eye className="h-5 w-5 text-muted-foreground" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-600">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms and Conditions */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  setAcceptTerms(!acceptTerms);
                  if (navigator.vibrate) navigator.vibrate(5);
                  if (errors.terms) setErrors(prev => ({...prev, terms: undefined}));
                }}
                className="flex items-start gap-3"
              >
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${
                  acceptTerms 
                    ? 'bg-blue-600 border-blue-600' 
                    : 'border-muted-foreground hover:border-blue-600'
                }`}>
                  {acceptTerms && (
                    <Check className="h-3 w-3 text-white" />
                  )}
                </div>
                <p className="text-sm text-foreground text-left">
                  I agree to the{' '}
                  <span className="text-blue-600 underline">Terms of Service</span>
                  {' '}and{' '}
                  <span className="text-blue-600 underline">Privacy Policy</span>
                </p>
              </button>
              {errors.terms && (
                <p className="text-sm text-red-600">{errors.terms}</p>
              )}
            </div>

            {/* Sign Up Button */}
            <button
              onClick={handleSignUp}
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-semibold transition-all duration-200 ease-out active:scale-[0.98] ${
                isLoading
                  ? 'bg-muted text-muted-foreground cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </div>
              ) : (
                'Create Account'
              )}
            </button>
          </Card>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-border"></div>
            <span className="text-sm text-muted-foreground">or sign up with</span>
            <div className="flex-1 h-px bg-border"></div>
          </div>

          {/* Social Sign Up */}
          <button
            onClick={() => handleSocialSignUp('Apple')}
            className="group w-full flex items-center justify-center gap-3 py-4 bg-black hover:bg-gray-800 active:bg-gray-900 rounded-xl transition-all duration-200 ease-out active:scale-[0.98]"
          >
            <Apple className="h-6 w-6 text-white" />
            <span className="text-white font-medium">Continue with Apple</span>
          </button>

          {/* Login Link */}
          <div className="text-center pb-8">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <button
                onClick={onLogin}
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
              >
                Sign In
              </button>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}