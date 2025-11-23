/**
 * Indian cigarette brands configuration
 * Contains popular brands with their variants and nicotine content
 */

export interface BrandVariant {
  name: string;
  variants: string[];
  nicotineContent: Record<string, number>;
}

export const INDIAN_CIGARETTE_BRANDS: Record<string, BrandVariant> = {
  marlboro: {
    name: 'Marlboro',
    variants: ['Choti Advanced', 'Badi Advanced'],
    nicotineContent: { regular: 0.8, kingSize: 1.0 }
  },
  goldFlake: {
    name: 'Gold Flake',
    variants: ['Regular', 'Kings', 'Premium'],
    nicotineContent: { regular: 0.7, kings: 0.9, premium: 0.6 }
  },
  classic: {
    name: 'Classic',
    variants: ['Regular', 'Ultra', 'Mild'],
    nicotineContent: { regular: 0.9, ultra: 1.1, mild: 0.5 }
  },
  navyCut: {
    name: 'Navy Cut',
    variants: ['Plain', 'Deluxe'],
    nicotineContent: { plain: 0.8, deluxe: 1.0 }
  },
  fourSquare: {
    name: 'Four Square',
    variants: ['Regular', 'Kings'],
    nicotineContent: { regular: 0.7, kings: 0.9 }
  }
};

/**
 * Get all brand names as an array
 */
export const getAllBrandNames = (): string[] => {
  return Object.values(INDIAN_CIGARETTE_BRANDS).map(brand => brand.name);
};

/**
 * Get variants for a specific brand
 */
export const getBrandVariants = (brandName: string): string[] => {
  const brand = Object.values(INDIAN_CIGARETTE_BRANDS).find(
    b => b.name.toLowerCase() === brandName.toLowerCase()
  );
  return brand?.variants || [];
};

