/**
 * Notification Service
 * Application service for handling notifications and alerts
 */

import { DailyStats } from '../../domain/entities/DailyStats';
import notifee, { AndroidImportance } from '@notifee/react-native';

export class NotificationService {
  private static CHANNEL_ID = 'smoking-notifications';

  /**
   * Initialize notification channels
   */
  static async initialize(): Promise<void> {
    await notifee.createChannel({
      id: this.CHANNEL_ID,
      name: 'Smoking Notifications',
      importance: AndroidImportance.HIGH,
    });
  }

  /**
   * Check current count and notify if approaching limit
   */
  async checkAndNotify(currentCount: number, dailyLimit: number): Promise<void> {
    const percentage = (currentCount / dailyLimit) * 100;

    if (percentage >= 75 && percentage < 90) {
      await this.showWarning(
        'Approaching Limit',
        `You've smoked ${currentCount} out of ${dailyLimit} cigarettes today.`
      );
    } else if (percentage >= 90 && percentage < 100) {
      await this.showWarning(
        'Limit Almost Reached',
        'You have only 1-2 cigarettes left for today.'
      );
    } else if (percentage >= 100) {
      await this.showCriticalWarning(
        'Daily Limit Exceeded',
        'You have exceeded your daily limit. Consider stopping for today.'
      );
    }
  }

  /**
   * Show daily summary notification
   */
  async showDailySummary(stats: DailyStats, dailyLimit: number): Promise<void> {
    const message = stats.limitExceeded
      ? `You exceeded your limit by ${stats.totalCigarettes - dailyLimit} cigarettes.`
      : `Great job! You stayed within your limit.`;

    await this.showNotification('Daily Summary', message);
  }

  /**
   * Show a warning notification
   */
  private async showWarning(title: string, body: string): Promise<void> {
    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: NotificationService.CHANNEL_ID,
        importance: AndroidImportance.HIGH,
        sound: 'default',
      },
    });
  }

  /**
   * Show a critical warning notification
   */
  private async showCriticalWarning(title: string, body: string): Promise<void> {
    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: NotificationService.CHANNEL_ID,
        importance: AndroidImportance.HIGH,
        sound: 'default',
        vibrationPattern: [300, 500],
      },
    });
  }

  /**
   * Show a general notification
   */
  private async showNotification(title: string, body: string): Promise<void> {
    await notifee.displayNotification({
      title,
      body,
      android: {
        channelId: NotificationService.CHANNEL_ID,
        importance: AndroidImportance.DEFAULT,
      },
    });
  }
}

