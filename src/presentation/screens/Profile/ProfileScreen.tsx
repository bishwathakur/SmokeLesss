/**
 * Profile Screen
 * User profile information
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSmokingStore } from '../../store/smokingStore';
import { Colors } from '../../../core/theme/colors';
import { Typography } from '../../../core/theme/typography';
import { format } from 'date-fns';

export const ProfileScreen: React.FC = () => {
  const { currentUser } = useSmokingStore();

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Please complete onboarding first</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.profileCard}>
        <Text style={styles.title}>Profile</Text>
        
        <View style={styles.infoRow}>
          <Text style={styles.label}>Age</Text>
          <Text style={styles.value}>{currentUser.age}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Smoking Start Age</Text>
          <Text style={styles.value}>{currentUser.smokingStartAge}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Daily Limit Goal</Text>
          <Text style={styles.value}>{currentUser.dailyLimitGoal}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>Registration Date</Text>
          <Text style={styles.value}>
            {format(currentUser.registrationDate, 'MMM dd, yyyy')}
          </Text>
        </View>

        {currentUser.preferredBrands.length > 0 && (
          <View style={styles.brandsSection}>
            <Text style={styles.label}>Preferred Brands</Text>
            {currentUser.preferredBrands.map((brand, index) => (
              <Text key={index} style={styles.brandTag}>
                {brand}
              </Text>
            ))}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16,
  },
  message: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 50,
  },
  profileCard: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    ...Typography.h2,
    color: Colors.text,
    marginBottom: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  label: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
  value: {
    ...Typography.body,
    color: Colors.text,
    fontWeight: '600',
  },
  brandsSection: {
    marginTop: 16,
  },
  brandTag: {
    ...Typography.bodySmall,
    color: Colors.primary,
    backgroundColor: Colors.surface,
    padding: 8,
    borderRadius: 8,
    marginTop: 8,
  },
});

export default ProfileScreen;

