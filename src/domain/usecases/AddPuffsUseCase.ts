/**
 * Add Puffs Use Case
 * Business logic for adding puffs (partial cigarette tracking)
 */

import { ISmokingRepository } from '../repositories/ISmokingRepository';
import { SmokingSession, createPartialSession } from '../entities/SmokingSess';
import uuid from 'react-native-uuid';
import { CigaretteType } from '../entities/Cigarette';

export class AddPuffsUseCase {
  constructor(private smokingRepository: ISmokingRepository) { }

  /**
   * Execute the use case to add puffs
   * @param userId - ID of the user
   * @param brand - Cigarette brand name
   * @param type - Type of cigarette
   * @param puffsCount - Number of puffs to add
   * @param timestamp - When the puffs were taken (defaults to now)
   * @param notes - Optional notes
   * @returns The created partial session
   */
  async execute(
    userId: string,
    brand: string,
    type: CigaretteType,
    puffsCount: number,
    timestamp: Date = new Date(),
    notes?: string
  ): Promise<SmokingSession> {
    // Validate puffs count
    if (puffsCount <= 0) {
      throw new Error('Puffs count must be greater than 0');
    }

    // Generate unique entry ID
    const entryId = uuid.v4() as string;

    // Create partial smoking session
    const session = createPartialSession(
      entryId,
      userId,
      timestamp,
      brand,
      type,
      puffsCount,
      notes
    );

    // Save to repository
    await this.smokingRepository.addSession(session);

    return session;
  }
}
