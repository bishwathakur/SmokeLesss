/**
 * Progress Bar Component
 * Displays progress towards daily limit
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../../core/theme/colors';
import { Typography } from '../../../core/theme/typography';
import { calculatePercentage } from '../../../core/utils/calculations';

interface ProgressBarProps {
  current: number;
  limit: number;
  showLabel?: boolean;
  height?: number;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  limit,
  showLabel = true,
  height = 12,
}) => {
  const percentage = calculatePercentage(current, limit);
  const isExceeded = current > limit;

  // Determine color based on progress
  const getProgressColor = () => {
    if (isExceeded) return Colors.error;
    if (percentage >= 90) return Colors.warning;
    if (percentage >= 75) return Colors.warning;
    return Colors.success;
  };

  return (
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            {current} / {limit} cigarettes
          </Text>
          <Text style={[styles.percentage, isExceeded && styles.exceededText]}>
            {percentage.toFixed(0)}%
          </Text>
        </View>
      )}
      <View style={[styles.progressContainer, { height }]}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${Math.min(percentage, 100)}%`,
              backgroundColor: getProgressColor(),
              height,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    ...Typography.body,
    color: Colors.text,
  },
  percentage: {
    ...Typography.body,
    fontWeight: '600',
    color: Colors.text,
  },
  exceededText: {
    color: Colors.error,
  },
  progressContainer: {
    width: '100%',
    backgroundColor: Colors.border,
    borderRadius: 6,
    overflow: 'hidden',
  },
  progressFill: {
    borderRadius: 6,
    transition: 'width 0.3s ease',
  },
});

export default ProgressBar;

