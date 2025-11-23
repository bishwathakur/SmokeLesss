/**
 * Daily Stats Entity
 * Represents aggregated statistics for a single day
 */

/**
 * Daily Stats Entity
 * @description Daily Stats Entity
 * @interface DailyStats
 * @property {string} date - The date of the stats
 * @property {string} userId - The user's ID
 * @property {number} totalCigarettes - The total number of cigarettes smoked
 * @property {number} totalPuffs - The total number of puffs smoked
 * @property {boolean} limitExceeded - Whether the limit was exceeded
 * @property {Record<string, number>} brandBreakdown - The breakdown of cigarettes by brand
 * @property {Record<number, number>} hourlyBreakdown - The breakdown of cigarettes by hour
 */
export interface DailyStats {
    date: string;
    userId: string;
    totalCigarettes: number;
    totalPuffs: number;
    limitExceeded: boolean;
    brandBreakdown: Record<string, number>;
    hourlyBreakdown: Record<number, number>;
}

/**
 * Create a new DailyStats entity
 * @param date - The date of the stats
 * @param userId - The user's ID
 * @param totalCigarettes - The total number of cigarettes smoked
 * @param totalPuffs - The total number of puffs smoked
 * @param limitExceeded - Whether the limit was exceeded
 * @param brandBreakdown - The breakdown of cigarettes by brand
 * @param hourlyBreakdown - The breakdown of cigarettes by hour
 * @returns DailyStats
*/
export const createDailyStats = (
    date: string,
    userId: string,
    totalCigarettes: number = 0,
    totalPuffs: number = 0,
    limitExceeded: boolean = false,
    brandBreakdown: Record<string, number> = {},
    hourlyBreakdown: Record<number, number> = {}
): DailyStats => {
    return {
        date,
        userId,
        totalCigarettes,
        totalPuffs,
        limitExceeded,
        brandBreakdown,
        hourlyBreakdown,
    };
};

