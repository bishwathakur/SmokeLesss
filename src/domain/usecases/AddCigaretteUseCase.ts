/**
 * Add Cigarette Use Case
 * Business logic for adding a new cigarette entry
 */

import { ISmokingRepository } from '../repositories/ISmokingRepository';
import { SmokingSession, createSmokingSession } from '../entities/SmokingSess';
import uuid from 'react-native-uuid';
import { CigaretteType } from '../entities/Cigarette';

export class AddCigaretteUseCase {
    constructor(private smokingRepository: ISmokingRepository) { }

    /**
     * Execute the use case to add a new cigarette
     * @param userId - ID of the user
     * @param brand - Cigarette brand name
     * @param type - Type of cigarette (regular, king-size, slim)
     * @param timestamp - When the cigarette was smoked (defaults to now)
     * @param notes - Optional notes about the session
     * @returns The created smoking session
     */
    async execute(
        userId: string,
        brand: string,
        type: CigaretteType,
        timestamp: Date = new Date(),
        notes?: string
    ): Promise<SmokingSession> {
        // Generate unique entry ID
        const entryId = uuid.v4() as string;

        // Create the smoking session entity
        const session = createSmokingSession(
            entryId,
            userId,
            timestamp,
            brand,
            type,
            0, // puffsCount - full cigarette
            true, // isComplete - full cigarette
            notes
        );

        // Save to repository
        await this.smokingRepository.addSession(session);

        return session;
    }
}

