import { useState } from "react";
import { ChevronLeft, Mail, Send, CheckCircle } from "lucide-react";
import { Card } from "./ui/card";

interface ForgotPasswordProps {
  onBack?: () => void;
  onEmailSent?: () => void;
}

export default function ForgotPassword({ onBack, onEmailSent }: ForgotPasswordProps) {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState("");

  const handleBack = () => {
    if (navigator.vibrate) {
      navigator.vibrate(5);
    }
    onBack?.();
  };

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSendReset = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }
    
    if (!validateEmail(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);
    setError("");
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setEmailSent(true);
      onEmailSent?.();
    }, 2000);
  };

  const handleResend = () => {
    setEmailSent(false);
    setEmail("");
    if (navigator.vibrate) {
      navigator.vibrate(5);
    }
  };

  return (
    <div className="relative h-full w-full bg-background flex flex-col">
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
            <h1 className="text-lg font-semibold text-foreground">Reset Password</h1>
          </div>
          <div className="w-[88px]"></div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-md space-y-8">
          
          {!emailSent ? (
            <>
              {/* Reset Form */}
              <div className="text-center space-y-4">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="h-10 w-10 text-blue-600" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">Forgot Password?</h2>
                  <p className="text-muted-foreground">
                    No worries, we'll send you reset instructions.
                  </p>
                </div>
              </div>

              <Card className="p-6 space-y-6 bg-card border border-border/50">
                {/* Email Field */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError("");
                      }}
                      placeholder="Enter your email"
                      className={`w-full pl-10 pr-4 py-3 bg-muted/50 rounded-xl text-foreground placeholder-muted-foreground border-0 focus:outline-none focus:ring-2 transition-all duration-200 ${
                        error ? 'focus:ring-red-500/20 bg-red-50' : 'focus:ring-blue-500/20 focus:bg-muted'
                      }`}
                      autoComplete="email"
                      autoFocus
                    />
                  </div>
                  {error && (
                    <p className="text-sm text-red-600">{error}</p>
                  )}
                </div>

                {/* Send Reset Button */}
                <button
                  onClick={handleSendReset}
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
                      Sending...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <Send className="h-5 w-5" />
                      Send Reset Instructions
                    </div>
                  )}
                </button>
              </Card>
            </>
          ) : (
            <>
              {/* Success State */}
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-foreground">Check Your Email</h2>
                  <p className="text-muted-foreground">
                    We sent a password reset link to
                  </p>
                  <p className="font-medium text-foreground">{email}</p>
                </div>
              </div>

              <Card className="p-6 space-y-4 bg-card border border-border/50">
                <div className="space-y-3 text-sm text-muted-foreground">
                  <p className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></span>
                    Check your email and click the reset link
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></span>
                    The link will expire in 24 hours
                  </p>
                  <p className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full mt-2 flex-shrink-0"></span>
                    Check your spam folder if you don't see it
                  </p>
                </div>
              </Card>

              {/* Resend Button */}
              <div className="text-center space-y-4">
                <p className="text-muted-foreground">
                  Didn't receive the email?
                </p>
                <button
                  onClick={handleResend}
                  className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                >
                  Resend Instructions
                </button>
              </div>
            </>
          )}

          {/* Back to Login */}
          <div className="text-center">
            <button
              onClick={handleBack}
              className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center justify-center gap-2 mx-auto"
            >
              <ChevronLeft className="h-4 w-4" />
              Back to Sign In
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}