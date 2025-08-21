import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../utils/test-utils'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import Login from '../../components/Login'
import OnboardingScreen from '../../components/OnboardingScreen'

// Mock navigation component to test full authentication flow
function MockApp() {
  const [currentScreen, setCurrentScreen] = useState<'onboarding' | 'login' | 'dashboard'>('onboarding')
  
  const handleGetStarted = () => setCurrentScreen('login')
  const handleLogin = () => setCurrentScreen('dashboard')

  return (
    <div>
      {currentScreen === 'onboarding' && (
        <OnboardingScreen 
          onGetStarted={handleGetStarted}
        />
      )}
      {currentScreen === 'login' && (
        <Login 
          onLogin={handleLogin}
          onSignUp={() => {}} // Not implemented in this test
          onForgotPassword={() => {}} // Not implemented in this test
          onSkip={handleLogin}
        />
      )}
      {currentScreen === 'dashboard' && (
        <div role="main" aria-label="Dashboard">
          <h1>Welcome to Dashboard</h1>
        </div>
      )}
    </div>
  )
}

describe('Authentication Flow Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should complete full onboarding to login to dashboard flow', async () => {
    const user = userEvent.setup()
    render(<MockApp />)
    
    // Start on onboarding screen
    expect(screen.getByText(/smart stock insights/i)).toBeInTheDocument()
    
    // Click "Get Started" to go to login
    const getStartedButton = screen.getByRole('button', { name: /get started/i })
    await user.click(getStartedButton)
    
    // Should now be on login screen
    await waitFor(() => {
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    })
    
    // Fill out login form
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText('Password')
    const loginButton = screen.getByRole('button', { name: /sign in/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(loginButton)
    
    // Should show loading state
    expect(screen.getByText(/signing in.../i)).toBeInTheDocument()
    
    // Should eventually reach dashboard
    await waitFor(() => {
      expect(screen.getByRole('main', { name: /dashboard/i })).toBeInTheDocument()
      expect(screen.getByText(/welcome to dashboard/i)).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('should allow skipping directly from onboarding to dashboard', async () => {
    const user = userEvent.setup()
    render(<MockApp />)
    
    // Start on onboarding screen
    expect(screen.getByText(/smart stock insights/i)).toBeInTheDocument()
    
    // Click the skip button that's built into the onboarding screen
    const skipButton = screen.getByRole('button', { name: /skip for now/i })
    await user.click(skipButton)
    
    // Should navigate to login screen first (since onboarding skip goes to login)
    await waitFor(() => {
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument()
    })
    
    // Then skip from login to go to dashboard
    const loginSkipButton = screen.getByRole('button', { name: /skip for testing/i })
    await user.click(loginSkipButton)
    
    // Should go to dashboard
    await waitFor(() => {
      expect(screen.getByRole('main', { name: /dashboard/i })).toBeInTheDocument()
    })
  })

  it('should allow skipping from login screen to dashboard', async () => {
    const user = userEvent.setup()
    render(<MockApp />)
    
    // Navigate to login first
    const getStartedButton = screen.getByRole('button', { name: /get started/i })
    await user.click(getStartedButton)
    
    await waitFor(() => {
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument()
    })
    
    // Skip from login
    const skipButton = screen.getByRole('button', { name: /skip for testing/i })
    await user.click(skipButton)
    
    // Should go to dashboard
    await waitFor(() => {
      expect(screen.getByRole('main', { name: /dashboard/i })).toBeInTheDocument()
    })
  })

  it('should handle form validation errors in full flow', async () => {
    const user = userEvent.setup()
    render(<MockApp />)
    
    // Navigate to login
    const getStartedButton = screen.getByRole('button', { name: /get started/i })
    await user.click(getStartedButton)
    
    await waitFor(() => {
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    })
    
    // Try to submit empty form
    const loginButton = screen.getByRole('button', { name: /sign in/i })
    await user.click(loginButton)
    
    // Should show validation errors
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
    
    // Fill invalid email
    const emailInput = screen.getByLabelText(/email/i)
    await user.type(emailInput, 'invalid-email')
    await user.click(loginButton)
    
    await waitFor(() => {
      expect(screen.getByText(/email is invalid/i)).toBeInTheDocument()
    })
    
    // Fix email and add short password
    await user.clear(emailInput)
    await user.type(emailInput, 'test@example.com')
    
    const passwordInput = screen.getByLabelText('Password')
    await user.type(passwordInput, '123')
    await user.click(loginButton)
    
    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument()
    })
    
    // Fix everything and complete login
    await user.clear(passwordInput)
    await user.type(passwordInput, 'password123')
    await user.click(loginButton)
    
    // Should complete successfully
    await waitFor(() => {
      expect(screen.getByRole('main', { name: /dashboard/i })).toBeInTheDocument()
    }, { timeout: 3000 })
  })

  it('should maintain accessibility throughout the flow', async () => {
    const user = userEvent.setup()
    render(<MockApp />)
    
    // Test keyboard navigation on onboarding
    await user.tab()
    expect(screen.getByRole('button', { name: /get started/i })).toHaveFocus()
    
    await user.tab()
    expect(screen.getByRole('button', { name: /skip for now/i })).toHaveFocus()
    
    // Navigate to login via keyboard
    await user.keyboard('{Enter}') // Should activate skip button and navigate to login
    
    await waitFor(() => {
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument()
    })
  })

  it('should handle social login integration', async () => {
    const user = userEvent.setup()
    render(<MockApp />)
    
    // Navigate to login
    const getStartedButton = screen.getByRole('button', { name: /get started/i })
    await user.click(getStartedButton)
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /continue with apple/i })).toBeInTheDocument()
    })
    
    // Try Apple login
    const appleButton = screen.getByRole('button', { name: /continue with apple/i })
    await user.click(appleButton)
    
    // Should complete login and go to dashboard
    await waitFor(() => {
      expect(screen.getByRole('main', { name: /dashboard/i })).toBeInTheDocument()
    }, { timeout: 2000 })
  })

  it('should handle multiple rapid navigation clicks gracefully', async () => {
    const user = userEvent.setup()
    render(<MockApp />)
    
    // Rapidly click get started multiple times
    const getStartedButton = screen.getByRole('button', { name: /get started/i })
    await user.click(getStartedButton)
    await user.click(getStartedButton)
    await user.click(getStartedButton)
    
    // Should only navigate once
    await waitFor(() => {
      expect(screen.getByText(/welcome back/i)).toBeInTheDocument()
      expect(screen.queryByText(/discover powerful insights/i)).not.toBeInTheDocument()
    })
    
    // Fill form and rapidly submit
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText('Password')
    const loginButton = screen.getByRole('button', { name: /sign in/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    
    // Rapid clicks
    await user.click(loginButton)
    await user.click(loginButton)
    await user.click(loginButton)
    
    // Should only process once and reach dashboard
    await waitFor(() => {
      expect(screen.getByRole('main', { name: /dashboard/i })).toBeInTheDocument()
    }, { timeout: 3000 })
  })
})
