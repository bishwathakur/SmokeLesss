/**
 * Smoking Session Entity
 * Represents a single smoking session/entry in the domain model
 * This is the core entity for tracking smoking activities
 */

import { CigaretteType } from "./Cigarette";

/**
 * Smoking Session Entity
 * @description Smoking Session Entity
 * @interface SmokingSession
 * @property {string} entryId - The smoking session's ID
 * @property {string} userId - The user's ID
 * @property {Date} timestamp - The smoking session's timestamp
 * @property {string} cigaretteBrand - The cigarette's brand
 * @property {CigaretteType} cigaretteType - The cigarette's type
 * @property {number} puffsCount - The number of puffs in the smoking session
 * @property {boolean} isComplete - Whether the smoking session is complete
 * @property {string} notes - The notes for the smoking session
 * @property {Date} createdAt - The smoking session's creation date
 */
export interface SmokingSession {
  entryId: string;
  userId: string;
  timestamp: Date;
  cigaretteBrand: string;
  cigaretteType: CigaretteType;
  puffsCount: number;
  isComplete: boolean;
  notes?: string;
  createdAt: Date;
}

/**
* Create a new SmokingSession entity
* @param entryId - The smoking session's ID
* @param userId - The user's ID
* @param timestamp - The smoking session's timestamp
* @param cigaretteBrand - The cigarette's brand
* @param cigaretteType - The cigarette's type
* @param puffsCount - The number of puffs in the smoking session
* @param isComplete - Whether the smoking session is complete
* @param notes - The notes for the smoking session
* @returns SmokingSession
*/
export const createSmokingSession = (
  entryId: string,
  userId: string,
  timestamp: Date,
  cigaretteBrand: string,
  cigaretteType: CigaretteType,
  puffsCount: number = 0,
  isComplete: boolean = true,
  notes?: string
): SmokingSession => {
  return {
    entryId,
    userId,
    timestamp,
    cigaretteBrand,
    cigaretteType,
    puffsCount,
    isComplete,
    notes,
    createdAt: new Date(),
  };
};

/**
 * Create a partial smoking session (for puff tracking)
 * @param entryId - The smoking session's ID
 * @param userId - The user's ID
 * @param timestamp - The smoking session's timestamp
 * @param cigaretteBrand - The cigarette's brand
 * @param cigaretteType - The cigarette's type
 * @param puffsCount - The number of puffs in the smoking session
 * @param notes - The notes for the smoking session
 * @returns SmokingSession
 */
export const createPartialSession = (
  entryId: string,
  userId: string,
  timestamp: Date,
  cigaretteBrand: string,
  cigaretteType: CigaretteType,
  puffsCount: number,
  notes?: string
): SmokingSession => {
  return createSmokingSession(
    entryId,
    userId,
    timestamp,
    cigaretteBrand,
    cigaretteType,
    puffsCount,
    false,
    notes
  );
};
