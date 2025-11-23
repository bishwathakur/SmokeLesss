/**
 * SQLite Database Manager
 * Handles database initialization and provides database connection
 * 
 * Uses react-native-quick-sqlite for better performance and modern API
 */

import { open, QuickSQLiteConnection } from 'react-native-quick-sqlite';

export class SQLiteDatabase {
    private static instance: SQLiteDatabase;
    private db: QuickSQLiteConnection | null = null;
    private dbName: string = 'SmokingRegulation.db';

    private constructor() { }

    /**
     * Get singleton instance
     */
    static getInstance(): SQLiteDatabase {
        if (!SQLiteDatabase.instance) {
            SQLiteDatabase.instance = new SQLiteDatabase();
        }
        return SQLiteDatabase.instance;
    }

    /**
     * Initialize and open database connection
     */
    async initialize(): Promise<void> {
        try {
            // Open database connection
            // react-native-quick-sqlite uses open() function which returns a connection object
            this.db = open({
                name: this.dbName,
                location: 'default',
            });

            // Create tables
            await this.createTables();
        } catch (error) {
            console.error('Database initialization error:', error);
            throw error;
        }
    }

    /**
     * Create all database tables
     */
    private async createTables(): Promise<void> {
        if (!this.db) {
            throw new Error('Database not initialized');
        }

        // Users table
        this.db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        user_id TEXT PRIMARY KEY,
        age INTEGER NOT NULL,
        registration_date TEXT NOT NULL,
        smoking_start_age INTEGER,
        daily_limit_goal INTEGER NOT NULL,
        preferred_brands TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

        // Smoking sessions table
        this.db.execute(`
      CREATE TABLE IF NOT EXISTS smoking_sessions (
        entry_id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        cigarette_brand TEXT NOT NULL,
        cigarette_type TEXT NOT NULL,
        puffs_count INTEGER DEFAULT 0,
        is_complete INTEGER DEFAULT 1,
        notes TEXT,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      );
    `);

        // Create indexes
        this.db.execute(`
      CREATE INDEX IF NOT EXISTS idx_user_timestamp 
      ON smoking_sessions(user_id, timestamp);
    `);

        this.db.execute(`
      CREATE INDEX IF NOT EXISTS idx_date 
      ON smoking_sessions(DATE(timestamp));
    `);

        // Settings table
        this.db.execute(`
      CREATE TABLE IF NOT EXISTS settings (
        user_id TEXT PRIMARY KEY,
        notifications_enabled INTEGER DEFAULT 1,
        status_bar_counter_enabled INTEGER DEFAULT 1,
        theme TEXT DEFAULT 'system',
        custom_brands TEXT,
        reminder_times TEXT,
        weekly_goal_reduction REAL DEFAULT 5.0,
        FOREIGN KEY (user_id) REFERENCES users(user_id)
      );
    `);
    }

    /**
     * Get database connection
     */
    getDatabase(): QuickSQLiteConnection {
        if (!this.db) {
            throw new Error('Database not initialized. Call initialize() first.');
        }
        return this.db;
    }

    /**
     * Close database connection
     */
    async close(): Promise<void> {
        if (this.db) {
            this.db.close();
            this.db = null;
        }
    }
}

