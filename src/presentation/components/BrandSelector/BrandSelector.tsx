/**
 * Brand Selector Component
 * Allows users to select a cigarette brand and multiple types
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Colors } from '../../../core/theme/colors';
import { Typography } from '../../../core/theme/typography';
import { INDIAN_CIGARETTE_BRANDS, getAllBrandNames } from '../../../core/constants/brands';

interface BrandSelectorProps {
  selectedBrand?: string;
  selectedTypes?: string[]; // Changed to array for multiple selection
  onBrandSelect: (brand: string) => void;
  onTypeSelect: (type: string) => void; // This will toggle the type in/out
}

export const BrandSelector: React.FC<BrandSelectorProps> = ({
  selectedBrand,
  selectedTypes = [], // Default to empty array
  onBrandSelect,
  onTypeSelect,
}) => {
  const brands = getAllBrandNames();

  const getBrandVariants = (brandName: string): string[] => {
    const brand = Object.values(INDIAN_CIGARETTE_BRANDS).find(
      b => b.name.toLowerCase() === brandName.toLowerCase()
    );
    return brand?.variants || [];
  };

  const variants = selectedBrand ? getBrandVariants(selectedBrand) : [];

  // Helper function to check if a type is selected
  const isTypeSelected = (type: string): boolean => {
    return selectedTypes.includes(type);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Brand</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.brandScroll}>
        {brands.map(brand => (
          <TouchableOpacity
            key={brand}
            style={[
              styles.brandButton,
              selectedBrand === brand && styles.selectedBrandButton,
            ]}
            onPress={() => onBrandSelect(brand)}
          >
            <Text
              style={[
                styles.brandText,
                selectedBrand === brand && styles.selectedBrandText,
              ]}
            >
              {brand}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedBrand && variants.length > 0 && (
        <View style={styles.variantContainer}>
          <Text style={styles.label}>Select Types (Multiple Selection)</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {variants.map(variant => {
              const isSelected = isTypeSelected(variant);
              return (
                <TouchableOpacity
                  key={variant}
                  style={[
                    styles.variantButton,
                    isSelected && styles.selectedVariantButton,
                  ]}
                  onPress={() => onTypeSelect(variant)}
                >
                  <Text
                    style={[
                      styles.variantText,
                      isSelected && styles.selectedVariantText,
                    ]}
                  >
                    {variant}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          {selectedTypes.length > 0 && (
            <Text style={styles.selectedCount}>
              {selectedTypes.length} type{selectedTypes.length !== 1 ? 's' : ''} selected
            </Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  label: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  brandScroll: {
    marginVertical: 8,
  },
  brandButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: Colors.surface,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedBrandButton: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  brandText: {
    ...Typography.body,
    color: Colors.text,
  },
  selectedBrandText: {
    color: Colors.textLight,
    fontWeight: '600',
  },
  variantContainer: {
    marginTop: 16,
  },
  variantButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: Colors.surface,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedVariantButton: {
    backgroundColor: Colors.secondary,
    borderColor: Colors.secondary,
  },
  variantText: {
    ...Typography.bodySmall,
    color: Colors.text,
  },
  selectedVariantText: {
    color: Colors.textLight,
    fontWeight: '600',
  },
  selectedCount: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default BrandSelector;

