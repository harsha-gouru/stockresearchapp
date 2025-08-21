-- Initialize Stock Trading App Database
-- This script creates all necessary tables for the application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    full_name VARCHAR(255),
    phone_number VARCHAR(20),
    avatar_url TEXT,
    bio TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_premium BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP,
    onboarding_completed BOOLEAN DEFAULT FALSE,
    push_token TEXT,
    biometric_enabled BOOLEAN DEFAULT FALSE,
    preferred_currency VARCHAR(3) DEFAULT 'USD',
    timezone VARCHAR(50) DEFAULT 'UTC'
);

-- Auth Tokens Table
CREATE TABLE auth_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    token_type VARCHAR(20), -- 'access', 'refresh', 'reset_password'
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Social Auth Table
CREATE TABLE social_auth (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    provider VARCHAR(50), -- 'google', 'apple'
    provider_user_id VARCHAR(255),
    access_token TEXT,
    refresh_token TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Stocks Table
CREATE TABLE stocks (
    symbol VARCHAR(10) PRIMARY KEY,
    name VARCHAR(255),
    exchange VARCHAR(50),
    sector VARCHAR(100),
    industry VARCHAR(100),
    market_cap BIGINT,
    logo_url TEXT,
    description TEXT,
    ceo VARCHAR(255),
    employees INTEGER,
    headquarters VARCHAR(255),
    founded_year INTEGER,
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Stock Prices Table
CREATE TABLE stock_prices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    symbol VARCHAR(10) REFERENCES stocks(symbol),
    price DECIMAL(10,2),
    open DECIMAL(10,2),
    high DECIMAL(10,2),
    low DECIMAL(10,2),
    close DECIMAL(10,2),
    volume BIGINT,
    change DECIMAL(10,2),
    change_percent DECIMAL(5,2),
    timestamp TIMESTAMP DEFAULT NOW()
);

-- Portfolios Table
CREATE TABLE portfolios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) DEFAULT 'My Portfolio',
    total_value DECIMAL(15,2) DEFAULT 0,
    total_cost DECIMAL(15,2) DEFAULT 0,
    daily_change DECIMAL(15,2) DEFAULT 0,
    daily_change_percent DECIMAL(5,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Portfolio Holdings Table
CREATE TABLE portfolio_holdings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
    stock_symbol VARCHAR(10) NOT NULL,
    quantity DECIMAL(15,4),
    average_cost DECIMAL(10,2),
    current_price DECIMAL(10,2),
    current_value DECIMAL(15,2),
    profit_loss DECIMAL(15,2),
    profit_loss_percent DECIMAL(5,2),
    purchased_at TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Watchlists Table
CREATE TABLE watchlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) DEFAULT 'My Watchlist',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Watchlist Items Table
CREATE TABLE watchlist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    watchlist_id UUID REFERENCES watchlists(id) ON DELETE CASCADE,
    stock_symbol VARCHAR(10) NOT NULL,
    added_at TIMESTAMP DEFAULT NOW(),
    notes TEXT,
    target_price DECIMAL(10,2),
    UNIQUE(watchlist_id, stock_symbol)
);

-- Alerts Table
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    stock_symbol VARCHAR(10) NOT NULL,
    alert_type VARCHAR(50), -- 'price_above', 'price_below', 'percent_change', 'volume_spike'
    target_value DECIMAL(15,2),
    current_value DECIMAL(15,2),
    is_active BOOLEAN DEFAULT TRUE,
    is_triggered BOOLEAN DEFAULT FALSE,
    triggered_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    notes TEXT,
    notification_channels JSONB DEFAULT '["push"]'
);

-- Alert History Table
CREATE TABLE alert_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_id UUID REFERENCES alerts(id) ON DELETE CASCADE,
    triggered_at TIMESTAMP DEFAULT NOW(),
    stock_price DECIMAL(10,2),
    notification_sent BOOLEAN DEFAULT FALSE
);

-- Notifications Table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50), -- 'alert_triggered', 'price_movement', 'ai_insight', 'news', 'system'
    title VARCHAR(255),
    message TEXT,
    data JSONB, -- Additional data like stock_symbol, alert_id, etc.
    priority VARCHAR(20) DEFAULT 'medium', -- 'high', 'medium', 'low'
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Notification Settings Table
CREATE TABLE notification_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    push_enabled BOOLEAN DEFAULT TRUE,
    email_enabled BOOLEAN DEFAULT TRUE,
    sms_enabled BOOLEAN DEFAULT FALSE,
    price_alerts BOOLEAN DEFAULT TRUE,
    news_updates BOOLEAN DEFAULT TRUE,
    ai_insights BOOLEAN DEFAULT TRUE,
    portfolio_summary BOOLEAN DEFAULT TRUE,
    marketing BOOLEAN DEFAULT FALSE,
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    updated_at TIMESTAMP DEFAULT NOW()
);

-- AI Insights Table
CREATE TABLE ai_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stock_symbol VARCHAR(10),
    insight_type VARCHAR(50), -- 'buy_signal', 'sell_signal', 'hold', 'trend_analysis'
    title VARCHAR(255),
    content TEXT,
    confidence_score DECIMAL(3,2), -- 0.00 to 1.00
    prediction VARCHAR(50), -- 'bullish', 'bearish', 'neutral'
    reasoning JSONB, -- Detailed factors
    valid_until TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- User AI Insights Table
CREATE TABLE user_ai_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    insight_id UUID REFERENCES ai_insights(id) ON DELETE CASCADE,
    is_viewed BOOLEAN DEFAULT FALSE,
    is_acted_upon BOOLEAN DEFAULT FALSE,
    user_feedback VARCHAR(20), -- 'helpful', 'not_helpful', null
    created_at TIMESTAMP DEFAULT NOW()
);

-- Transactions Table
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    portfolio_id UUID REFERENCES portfolios(id) ON DELETE CASCADE,
    type VARCHAR(20), -- 'buy', 'sell'
    stock_symbol VARCHAR(10) NOT NULL,
    quantity DECIMAL(15,4),
    price DECIMAL(10,2),
    total_amount DECIMAL(15,2),
    commission DECIMAL(10,2) DEFAULT 0,
    notes TEXT,
    executed_at TIMESTAMP DEFAULT NOW()
);

-- Stock Categories Table
CREATE TABLE stock_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100),
    icon VARCHAR(10),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Stock Category Mappings Table
CREATE TABLE stock_category_mappings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stock_symbol VARCHAR(10) REFERENCES stocks(symbol),
    category_id UUID REFERENCES stock_categories(id),
    UNIQUE(stock_symbol, category_id)
);

-- User Search History Table
CREATE TABLE user_search_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    search_query VARCHAR(255),
    ticker VARCHAR(10),
    searched_at TIMESTAMP DEFAULT NOW()
);

-- Market Indices Table
CREATE TABLE market_indices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    symbol VARCHAR(20) UNIQUE NOT NULL, -- 'SP500', 'NASDAQ', 'DOW'
    name VARCHAR(100),
    value DECIMAL(10,2),
    change DECIMAL(10,2),
    change_percent DECIMAL(5,2),
    previous_close DECIMAL(10,2),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create Indexes for Performance
CREATE INDEX idx_stock_prices_symbol_timestamp ON stock_prices(symbol, timestamp DESC);
CREATE INDEX idx_alerts_user_active ON alerts(user_id, is_active) WHERE is_active = true;
CREATE INDEX idx_alerts_symbol ON alerts(stock_symbol);
CREATE INDEX idx_user_search_history ON user_search_history(user_id, searched_at DESC);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_portfolio_holdings_portfolio ON portfolio_holdings(portfolio_id);
CREATE INDEX idx_watchlist_items_watchlist ON watchlist_items(watchlist_id);

-- Insert Sample Market Indices
INSERT INTO market_indices (symbol, name, value, change, change_percent, previous_close) VALUES
('SP500', 'S&P 500', 4536.19, 37.88, 0.84, 4498.31),
('NASDAQ', 'NASDAQ Composite', 14229.91, 160.69, 1.14, 14069.22),
('DOW', 'Dow Jones Industrial Average', 35456.80, -78.12, -0.22, 35534.92);

-- Insert Sample Stock Categories
INSERT INTO stock_categories (slug, name, icon, description) VALUES
('tech', 'Tech Giants', '💻', 'Leading technology companies'),
('healthcare', 'Healthcare', '🏥', 'Healthcare and pharmaceutical companies'),
('finance', 'Finance', '🏦', 'Banks and financial services'),
('energy', 'Energy', '⚡', 'Energy and oil companies'),
('retail', 'Retail', '🛍️', 'Retail and consumer goods'),
('automotive', 'Automotive', '🚗', 'Automotive and transportation');

-- Insert Sample Stocks
INSERT INTO stocks (symbol, name, exchange, sector, industry) VALUES
('AAPL', 'Apple Inc.', 'NASDAQ', 'Technology', 'Consumer Electronics'),
('MSFT', 'Microsoft Corporation', 'NASDAQ', 'Technology', 'Software'),
('GOOGL', 'Alphabet Inc.', 'NASDAQ', 'Technology', 'Internet Services'),
('AMZN', 'Amazon.com Inc.', 'NASDAQ', 'Consumer Discretionary', 'E-commerce'),
('TSLA', 'Tesla Inc.', 'NASDAQ', 'Automotive', 'Electric Vehicles'),
('META', 'Meta Platforms Inc.', 'NASDAQ', 'Technology', 'Social Media'),
('NVDA', 'NVIDIA Corporation', 'NASDAQ', 'Technology', 'Semiconductors'),
('JPM', 'JPMorgan Chase & Co.', 'NYSE', 'Finance', 'Banking'),
('JNJ', 'Johnson & Johnson', 'NYSE', 'Healthcare', 'Pharmaceuticals'),
('V', 'Visa Inc.', 'NYSE', 'Finance', 'Payment Processing');

-- Map stocks to categories
INSERT INTO stock_category_mappings (stock_symbol, category_id) 
SELECT s.symbol, c.id 
FROM stocks s, stock_categories c 
WHERE (s.symbol IN ('AAPL', 'MSFT', 'GOOGL', 'META', 'NVDA') AND c.slug = 'tech')
   OR (s.symbol = 'JNJ' AND c.slug = 'healthcare')
   OR (s.symbol IN ('JPM', 'V') AND c.slug = 'finance')
   OR (s.symbol = 'TSLA' AND c.slug = 'automotive')
   OR (s.symbol = 'AMZN' AND c.slug = 'retail');

-- Insert Sample Stock Prices
INSERT INTO stock_prices (symbol, price, open, high, low, close, volume, change, change_percent) VALUES
('AAPL', 195.42, 193.80, 196.38, 193.42, 195.42, 52340000, 2.34, 1.21),
('MSFT', 408.75, 405.20, 410.50, 404.90, 408.75, 28450000, 5.55, 1.38),
('GOOGL', 142.89, 140.25, 143.75, 140.10, 142.89, 31250000, 3.14, 2.25),
('AMZN', 155.32, 152.80, 156.20, 152.45, 155.32, 45670000, 2.87, 1.88),
('TSLA', 248.56, 245.30, 251.20, 244.80, 248.56, 78920000, 8.26, 3.44),
('META', 502.18, 498.50, 505.30, 497.20, 502.18, 23890000, 6.68, 1.35),
('NVDA', 875.30, 845.20, 880.50, 842.10, 875.30, 45234567, 69.42, 8.62),
('JPM', 175.89, 174.20, 176.50, 173.80, 175.89, 12340000, 1.23, 0.70),
('JNJ', 162.45, 161.80, 163.20, 161.30, 162.45, 8750000, 0.85, 0.53),
('V', 285.67, 283.40, 287.20, 282.90, 285.67, 6890000, 2.91, 1.03);

COMMIT;
