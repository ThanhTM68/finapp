import * as Notifications from 'expo-notifications';
import { secureStorage } from '../../security/secureStore';

let initialized = false;
const BUDGET_NOTICE_PREFIX = 'budget_notice_';

async function ensurePermissions(): Promise<void> {
  if (initialized) return;
  const existing = await Notifications.getPermissionsAsync();
  if (!existing.granted) {
    await Notifications.requestPermissionsAsync();
  }
  initialized = true;
}

export const notificationService = {
  async notifyBudgetNearLimit(budgetId: string, budgetName: string, percentage: number): Promise<void> {
    const key = `${BUDGET_NOTICE_PREFIX}${budgetId}`;
    const noticeFlag = await secureStorage.getString(key);
    if (noticeFlag === 'sent') return;

    await ensurePermissions();
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Cảnh báo ngân sách',
        body: `Ngân sách "${budgetName}" đã dùng ${Math.round(percentage)}%`,
      },
      trigger: null,
    });
    await secureStorage.setString(key, 'sent');
  },
};
