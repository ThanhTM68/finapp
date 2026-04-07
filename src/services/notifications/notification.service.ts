import * as Notifications from 'expo-notifications';

let initialized = false;

async function ensurePermissions(): Promise<void> {
  if (initialized) return;
  const existing = await Notifications.getPermissionsAsync();
  if (!existing.granted) {
    await Notifications.requestPermissionsAsync();
  }
  initialized = true;
}

export const notificationService = {
  async notifyBudgetNearLimit(budgetName: string, percentage: number): Promise<void> {
    await ensurePermissions();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Cảnh báo ngân sách',
        body: `Ngân sách "${budgetName}" đã dùng ${Math.round(percentage)}%`,
      },
      trigger: null,
    });
  },
};
