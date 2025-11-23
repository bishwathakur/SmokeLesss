/**
 * Statistics Screen
 * Displays weekly/monthly trends and analytics
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useSmokingStore } from '../../store/smokingStore';
import { SmokingService } from '../../../application/services/SmokingService';
import { SmokingRepository } from '../../../infrastructure/repositories/SmokingRepository';
import { GetWeeklyTrendsUseCase } from '../../../domain/usecases/GetWeeklyTrendsUseCase';
import { Colors } from '../../../core/theme/colors';
import { Typography } from '../../../core/theme/typography';
import { WeeklyTrendData } from '../../../domain/usecases/GetWeeklyTrendsUseCase';

export const StatisticsScreen: React.FC = () => {
  const { currentUser } = useSmokingStore();
  const [weeklyData, setWeeklyData] = useState<WeeklyTrendData | null>(null);
  const [monthlyData, setMonthlyData] = useState<WeeklyTrendData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadStatistics();
    }
  }, [currentUser]);

  const loadStatistics = async () => {
    if (!currentUser) return;

    try {
      setIsLoading(true);
      const smokingRepository = new SmokingRepository();
      const getWeeklyTrendsUseCase = new GetWeeklyTrendsUseCase(smokingRepository);
      
      const weekly = await getWeeklyTrendsUseCase.execute(currentUser.userId);
      const monthly = await getWeeklyTrendsUseCase.getMonthlyTrends(currentUser.userId);

      setWeeklyData(weekly);
      setMonthlyData(monthly);
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const chartConfig = {
    backgroundColor: Colors.surface,
    backgroundGradientFrom: Colors.surface,
    backgroundGradientTo: Colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 107, 107, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(33, 37, 41, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: Colors.primary,
    },
  };

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Please complete onboarding first</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Loading statistics...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Weekly Trends</Text>
      {weeklyData && (
        <LineChart
          data={{
            labels: weeklyData.labels,
            datasets: [{ data: weeklyData.counts }],
          }}
          width={Dimensions.get('window').width - 32}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      )}

      <Text style={styles.title}>Monthly Trends</Text>
      {monthlyData && (
        <LineChart
          data={{
            labels: monthlyData.labels,
            datasets: [{ data: monthlyData.counts }],
          }}
          width={Dimensions.get('window').width - 32}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      )}

      {/* Placeholder for brand breakdown and hourly patterns */}
      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Brand Breakdown</Text>
        <Text style={styles.placeholderSubtext}>Coming soon</Text>
      </View>

      <View style={styles.placeholder}>
        <Text style={styles.placeholderText}>Hourly Patterns</Text>
        <Text style={styles.placeholderSubtext}>Coming soon</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
  },
  message: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 50,
  },
  title: {
    ...Typography.h2,
    color: Colors.text,
    marginVertical: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  placeholder: {
    backgroundColor: Colors.surface,
    padding: 24,
    borderRadius: 12,
    marginVertical: 8,
    alignItems: 'center',
  },
  placeholderText: {
    ...Typography.h3,
    color: Colors.text,
  },
  placeholderSubtext: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 8,
  },
});

export default StatisticsScreen;

