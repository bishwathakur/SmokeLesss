/**
 * App Navigator
 * Main navigation setup using React Navigation
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useSmokingStore } from '../store/smokingStore';

// Screens
import DashboardScreen from '../screens/Dashboard/DashboardScreen';
import StatisticsScreen from '../screens/Statistics/StatisticsScreen';
import HistoryScreen from '../screens/History/HistoryScreen';
import SettingsScreen from '../screens/Settings/SettingsScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import OnboardingScreen from '../screens/Onboarding/OnboardingScreen';

// Icons
import { HomeIcon } from '../components/Icons/HomeIcon';
import { StatsIcon } from '../components/Icons/StatsIcon';
import { HistoryIcon } from '../components/Icons/HistoryIcon';
import { SettingsIcon } from '../components/Icons/SettingsIcon';
import { ProfileIcon } from '../components/Icons/ProfileIcon';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

/**
 * Main tab navigator (shown after onboarding)
 */
const MainTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: '#FF6B6B',
        tabBarInactiveTintColor: '#6C757D',
        headerStyle: {
          backgroundColor: '#FFFFFF',
        },
        headerTintColor: '#212529',
        tabBarIcon: ({ color, size }) => {
          switch (route.name) {
            case 'Dashboard':
              return <HomeIcon color={color} size={size} />;
            case 'Statistics':
              return <StatsIcon color={color} size={size} />;
            case 'History':
              return <HistoryIcon color={color} size={size} />;
            case 'Settings':
              return <SettingsIcon color={color} size={size} />;
            case 'Profile':
              return <ProfileIcon color={color} size={size} />;
            default:
              return <HomeIcon color={color} size={size} />;
          }
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{ title: 'Dashboard' }}
      />
      <Tab.Screen
        name="Statistics"
        component={StatisticsScreen}
        options={{ title: 'Statistics' }}
      />
      <Tab.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: 'History' }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
    </Tab.Navigator>
  );
};

/**
 * Root navigator (handles onboarding vs main app)
 */
export const AppNavigator: React.FC = () => {
  const { currentUser } = useSmokingStore();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!currentUser ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainTabs} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;

