/**
 * Push Notification Manager
 * Handles push notifications and status bar counter
 */

import notifee, { AndroidImportance } from '@notifee/react-native';

export class PushNotificationManager {
  private static COUNTER_CHANNEL_ID = 'smoking-counter';
  private static NOTIFICATION_CHANNEL_ID = 'smoking-notifications';

  /**
   * Initialize notification channels
   */
  static async initialize(): Promise<void> {
    // Status bar counter channel (low importance, ongoing)
    await notifee.createChannel({
      id: this.COUNTER_CHANNEL_ID,
      name: 'Smoking Counter',
      importance: AndroidImportance.LOW,
    });

    // Regular notifications channel
    await notifee.createChannel({
      id: this.NOTIFICATION_CHANNEL_ID,
      name: 'Smoking Notifications',
      importance: AndroidImportance.HIGH,
    });
  }

  /**
   * Update status bar counter
   */
  static async updateCounter(count: number, limit: number): Promise<void> {
    const progress = Math.min((count / limit) * 100, 100);
    
    await notifee.displayNotification({
      id: 'smoking-counter-notification',
      title: `Today: ${count}/${limit} cigarettes`,
      body: `${progress.toFixed(0)}% of daily limit`,
      android: {
        channelId: this.COUNTER_CHANNEL_ID,
        ongoing: true,
        progress: {
          max: limit,
          current: count,
        },
        actions: [
          {
            title: 'Add Cigarette',
            pressAction: { id: 'add-cigarette' },
          },
          {
            title: 'Add Puffs',
            pressAction: { id: 'add-puffs' },
          },
        ],
      },
    });
  }

  /**
   * Remove status bar counter
   */
  static async removeCounter(): Promise<void> {
    await notifee.cancelNotification('smoking-counter-notification');
  }

  /**
   * Request notification permissions
   */
  static async requestPermissions(): Promise<boolean> {
    const settings = await notifee.requestPermission();
    return settings.authorizationStatus >= 1; // Authorized or Provisional
  }
}

