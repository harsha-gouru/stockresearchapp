import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '../../utils/test-utils'
import userEvent from '@testing-library/user-event'
import Login from '../../../components/Login'

describe('Login Component', () => {
  const mockProps = {
    onLogin: vi.fn(),
    onSignUp: vi.fn(),
    onForgotPassword: vi.fn(),
    onSkip: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders login form correctly', () => {
    render(<Login {...mockProps} />)
    
    // Test form inputs with improved accessibility selectors
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument()
  })

  it('displays email and password input fields with proper accessibility', () => {
    render(<Login {...mockProps} />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText('Password')
    
    // Test input types
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(passwordInput).toHaveAttribute('type', 'password')
    
    // Test accessibility attributes
    expect(emailInput).toHaveAttribute('id', 'email-input')
    expect(passwordInput).toHaveAttribute('id', 'password-input')
    expect(emailInput).toHaveAttribute('aria-invalid', 'false')
    expect(passwordInput).toHaveAttribute('aria-invalid', 'false')
  })

  it('validates email format on form submission', async () => {
    const user = userEvent.setup()
    render(<Login {...mockProps} />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    await user.type(emailInput, 'invalid-email')
    await user.click(submitButton)
    
    // Check for error message display with proper accessibility
    await waitFor(() => {
      const errorMessage = screen.getByText(/email is invalid/i)
      expect(errorMessage).toBeInTheDocument()
      expect(errorMessage).toHaveAttribute('role', 'alert')
      expect(errorMessage).toHaveAttribute('aria-live', 'polite')
      expect(errorMessage).toHaveAttribute('id', 'email-error')
    })
    
    // Test that input has proper error aria attributes
    await waitFor(() => {
      expect(emailInput).toHaveAttribute('aria-invalid', 'true')
      expect(emailInput).toHaveAttribute('aria-describedby', 'email-error')
    })
  })

  it('validates password requirement on form submission', async () => {
    const user = userEvent.setup()
    render(<Login {...mockProps} />)
    
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    await user.type(passwordInput, '123') // Too short
    await user.click(submitButton)
    
    await waitFor(() => {
      const errorMessage = screen.getByText(/password must be at least 6 characters/i)
      expect(errorMessage).toBeInTheDocument()
      expect(errorMessage).toHaveAttribute('role', 'alert')
      expect(errorMessage).toHaveAttribute('id', 'password-error')
    })
    
    await waitFor(() => {
      expect(passwordInput).toHaveAttribute('aria-invalid', 'true')
      expect(passwordInput).toHaveAttribute('aria-describedby', 'password-error')
    })
  })

  it('shows loading state during login submission', async () => {
    const user = userEvent.setup()
    render(<Login {...mockProps} />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    await user.click(submitButton)
    
    expect(screen.getByText(/signing in.../i)).toBeInTheDocument()
    expect(submitButton).toBeDisabled()
    
    await waitFor(() => {
      expect(mockProps.onLogin).toHaveBeenCalled()
    }, { timeout: 2000 })
  })

  it('toggles password visibility with proper accessibility', async () => {
    const user = userEvent.setup()
    render(<Login {...mockProps} />)
    
    const passwordInput = screen.getByLabelText('Password')
    const toggleButton = screen.getByRole('button', { name: /show password/i })
    
    // Initially password is hidden
    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(toggleButton).toHaveAttribute('aria-pressed', 'false')
    
    // Click to show password
    await user.click(toggleButton)
    
    expect(passwordInput).toHaveAttribute('type', 'text')
    expect(screen.getByRole('button', { name: /hide password/i })).toBeInTheDocument()
    expect(toggleButton).toHaveAttribute('aria-pressed', 'true')
    
    // Click to hide password again
    await user.click(toggleButton)
    
    expect(passwordInput).toHaveAttribute('type', 'password')
    expect(screen.getByRole('button', { name: /show password/i })).toBeInTheDocument()
  })

  it('prevents double submission when loading', async () => {
    const user = userEvent.setup()
    render(<Login {...mockProps} />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const passwordInput = screen.getByLabelText('Password')
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')
    
    // Click multiple times rapidly
    await user.click(submitButton)
    await user.click(submitButton)
    await user.click(submitButton)
    
    // Should only call onLogin once
    await waitFor(() => {
      expect(mockProps.onLogin).toHaveBeenCalledTimes(1)
    }, { timeout: 2000 })
  })

  it('calls onSignUp when sign up link is clicked', async () => {
    const user = userEvent.setup()
    render(<Login {...mockProps} />)
    
    const signUpLink = screen.getByRole('button', { name: /sign up/i })
    await user.click(signUpLink)
    
    expect(mockProps.onSignUp).toHaveBeenCalled()
  })

  it('calls onForgotPassword when forgot password link is clicked', async () => {
    const user = userEvent.setup()
    render(<Login {...mockProps} />)
    
    const forgotPasswordLink = screen.getByText(/forgot password/i)
    await user.click(forgotPasswordLink)
    
    expect(mockProps.onForgotPassword).toHaveBeenCalled()
  })

  it('calls onSkip when skip button is clicked', async () => {
    const user = userEvent.setup()
    render(<Login {...mockProps} />)
    
    const skipButton = screen.getByText(/skip for testing/i)
    await user.click(skipButton)
    
    expect(mockProps.onSkip).toHaveBeenCalled()
  })

  it('displays social login options', () => {
    render(<Login {...mockProps} />)
    
    expect(screen.getByRole('button', { name: /continue with apple/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /continue with google/i })).toBeInTheDocument()
  })

  it('clears errors when user starts typing', async () => {
    const user = userEvent.setup()
    render(<Login {...mockProps} />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    // Trigger validation error
    await user.click(submitButton)
    expect(screen.getByText(/email is required/i)).toBeInTheDocument()
    
    // Start typing to clear error
    await user.type(emailInput, 'test@example.com')
    
    await waitFor(() => {
      expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument()
    })
  })

  it('handles social login clicks', async () => {
    const user = userEvent.setup()
    render(<Login {...mockProps} />)
    
    const appleButton = screen.getByRole('button', { name: /continue with apple/i })
    const googleButton = screen.getByRole('button', { name: /continue with google/i })
    
    await user.click(appleButton)
    await user.click(googleButton)
    
    // Should call onLogin after social login simulation
    await waitFor(() => {
      expect(mockProps.onLogin).toHaveBeenCalledTimes(2)
    }, { timeout: 1500 })
  })

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<Login {...mockProps} />)
    
    // Focus on the first focusable element in the form (skip button is first in tab order)
    await user.tab() // Skip button
    await user.tab() // Email input
    expect(screen.getByLabelText(/email/i)).toHaveFocus()
    
    await user.tab() // Password input
    expect(screen.getByLabelText('Password')).toHaveFocus()
    
    await user.tab() // Password toggle button
    expect(screen.getByRole('button', { name: /show password/i })).toHaveFocus()
    
    await user.tab() // Forgot password link
    expect(screen.getByText(/forgot password/i)).toHaveFocus()
    
    await user.tab() // Sign in button
    expect(screen.getByRole('button', { name: /sign in/i })).toHaveFocus()
  })

  it('validates error styling is applied correctly', async () => {
    const user = userEvent.setup()
    render(<Login {...mockProps} />)
    
    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    
    await user.type(emailInput, 'invalid-email')
    await user.click(submitButton)
    
    await waitFor(() => {
      // Test that error styling classes are applied
      expect(emailInput).toHaveClass('focus:ring-red-500/20', 'bg-red-50')
    })
  })

  it('has proper ARIA landmarks and roles', () => {
    render(<Login {...mockProps} />)
    
    // Check for proper heading structure
    expect(screen.getByRole('heading', { name: /welcome back/i })).toBeInTheDocument()
    
    // Check for proper button roles
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /show password/i })).toBeInTheDocument()
    
    // Check for proper form structure using specific selectors
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })
})
