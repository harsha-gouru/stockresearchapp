#!/bin/bash

# Full Stack Docker Management Script
# Manages frontend + backend + databases in Docker

set -e

PROJECT_NAME="stock-trading-app"
COMPOSE_FILE="docker-compose-fullstack.yml"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}🐳 Full Stack Docker Manager${NC}"
    echo "==============================="
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker first."
        exit 1
    fi
    print_status "Docker is running"
}

# Build and start all services
start_stack() {
    print_header
    check_docker
    
    print_status "Stopping any existing containers..."
    docker-compose -f $COMPOSE_FILE down --remove-orphans 2>/dev/null || true
    
    print_status "Building and starting full stack..."
    docker-compose -f $COMPOSE_FILE up -d --build
    
    print_status "Waiting for services to be ready..."
    
    # Wait for backend health check
    print_status "Waiting for backend to be healthy..."
    timeout 120s bash -c 'until curl -f http://localhost:3000/health >/dev/null 2>&1; do sleep 2; done' || {
        print_error "Backend failed to start within 120 seconds"
        docker-compose -f $COMPOSE_FILE logs backend
        exit 1
    }
    
    # Wait for frontend
    print_status "Waiting for frontend to be ready..."
    timeout 60s bash -c 'until curl -f http://localhost:3001 >/dev/null 2>&1; do sleep 2; done' || {
        print_warning "Frontend might still be starting up, check manually"
    }
    
    print_status "Full stack is ready!"
    show_status
}

# Stop all services
stop_stack() {
    print_header
    print_status "Stopping all services..."
    docker-compose -f $COMPOSE_FILE down
    print_status "All services stopped"
}

# Restart all services
restart_stack() {
    print_header
    stop_stack
    start_stack
}

# Show status of all services
show_status() {
    print_header
    print_status "Service Status:"
    docker-compose -f $COMPOSE_FILE ps
    
    echo ""
    print_status "Access Information:"
    echo "📱 Frontend (React):     http://localhost:3001"
    echo "🚀 Backend API:          http://localhost:3000"
    echo "🔍 API Health:           http://localhost:3000/health"
    echo "🗄️  PostgreSQL:          localhost:5432"
    echo "📝 Redis:                localhost:6379"
    echo ""
    print_status "Test the signup form at: http://localhost:3001"
}

# Show logs
show_logs() {
    service=${1:-""}
    if [ -z "$service" ]; then
        print_status "Showing logs for all services..."
        docker-compose -f $COMPOSE_FILE logs -f
    else
        print_status "Showing logs for $service..."
        docker-compose -f $COMPOSE_FILE logs -f $service
    fi
}

# Clean up everything
clean_all() {
    print_header
    print_warning "This will remove all containers, networks, and volumes!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Cleaning up everything..."
        docker-compose -f $COMPOSE_FILE down --volumes --remove-orphans
        docker system prune -f
        print_status "Cleanup complete"
    else
        print_status "Cleanup cancelled"
    fi
}

# Test the integration
test_integration() {
    print_header
    print_status "Testing full stack integration..."
    
    # Check backend health
    if curl -f http://localhost:3000/health >/dev/null 2>&1; then
        echo "✅ Backend healthy"
    else
        echo "❌ Backend not responding"
        return 1
    fi
    
    # Check frontend
    if curl -f http://localhost:3001 >/dev/null 2>&1; then
        echo "✅ Frontend accessible"
    else
        echo "❌ Frontend not responding"
        return 1
    fi
    
    # Test registration API
    echo "🧪 Testing registration API..."
    REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3000/api/v1/auth/register \
        -H "Content-Type: application/json" \
        -H "Origin: http://localhost:3001" \
        -d "{
            \"email\": \"test_$(date +%s)@example.com\",
            \"password\": \"TestPassword123\",
            \"firstName\": \"Test\",
            \"lastName\": \"User\"
        }")
    
    if echo "$REGISTER_RESPONSE" | grep -q "User registered successfully"; then
        echo "✅ Registration API working"
    else
        echo "❌ Registration API failed"
        echo "Response: $REGISTER_RESPONSE"
        return 1
    fi
    
    print_status "✅ All tests passed! Integration is working."
}

# Help function
show_help() {
    print_header
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  start     - Build and start all services"
    echo "  stop      - Stop all services"
    echo "  restart   - Restart all services"
    echo "  status    - Show status of all services"
    echo "  logs      - Show logs (optionally specify service name)"
    echo "  test      - Test the integration"
    echo "  clean     - Clean up all containers and volumes"
    echo "  help      - Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 start              # Start the full stack"
    echo "  $0 logs frontend      # Show frontend logs"
    echo "  $0 logs backend       # Show backend logs"
    echo "  $0 test               # Test the integration"
}

# Main command handler
case "${1:-help}" in
    start)
        start_stack
        ;;
    stop)
        stop_stack
        ;;
    restart)
        restart_stack
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs $2
        ;;
    test)
        test_integration
        ;;
    clean)
        clean_all
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac
