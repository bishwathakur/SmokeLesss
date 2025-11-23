/**
 * Smoking Session Mapper
 * Maps between SmokingSession entities and database DTOs
 */

import { CigaretteType } from '../../domain/entities/Cigarette';
import { SmokingSession } from '../../domain/entities/SmokingSess';

/**
 * Smoking Session DTO for database storage
 */
export interface SmokingSessionDTO {
    entry_id: string;
    user_id: string;
    timestamp: string;
    cigarette_brand: string;
    cigarette_type: CigaretteType;
    puffs_count: number;
    is_complete: number; // SQLite stores boolean as 0 or 1
    notes?: string;
    created_at: string;
}

/**
 * Map SmokingSession entity to DTO
 */
export const mapSessionToDTO = (session: SmokingSession): SmokingSessionDTO => {
    return {
        entry_id: session.entryId,
        user_id: session.userId,
        timestamp: session.timestamp.toISOString(),
        cigarette_brand: session.cigaretteBrand,
        cigarette_type: session.cigaretteType,
        puffs_count: session.puffsCount,
        is_complete: session.isComplete ? 1 : 0,
        notes: session.notes,
        created_at: session.createdAt.toISOString(),
    };
};

/**
 * Map DTO to SmokingSession entity
 */
export const mapDTOToSession = (dto: SmokingSessionDTO): SmokingSession => {
    return {
        entryId: dto.entry_id,
        userId: dto.user_id,
        timestamp: new Date(dto.timestamp),
        cigaretteBrand: dto.cigarette_brand,
        cigaretteType: dto.cigarette_type,
        puffsCount: dto.puffs_count,
        isComplete: dto.is_complete === 1,
        notes: dto.notes,
        createdAt: new Date(dto.created_at),
    };
};

