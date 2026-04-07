import { AppState, AppStateStatus } from 'react-native';
import { syncProcessor } from './syncProcessor';
import { logger } from '../../utils/logger';

let intervalId: ReturnType<typeof setInterval> | null = null;
let appStateSubscription: { remove: () => void } | null = null;
const SYNC_INTERVAL_MS = 5 * 60_000; // 5 minutes

export const syncScheduler = {
  start(): void {
    logger.info('[SyncScheduler] Starting');

    // Sync on app foreground
    appStateSubscription = AppState.addEventListener('change', handleAppStateChange);

    // Periodic sync
    intervalId = setInterval(() => {
      void syncProcessor.push();
      void syncProcessor.pull();
    }, SYNC_INTERVAL_MS);
  },

  stop(): void {
    logger.info('[SyncScheduler] Stopping');
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    appStateSubscription?.remove();
    appStateSubscription = null;
  },

  async syncNow(): Promise<void> {
    await syncProcessor.push();
    await syncProcessor.pull();
  },
};

function handleAppStateChange(state: AppStateStatus): void {
  if (state === 'active') {
    void syncProcessor.push();
    void syncProcessor.pull();
  }
}
