/**
 * Dashboard Screen
 * Main screen showing daily progress and quick actions
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useSmokingStats } from '../../hooks/useSmokingStats';
import { useSmokingStore } from '../../store/smokingStore';
import QuickAddButton from '../../components/QuickAddButton/QuickAddButton';
import ProgressCircle from './components/ProgressCircle';
import TodayStats from './components/TodayStats';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import BrandSelector from '../../components/BrandSelector/BrandSelector';
import { Colors } from '../../../core/theme/colors';
import { Typography } from '../../../core/theme/typography';
import { SmokingService } from '../../../application/services/SmokingService';
import { SmokingRepository } from '../../../infrastructure/repositories/SmokingRepository';
import { AddCigaretteUseCase } from '../../../domain/usecases/AddCigaretteUseCase';
import { AddPuffsUseCase } from '../../../domain/usecases/AddPuffsUseCase';
import { GetTodayStatisticsUseCase } from '../../../domain/usecases/GetTodayStatisticsUseCase';
import { GetWeeklyTrendsUseCase } from '../../../domain/usecases/GetWeeklyTrendsUseCase';
import { CheckLimitExceededUseCase } from '../../../domain/usecases/CheckLimitExceededUseCase';

export const DashboardScreen: React.FC = () => {
  const { currentUser } = useSmokingStore();
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // Initialize services (in a real app, this would come from dependency injection)
  const smokingRepository = new SmokingRepository();
  const smokingService = new SmokingService(
    new AddCigaretteUseCase(smokingRepository),
    new AddPuffsUseCase(smokingRepository),
    new GetTodayStatisticsUseCase(smokingRepository),
    new GetWeeklyTrendsUseCase(smokingRepository),
    new CheckLimitExceededUseCase(smokingRepository)
  );

  const {
    todayCount,
    dailyLimit,
    todayStats,
    limitStatus,
    isLoading,
    addCigarette,
    addPuffs,
  } = useSmokingStats(smokingService);

  const progress = (todayCount / dailyLimit) * 100;

  const handleBrandSelect = (brand: string) => {
    setSelectedBrand(brand);
    setSelectedTypes([]); // Reset types when brand changes
  };

  const handleTypeSelect = (type: string) => {
    setSelectedTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(t => t !== type);
      }
      return [...prev, type];
    });
  };

  const handleAddCigarette = async () => {
    if (!selectedBrand || selectedTypes.length === 0) {
      Alert.alert('Selection Required', 'Please select a brand and at least one type');
      return;
    }

    try {
      // For now, we just add the first selected type. 
      // In a real app, we might want to handle multiple types differently.
      await addCigarette(selectedBrand, selectedTypes[0]);
      // Reset selections
      setSelectedBrand('');
      setSelectedTypes([]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add cigarette');
    }
  };

  const handleAddPuffs = async () => {
    if (!selectedBrand || selectedTypes.length === 0) {
      Alert.alert('Selection Required', 'Please select a brand and at least one type');
      return;
    }

    try {
      await addPuffs(5, selectedBrand, selectedTypes[0]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add puffs');
    }
  };

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Please complete onboarding first</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hello,</Text>
          <Text style={styles.username}>User</Text>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.date}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'short',
              day: 'numeric',
              month: 'short',
            })}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.card}>
          <ProgressCircle count={todayCount} limit={dailyLimit} progress={progress} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Today's Statistics</Text>
          <TodayStats
            cigarettes={todayCount}
            limit={dailyLimit}
            remaining={Math.max(0, dailyLimit - todayCount)}
            totalPuffs={todayStats?.totalPuffs || 0}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <BrandSelector
            selectedBrand={selectedBrand}
            selectedTypes={selectedTypes}
            onBrandSelect={handleBrandSelect}
            onTypeSelect={handleTypeSelect}
          />

          <View style={styles.quickActions}>
            <QuickAddButton
              label="Add Cigarette"
              onPress={handleAddCigarette}
              icon="+"
              disabled={isLoading || !selectedBrand || selectedTypes.length === 0}
            />
            <QuickAddButton
              label="Add Puffs"
              onPress={handleAddPuffs}
              icon="💨"
              variant="secondary"
              disabled={isLoading || !selectedBrand || selectedTypes.length === 0}
            />
          </View>
        </View>

        {limitStatus?.warningLevel !== 'none' && (
          <View
            style={[
              styles.warningBanner,
              limitStatus?.warningLevel === 'exceeded' && styles.errorBanner,
            ]}
          >
            <Text style={styles.warningText}>
              {limitStatus?.warningLevel === 'exceeded'
                ? 'Daily limit exceeded!'
                : limitStatus?.warningLevel === 'almost'
                  ? 'Almost at your limit!'
                  : 'Approaching your limit'}
            </Text>
          </View>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 24,
    backgroundColor: Colors.background,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  greeting: {
    ...Typography.body,
    color: Colors.textSecondary,
    fontSize: 16,
  },
  username: {
    ...Typography.h2,
    color: Colors.text,
    marginTop: 4,
  },
  dateContainer: {
    backgroundColor: Colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
  },
  date: {
    ...Typography.caption,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: 24,
    padding: 24,
    marginBottom: 32,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: 16,
    marginLeft: 4,
  },
  message: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 50,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
    gap: 12,
  },
  warningBanner: {
    backgroundColor: Colors.warning,
    padding: 16,
    borderRadius: 16,
    marginTop: 8,
    width: '100%',
  },
  errorBanner: {
    backgroundColor: Colors.error,
  },
  warningText: {
    ...Typography.body,
    color: Colors.textLight,
    textAlign: 'center',
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 100,
  },
});

export default DashboardScreen;

