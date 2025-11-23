/**
 * Stat Card Component
 * Displays a statistic in a card format
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../../core/theme/colors';
import { Typography } from '../../../core/theme/typography';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  color?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  color = Colors.primary,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {icon && <Text style={styles.icon}>{icon}</Text>}
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={[styles.value, { color }]}>{value}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  title: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  value: {
    ...Typography.h2,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.textSecondary,
    marginTop: 4,
  },
});

export default StatCard;

