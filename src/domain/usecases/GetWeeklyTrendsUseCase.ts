/**
 * Get Weekly Trends Use Case
 * Business logic for retrieving weekly smoking trends
 */

import { ISmokingRepository } from '../repositories/ISmokingRepository';
import { DailyStats } from '../entities/DailyStats';
import { getLastNDays } from '../../core/utils/dateHelpers';

export interface WeeklyTrendData {
    labels: string[];
    counts: number[];
    dates: string[];
}

export class GetWeeklyTrendsUseCase {
    constructor(private smokingRepository: ISmokingRepository) { }

    /**
     * Execute the use case to get weekly trends
     * @param userId - ID of the user
     * @returns Weekly trend data for the last 7 days
     */
    async execute(userId: string): Promise<WeeklyTrendData> {
        // Get last 7 days
        const dates = getLastNDays(7);

        // Get daily stats for each date
        const statsPromises = dates.map(date =>
            this.smokingRepository.getDailyStats(userId, date)
        );

        const stats = await Promise.all(statsPromises);

        // Format data for charts
        const labels = dates.map(date => {
            const dateObj = new Date(date);
            return dateObj.toLocaleDateString('en-US', { weekday: 'short' });
        });

        const counts = stats.map(stat => stat?.totalCigarettes || 0);

        return {
            labels,
            counts,
            dates,
        };
    }

    /**
     * Get monthly trends (last 30 days)
     */
    async getMonthlyTrends(userId: string): Promise<WeeklyTrendData> {
        const dates = getLastNDays(30);

        const statsPromises = dates.map(date =>
            this.smokingRepository.getDailyStats(userId, date)
        );

        const stats = await Promise.all(statsPromises);

        // Format labels for monthly view (show day of month)
        const labels = dates.map(date => {
            const dateObj = new Date(date);
            return dateObj.getDate().toString();
        });

        const counts = stats.map(stat => stat?.totalCigarettes || 0);

        return {
            labels,
            counts,
            dates,
        };
    }
}

