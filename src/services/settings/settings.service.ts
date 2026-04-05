import { secureStorage } from '../../security/secureStore';

export interface AppSettings {
  isDarkMode: boolean;
  isBalanceHidden: boolean;
  isAppLockEnabled: boolean;
  language: 'vi' | 'en';
}

const SETTINGS_KEY = 'app_settings';

const DEFAULT_SETTINGS: AppSettings = {
  isDarkMode: false,
  isBalanceHidden: false,
  isAppLockEnabled: false,
  language: 'vi',
};

export const settingsService = {
  async load(): Promise<AppSettings> {
    const raw = await secureStorage.getString(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<AppSettings>) };
  },

  async save(settings: Partial<AppSettings>): Promise<void> {
    const current = await settingsService.load();
    await secureStorage.setString(SETTINGS_KEY, JSON.stringify({ ...current, ...settings }));
  },

  async reset(): Promise<void> {
    await secureStorage.setString(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
  },
};
