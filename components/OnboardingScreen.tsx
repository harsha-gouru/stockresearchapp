import { Button } from "./ui/button";

interface OnboardingScreenProps {
  onGetStarted?: () => void;
}

export default function OnboardingScreen({ onGetStarted }: OnboardingScreenProps) {
  const handleGetStarted = () => {
    // Handle onboarding completion
    console.log("Get Started pressed");
    onGetStarted?.();
  };

  const handleSkip = () => {
    // Handle skip action
    console.log("Skip pressed");
    onGetStarted?.();
  };

  return (
    <div className="relative h-full w-full bg-white">
      <div className="flex h-full flex-col items-center justify-between px-8 py-8">
        {/* Logo Section */}
        <div className="flex flex-col items-center space-y-6 pt-8">
          {/* Minimal Logo */}
          <div className="flex w-20 h-20 items-center justify-center rounded-2xl border border-gray-200 bg-white shadow-sm">
            <svg
              className="w-10 h-10 text-gray-800"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
              />
            </svg>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex max-w-xs flex-col items-center space-y-6 text-center">
          {/* Title */}
          <h1 className="text-3xl font-semibold text-gray-900 leading-tight">
            Smart Stock Insights
          </h1>
          
          {/* Subtitle */}
          <p className="text-lg text-gray-600 leading-relaxed">
            AI-powered analysis for your portfolio
          </p>
          
          {/* Get Started Button */}
          <Button
            onClick={handleGetStarted}
            className="mt-8 w-full rounded-2xl bg-black px-8 py-4 text-white font-medium text-lg transition-all duration-200 hover:bg-gray-800 active:scale-[0.98] shadow-lg"
            size="lg"
          >
            Get Started
          </Button>
        </div>

        {/* Skip Section */}
        <div className="flex items-center justify-center pb-4">
          <button
            onClick={handleSkip}
            className="text-gray-500 text-lg transition-colors hover:text-gray-700 active:text-gray-400"
          >
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}