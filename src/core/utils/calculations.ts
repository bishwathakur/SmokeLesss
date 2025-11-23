/**
 * Calculation utility functions
 * Contains business logic for various calculations in the app
 */

/**
 * Calculate percentage with bounds checking
 * Ensures the result is between 0 and 100
 */
export const calculatePercentage = (current: number, total: number): number => {
  if (total === 0) return 0;
  return Math.min(Math.max((current / total) * 100, 0), 100);
};

/**
 * Calculate remaining count (cannot go below 0)
 */
export const calculateRemaining = (limit: number, current: number): number => {
  return Math.max(0, limit - current);
};

/**
 * Calculate average from an array of numbers
 */
export const calculateAverage = (numbers: number[]): number => {
  if (numbers.length === 0) return 0;
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  return sum / numbers.length;
};

/**
 * Calculate percentage change between two values
 */
export const calculatePercentageChange = (oldValue: number, newValue: number): number => {
  if (oldValue === 0) return newValue > 0 ? 100 : 0;
  return ((newValue - oldValue) / oldValue) * 100;
};

/**
 * Round to specified decimal places
 */
export const roundTo = (value: number, decimals: number): number => {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
};

