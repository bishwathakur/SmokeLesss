/**
 * useDailyLimit Hook
 * Custom hook for managing daily limit
 */

import { useSmokingStore } from '../store/smokingStore';
import { CalculateDailyLimitUseCase } from '../../domain/usecases/CalculateDailyLimitUseCase';

export const useDailyLimit = () => {
  const { dailyLimit, setDailyLimit, currentUser } = useSmokingStore();
  const calculateUseCase = new CalculateDailyLimitUseCase();

  /**
   * Calculate and set daily limit based on user's age
   */
  const calculateAndSetLimit = (age: number) => {
    const limitData = calculateUseCase.execute(age);
    setDailyLimit(limitData.recommended);
    return limitData;
  };

  /**
   * Get recommended limit for a given age
   */
  const getRecommendedLimit = (age: number) => {
    return calculateUseCase.execute(age);
  };

  return {
    dailyLimit,
    setDailyLimit,
    calculateAndSetLimit,
    getRecommendedLimit,
    userAge: currentUser?.age,
  };
};

