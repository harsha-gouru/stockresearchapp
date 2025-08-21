#!/bin/bash

# Database Setup Script for Stock Trading App
# This script sets up PostgreSQL and Redis locally on macOS without Docker

set -e  # Exit on any error

echo "🚀 Setting up Stock Trading App Database..."
echo "============================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Check if Homebrew is installed
if ! command -v brew &> /dev/null; then
    print_error "Homebrew is not installed. Please install it first:"
    echo "  /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
    exit 1
fi

print_success "Homebrew is installed"

# Install PostgreSQL
print_status "Checking PostgreSQL installation..."
if ! command -v psql &> /dev/null; then
    print_status "Installing PostgreSQL..."
    brew install postgresql@15
    print_success "PostgreSQL installed"
else
    print_success "PostgreSQL is already installed"
fi

# Install Redis
print_status "Checking Redis installation..."
if ! command -v redis-server &> /dev/null; then
    print_status "Installing Redis..."
    brew install redis
    print_success "Redis installed"
else
    print_success "Redis is already installed"
fi

# Add PostgreSQL to PATH for this session
export PATH="/opt/homebrew/opt/postgresql@15/bin:$PATH"

# Start PostgreSQL service
print_status "Starting PostgreSQL service..."
brew services start postgresql@15 || true
sleep 3

# Start Redis service
print_status "Starting Redis service..."
brew services start redis || true
sleep 2

# Create database and user
print_status "Setting up database..."

# Database configuration
DB_NAME="stock_trading_app"
DB_USER="stock_app_user"
DB_PASSWORD="stock_app_password"

# Check if PostgreSQL is running
if ! pg_isready &> /dev/null; then
    print_error "PostgreSQL is not running. Please start it manually:"
    echo "  brew services start postgresql@15"
    exit 1
fi

# Create database user if it doesn't exist
print_status "Creating database user..."
psql postgres -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" 2>/dev/null || print_warning "User might already exist"

# Create database if it doesn't exist
print_status "Creating database..."
psql postgres -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;" 2>/dev/null || print_warning "Database might already exist"

# Grant privileges
print_status "Granting privileges..."
psql postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;" 2>/dev/null || true

# Run database schema
print_status "Setting up database schema..."
if [ -f "sql/init/001_initial_schema.sql" ]; then
    psql -U $DB_USER -d $DB_NAME -f sql/init/001_initial_schema.sql
    print_success "Database schema created"
else
    print_error "Schema file not found: sql/init/001_initial_schema.sql"
    exit 1
fi

# Insert sample data
print_status "Inserting sample data..."
if [ -f "sql/init/002_sample_data.sql" ]; then
    psql -U $DB_USER -d $DB_NAME -f sql/init/002_sample_data.sql
    print_success "Sample data inserted"
else
    print_warning "Sample data file not found: sql/init/002_sample_data.sql"
fi

# Test Redis connection
print_status "Testing Redis connection..."
if redis-cli ping | grep -q "PONG"; then
    print_success "Redis is running and responding"
else
    print_error "Redis is not responding"
    exit 1
fi

# Create .env file if it doesn't exist
print_status "Setting up environment file..."
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        # Update .env with actual database credentials
        sed -i '' "s/your_postgres_user/$DB_USER/g" .env
        sed -i '' "s/your_postgres_password/$DB_PASSWORD/g" .env
        sed -i '' "s/stock_trading_app/$DB_NAME/g" .env
        print_success ".env file created from template"
    else
        print_warning ".env.example not found, creating basic .env file"
        cat > .env << EOF
NODE_ENV=development
PORT=3000
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=$DB_USER
DATABASE_PASSWORD=$DB_PASSWORD
DATABASE_NAME=$DB_NAME
DATABASE_URL=postgresql://$DB_USER:$DB_PASSWORD@localhost:5432/$DB_NAME
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_URL=redis://localhost:6379
JWT_SECRET=development-jwt-secret-change-in-production
JWT_REFRESH_SECRET=development-refresh-secret-change-in-production
EOF
        print_success "Basic .env file created"
    fi
else
    print_warning ".env file already exists, skipping creation"
fi

# Test database connection
print_status "Testing database connection..."
if psql -U $DB_USER -d $DB_NAME -c "SELECT COUNT(*) FROM users;" &> /dev/null; then
    print_success "Database connection successful"
else
    print_error "Database connection failed"
    exit 1
fi

# Display connection information
echo ""
print_success "Database setup complete!"
echo "============================================"
echo "Database Information:"
echo "  Database: $DB_NAME"
echo "  User: $DB_USER"
echo "  Password: $DB_PASSWORD"
echo "  Host: localhost"
echo "  Port: 5432"
echo ""
echo "Redis Information:"
echo "  Host: localhost"
echo "  Port: 6379"
echo ""
echo "To connect to PostgreSQL:"
echo "  psql -U $DB_USER -d $DB_NAME"
echo ""
echo "To connect to Redis:"
echo "  redis-cli"
echo ""
print_status "You can now start your application with:"
echo "  npm run start:yahoo  # For Yahoo Finance integration"
echo "  npm run dev:yahoo    # For development with hot reload"
echo ""
print_success "Setup complete! 🎉"
