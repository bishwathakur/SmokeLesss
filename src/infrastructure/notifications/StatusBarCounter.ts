/**
 * Status Bar Counter
 * Manages the persistent notification showing daily cigarette count
 * This is a wrapper around PushNotificationManager for status bar counter specifically
 */

import { PushNotificationManager } from './PushNotificationManager';

export class StatusBarCounter {
  /**
   * Initialize the status bar counter
   */
  static async initialize(): Promise<void> {
    await PushNotificationManager.initialize();
  }

  /**
   * Update the counter display
   */
  static async updateCounter(count: number, limit: number): Promise<void> {
    await PushNotificationManager.updateCounter(count, limit);
  }

  /**
   * Remove the counter from status bar
   */
  static async removeCounter(): Promise<void> {
    await PushNotificationManager.removeCounter();
  }
}

