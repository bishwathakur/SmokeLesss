/**
 * Today Stats Component
 * Displays today's smoking statistics
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../../../core/theme/colors';
import { Typography } from '../../../../core/theme/typography';
import StatCard from '../../../components/StatCard/StatCard';

interface TodayStatsProps {
  cigarettes: number;
  limit: number;
  remaining: number;
  totalPuffs?: number;
}

export const TodayStats: React.FC<TodayStatsProps> = ({
  cigarettes,
  limit,
  remaining,
  totalPuffs = 0,
}) => {
  return (
    <View style={styles.container}>
      <View style={{ flex: 1 }}>
        <StatCard
          title="Today's Count"
          value={cigarettes}
          subtitle={`${remaining} remaining`}
          color={cigarettes > limit ? Colors.error : Colors.primary}
        />
      </View>
      {totalPuffs > 0 && (
        <View style={{ flex: 1 }}>
          <StatCard
            title="Total Puffs"
            value={totalPuffs}
            subtitle="Partial cigarettes"
            color={Colors.secondary}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
});

export default TodayStats;

