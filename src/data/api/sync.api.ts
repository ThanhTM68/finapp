import { httpClient } from './httpClient';
import { SyncQueueItem } from '../db/dao/sync_queue.dao';

export interface SyncBatchPayload {
  items: Pick<SyncQueueItem, 'id' | 'tableName' | 'operation' | 'payload'>[];
  lastSyncAt?: string;
}

export interface SyncBatchResponse {
  changes: object[];
  syncedIds: number[];
}

export const syncApi = {
  push: (payload: SyncBatchPayload) =>
    httpClient.post<SyncBatchResponse>('/sync/push', payload),

  pull: (lastSyncAt?: string) => {
    const params = lastSyncAt ? `?since=${encodeURIComponent(lastSyncAt)}` : '';
    return httpClient.get<{ changes: object[] }>(`/sync/pull${params}`);
  },
};
