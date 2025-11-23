/**
 * History Screen
 * Displays past smoking sessions
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { useSmokingStore } from '../../store/smokingStore';
import { SmokingRepository } from '../../../infrastructure/repositories/SmokingRepository';
import { SmokingSession } from '../../../domain/entities/SmokingSession';
import { Colors } from '../../../core/theme/colors';
import { Typography } from '../../../core/theme/typography';
import { format } from 'date-fns';

export const HistoryScreen: React.FC = () => {
  const { currentUser } = useSmokingStore();
  const [sessions, setSessions] = useState<SmokingSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadHistory();
    }
  }, [currentUser]);

  const loadHistory = async () => {
    if (!currentUser) return;

    try {
      setIsLoading(true);
      const repository = new SmokingRepository();
      const allSessions = await repository.getSessionsByUserId(currentUser.userId);
      setSessions(allSessions);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderSession = ({ item }: { item: SmokingSession }) => {
    return (
      <View style={styles.sessionCard}>
        <View style={styles.sessionHeader}>
          <Text style={styles.brand}>{item.cigaretteBrand}</Text>
          <Text style={styles.type}>{item.cigaretteType}</Text>
        </View>
        <Text style={styles.timestamp}>
          {format(new Date(item.timestamp), 'MMM dd, yyyy HH:mm')}
        </Text>
        {item.puffsCount > 0 && (
          <Text style={styles.puffs}>Puffs: {item.puffsCount}</Text>
        )}
        {item.notes && <Text style={styles.notes}>{item.notes}</Text>}
      </View>
    );
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
        <Text style={styles.message}>Loading history...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={sessions}
        renderItem={renderSession}
        keyExtractor={item => item.entryId}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No smoking sessions yet</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    padding: 16,
  },
  sessionCard: {
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sessionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  brand: {
    ...Typography.h4,
    color: Colors.text,
  },
  type: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
  },
  timestamp: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  puffs: {
    ...Typography.bodySmall,
    color: Colors.primary,
    marginTop: 4,
  },
  notes: {
    ...Typography.bodySmall,
    color: Colors.textSecondary,
    marginTop: 8,
    fontStyle: 'italic',
  },
  message: {
    ...Typography.body,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 50,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.textSecondary,
  },
});

export default HistoryScreen;

