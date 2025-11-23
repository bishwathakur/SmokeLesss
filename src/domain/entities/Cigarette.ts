/**
 * Cigarette Entity
 * Represents a single cigarette entry
 */

export type CigaretteType = 'choti' | 'badi' | 'slim';

/**
 * Cigarette entity
 * @description Cigarette entity
 * @interface Cigarette
 * @property {string} brand - The cigarette's brand
 * @property {CigaretteType} type - The cigarette's type
 * @property {number} nicotineContent - The cigarette's nicotine content
 */
export interface Cigarette {
    brand: string;
    type: CigaretteType;
    nicotineContent?: number;
}

/**
 * @description Create a new cigarette entity
 * @param brand - The cigarette's brand
 * @param type - The cigarette's type
 * @param nicotineContent - The cigarette's nicotine content
 * @returns Cigarette
 */

export const createCigarette = (
    brand: string,
    type: CigaretteType,
    nicotineContent?: number,
): Cigarette => {
    return { brand, type, nicotineContent };
};
