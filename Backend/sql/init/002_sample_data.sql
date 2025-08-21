-- Sample data for development and testing
-- Run this after the initial schema setup

-- Insert sample users (passwords are hashed for 'password123')
INSERT INTO users (id, email, password_hash, first_name, last_name, is_verified) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'john.doe@example.com', '$2b$10$rOj5pGVZ5F5KkVxVKuFdJe.Y8kXGjYYs8FUyGhLF5Wq8L1HHXyJXu', 'John', 'Doe', true),
    ('550e8400-e29b-41d4-a716-446655440002', 'jane.smith@example.com', '$2b$10$rOj5pGVZ5F5KkVxVKuFdJe.Y8kXGjYYs8FUyGhLF5Wq8L1HHXyJXu', 'Jane', 'Smith', true),
    ('550e8400-e29b-41d4-a716-446655440003', 'demo@example.com', '$2b$10$rOj5pGVZ5F5KkVxVKuFdJe.Y8kXGjYYs8FUyGhLF5Wq8L1HHXyJXu', 'Demo', 'User', true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample watchlists
INSERT INTO watchlists (id, user_id, name, description, is_default) VALUES
    ('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Tech Stocks', 'Technology companies to watch', true),
    ('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Dividend Stocks', 'High dividend yield stocks', false),
    ('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Growth Stocks', 'High growth potential stocks', true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample watchlist stocks
INSERT INTO watchlist_stocks (watchlist_id, symbol, company_name, sort_order) VALUES
    ('660e8400-e29b-41d4-a716-446655440001', 'AAPL', 'Apple Inc.', 1),
    ('660e8400-e29b-41d4-a716-446655440001', 'MSFT', 'Microsoft Corporation', 2),
    ('660e8400-e29b-41d4-a716-446655440001', 'GOOGL', 'Alphabet Inc.', 3),
    ('660e8400-e29b-41d4-a716-446655440001', 'AMZN', 'Amazon.com Inc.', 4),
    ('660e8400-e29b-41d4-a716-446655440001', 'TSLA', 'Tesla Inc.', 5),
    ('660e8400-e29b-41d4-a716-446655440002', 'T', 'AT&T Inc.', 1),
    ('660e8400-e29b-41d4-a716-446655440002', 'VZ', 'Verizon Communications Inc.', 2),
    ('660e8400-e29b-41d4-a716-446655440002', 'KO', 'The Coca-Cola Company', 3),
    ('660e8400-e29b-41d4-a716-446655440003', 'NVDA', 'NVIDIA Corporation', 1),
    ('660e8400-e29b-41d4-a716-446655440003', 'AMD', 'Advanced Micro Devices Inc.', 2)
ON CONFLICT (watchlist_id, symbol) DO NOTHING;

-- Insert sample portfolios
INSERT INTO portfolios (id, user_id, name, description, cash_balance, is_default) VALUES
    ('770e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Main Portfolio', 'Primary investment portfolio', 5000.00, true),
    ('770e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440002', 'Retirement Fund', 'Long-term retirement investments', 25000.00, true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample portfolio holdings
INSERT INTO portfolio_holdings (portfolio_id, symbol, company_name, shares, average_cost, current_price) VALUES
    ('770e8400-e29b-41d4-a716-446655440001', 'AAPL', 'Apple Inc.', 10.000000, 180.50, 184.92),
    ('770e8400-e29b-41d4-a716-446655440001', 'MSFT', 'Microsoft Corporation', 5.000000, 340.20, 345.67),
    ('770e8400-e29b-41d4-a716-446655440001', 'GOOGL', 'Alphabet Inc.', 2.000000, 2650.00, 2678.45),
    ('770e8400-e29b-41d4-a716-446655440002', 'SPY', 'SPDR S&P 500 ETF Trust', 50.000000, 420.30, 445.60),
    ('770e8400-e29b-41d4-a716-446655440002', 'VTI', 'Vanguard Total Stock Market ETF', 25.000000, 210.80, 218.90)
ON CONFLICT (portfolio_id, symbol) DO NOTHING;

-- Insert sample transactions
INSERT INTO transactions (portfolio_id, symbol, transaction_type, shares, price_per_share, total_amount, fees, notes) VALUES
    ('770e8400-e29b-41d4-a716-446655440001', 'AAPL', 'buy', 10.000000, 180.50, 1805.00, 9.95, 'Initial purchase'),
    ('770e8400-e29b-41d4-a716-446655440001', 'MSFT', 'buy', 5.000000, 340.20, 1701.00, 9.95, 'Tech diversification'),
    ('770e8400-e29b-41d4-a716-446655440001', 'GOOGL', 'buy', 2.000000, 2650.00, 5300.00, 9.95, 'Growth investment'),
    ('770e8400-e29b-41d4-a716-446655440002', 'SPY', 'buy', 50.000000, 420.30, 21015.00, 9.95, 'Index fund investment'),
    ('770e8400-e29b-41d4-a716-446655440002', 'VTI', 'buy', 25.000000, 210.80, 5270.00, 9.95, 'Total market exposure')
ON CONFLICT DO NOTHING;

-- Insert sample stock alerts
INSERT INTO stock_alerts (user_id, symbol, alert_type, condition_value, message, is_active) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'AAPL', 'price_above', 200.00, 'Apple stock hit $200!', true),
    ('550e8400-e29b-41d4-a716-446655440001', 'TSLA', 'price_below', 150.00, 'Tesla dropped below $150', true),
    ('550e8400-e29b-41d4-a716-446655440002', 'MSFT', 'percent_change', 5.00, 'Microsoft up 5% today', true)
ON CONFLICT DO NOTHING;

-- Insert sample notifications
INSERT INTO notifications (user_id, title, message, type, data) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Welcome!', 'Welcome to your stock trading app!', 'system', '{"action": "welcome"}'),
    ('550e8400-e29b-41d4-a716-446655440001', 'Portfolio Update', 'Your portfolio gained 2.5% today', 'portfolio', '{"change": 2.5, "amount": 125.50}'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Market Alert', 'S&P 500 reached a new high', 'alert', '{"symbol": "^GSPC", "price": 4456.23}')
ON CONFLICT DO NOTHING;

-- Insert sample stock data cache (this would normally be populated by the application)
INSERT INTO stock_data_cache (symbol, data_type, data, expires_at) VALUES
    ('AAPL', 'quote', '{"symbol": "AAPL", "price": 184.92, "change": 2.15, "changePercent": 1.17}', NOW() + INTERVAL '1 minute'),
    ('MSFT', 'quote', '{"symbol": "MSFT", "price": 345.67, "change": 5.47, "changePercent": 1.61}', NOW() + INTERVAL '1 minute'),
    ('GOOGL', 'quote', '{"symbol": "GOOGL", "price": 2678.45, "change": 28.45, "changePercent": 1.07}', NOW() + INTERVAL '1 minute')
ON CONFLICT (symbol, data_type) DO UPDATE SET
    data = EXCLUDED.data,
    expires_at = EXCLUDED.expires_at,
    updated_at = CURRENT_TIMESTAMP;

-- Update market data with sample values
INSERT INTO market_data (symbol, name, current_price, change_amount, change_percent, volume) VALUES
    ('^GSPC', 'S&P 500', 4456.23, 12.45, 0.28, 1234567890),
    ('^DJI', 'Dow Jones Industrial Average', 34567.89, 156.78, 0.45, 987654321),
    ('^IXIC', 'NASDAQ Composite', 13456.78, -23.45, -0.17, 2345678901),
    ('^RUT', 'Russell 2000', 1987.65, 8.90, 0.45, 456789012),
    ('^VIX', 'CBOE Volatility Index', 18.45, -1.23, -6.25, 123456789)
ON CONFLICT (symbol) DO UPDATE SET
    current_price = EXCLUDED.current_price,
    change_amount = EXCLUDED.change_amount,
    change_percent = EXCLUDED.change_percent,
    volume = EXCLUDED.volume,
    last_updated = CURRENT_TIMESTAMP;

-- Create some audit log entries
INSERT INTO audit_logs (user_id, action, resource_type, resource_id, new_values, ip_address) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'user_login', 'user', '550e8400-e29b-41d4-a716-446655440001', '{"login_time": "2025-08-20T10:00:00Z"}', '192.168.1.100'),
    ('550e8400-e29b-41d4-a716-446655440001', 'portfolio_created', 'portfolio', '770e8400-e29b-41d4-a716-446655440001', '{"name": "Main Portfolio"}', '192.168.1.100'),
    ('550e8400-e29b-41d4-a716-446655440002', 'user_login', 'user', '550e8400-e29b-41d4-a716-446655440002', '{"login_time": "2025-08-20T09:30:00Z"}', '192.168.1.101')
ON CONFLICT DO NOTHING;

-- Sample data for development and testing purposes
