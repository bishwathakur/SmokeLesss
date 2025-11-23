/**
 * User Mapper
 * Maps between domain entities and data transfer objects (DTOs)
 * Handles conversion between different data representations
 */

import { User } from '../../domain/entities/User';

/**
 * User DTO for database storage
 * Dates are stored as ISO strings in the database
 */
export interface UserDTO {
    user_id: string;
    age: number;
    registration_date: string;
    smoking_start_age: number;
    daily_limit_goal: number;
    preferred_brands: string;
    created_at: string;
    updated_at: string;
}

/**
 * Map User entity to DTO for database storage
 */
export const mapUserToDTO = (user: User): UserDTO => {
    return {
        user_id: user.userId,
        age: user.age,
        registration_date: user.registrationDate.toISOString(),
        smoking_start_age: user.smokingStartAge,
        daily_limit_goal: user.dailyLimitGoal,
        preferred_brands: JSON.stringify(user.preferredBrands),
        created_at: user.createdAt.toISOString(),
        updated_at: user.updatedAt.toISOString(),
    };
};

/**
 * Map DTO to User entity
 */
export const mapDTOToUser = (dto: UserDTO): User => {
    return {
        userId: dto.user_id,
        age: dto.age,
        registrationDate: new Date(dto.registration_date),
        smokingStartAge: dto.smoking_start_age,
        dailyLimitGoal: dto.daily_limit_goal,
        preferredBrands: JSON.parse(dto.preferred_brands || '[]'),
        createdAt: new Date(dto.created_at),
        updatedAt: new Date(dto.updated_at),
    };
};

