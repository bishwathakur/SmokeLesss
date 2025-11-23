/**
 * Date utility functions for handling date operations
 * Used throughout the app for date formatting, comparisons, and calculations
 */

import { format, startOfDay, endOfDay, isToday, isYesterday, parseISO } from 'date-fns';

/**
 * Format date to YYYY-MM-DD string format
 * This is the standard format used in the database
 */
export const formatDateToString = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};

/**
 * Parse YYYY-MM-DD string to Date object
 */
export const parseDateString = (dateString: string): Date => {
  return parseISO(dateString);
};

/**
 * Get start of day (00:00:00) for a given date
 */
export const getStartOfDay = (date: Date): Date => {
  return startOfDay(date);
};

/**
 * Get end of day (23:59:59) for a given date
 */
export const getEndOfDay = (date: Date): Date => {
  return endOfDay(date);
};

/**
 * Check if a date is today
 */
export const isDateToday = (date: Date): boolean => {
  return isToday(date);
};

/**
 * Check if a date is yesterday
 */
export const isDateYesterday = (date: Date): boolean => {
  return isYesterday(date);
};

/**
 * Get today's date string in YYYY-MM-DD format
 */
export const getTodayString = (): string => {
  return formatDateToString(new Date());
};

/**
 * Get date string for N days ago
 */
export const getDaysAgoString = (daysAgo: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return formatDateToString(date);
};

/**
 * Get all date strings for the last N days
 */
export const getLastNDays = (n: number): string[] => {
  const dates: string[] = [];
  for (let i = 0; i < n; i++) {
    dates.push(getDaysAgoString(i));
  }
  return dates.reverse(); // Return in chronological order
};

