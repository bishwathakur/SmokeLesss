/**
 * Quick Add Button Component
 * Reusable button for quick actions (Add Cigarette, Add Puffs)
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Colors } from '../../../core/theme/colors';
import { Typography } from '../../../core/theme/typography';

interface QuickAddButtonProps {
  label: string;
  onPress: () => void;
  icon?: string;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export const QuickAddButton: React.FC<QuickAddButtonProps> = ({
  label,
  onPress,
  icon,
  variant = 'primary',
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'primary' ? styles.primaryButton : styles.secondaryButton,
        disabled && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <Text
          style={[
            styles.label,
            variant === 'primary' ? styles.primaryLabel : styles.secondaryLabel,
            disabled && styles.disabledLabel,
          ]}
        >
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 150,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
  },
  secondaryButton: {
    backgroundColor: Colors.secondary,
  },
  disabledButton: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 20,
  },
  label: {
    ...Typography.button,
    color: Colors.textLight,
  },
  primaryLabel: {
    color: Colors.textLight,
  },
  secondaryLabel: {
    color: Colors.textLight,
  },
  disabledLabel: {
    color: Colors.textSecondary,
  },
});

export default QuickAddButton;

