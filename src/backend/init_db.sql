
-- Create the database if it doesn't exist
-- Run this command separately: CREATE DATABASE shabyt_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
  reset_token VARCHAR(255),
  reset_token_expiry BIGINT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample users (password is 'password' hashed with bcrypt)
INSERT INTO users (name, email, password, role) 
VALUES 
  ('Әлібек Нұрғали', 'alibek@shabyt.kz', '$2a$10$xVLXxKFZpX4FwKGFn1OhQ.n5AEiW1ETyuNBkpy7n99s4VJ3sO/b8i', 'admin'),
  ('Айгүл Қанатова', 'aigul@shabyt.kz', '$2a$10$xVLXxKFZpX4FwKGFn1OhQ.n5AEiW1ETyuNBkpy7n99s4VJ3sO/b8i', 'teacher'),
  ('Нұрлан Серікұлы', 'nurlan@shabyt.kz', '$2a$10$xVLXxKFZpX4FwKGFn1OhQ.n5AEiW1ETyuNBkpy7n99s4VJ3sO/b8i', 'student')
ON CONFLICT (email) DO NOTHING;

-- Other tables from schema.sql would be included here
