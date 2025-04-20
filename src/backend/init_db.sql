
-- Create the database if it doesn't exist
-- Run this command separately: CREATE DATABASE shabyt4_db;

-- Users table based on the schema.sql definition
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'student', -- student, teacher, admin
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  profile_image_url VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  language_preference VARCHAR(10) DEFAULT 'ru', -- ru, kk, en
  reset_token VARCHAR(255),
  reset_token_expiry BIGINT
);

-- Sample users (password is 'password' hashed with bcrypt)
INSERT INTO users (first_name, last_name, email, password, role, is_active, language_preference) 
VALUES 
  ('Әлібек', 'Нұрғали', 'alibek@shabyt.kz', '$2a$10$xVLXxKFZpX4FwKGFn1OhQ.n5AEiW1ETyuNBkpy7n99s4VJ3sO/b8i', 'admin', true, 'kk'),
  ('Айгүл', 'Қанатова', 'aigul@shabyt.kz', '$2a$10$xVLXxKFZpX4FwKGFn1OhQ.n5AEiW1ETyuNBkpy7n99s4VJ3sO/b8i', 'teacher', true, 'kk'),
  ('Нұрлан', 'Серікұлы', 'nurlan@shabyt.kz', '$2a$10$xVLXxKFZpX4FwKGFn1OhQ.n5AEiW1ETyuNBkpy7n99s4VJ3sO/b8i', 'student', true, 'kk')
ON CONFLICT (email) DO NOTHING;

-- Registration logs table with improved information
CREATE TABLE IF NOT EXISTS registration_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    registration_source VARCHAR(50), -- web, mobile, api
    ip_address VARCHAR(50),
    user_agent TEXT,
    referrer VARCHAR(255),
    device_info JSONB,
    verification_status VARCHAR(20) DEFAULT 'pending', -- pending, verified, failed
    verification_date TIMESTAMP,
    verification_method VARCHAR(20), -- email, phone, etc.
    verification_attempts INTEGER DEFAULT 0,
    metadata JSONB -- Additional metadata about registration process
);

-- User login logs with enhanced tracking
CREATE TABLE IF NOT EXISTS login_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    login_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    login_source VARCHAR(50), -- web, mobile, api
    ip_address VARCHAR(50),
    user_agent TEXT,
    location VARCHAR(255), -- Country/city derived from IP
    device_id VARCHAR(255), -- Unique device identifier if available
    status VARCHAR(20) NOT NULL, -- success, failed
    failure_reason VARCHAR(255),
    session_id VARCHAR(255), -- Track user sessions
    session_duration INTEGER -- Session duration in seconds (updated on logout)
);

-- User Sessions tracking
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    last_active_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(50),
    user_agent TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    metadata JSONB
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_registration_logs_user_id ON registration_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_login_logs_user_id ON login_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_registration_logs_email ON registration_logs(email);
