/**
 * Main App Component
 * Entry point of the React Native application
 */

import React, { useEffect } from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/presentation/navigation/AppNavigator';
import { SQLiteDatabase } from './src/infrastructure/database/SQLiteDatabase';
import { PushNotificationManager } from './src/infrastructure/notifications/PushNotificationManager';
import { Colors } from './src/core/theme/colors';

const initFns = async()=>{
  // Initialize database
  await SQLiteDatabase.getInstance().initialize();
        
  // Initialize notifications
  await PushNotificationManager.initialize();
  await PushNotificationManager.requestPermissions();
}

const App: React.FC = () => {
  useEffect(() => {
    // Initialize database and notifications on app start
    const initializeApp = async () => {
      try {
        initFns();
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };

    initializeApp();
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
      <AppNavigator />
    </>
  );
};

export default App;

