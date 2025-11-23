/**
 * useSmokingStats Hook
 * Custom hook for accessing and managing smoking statistics
 */

import { useEffect, useState } from 'react';
import { useSmokingStore } from '../store/smokingStore';
import { SmokingService } from '../../application/services/SmokingService';
import { DailyStats } from '../../domain/entities/DailyStats';
import { LimitStatus } from '../../domain/usecases/CheckLimitExceededUseCase';

export const useSmokingStats = (smokingService?: SmokingService) => {
  const { todayCount, dailyLimit, currentUser, incrementTodayCount, setLoading } = useSmokingStore();
  const [todayStats, setTodayStats] = useState<DailyStats | null>(null);
  const [limitStatus, setLimitStatus] = useState<LimitStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Load today's statistics
  useEffect(() => {
    if (currentUser && smokingService) {
      loadTodayStats();
    }
  }, [currentUser, todayCount]);

  const loadTodayStats = async () => {
    if (!currentUser || !smokingService) return;

    try {
      setIsLoading(true);
      const stats = await smokingService.getTodayStatistics(
        currentUser.userId,
        dailyLimit
      );
      setTodayStats(stats);

      const status = await smokingService.checkLimitStatus(
        currentUser.userId,
        dailyLimit
      );
      setLimitStatus(status);
    } catch (error) {
      console.error('Error loading today stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addCigarette = async (brand: string, type: string) => {
    if (!currentUser || !smokingService) return;

    try {
      setLoading(true);
      await smokingService.addCigarette(currentUser.userId, brand, type);
      incrementTodayCount();
      await loadTodayStats(); // Refresh stats
    } catch (error) {
      console.error('Error adding cigarette:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const addPuffs = async (count: number, brand: string, type: string) => {
    if (!currentUser || !smokingService) return;

    try {
      setLoading(true);
      await smokingService.addPuffs(currentUser.userId, brand, type, count);
      await loadTodayStats(); // Refresh stats
    } catch (error) {
      console.error('Error adding puffs:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    todayCount,
    dailyLimit,
    todayStats,
    limitStatus,
    isLoading,
    addCigarette,
    addPuffs,
    refreshStats: loadTodayStats,
  };
};

