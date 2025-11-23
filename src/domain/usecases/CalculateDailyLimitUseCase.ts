/**
 * Calculate Daily Limit Use Case
 * Business logic for calculating age-based daily cigarette limits
 * This is a core use case in the domain layer
 */

import { DailyLimit, createDailyLimit } from '../entities/DailyLimit';
import { AGE_LIMITS, DEFAULT_AGE_LIMIT } from '../../core/constants/ageLimits';

export class CalculateDailyLimitUseCase {
  /**
   * Execute the use case to calculate daily limit based on age
   * @param age - User's age
   * @returns DailyLimit object with min, max, and recommended values
   */
  execute(age: number): DailyLimit {
    // Validate age input
    if (age < 18) {
      // For users under 18, return default (though app should prevent this)
      return DEFAULT_AGE_LIMIT;
    }

    // Determine age group and return corresponding limits
    if (age >= 18 && age <= 25) {
      return createDailyLimit(
        AGE_LIMITS['18-25'].min,
        AGE_LIMITS['18-25'].max,
        AGE_LIMITS['18-25'].recommended
      );
    } else if (age >= 26 && age <= 35) {
      return createDailyLimit(
        AGE_LIMITS['26-35'].min,
        AGE_LIMITS['26-35'].max,
        AGE_LIMITS['26-35'].recommended
      );
    } else if (age >= 36 && age <= 45) {
      return createDailyLimit(
        AGE_LIMITS['36-45'].min,
        AGE_LIMITS['36-45'].max,
        AGE_LIMITS['36-45'].recommended
      );
    } else if (age >= 46) {
      return createDailyLimit(
        AGE_LIMITS['46+'].min,
        AGE_LIMITS['46+'].max,
        AGE_LIMITS['46+'].recommended
      );
    }

    // Default fallback
    return DEFAULT_AGE_LIMIT;
  }
}

