-- Database Schema for Smoking Regulation App
-- SQLite database schema definitions

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  user_id TEXT PRIMARY KEY,
  age INTEGER NOT NULL,
  registration_date TEXT NOT NULL,
  smoking_start_age INTEGER,
  daily_limit_goal INTEGER NOT NULL,
  preferred_brands TEXT, -- JSON array
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

-- Smoking Sessions Table
CREATE TABLE IF NOT EXISTS smoking_sessions (
  entry_id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  timestamp TEXT NOT NULL,
  cigarette_brand TEXT NOT NULL,
  cigarette_type TEXT NOT NULL,
  puffs_count INTEGER DEFAULT 0,
  is_complete INTEGER DEFAULT 1, -- Boolean (0 or 1)
  notes TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_timestamp ON smoking_sessions(user_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_date ON smoking_sessions(DATE(timestamp));

-- Settings Table
CREATE TABLE IF NOT EXISTS settings (
  user_id TEXT PRIMARY KEY,
  notifications_enabled INTEGER DEFAULT 1,
  status_bar_counter_enabled INTEGER DEFAULT 1,
  theme TEXT DEFAULT 'system',
  custom_brands TEXT, -- JSON array
  reminder_times TEXT, -- JSON array
  weekly_goal_reduction REAL DEFAULT 5.0,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

