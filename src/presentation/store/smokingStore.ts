/**
 * Smoking Store (Zustand)
 * Centralized state management for the app
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '../../domain/entities/User';

interface SmokingState {
  // State
  todayCount: number;
  dailyLimit: number;
  currentUser: User | null;
  isLoading: boolean;

  // Actions
  addCigarette: (brand: string, type: string) => Promise<void>;
  addPuffs: (count: number, brand: string, type: string) => Promise<void>;
  setDailyLimit: (limit: number) => void;
  setCurrentUser: (user: User | null) => void;
  resetDailyCount: () => void;
  incrementTodayCount: () => void;
  setLoading: (loading: boolean) => void;
}

export const useSmokingStore = create<SmokingState>()(
  persist(
    (set, get) => ({
      // Initial state
      todayCount: 0,
      dailyLimit: 6,
      currentUser: null,
      isLoading: false,

      // Increment today's count (called after successful database save)
      incrementTodayCount: () => {
        set(state => ({ todayCount: state.todayCount + 1 }));
      },

      // Add cigarette (this will be enhanced to call the service)
      addCigarette: async (brand: string, type: string) => {
        // This will be connected to the service layer
        // For now, just increment the count
        get().incrementTodayCount();
      },

      // Add puffs (this will be enhanced to call the service)
      addPuffs: async (count: number, brand: string, type: string) => {
        // This will be connected to the service layer
        // Puff tracking logic will be implemented here
      },

      // Set daily limit
      setDailyLimit: (limit: number) => {
        set({ dailyLimit: limit });
      },

      // Set current user
      setCurrentUser: (user: User | null) => {
        set({ currentUser: user });
        if (user) {
          set({ dailyLimit: user.dailyLimitGoal });
        }
      },

      // Reset daily count (called at midnight or manually)
      resetDailyCount: () => {
        set({ todayCount: 0 });
      },

      // Set loading state
      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'smoking-storage',
      storage: createJSONStorage(() => AsyncStorage),
      // Only persist certain fields
      partialize: (state) => ({
        dailyLimit: state.dailyLimit,
        currentUser: state.currentUser,
      }),
    }
  )
);

