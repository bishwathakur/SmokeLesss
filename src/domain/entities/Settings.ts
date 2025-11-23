/**
 * Settings Entity
 * Represents user settings and preferences
 */

export type ThemeMode = 'light' | 'dark' | 'system';

/** */
export interface Settings {
  userId: string;
  notificationsEnabled: boolean;
  statusBarCounterEnabled: boolean;
  theme: ThemeMode;
  customBrands: string[];
  reminderTimes: string[]; // HH:mm format
  weeklyGoalReduction: number; // percentage
}

/**
 * Create default settings for a user
 */

export const createDefaultSettings = (userId: string): Settings => {
  return {
    userId,
    notificationsEnabled: true,
    statusBarCounterEnabled: true,
    theme: 'system',
    customBrands: [],
    reminderTimes: [],
    weeklyGoalReduction: 5.0,
  };
};

