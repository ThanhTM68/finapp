import { syncQueueDao } from '../db/dao/sync_queue.dao';
import { syncApi } from '../api/sync.api';
import { logger } from '../../utils/logger';

export const syncProcessor = {
  async push(): Promise<void> {
    const pending = await syncQueueDao.findPending();
    if (pending.length === 0) return;

    logger.info(`[SyncProcessor] Pushing ${pending.length} items`);

    try {
      const result = await syncApi.push({
        items: pending.map((item) => ({
          tableName: item.tableName,
          operation: item.operation,
          payload: item.payload,
        })),
      });

      for (const id of result.syncedIds) {
        await syncQueueDao.markSynced(id);
      }

      await syncQueueDao.clearSynced();
      logger.info(`[SyncProcessor] Push complete`);
    } catch (error) {
      logger.error('[SyncProcessor] Push failed', error);
    }
  },

  async pull(lastSyncAt?: string): Promise<void> {
    try {
      const result = await syncApi.pull(lastSyncAt);
      logger.info(`[SyncProcessor] Pulled ${result.changes.length} changes`);
      // TODO: apply server changes to local DB
    } catch (error) {
      logger.error('[SyncProcessor] Pull failed', error);
    }
  },
};
