/**
 * Color theme configuration
 * Defines the color palette for the app
 */

export const Colors = {
  // Primary colors
  primary: '#FF6B6B',
  primaryDark: '#EE5A5A',
  primaryLight: '#FF8E8E',
  
  // Secondary colors
  secondary: '#4ECDC4',
  secondaryDark: '#3DB8B0',
  secondaryLight: '#6EDDD6',
  
  // Status colors
  success: '#51CF66',
  warning: '#FFD93D',
  error: '#FF6B6B',
  info: '#4DABF7',
  
  // Neutral colors
  background: '#FFFFFF',
  backgroundDark: '#1A1A1A',
  surface: '#F8F9FA',
  surfaceDark: '#2D2D2D',
  
  // Text colors
  text: '#212529',
  textSecondary: '#6C757D',
  textLight: '#FFFFFF',
  textDark: '#1A1A1A',
  
  // Border colors
  border: '#DEE2E6',
  borderDark: '#495057',
  
  // Chart colors
  chartPrimary: '#FF6B6B',
  chartSecondary: '#4ECDC4',
  chartTertiary: '#95E1D3',
  chartQuaternary: '#F38181',
};

/**
 * Get color based on theme mode
 */
export const getThemeColors = (isDark: boolean) => {
  return {
    background: isDark ? Colors.backgroundDark : Colors.background,
    surface: isDark ? Colors.surfaceDark : Colors.surface,
    text: isDark ? Colors.textLight : Colors.text,
    textSecondary: isDark ? Colors.textSecondary : Colors.textSecondary,
    border: isDark ? Colors.borderDark : Colors.border,
  };
};

