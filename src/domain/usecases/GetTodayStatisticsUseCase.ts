/**
 * Get Today Statistics Use Case
 * Business logic for retrieving today's smoking statistics
 */

import { ISmokingRepository } from '../repositories/ISmokingRepository';
import { DailyStats, createDailyStats } from '../entities/DailyStats';
import { SmokingSession } from '../entities/SmokingSess';
import { getTodayString } from '../../core/utils/dateHelpers';

export class GetTodayStatisticsUseCase {
  constructor(private smokingRepository: ISmokingRepository) {}

  /**
   * Execute the use case to get today's statistics
   * @param userId - ID of the user
   * @param dailyLimit - Daily limit to check against
   * @returns DailyStats for today
   */
  async execute(userId: string, dailyLimit: number): Promise<DailyStats> {
    const today = getTodayString();

    // Try to get existing daily stats
    let dailyStats = await this.smokingRepository.getDailyStats(userId, today);

    // If no stats exist, calculate from sessions
    if (!dailyStats) {
      const sessions = await this.smokingRepository.getSessionsByDate(userId, today);
      dailyStats = this.calculateStatsFromSessions(userId, today, sessions, dailyLimit);
    }

    return dailyStats;
  }

  /**
   * Calculate daily stats from smoking sessions
   */
  private calculateStatsFromSessions(
    userId: string,
    date: string,
    sessions: SmokingSession[],
    dailyLimit: number
  ): DailyStats {
    let totalCigarettes = 0;
    let totalPuffs = 0;
    const brandBreakdown: Record<string, number> = {};
    const hourlyBreakdown: Record<number, number> = {};

    // Process each session
    sessions.forEach(session => {
      // Count complete cigarettes
      if (session.isComplete) {
        totalCigarettes += 1;
      } else {
        // For partial sessions, count puffs
        totalPuffs += session.puffsCount;
      }

      // Track brand breakdown
      if (session.cigaretteBrand) {
        brandBreakdown[session.cigaretteBrand] =
          (brandBreakdown[session.cigaretteBrand] || 0) + 1;
      }

      // Track hourly breakdown
      const hour = new Date(session.timestamp).getHours();
      hourlyBreakdown[hour] = (hourlyBreakdown[hour] || 0) + 1;
    });

    // Check if limit exceeded
    const limitExceeded = totalCigarettes > dailyLimit;

    return createDailyStats(
      date,
      userId,
      totalCigarettes,
      totalPuffs,
      limitExceeded,
      brandBreakdown,
      hourlyBreakdown
    );
  }
}

