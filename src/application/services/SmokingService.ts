/**
 * Smoking Service
 * Application service that orchestrates smoking-related operations
 * Acts as a facade between presentation and domain layers
 */

import { AddCigaretteUseCase } from '../../domain/usecases/AddCigaretteUseCase';
import { AddPuffsUseCase } from '../../domain/usecases/AddPuffsUseCase';
import { GetTodayStatisticsUseCase } from '../../domain/usecases/GetTodayStatisticsUseCase';
import { GetWeeklyTrendsUseCase } from '../../domain/usecases/GetWeeklyTrendsUseCase';
import { CheckLimitExceededUseCase } from '../../domain/usecases/CheckLimitExceededUseCase';
import { SmokingSession } from '../../domain/entities/SmokingSess';
import { DailyStats } from '../../domain/entities/DailyStats';
import { LimitStatus } from '../../domain/usecases/CheckLimitExceededUseCase';
import { WeeklyTrendData } from '../../domain/usecases/GetWeeklyTrendsUseCase';
import { CigaretteType } from '../../domain/entities/Cigarette';

export class SmokingService {
    constructor(
        private addCigaretteUseCase: AddCigaretteUseCase,
        private addPuffsUseCase: AddPuffsUseCase,
        private getTodayStatisticsUseCase: GetTodayStatisticsUseCase,
        private getWeeklyTrendsUseCase: GetWeeklyTrendsUseCase,
        private checkLimitExceededUseCase: CheckLimitExceededUseCase
    ) { }

    /**
     * Add a cigarette for a user
     */
    async addCigarette(
        userId: string,
        brand: string,
        type: CigaretteType,
        timestamp?: Date,
        notes?: string
    ): Promise<SmokingSession> {
        return await this.addCigaretteUseCase.execute(userId, brand, type, timestamp, notes);
    }

    /**
     * Add puffs for a user
     */
    async addPuffs(
        userId: string,
        brand: string,
        type: CigaretteType,
        puffsCount: number,
        timestamp?: Date,
        notes?: string
    ): Promise<SmokingSession> {
        return await this.addPuffsUseCase.execute(userId, brand, type, puffsCount, timestamp, notes);
    }

    /**
     * Get today's statistics
     */
    async getTodayStatistics(userId: string, dailyLimit: number): Promise<DailyStats> {
        return await this.getTodayStatisticsUseCase.execute(userId, dailyLimit);
    }

    /**
     * Get weekly trends
     */
    async getWeeklyTrends(userId: string): Promise<WeeklyTrendData> {
        return await this.getWeeklyTrendsUseCase.execute(userId);
    }

    /**
     * Get monthly trends
     */
    async getMonthlyTrends(userId: string): Promise<WeeklyTrendData> {
        return await this.getWeeklyTrendsUseCase.getMonthlyTrends(userId);
    }

    /**
     * Check if limit is exceeded
     */
    async checkLimitStatus(userId: string, dailyLimit: number): Promise<LimitStatus> {
        return await this.checkLimitExceededUseCase.execute(userId, dailyLimit);
    }
}

