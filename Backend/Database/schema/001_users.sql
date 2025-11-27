-- 001_users.sql

CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('admin', 'customer')),
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
