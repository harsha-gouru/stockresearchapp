import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { vi } from 'vitest'

// Create a custom render function that includes any providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
    </>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
) => render(ui, { wrapper: AllTheProviders, ...options })

// Create mock functions for common callbacks
export const createMockProps = () => ({
  onLogin: vi.fn(),
  onSignUp: vi.fn(),
  onForgotPassword: vi.fn(),
  onSkip: vi.fn(),
  onGetStarted: vi.fn(),
  onNext: vi.fn(),
  onPrevious: vi.fn(),
  onComplete: vi.fn(),
  onCancel: vi.fn(),
  onSave: vi.fn(),
  onDelete: vi.fn(),
  onEdit: vi.fn(),
  onRefresh: vi.fn(),
  onClick: vi.fn(),
  onChange: vi.fn(),
  onSubmit: vi.fn(),
})

// Mock localStorage
export const mockLocalStorage = () => {
  const store: Record<string, string> = {}
  
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key])
    }),
  }
}

// Mock sessionStorage
export const mockSessionStorage = () => {
  const store: Record<string, string> = {}
  
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key]
    }),
    clear: vi.fn(() => {
      Object.keys(store).forEach(key => delete store[key])
    }),
  }
}

// Helper to wait for async operations
export const waitForAsync = () => new Promise(resolve => setTimeout(resolve, 0))

// Helper to create mock events
export const createMockEvent = (overrides = {}) => ({
  preventDefault: vi.fn(),
  stopPropagation: vi.fn(),
  target: { value: '' },
  ...overrides,
})

// Helper to mock fetch responses
export const mockFetch = (response: any, status = 200) => {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: vi.fn().mockResolvedValue(response),
    text: vi.fn().mockResolvedValue(JSON.stringify(response)),
  })
}

// Helper to test accessibility
export const testAccessibility = async (component: ReactElement) => {
  const { container } = customRender(component)
  
  // Basic accessibility checks
  const headings = container.querySelectorAll('h1, h2, h3, h4, h5, h6')
  const buttons = container.querySelectorAll('button')
  const links = container.querySelectorAll('a')
  const inputs = container.querySelectorAll('input, textarea, select')
  
  return {
    headings: Array.from(headings),
    buttons: Array.from(buttons),
    links: Array.from(links),
    inputs: Array.from(inputs),
  }
}

// Re-export everything from React Testing Library
export * from '@testing-library/react'
export { customRender as render }
