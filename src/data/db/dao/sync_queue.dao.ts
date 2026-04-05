import { getDatabase } from '../sqlite';

export interface SyncQueueItem {
  id: number;
  tableName: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  payload: string;
  synced: boolean;
  createdAt: string;
}

export const syncQueueDao = {
  async enqueue(tableName: string, operation: SyncQueueItem['operation'], payload: object): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      'INSERT INTO sync_queue (table_name, operation, payload) VALUES (?, ?, ?)',
      [tableName, operation, JSON.stringify(payload)],
    );
  },

  async findPending(): Promise<SyncQueueItem[]> {
    const db = await getDatabase();
    return db.getAllAsync<SyncQueueItem>(
      'SELECT * FROM sync_queue WHERE synced = 0 ORDER BY id ASC',
    );
  },

  async markSynced(id: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('UPDATE sync_queue SET synced = 1 WHERE id = ?', [id]);
  },

  async clearSynced(): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM sync_queue WHERE synced = 1');
  },

  async count(): Promise<number> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM sync_queue WHERE synced = 0',
    );
    return row?.count ?? 0;
  },
};
