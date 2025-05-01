-- Create the database
CREATE DATABASE IF NOT EXISTS bank_statement_analyzer;
USE bank_statement_analyzer;

-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE INDEX idx_email (email)
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create statements table
CREATE TABLE IF NOT EXISTS statements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    statement_name VARCHAR(255),
    bank_name VARCHAR(100),
    statement_period VARCHAR(100),
    file_name VARCHAR(255),
    processing_status ENUM('pending', 'completed', 'failed') DEFAULT 'pending',
    processed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create transactions table
CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    statement_id INT NOT NULL,
    date DATE NOT NULL,
    description TEXT,
    amount DECIMAL(15, 2) NOT NULL,
    type ENUM('credit', 'debit') NOT NULL,
    category_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (statement_id) REFERENCES statements(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Create spending summary table
CREATE TABLE IF NOT EXISTS spending_summaries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    statement_id INT NOT NULL,
    category_id INT NOT NULL,
    total_amount DECIMAL(15, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (statement_id) REFERENCES statements(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
    UNIQUE KEY unique_summary (statement_id, category_id)
);

-- Insert default categories
INSERT INTO categories (name, description) VALUES
('Utilities', 'Electricity, water, gas, internet, phone bills'),
('Food & Dining', 'Restaurants, grocery shopping, food delivery'),
('Travel & Transportation', 'Public transit, cabs, flights, hotels'),
('Subscriptions', 'Streaming services, software subscriptions, memberships'),
('EMIs or Loans', 'Loan repayments, EMIs, mortgage payments'),
('Shopping', 'Clothing, electronics, household items'),
('Healthcare', 'Medical expenses, pharmacy, insurance'),
('Miscellaneous', 'Other expenses that don\'t fit into specific categories');