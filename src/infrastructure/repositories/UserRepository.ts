/**
 * User Repository Implementation
 * Implements IUserRepository using SQLite database
 */

import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { Settings, createDefaultSettings } from '../../domain/entities/Settings';
import { SQLiteDatabase } from '../database/SQLiteDataBase';
import { mapUserToDTO, mapDTOToUser } from '../../application/mappers/UserMapper';

export class UserRepository implements IUserRepository {
  private db = SQLiteDatabase.getInstance().getDatabase();

  async createUser(user: User): Promise<void> {
    const dto = mapUserToDTO(user);
    
    // react-native-quick-sqlite: execute() is synchronous
    this.db.execute(
      `INSERT INTO users 
       (user_id, age, registration_date, smoking_start_age, daily_limit_goal, preferred_brands, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        dto.user_id,
        dto.age,
        dto.registration_date,
        dto.smoking_start_age,
        dto.daily_limit_goal,
        dto.preferred_brands,
        dto.created_at,
        dto.updated_at,
      ]
    );

    // Create default settings for the user
    const defaultSettings = createDefaultSettings(user.userId);
    await this.updateSettings(defaultSettings);
  }

  async getUserById(userId: string): Promise<User | null> {
    const results = this.db.execute(
      'SELECT * FROM users WHERE user_id = ?',
      [userId]
    );

    // Check if results.rows exists before accessing it
    if (!results.rows) {
      return null;
    }
    
    // Access rows as array
    const rows = results.rows._array || results.rows;
    if (!rows || rows.length === 0) {
      return null;
    }

    return mapDTOToUser(rows[0]);
  }

  async updateUser(user: User): Promise<void> {
    const dto = mapUserToDTO(user);
    
    this.db.execute(
      `UPDATE users 
       SET age = ?, smoking_start_age = ?, daily_limit_goal = ?, 
           preferred_brands = ?, updated_at = ?
       WHERE user_id = ?`,
      [
        dto.age,
        dto.smoking_start_age,
        dto.daily_limit_goal,
        dto.preferred_brands,
        dto.updated_at,
        dto.user_id,
      ]
    );
  }

  async deleteUser(userId: string): Promise<void> {
    // Delete related data first (cascade delete)
    this.db.execute('DELETE FROM smoking_sessions WHERE user_id = ?', [userId]);
    this.db.execute('DELETE FROM settings WHERE user_id = ?', [userId]);
    this.db.execute('DELETE FROM users WHERE user_id = ?', [userId]);
  }

  async getSettings(userId: string): Promise<Settings | null> {
    const results = this.db.execute(
      'SELECT * FROM settings WHERE user_id = ?',
      [userId]
    );

    // Check if results.rows exists before accessing it
    if (!results.rows) {
      return null;
    }
    
    // Access rows as array
    const rows = results.rows._array || results.rows;
    if (!rows || rows.length === 0) {
      return null;
    }

    const row = rows[0];
    return {
      userId: row.user_id,
      notificationsEnabled: row.notifications_enabled === 1,
      statusBarCounterEnabled: row.status_bar_counter_enabled === 1,
      theme: row.theme,
      customBrands: JSON.parse(row.custom_brands || '[]'),
      reminderTimes: JSON.parse(row.reminder_times || '[]'),
      weeklyGoalReduction: row.weekly_goal_reduction || 5.0,
    };
  }

  async updateSettings(settings: Settings): Promise<void> {
    this.db.execute(
      `INSERT OR REPLACE INTO settings 
       (user_id, notifications_enabled, status_bar_counter_enabled, theme, custom_brands, reminder_times, weekly_goal_reduction)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        settings.userId,
        settings.notificationsEnabled ? 1 : 0,
        settings.statusBarCounterEnabled ? 1 : 0,
        settings.theme,
        JSON.stringify(settings.customBrands),
        JSON.stringify(settings.reminderTimes),
        settings.weeklyGoalReduction,
      ]
    );
  }

  async userExists(userId: string): Promise<boolean> {
    const results = this.db.execute(
      'SELECT COUNT(*) as count FROM users WHERE user_id = ?',
      [userId]
    );
    
    // Check if results.rows exists before accessing it
    if (!results.rows) {
      return false;
    }
    
    // Access rows as array
    const rows = results.rows._array || results.rows;
    if (!rows || rows.length === 0) {
      return false;
    }
    return rows[0].count > 0;
  }
}

