#!/bin/bash

# Docker Database Setup Script for Stock Trading App
# This script manages PostgreSQL and Redis using Docker

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo "🐳 Docker Database Setup for Stock Trading App"
    echo "=============================================="
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_error "Docker is not running. Please start Docker Desktop and try again."
        exit 1
    fi
    print_success "Docker is running"
}

# Start databases and application
start_full_stack() {
    print_status "Building and starting the full stack (app + databases)..."
    docker-compose up -d --build
    
    print_status "Waiting for all services to be ready..."
    
    # Wait for PostgreSQL
    print_status "Waiting for PostgreSQL to be ready..."
    until docker-compose exec -T postgres pg_isready -U stock_app_user -d stock_trading_app > /dev/null 2>&1; do
        echo -n "."
        sleep 2
    done
    echo ""
    print_success "PostgreSQL is ready"
    
    # Wait for Redis
    print_status "Waiting for Redis to be ready..."
    until docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; do
        echo -n "."
        sleep 1
    done
    echo ""
    print_success "Redis is ready"
    
    # Wait for application
    print_status "Waiting for Stock Trading App to be ready..."
    until curl -s http://localhost:3000/health > /dev/null 2>&1; do
        echo -n "."
        sleep 3
    done
    echo ""
    print_success "Stock Trading App is ready"
}

# Start databases
start_databases() {
    print_status "Starting PostgreSQL and Redis containers..."
    docker-compose up -d postgres redis
    
    print_status "Waiting for databases to be ready..."
    
    # Wait for PostgreSQL
    print_status "Waiting for PostgreSQL to be ready..."
    until docker-compose exec -T postgres pg_isready -U stock_app_user -d stock_trading_app > /dev/null 2>&1; do
        echo -n "."
        sleep 2
    done
    echo ""
    print_success "PostgreSQL is ready"
    
    # Wait for Redis
    print_status "Waiting for Redis to be ready..."
    until docker-compose exec -T redis redis-cli ping > /dev/null 2>&1; do
        echo -n "."
        sleep 1
    done
    echo ""
    print_success "Redis is ready"
}

# Start with GUI tools
start_with_tools() {
    print_status "Starting databases with GUI tools..."
    docker-compose --profile tools up -d
    
    print_status "Waiting for databases to be ready..."
    start_databases
    
    print_success "All services started!"
    echo ""
    echo "🌐 Available GUIs:"
    echo "   pgAdmin (PostgreSQL): http://localhost:8080"
    echo "   Redis Commander:      http://localhost:8081"
    echo ""
    echo "Login credentials:"
    echo "   pgAdmin: admin@stockapp.com / admin123"
}

# Stop databases
stop_databases() {
    print_status "Stopping all containers..."
    docker-compose down
    print_success "All containers stopped"
}

# Show logs
show_logs() {
    print_status "Showing database logs..."
    docker-compose logs -f postgres redis
}

# Show status
show_status() {
    print_status "Application stack status:"
    docker-compose ps
    
    echo ""
    print_status "Connection information:"
    echo "Stock Trading App:"
    echo "  URL: http://localhost:3000"
    echo "  Health: http://localhost:3000/health"
    echo "  API Docs: http://localhost:3000/api/v1/stocks/search?q=AAPL"
    echo ""
    echo "PostgreSQL:"
    echo "  Host: localhost"
    echo "  Port: 5432"
    echo "  Database: stock_trading_app"
    echo "  User: stock_app_user"
    echo "  Password: stock_app_password"
    echo ""
    echo "Redis:"
    echo "  Host: localhost"
    echo "  Port: 6379"
    echo "  No password required"
}

# Reset databases (removes all data)
reset_databases() {
    print_warning "This will remove ALL database data!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Stopping containers..."
        docker-compose down
        
        print_status "Removing volumes..."
        docker volume rm backend_postgres_data backend_redis_data 2>/dev/null || true
        
        print_status "Starting fresh containers..."
        start_databases
        
        print_success "Databases reset successfully!"
    else
        print_status "Reset cancelled"
    fi
}

# Update .env file
update_env() {
    print_status "Updating .env file with Docker database configuration..."
    
    if [ ! -f ".env" ]; then
        if [ -f ".env.example" ]; then
            cp .env.example .env
            print_success ".env file created from template"
        else
            print_error ".env.example not found"
            return 1
        fi
    fi
    
    # Update database settings for Docker
    sed -i.bak 's|DATABASE_HOST=.*|DATABASE_HOST=localhost|g' .env
    sed -i.bak 's|DATABASE_PORT=.*|DATABASE_PORT=5432|g' .env
    sed -i.bak 's|DATABASE_USER=.*|DATABASE_USER=stock_app_user|g' .env
    sed -i.bak 's|DATABASE_PASSWORD=.*|DATABASE_PASSWORD=stock_app_password|g' .env
    sed -i.bak 's|DATABASE_NAME=.*|DATABASE_NAME=stock_trading_app|g' .env
    sed -i.bak 's|DATABASE_URL=.*|DATABASE_URL=postgresql://stock_app_user:stock_app_password@localhost:5432/stock_trading_app|g' .env
    
    # Update Redis settings
    sed -i.bak 's|REDIS_HOST=.*|REDIS_HOST=localhost|g' .env
    sed -i.bak 's|REDIS_PORT=.*|REDIS_PORT=6379|g' .env
    sed -i.bak 's|REDIS_URL=.*|REDIS_URL=redis://localhost:6379|g' .env
    
    rm .env.bak 2>/dev/null || true
    print_success ".env file updated for Docker"
}

# Main script logic
case "${1:-app}" in
    "app")
        print_header
        check_docker
        update_env
        start_full_stack
        show_status
        ;;
    "db"|"start")
        print_header
        check_docker
        update_env
        start_databases
        show_status
        ;;
    "tools")
        print_header
        check_docker
        update_env
        print_status "Starting full stack with GUI tools..."
        docker-compose --profile tools up -d --build
        start_full_stack
        print_success "All services with tools started!"
        echo ""
        echo "🌐 Available GUIs:"
        echo "   Stock Trading App:    http://localhost:3000"
        echo "   pgAdmin (PostgreSQL): http://localhost:8080"
        echo "   Redis Commander:      http://localhost:8081"
        echo ""
        echo "Login credentials:"
        echo "   pgAdmin: admin@stockapp.com / admin123"
        show_status
        ;;
    "stop")
        print_header
        stop_databases
        ;;
    "restart")
        print_header
        check_docker
        stop_databases
        sleep 2
        start_full_stack
        show_status
        ;;
    "logs")
        case "${2:-all}" in
            "app")
                docker-compose logs -f app
                ;;
            "db"|"postgres")
                docker-compose logs -f postgres
                ;;
            "redis")
                docker-compose logs -f redis
                ;;
            *)
                show_logs
                ;;
        esac
        ;;
    "status")
        show_status
        ;;
    "reset")
        print_header
        check_docker
        reset_databases
        ;;
    "build")
        print_header
        check_docker
        print_status "Building application image..."
        docker-compose build app
        print_success "Application image built successfully!"
        ;;
    "shell")
        case "${2:-app}" in
            "app")
                print_status "Opening shell in application container..."
                docker-compose exec app sh
                ;;
            "db"|"postgres")
                print_status "Opening PostgreSQL shell..."
                docker-compose exec postgres psql -U stock_app_user -d stock_trading_app
                ;;
            "redis")
                print_status "Opening Redis CLI..."
                docker-compose exec redis redis-cli
                ;;
            *)
                print_error "Unknown shell target: $2"
                echo "Available targets: app, db/postgres, redis"
                ;;
        esac
        ;;
    "help"|"-h"|"--help")
        echo "Usage: $0 [command] [options]"
        echo ""
        echo "Commands:"
        echo "  app       Start full stack (app + databases) - default"
        echo "  db        Start only databases (PostgreSQL + Redis)"
        echo "  tools     Start with GUI tools (pgAdmin + Redis Commander)"
        echo "  stop      Stop all containers"
        echo "  restart   Restart all containers"
        echo "  logs      Show container logs [app|db|redis|all]"
        echo "  status    Show container status and connection info"
        echo "  reset     Reset databases (removes all data)"
        echo "  build     Build application image"
        echo "  shell     Open shell [app|db|redis]"
        echo "  help      Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0 app           # Start full application stack"
        echo "  $0 db            # Start only databases"
        echo "  $0 tools         # Start with web GUIs"
        echo "  $0 logs app      # Show only app logs"
        echo "  $0 shell app     # Open shell in app container"
        echo "  $0 shell db      # Open PostgreSQL shell"
        ;;
    *)
        print_error "Unknown command: $1"
        echo "Use '$0 help' for available commands"
        exit 1
        ;;
esac
