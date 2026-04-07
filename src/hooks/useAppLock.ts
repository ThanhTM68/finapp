import { useCallback, useEffect, useState } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { appLock } from '../security/appLock';
import { useSettingsStore } from '../store/settings.store';

export function useAppLock() {
  const [isLocked, setIsLocked] = useState(false);
  const isAppLockEnabled = useSettingsStore((state) => state.isAppLockEnabled);

  const unlockWithBiometric = useCallback(async (): Promise<boolean> => {
    const result = await appLock.authenticateBiometric();
    if (result) setIsLocked(false);
    return result;
  }, []);

  const unlockWithPin = useCallback(async (pin: string): Promise<boolean> => {
    const result = await appLock.verifyPin(pin);
    if (result) setIsLocked(false);
    return result;
  }, []);

  const lock = useCallback(() => {
    if (!isAppLockEnabled) return;
    setIsLocked(true);
  }, [isAppLockEnabled]);

  useEffect(() => {
    if (!isAppLockEnabled) {
      setIsLocked(false);
      return;
    }

    let previousState: AppStateStatus = AppState.currentState;
    const onAppStateChange = (state: AppStateStatus) => {
      const cameFromBackground = previousState.match(/inactive|background/) && state === 'active';
      previousState = state;
      if (cameFromBackground) {
        setIsLocked(true);
      }
    };

    const sub = AppState.addEventListener('change', onAppStateChange);
    return () => sub.remove();
  }, [isAppLockEnabled]);

  return { isLocked, lock, unlockWithBiometric, unlockWithPin };
}
