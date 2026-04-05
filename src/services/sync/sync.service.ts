import { syncScheduler } from '../../data/sync/syncScheduler';
import { syncQueueDao } from '../../data/db/dao/sync_queue.dao';

export const syncService = {
  start(): void {
    syncScheduler.start();
  },

  stop(): void {
    syncScheduler.stop();
  },

  async syncNow(): Promise<void> {
    return syncScheduler.syncNow();
  },

  async getPendingCount(): Promise<number> {
    return syncQueueDao.count();
  },
};
