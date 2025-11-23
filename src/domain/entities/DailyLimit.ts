/**
 * Daily Limit Entity
 * Represents the daily limit configuration for a user
 */

/**
 * Daily Limit Entity
 * @description Daily Limit Entity
 * @interface DailyLimit
 * @property {number} min - The minimum daily limit
 * @property {number} max - The maximum daily limit
 * @property {number} recommended - The recommended daily limit
 */
export interface DailyLimit {
    min: number;
    max: number;
    recommended: number;
  }
  
  /**
   * Create a DailyLimit entity
   * @param min - The minimum daily limit
   * @param max - The maximum daily limit
   * @param recommended - The recommended daily limit
   * @returns DailyLimit
   */

  export const createDailyLimit = (
    min: number,
    max: number,
    recommended: number
  ): DailyLimit => {
    return {
      min,
      max,
      recommended,
    };
  };
  
  /**
   * Check if a count exceeds the limit
   * @param count - The count to check
   * @param limit - The limit to check
   * @returns boolean
   */
  export const isLimitExceeded = (count: number, limit: DailyLimit): boolean => {
    return count > limit.recommended;
  };
  
  /**
   * Check if a count is approaching the limit (75% or more)
   * @param count - The count to check
   * @param limit - The limit to check
   * @returns boolean
   */
  export const isApproachingLimit = (count: number, limit: DailyLimit): boolean => {
    const threshold = limit.recommended * 0.75;
    return count >= threshold && count < limit.recommended;
  };
  
  