-- Migration to fix client schema to match frontend expectations

-- Drop the existing clients table if it exists (since we're changing the structure significantly)
DROP TABLE IF EXISTS clients CASCADE;

-- Create the clients table with correct field names
CREATE TABLE clients (
    id TEXT PRIMARY KEY,
    uci TEXT,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    country TEXT,
    notes TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert sample data for testing
INSERT INTO clients (id, first_name, last_name, email, phone, country, uci, notes) VALUES
('sample-client-1', 'John', 'Doe', 'john.doe@example.com', '+1-555-0123', 'United States', 'UCI123456', 'Sample client for testing'),
('sample-client-2', 'Maria', 'Garcia', 'maria.garcia@example.com', '+1-555-0124', 'Mexico', 'UCI123457', 'Work permit application'),
('sample-client-3', 'Ahmed', 'Khan', 'ahmed.khan@example.com', '+1-555-0125', 'Pakistan', 'UCI123458', 'Permanent residence application');