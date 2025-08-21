import { useState, useEffect } from "react";
import { Smartphone, Shield, Check, X, User as Face, Fingerprint } from "lucide-react";
import { Card } from "./ui/card";

interface BiometricSetupProps {
  onSetupComplete?: () => void;
  onSkip?: () => void;
}

export default function BiometricSetup({ onSetupComplete, onSkip }: BiometricSetupProps) {
  const [currentStep, setCurrentStep] = useState<'intro' | 'setup' | 'success'>('intro');
  const [isEnabling, setIsEnabling] = useState(false);
  const [biometricType, setBiometricType] = useState<'faceId' | 'touchId' | 'none'>('faceId');

  // Detect biometric type (simulated)
  useEffect(() => {
    // In a real app, you'd detect the device's biometric capabilities
    const userAgent = navigator.userAgent;
    if (userAgent.includes('iPhone') || userAgent.includes('iPad')) {
      setBiometricType('faceId');
    } else {
      setBiometricType('touchId');
    }
  }, []);

  const handleEnableBiometric = async () => {
    setIsEnabling(true);
    if (navigator.vibrate) {
      navigator.vibrate([10, 50, 10]);
    }

    // Simulate biometric setup process
    setTimeout(() => {
      setIsEnabling(false);
      setCurrentStep('success');
      
      // Complete setup after showing success
      setTimeout(() => {
        onSetupComplete?.();
      }, 2000);
    }, 3000);
  };

  const handleSkip = () => {
    if (navigator.vibrate) {
      navigator.vibrate(5);
    }
    onSkip?.();
  };

  const BiometricIcon = biometricType === 'faceId' ? Face : Fingerprint;
  const biometricName = biometricType === 'faceId' ? 'Face ID' : 'Touch ID';

  if (currentStep === 'intro') {
    return (
      <div className="relative h-full w-full bg-background flex flex-col">
        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-md space-y-8">
            
            {/* Header */}
            <div className="text-center space-y-6">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <BiometricIcon className="h-12 w-12 text-blue-600" />
              </div>
              <div className="space-y-3">
                <h1 className="text-3xl font-bold text-foreground">Enable {biometricName}</h1>
                <p className="text-muted-foreground text-lg">
                  Use {biometricName} for quick and secure access to your account
                </p>
              </div>
            </div>

            {/* Benefits */}
            <Card className="p-6 space-y-4 bg-card border border-border/50">
              <h3 className="font-semibold text-foreground mb-4">Benefits:</h3>
              <div className="space-y-3">
                {[
                  { icon: Shield, text: "Enhanced security for your portfolio" },
                  { icon: Smartphone, text: "Faster login without passwords" },
                  { icon: Check, text: "Your biometric data stays on device" }
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <benefit.icon className="h-4 w-4 text-green-600" />
                    </div>
                    <p className="text-foreground">{benefit.text}</p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Privacy Note */}
            <Card className="p-4 bg-muted/30 border border-border/30">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-foreground font-medium">Privacy Protected</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Your biometric information is encrypted and stored securely on your device. 
                    It never leaves your device and cannot be accessed by StockTrader.
                  </p>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => setCurrentStep('setup')}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl transition-all duration-200 ease-out active:scale-[0.98]"
              >
                Enable {biometricName}
              </button>
              
              <button
                onClick={handleSkip}
                className="w-full py-4 bg-transparent text-muted-foreground hover:text-foreground font-medium transition-colors duration-200"
              >
                Skip for Now
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'setup') {
    return (
      <div className="relative h-full w-full bg-background flex flex-col">
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-md space-y-8 text-center">
            
            {/* Setup Animation */}
            <div className="space-y-6">
              <div className="relative">
                <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <BiometricIcon className="h-16 w-16 text-blue-600" />
                </div>
                {isEnabling && (
                  <>
                    <div className="absolute inset-0 w-32 h-32 border-4 border-blue-500/30 rounded-full mx-auto animate-pulse" />
                    <div className="absolute inset-2 w-28 h-28 border-4 border-blue-400/20 rounded-full mx-auto animate-ping" />
                  </>
                )}
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">
                  {isEnabling ? `Setting up ${biometricName}...` : `Ready to setup ${biometricName}`}
                </h2>
                <p className="text-muted-foreground">
                  {isEnabling 
                    ? `Please look at your device${biometricType === 'touchId' ? ' and place your finger on the home button' : ''}`
                    : `Position your ${biometricType === 'faceId' ? 'face' : 'finger'} when prompted`
                  }
                </p>
              </div>
            </div>

            {/* Setup Instructions */}
            <Card className="p-6 bg-card border border-border/50">
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Instructions:</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  {biometricType === 'faceId' ? [
                    "Hold your device at arm's length",
                    "Look directly at the screen",
                    "Move your head in a circle slowly"
                  ] : [
                    "Place your finger on the home button",
                    "Lift and place your finger repeatedly",
                    "Try different angles of your fingerprint"
                  ].map((instruction, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-600">
                        {index + 1}
                      </div>
                      <p>{instruction}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Action Button */}
            {!isEnabling ? (
              <button
                onClick={handleEnableBiometric}
                className="w-full py-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl transition-all duration-200 ease-out active:scale-[0.98]"
              >
                Start Setup
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-center gap-2 text-blue-600">
                  <div className="w-5 h-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                  <span className="font-medium">Configuring {biometricName}...</span>
                </div>
                <button
                  onClick={handleSkip}
                  className="text-muted-foreground hover:text-foreground font-medium transition-colors duration-200"
                >
                  Cancel Setup
                </button>
              </div>
            )}

          </div>
        </div>
      </div>
    );
  }

  if (currentStep === 'success') {
    return (
      <div className="relative h-full w-full bg-background flex flex-col">
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-md space-y-8 text-center">
            
            {/* Success Animation */}
            <div className="space-y-6">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <Check className="h-12 w-12 text-green-600" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">{biometricName} Enabled!</h2>
                <p className="text-muted-foreground">
                  You can now use {biometricName} to sign in to your account quickly and securely.
                </p>
              </div>
            </div>

            {/* Success Card */}
            <Card className="p-6 bg-green-50 border border-green-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <Shield className="h-5 w-5 text-green-600" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-green-800">Biometric Authentication Active</p>
                  <p className="text-sm text-green-600">Your account is now more secure</p>
                </div>
              </div>
            </Card>

          </div>
        </div>
      </div>
    );
  }

  return null;
}