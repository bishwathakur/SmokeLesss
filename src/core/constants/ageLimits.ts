/**
 * Age-based daily limit constants
 * Defines the recommended daily cigarette limits based on age groups
 */

export interface AgeLimitRange {
  min: number;
  max: number;
  recommended: number;
}

/**
 * Age limit configuration for different age groups
 */
export const AGE_LIMITS: Record<string, AgeLimitRange> = {
  '18-25': { min: 5, max: 7, recommended: 6 },
  '26-35': { min: 4, max: 6, recommended: 5 },
  '36-45': { min: 3, max: 5, recommended: 4 },
  '46+': { min: 2, max: 4, recommended: 3 }
};

/**
 * Default age limit for edge cases
 */
export const DEFAULT_AGE_LIMIT: AgeLimitRange = { min: 5, max: 7, recommended: 6 };

