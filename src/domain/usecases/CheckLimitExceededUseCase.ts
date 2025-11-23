/**
 * Check Limit Exceeded Use Case
 * Business logic for checking if daily limit has been exceeded
 */

import { ISmokingRepository } from '../repositories/ISmokingRepository';
import { getTodayString } from '../../core/utils/dateHelpers';

export interface LimitStatus {
  isExceeded: boolean;
  currentCount: number;
  limit: number;
  remaining: number;
  percentage: number;
  warningLevel: 'none' | 'approaching' | 'almost' | 'exceeded';
}

export class CheckLimitExceededUseCase {
  constructor(private smokingRepository: ISmokingRepository) {}

  /**
   * Execute the use case to check limit status
   * @param userId - ID of the user
   * @param dailyLimit - Daily limit to check against
   * @returns LimitStatus with detailed information
   */
  async execute(userId: string, dailyLimit: number): Promise<LimitStatus> {
    const today = getTodayString();
    const sessions = await this.smokingRepository.getSessionsByDate(userId, today);

    // Count complete cigarettes
    const currentCount = sessions.filter(s => s.isComplete).length;

    // Calculate remaining
    const remaining = Math.max(0, dailyLimit - currentCount);

    // Calculate percentage
    const percentage = dailyLimit > 0 ? (currentCount / dailyLimit) * 100 : 0;

    // Determine if exceeded
    const isExceeded = currentCount > dailyLimit;

    // Determine warning level
    let warningLevel: LimitStatus['warningLevel'] = 'none';
    if (isExceeded) {
      warningLevel = 'exceeded';
    } else if (percentage >= 90) {
      warningLevel = 'almost';
    } else if (percentage >= 75) {
      warningLevel = 'approaching';
    }

    return {
      isExceeded,
      currentCount,
      limit: dailyLimit,
      remaining,
      percentage,
      warningLevel,
    };
  }
}

