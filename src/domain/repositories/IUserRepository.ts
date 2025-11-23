/**
 * User Repository Interface
 * Defines the contract for user data operations
 * This follows the Repository pattern from Clean Architecture
 */

import { User } from '../entities/User';
import { Settings } from '../entities/Settings';

export interface IUserRepository {
  /**
   * Create a new user
   */
  createUser(user: User): Promise<void>;

  /**
   * Get user by ID
   */
  getUserById(userId: string): Promise<User | null>;

  /**
   * Update user information
   */
  updateUser(user: User): Promise<void>;

  /**
   * Delete user
   */
  deleteUser(userId: string): Promise<void>;

  /**
   * Get user settings
   */
  getSettings(userId: string): Promise<Settings | null>;

  /**
   * Update user settings
   */
  updateSettings(settings: Settings): Promise<void>;

  /**
   * Check if user exists
   */
  userExists(userId: string): Promise<boolean>;
}

