import { create } from 'zustand';
import { AppSettings } from '../services/settings/settings.service';

interface SettingsState extends AppSettings {
  setDarkMode: (value: boolean) => void;
  setBalanceHidden: (value: boolean) => void;
  setAppLockEnabled: (value: boolean) => void;
  setLanguage: (lang: AppSettings['language']) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  isDarkMode: false,
  isBalanceHidden: false,
  isAppLockEnabled: false,
  language: 'vi',
  setDarkMode: (isDarkMode) => set({ isDarkMode }),
  setBalanceHidden: (isBalanceHidden) => set({ isBalanceHidden }),
  setAppLockEnabled: (isAppLockEnabled) => set({ isAppLockEnabled }),
  setLanguage: (language) => set({ language }),
}));
