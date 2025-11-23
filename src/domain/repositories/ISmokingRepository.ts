/**
 * Smoking Repository Interface
 * Defines the contract for smoking session data operations
 * This follows the Repository pattern from Clean Architecture
 */

import { SmokingSession } from '../entities/SmokingSess';
import { DailyStats } from '../entities/DailyStats';

export interface ISmokingRepository {
  /**
   * Add a new smoking session
   */
  addSession(session: SmokingSession): Promise<void>;

  /**
   * Get all sessions for a user
   */
  getSessionsByUserId(userId: string): Promise<SmokingSession[]>;

  /**
   * Get sessions for a specific date
   */
  getSessionsByDate(userId: string, date: string): Promise<SmokingSession[]>;

  /**
   * Get sessions within a date range
   */
  getSessionsByDateRange(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<SmokingSession[]>;

  /**
   * Get daily statistics for a specific date
   */
  getDailyStats(userId: string, date: string): Promise<DailyStats | null>;

  /**
   * Get daily statistics for a date range
   */
  getDailyStatsRange(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<DailyStats[]>;

  /**
   * Delete a session by ID
   */
  deleteSession(entryId: string): Promise<void>;

  /**
   * Update a session
   */
  updateSession(session: SmokingSession): Promise<void>;
}

