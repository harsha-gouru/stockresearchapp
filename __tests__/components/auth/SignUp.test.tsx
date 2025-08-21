import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUp from '../../components/SignUp';
import api from '../../utils/api';

// Mock the API
vi.mock('../../utils/api', () => ({
  default: {
    auth: {
      register: vi.fn(),
    },
  },
}));

const mockProps = {
  onSignUp: vi.fn(),
  onLogin: vi.fn(),
  onBack: vi.fn(),
};

describe('SignUp Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders signup form correctly', () => {
    render(<SignUp {...mockProps} />);
    
    expect(screen.getByText('Create Account')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Full Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    const user = userEvent.setup();
    render(<SignUp {...mockProps} />);
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Full name is required')).toBeInTheDocument();
      expect(screen.getByText('Email is required')).toBeInTheDocument();
      expect(screen.getByText('Password is required')).toBeInTheDocument();
      expect(screen.getByText('You must accept the terms and conditions')).toBeInTheDocument();
    });
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    render(<SignUp {...mockProps} />);
    
    const emailInput = screen.getByPlaceholderText('Email');
    await user.type(emailInput, 'invalid-email');
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Email is invalid')).toBeInTheDocument();
    });
  });

  it('validates password requirements', async () => {
    const user = userEvent.setup();
    render(<SignUp {...mockProps} />);
    
    const passwordInput = screen.getByPlaceholderText('Password');
    await user.type(passwordInput, 'weak');
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters')).toBeInTheDocument();
    });
  });

  it('validates password complexity', async () => {
    const user = userEvent.setup();
    render(<SignUp {...mockProps} />);
    
    const passwordInput = screen.getByPlaceholderText('Password');
    await user.type(passwordInput, 'simplepassword');
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Password must contain uppercase, lowercase, and number')).toBeInTheDocument();
    });
  });

  it('validates password confirmation', async () => {
    const user = userEvent.setup();
    render(<SignUp {...mockProps} />);
    
    const passwordInput = screen.getByPlaceholderText('Password');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirm Password');
    
    await user.type(passwordInput, 'ValidPassword123');
    await user.type(confirmPasswordInput, 'DifferentPassword123');
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
    });
  });

  it('shows loading state during submission', async () => {
    const user = userEvent.setup();
    (api.auth.register as any).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));
    
    render(<SignUp {...mockProps} />);
    
    // Fill valid form data
    await user.type(screen.getByPlaceholderText('Full Name'), 'John Doe');
    await user.type(screen.getByPlaceholderText('Email'), 'john@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'ValidPassword123');
    await user.type(screen.getByPlaceholderText('Confirm Password'), 'ValidPassword123');
    await user.click(screen.getByRole('checkbox'));
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await user.click(submitButton);
    
    expect(screen.getByText('Creating Account...')).toBeInTheDocument();
    expect(submitButton).toBeDisabled();
  });

  it('handles successful registration', async () => {
    const user = userEvent.setup();
    (api.auth.register as any).mockResolvedValue({
      message: 'User registered successfully',
      user: { id: '1', email: 'john@example.com' },
      token: 'mock-token'
    });
    
    render(<SignUp {...mockProps} />);
    
    // Fill valid form data
    await user.type(screen.getByPlaceholderText('Full Name'), 'John Doe');
    await user.type(screen.getByPlaceholderText('Email'), 'john@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'ValidPassword123');
    await user.type(screen.getByPlaceholderText('Confirm Password'), 'ValidPassword123');
    await user.click(screen.getByRole('checkbox'));
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(api.auth.register).toHaveBeenCalledWith({
        email: 'john@example.com',
        password: 'ValidPassword123',
        firstName: 'John',
        lastName: 'Doe'
      });
      expect(mockProps.onSignUp).toHaveBeenCalled();
    });
  });

  it('handles registration error', async () => {
    const user = userEvent.setup();
    (api.auth.register as any).mockRejectedValue(new Error('User already exists'));
    
    render(<SignUp {...mockProps} />);
    
    // Fill valid form data
    await user.type(screen.getByPlaceholderText('Full Name'), 'John Doe');
    await user.type(screen.getByPlaceholderText('Email'), 'existing@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'ValidPassword123');
    await user.type(screen.getByPlaceholderText('Confirm Password'), 'ValidPassword123');
    await user.click(screen.getByRole('checkbox'));
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('User already exists')).toBeInTheDocument();
    });
  });

  it('handles network error gracefully', async () => {
    const user = userEvent.setup();
    (api.auth.register as any).mockRejectedValue(new TypeError('Failed to fetch'));
    
    render(<SignUp {...mockProps} />);
    
    // Fill valid form data
    await user.type(screen.getByPlaceholderText('Full Name'), 'John Doe');
    await user.type(screen.getByPlaceholderText('Email'), 'john@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'ValidPassword123');
    await user.type(screen.getByPlaceholderText('Confirm Password'), 'ValidPassword123');
    await user.click(screen.getByRole('checkbox'));
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    await user.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText('Failed to fetch')).toBeInTheDocument();
    });
  });

  it('toggles password visibility', async () => {
    const user = userEvent.setup();
    render(<SignUp {...mockProps} />);
    
    const passwordInput = screen.getByPlaceholderText('Password') as HTMLInputElement;
    const toggleButton = screen.getByRole('button', { name: /toggle password visibility/i });
    
    expect(passwordInput.type).toBe('password');
    
    await user.click(toggleButton);
    expect(passwordInput.type).toBe('text');
    
    await user.click(toggleButton);
    expect(passwordInput.type).toBe('password');
  });

  it('handles back button click', async () => {
    const user = userEvent.setup();
    render(<SignUp {...mockProps} />);
    
    const backButton = screen.getByText('Back');
    await user.click(backButton);
    
    expect(mockProps.onBack).toHaveBeenCalled();
  });

  it('handles login link click', async () => {
    const user = userEvent.setup();
    render(<SignUp {...mockProps} />);
    
    const loginLink = screen.getByText('Sign In');
    await user.click(loginLink);
    
    expect(mockProps.onLogin).toHaveBeenCalled();
  });

  it('shows password strength indicator', async () => {
    const user = userEvent.setup();
    render(<SignUp {...mockProps} />);
    
    const passwordInput = screen.getByPlaceholderText('Password');
    
    // Weak password
    await user.type(passwordInput, 'weak');
    expect(screen.getByText('Very Weak')).toBeInTheDocument();
    
    // Clear and type stronger password
    await user.clear(passwordInput);
    await user.type(passwordInput, 'StrongPassword123');
    expect(screen.getByText('Strong')).toBeInTheDocument();
  });

  it('prevents double submission', async () => {
    const user = userEvent.setup();
    (api.auth.register as any).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)));
    
    render(<SignUp {...mockProps} />);
    
    // Fill valid form data
    await user.type(screen.getByPlaceholderText('Full Name'), 'John Doe');
    await user.type(screen.getByPlaceholderText('Email'), 'john@example.com');
    await user.type(screen.getByPlaceholderText('Password'), 'ValidPassword123');
    await user.type(screen.getByPlaceholderText('Confirm Password'), 'ValidPassword123');
    await user.click(screen.getByRole('checkbox'));
    
    const submitButton = screen.getByRole('button', { name: /create account/i });
    
    // Click multiple times rapidly
    await user.click(submitButton);
    await user.click(submitButton);
    await user.click(submitButton);
    
    // Should only call API once
    expect(api.auth.register).toHaveBeenCalledTimes(1);
  });
});
