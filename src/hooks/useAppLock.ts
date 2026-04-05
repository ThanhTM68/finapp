import { useCallback, useState } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import { appLock } from '../security/appLock';

export function useAppLock() {
  const [isLocked, setIsLocked] = useState(false);

  const unlock = useCallback(async (): Promise<boolean> => {
    const result = await appLock.authenticate();
    if (result) setIsLocked(false);
    return result;
  }, []);

  const lock = useCallback(() => {
    setIsLocked(true);
  }, []);

  return { isLocked, lock, unlock };
}
