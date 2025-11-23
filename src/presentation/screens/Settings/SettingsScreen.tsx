/**
 * Settings Screen
 * User settings and preferences
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { useSmokingStore } from '../../store/smokingStore';
import { UserRepository } from '../../../infrastructure/repositories/UserRepository';
import { Colors } from '../../../core/theme/colors';
import { Typography } from '../../../core/theme/typography';
import { Settings, ThemeMode } from '../../../domain/entities/Settings';

export const SettingsScreen: React.FC = () => {
  const { currentUser, setCurrentUser } = useSmokingStore();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadSettings();
    }
  }, [currentUser]);

  const loadSettings = async () => {
    if (!currentUser) return;

    try {
      setIsLoading(true);
      const repository = new UserRepository();
      const userSettings = await repository.getSettings(currentUser.userId);
      setSettings(userSettings);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (newSettings: Settings) => {
    if (!currentUser) return;

    try {
      const repository = new UserRepository();
      await repository.updateSettings(newSettings);
      setSettings(newSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const toggleNotifications = (value: boolean) => {
    if (settings) {
      updateSettings({ ...settings, notificationsEnabled: value });
    }
  };

  const toggleStatusBarCounter = (value: boolean) => {
    if (settings) {
      updateSettings({ ...settings, statusBarCounterEnabled: value });
    }
  };

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Please complete onboarding first</Text>
      </View>
    );
  }

  if (isLoading || !settings) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Enable Notifications</Text>
          <Switch
            value={settings.notificationsEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: Colors.border, true: Colors.primary }}
          />
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Status Bar Counter</Text>
          <Switch
            value={settings.statusBarCounterEnabled}
            onValueChange={toggleStatusBarCounter}
            trackColor={{ false: Colors.border, true: Colors.primary }}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Appearance</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Theme</Text>
          <Text style={styles.settingValue}>{settings.theme}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Goals</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Weekly Goal Reduction</Text>
          <Text style={styles.settingValue}>{settings.weeklyGoalReduction}%</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Info</Text>
        
        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Age</Text>
          <Text style={styles.settingValue}>{currentUser.age}</Text>
        </View>

        <View style={styles.settingRow}>
          <Text style={styles.settingLabel}>Daily Limit</Text>
          <Text style={styles.settingValue}>{currentUser.dailyLimitGoal}</Text>
        </View>
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
  section: {
    backgroundColor: Colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    ...Typography.h3,
    color: Colors.text,
    marginBottom: 16,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  settingLabel: {
    ...Typography.body,
    color: Colors.text,
  },
  settingValue: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});

export default SettingsScreen;

