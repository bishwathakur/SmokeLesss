/**
 * User entity
 * @description User entity
 * @interface User
 * @property {string} userId - The user's ID
 * @property {number} age - The user's age
 * @property {Date} registrationDate - The user's registration date
 * @property {number} smokingStartAge - The user's smoking start age
 * @property {number} dailyLimitGoal - The user's daily limit goal
 * @property {string[]} preferredBrands - The user's preferred brands
 * @property {Date} createdAt - The user's creation date
 * @property {Date} updatedAt - The user's last update date
**/
/**
 * User Entity
 * Represents a user in the domain model
 * This is the core business entity for user information
 */

export interface User {
    userId: string;
    age: number;
    registrationDate: Date;
    smokingStartAge: number;
    dailyLimitGoal: number;
    preferredBrands: string[];
    createdAt: Date;
    updatedAt: Date;
  }

/**
 * @description Create a new user entity
 * @param userId - The user's ID
 * @param age - The user's age
 * @param registrationDate - The user's registration date
 * @param smokingStartAge - The user's smoking start age
 * @param dailyLimitGoal - The user's daily limit goal
 * @param preferredBrands - The user's preferred brands
 * @returns User
 */
export const createUser = (
    userId: string,
    age: number,
    registrationDate: Date,
    smokingStartAge: number,
    dailyLimitGoal: number,
    preferredBrands: string[]=[],
): User => {
    const now = new Date();
    return {
        userId,
        age,
        registrationDate,
        smokingStartAge,
        dailyLimitGoal,
        preferredBrands,
        createdAt: now,
        updatedAt: now,
    };
};


/**
 * @description Update the user's daily limit goal
 * @param user - The user to update
 * @param dailyLimit - The new daily limit goal
 * @returns User
 */
export const updateUserDailyLimit =(user:User, dailyLimit:number):User => {
    return {
        ...user,
        dailyLimitGoal: dailyLimit,
        updatedAt: new Date(),
    };
};

/**
 * @description Update the user's preferred brands
 * @param user - The user to update
 * @param preferredBrands - The new preferred brands
 * @returns User
 */
export const updateUserPreferredBrands =(user:User, preferredBrands:string[]):User => {
    return {
        ...user,
        preferredBrands: preferredBrands,
        updatedAt: new Date(),
    };
};