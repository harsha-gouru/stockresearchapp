import { describe, it, expect } from 'vitest'
import { render, screen } from '../../utils/test-utils'
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from '../../../components/ui/card'

describe('Card Components', () => {
  describe('Card', () => {
    it('renders correctly', () => {
      render(<Card>Card content</Card>)
      expect(screen.getByText('Card content')).toBeInTheDocument()
    })

    it('applies default classes', () => {
      render(<Card data-testid="card">Card content</Card>)
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('bg-card', 'text-card-foreground', 'flex', 'flex-col', 'gap-6', 'rounded-xl', 'border')
    })

    it('applies custom className', () => {
      render(<Card className="custom-class" data-testid="card">Card content</Card>)
      const card = screen.getByTestId('card')
      expect(card).toHaveClass('custom-class')
    })

    it('has correct data-slot attribute', () => {
      render(<Card data-testid="card">Card content</Card>)
      const card = screen.getByTestId('card')
      expect(card).toHaveAttribute('data-slot', 'card')
    })

    it('forwards props correctly', () => {
      render(<Card id="test-card" role="article">Card content</Card>)
      const card = screen.getByRole('article')
      expect(card).toHaveAttribute('id', 'test-card')
    })
  })

  describe('CardHeader', () => {
    it('renders correctly', () => {
      render(<CardHeader>Header content</CardHeader>)
      expect(screen.getByText('Header content')).toBeInTheDocument()
    })

    it('applies default classes', () => {
      render(<CardHeader data-testid="card-header">Header content</CardHeader>)
      const header = screen.getByTestId('card-header')
      expect(header).toHaveClass('grid', 'auto-rows-min', 'items-start', 'gap-1.5', 'px-6', 'pt-6')
    })

    it('has correct data-slot attribute', () => {
      render(<CardHeader data-testid="card-header">Header content</CardHeader>)
      const header = screen.getByTestId('card-header')
      expect(header).toHaveAttribute('data-slot', 'card-header')
    })
  })

  describe('CardTitle', () => {
    it('renders as h4 element', () => {
      render(<CardTitle>Card Title</CardTitle>)
      const title = screen.getByRole('heading', { level: 4 })
      expect(title).toBeInTheDocument()
      expect(title).toHaveTextContent('Card Title')
    })

    it('applies default classes', () => {
      render(<CardTitle data-testid="card-title">Card Title</CardTitle>)
      const title = screen.getByTestId('card-title')
      expect(title).toHaveClass('leading-none')
    })

    it('has correct data-slot attribute', () => {
      render(<CardTitle data-testid="card-title">Card Title</CardTitle>)
      const title = screen.getByTestId('card-title')
      expect(title).toHaveAttribute('data-slot', 'card-title')
    })
  })

  describe('CardDescription', () => {
    it('renders as p element', () => {
      render(<CardDescription>Card description text</CardDescription>)
      const description = screen.getByText('Card description text')
      expect(description.tagName).toBe('P')
    })

    it('applies default classes', () => {
      render(<CardDescription data-testid="card-description">Description</CardDescription>)
      const description = screen.getByTestId('card-description')
      expect(description).toHaveClass('text-muted-foreground')
    })

    it('has correct data-slot attribute', () => {
      render(<CardDescription data-testid="card-description">Description</CardDescription>)
      const description = screen.getByTestId('card-description')
      expect(description).toHaveAttribute('data-slot', 'card-description')
    })
  })

  describe('CardAction', () => {
    it('renders correctly', () => {
      render(<CardAction>Action content</CardAction>)
      expect(screen.getByText('Action content')).toBeInTheDocument()
    })

    it('applies default classes', () => {
      render(<CardAction data-testid="card-action">Action</CardAction>)
      const action = screen.getByTestId('card-action')
      expect(action).toHaveClass('col-start-2', 'row-span-2', 'row-start-1', 'self-start', 'justify-self-end')
    })

    it('has correct data-slot attribute', () => {
      render(<CardAction data-testid="card-action">Action</CardAction>)
      const action = screen.getByTestId('card-action')
      expect(action).toHaveAttribute('data-slot', 'card-action')
    })
  })

  describe('CardContent', () => {
    it('renders correctly', () => {
      render(<CardContent>Content text</CardContent>)
      expect(screen.getByText('Content text')).toBeInTheDocument()
    })

    it('applies default classes', () => {
      render(<CardContent data-testid="card-content">Content</CardContent>)
      const content = screen.getByTestId('card-content')
      expect(content).toHaveClass('px-6')
    })

    it('has correct data-slot attribute', () => {
      render(<CardContent data-testid="card-content">Content</CardContent>)
      const content = screen.getByTestId('card-content')
      expect(content).toHaveAttribute('data-slot', 'card-content')
    })
  })

  describe('CardFooter', () => {
    it('renders correctly', () => {
      render(<CardFooter>Footer content</CardFooter>)
      expect(screen.getByText('Footer content')).toBeInTheDocument()
    })

    it('applies default classes', () => {
      render(<CardFooter data-testid="card-footer">Footer</CardFooter>)
      const footer = screen.getByTestId('card-footer')
      expect(footer).toHaveClass('flex', 'items-center', 'px-6', 'pb-6')
    })

    it('has correct data-slot attribute', () => {
      render(<CardFooter data-testid="card-footer">Footer</CardFooter>)
      const footer = screen.getByTestId('card-footer')
      expect(footer).toHaveAttribute('data-slot', 'card-footer')
    })
  })

  describe('Complete Card Structure', () => {
    it('renders a complete card with all components', () => {
      render(
        <Card data-testid="complete-card">
          <CardHeader>
            <CardTitle>Test Card Title</CardTitle>
            <CardDescription>Test card description</CardDescription>
            <CardAction>
              <button>Action</button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p>This is the card content</p>
          </CardContent>
          <CardFooter>
            <button>Footer Button</button>
          </CardFooter>
        </Card>
      )

      expect(screen.getByTestId('complete-card')).toBeInTheDocument()
      expect(screen.getByRole('heading', { level: 4, name: 'Test Card Title' })).toBeInTheDocument()
      expect(screen.getByText('Test card description')).toBeInTheDocument()
      expect(screen.getByText('This is the card content')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Footer Button' })).toBeInTheDocument()
    })

    it('maintains proper semantic structure', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>Card Content</CardContent>
        </Card>
      )

      const title = screen.getByRole('heading', { level: 4 })
      const description = screen.getByText('Card Description')
      const content = screen.getByText('Card Content')

      expect(title).toBeInTheDocument()
      expect(description.tagName).toBe('P')
      expect(content).toBeInTheDocument()
    })
  })
})
