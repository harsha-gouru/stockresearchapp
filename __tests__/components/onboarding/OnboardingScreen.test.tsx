import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '../../utils/test-utils'
import userEvent from '@testing-library/user-event'
import OnboardingScreen from '../../../components/OnboardingScreen'

describe('OnboardingScreen Component', () => {
  const mockProps = {
    onGetStarted: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the logo section correctly', () => {
    render(<OnboardingScreen {...mockProps} />)
    
    // Check for the logo SVG container
    const { container } = render(<OnboardingScreen {...mockProps} />)
    const svgElement = container.querySelector('svg')
    expect(svgElement).toBeInTheDocument()
  })

  it('displays the main title', () => {
    render(<OnboardingScreen {...mockProps} />)
    
    expect(screen.getByRole('heading', { name: /smart stock insights/i })).toBeInTheDocument()
  })

  it('displays the subtitle/description', () => {
    render(<OnboardingScreen {...mockProps} />)
    
    // The subtitle should be visible
    expect(screen.getByText(/ai-powered analysis for your portfolio/i)).toBeInTheDocument()
  })

  it('renders the Get Started button', () => {
    render(<OnboardingScreen {...mockProps} />)
    
    const getStartedButton = screen.getByRole('button', { name: /get started/i })
    expect(getStartedButton).toBeInTheDocument()
  })

  it('renders the Skip button', () => {
    render(<OnboardingScreen {...mockProps} />)
    
    const skipButton = screen.getByRole('button', { name: /skip for now/i })
    expect(skipButton).toBeInTheDocument()
  })

  it('calls onGetStarted when Get Started button is clicked', async () => {
    const user = userEvent.setup()
    render(<OnboardingScreen {...mockProps} />)
    
    const getStartedButton = screen.getByRole('button', { name: /get started/i })
    await user.click(getStartedButton)
    
    expect(mockProps.onGetStarted).toHaveBeenCalledTimes(1)
  })

  it('calls onGetStarted when Skip button is clicked', async () => {
    const user = userEvent.setup()
    render(<OnboardingScreen {...mockProps} />)
    
    const skipButton = screen.getByRole('button', { name: /skip for now/i })
    await user.click(skipButton)
    
    expect(mockProps.onGetStarted).toHaveBeenCalledTimes(1)
  })

  it('has proper semantic structure', () => {
    render(<OnboardingScreen {...mockProps} />)
    
    // Check for heading hierarchy
    const mainHeading = screen.getByRole('heading', { level: 1 })
    expect(mainHeading).toHaveTextContent(/smart stock insights/i)
  })

  it('has proper accessibility attributes', () => {
    render(<OnboardingScreen {...mockProps} />)
    
    const getStartedButton = screen.getByRole('button', { name: /get started/i })
    const skipButton = screen.getByRole('button', { name: /skip for now/i })
    
    expect(getStartedButton).toBeEnabled()
    expect(skipButton).toBeEnabled()
  })

  it('supports keyboard navigation', async () => {
    const user = userEvent.setup()
    render(<OnboardingScreen {...mockProps} />)
    
    const getStartedButton = screen.getByRole('button', { name: /get started/i })
    const skipButton = screen.getByRole('button', { name: /skip for now/i })
    
    // Tab to first button
    await user.tab()
    expect(getStartedButton).toHaveFocus()
    
    // Tab to second button
    await user.tab()
    expect(skipButton).toHaveFocus()
  })

  it('triggers button clicks with keyboard', async () => {
    const user = userEvent.setup()
    render(<OnboardingScreen {...mockProps} />)
    
    const getStartedButton = screen.getByRole('button', { name: /get started/i })
    
    getStartedButton.focus()
    await user.keyboard('{Enter}')
    
    expect(mockProps.onGetStarted).toHaveBeenCalledTimes(1)
  })

  it('has correct layout and styling classes', () => {
    const { container } = render(<OnboardingScreen {...mockProps} />)
    
    // Check main container
    const mainContainer = container.firstChild
    expect(mainContainer).toHaveClass('relative', 'h-full', 'w-full', 'bg-white')
  })

  it('renders without crashing when no props are provided', () => {
    expect(() => render(<OnboardingScreen />)).not.toThrow()
  })

  it('logs correct messages when buttons are clicked', async () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    const user = userEvent.setup()
    
    render(<OnboardingScreen {...mockProps} />)
    
    const getStartedButton = screen.getByRole('button', { name: /get started/i })
    const skipButton = screen.getByRole('button', { name: /skip for now/i })
    
    await user.click(getStartedButton)
    expect(consoleSpy).toHaveBeenCalledWith('Get Started pressed')
    
    await user.click(skipButton)
    expect(consoleSpy).toHaveBeenCalledWith('Skip pressed')
    
    consoleSpy.mockRestore()
  })

  it('displays the app description text', () => {
    render(<OnboardingScreen {...mockProps} />)
    
    // Check for description text that should be present
    const description = screen.getByText(/ai-powered analysis for your portfolio/i)
    expect(description).toBeInTheDocument()
  })

  it('has proper component structure and hierarchy', () => {
    const { container } = render(<OnboardingScreen {...mockProps} />)
    
    // Check for main sections
    const logoSection = container.querySelector('.pt-8')
    const contentSection = container.querySelector('.text-center')
    
    expect(logoSection).toBeInTheDocument()
    expect(contentSection).toBeInTheDocument()
  })
})
