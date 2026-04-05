import { SQLiteDatabase } from 'expo-sqlite';
import { SyncEntity, SyncOperation, SyncQueueItem } from '../types';
import { generateId, nowIso } from './utils';
import { useSyncStore } from '../stores/syncStore';

/** Insert a record into the sync queue inside an existing SQLite transaction */
export function enqueueSyncItem(
  db: SQLiteDatabase,
  entity: SyncEntity,
  entityId: string,
  operation: SyncOperation,
  payload: object,
): void {
  const id = generateId();
  const now = nowIso();
  db.runSync(
    `INSERT INTO sync_queue (id, entity, entity_id, operation, payload, status, retry_count, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, 'pending', 0, ?, ?)`,
    [id, entity, entityId, operation, JSON.stringify(payload), now, now],
  );
}

const MAX_RETRIES = 5;
const BACKOFF_BASE_MS = 1000;

/**
 * Process the pending sync queue items.
 * Call this when the network becomes available or on a background timer.
 */
export async function processSyncQueue(): Promise<void> {
  const { setIsSyncing, setLastSyncAt, setQueue } = useSyncStore.getState();

  if (useSyncStore.getState().isSyncing) return;

  setIsSyncing(true);

  try {
    const { getDb } = await import('../db/client');
    const db = getDb();

    const pending = db
      .getAllSync<Record<string, unknown>>(
        `SELECT * FROM sync_queue WHERE status IN ('pending','failed') AND retry_count < ?
         ORDER BY created_at ASC`,
        [MAX_RETRIES],
      )
      .map(rowToSyncQueueItem);

    for (const item of pending) {
      await processItem(db, item);
    }

    setLastSyncAt(nowIso());

    const allItems = db
      .getAllSync<Record<string, unknown>>('SELECT * FROM sync_queue ORDER BY created_at DESC')
      .map(rowToSyncQueueItem);
    setQueue(allItems);
  } finally {
    setIsSyncing(false);
  }
}

async function processItem(
  db: SQLiteDatabase,
  item: SyncQueueItem,
): Promise<void> {
  const { updateQueueItem } = useSyncStore.getState();

  // Mark as syncing
  const now = nowIso();
  db.runSync(
    "UPDATE sync_queue SET status = 'syncing', updated_at = ? WHERE id = ?",
    [now, item.id],
  );
  updateQueueItem({ ...item, status: 'syncing', updatedAt: now });

  try {
    // TODO: replace with actual API call once backend is ready
    await fakeSyncApiCall(item);

    db.runSync(
      "UPDATE sync_queue SET status = 'synced', updated_at = ? WHERE id = ?",
      [nowIso(), item.id],
    );
    updateQueueItem({ ...item, status: 'synced', updatedAt: nowIso() });
  } catch (err) {
    const retryCount = (item.retryCount ?? 0) + 1;
    const delay = BACKOFF_BASE_MS * Math.pow(2, retryCount - 1);
    console.warn(`[Sync] Item ${item.id} failed (retry ${retryCount}). Next in ${delay}ms`, err);

    db.runSync(
      "UPDATE sync_queue SET status = 'failed', retry_count = ?, updated_at = ? WHERE id = ?",
      [retryCount, nowIso(), item.id],
    );
    updateQueueItem({ ...item, status: 'failed', retryCount, updatedAt: nowIso() });
  }
}

/** Placeholder – replace with your actual REST/GraphQL call */
async function fakeSyncApiCall(_item: SyncQueueItem): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 50));
}

function rowToSyncQueueItem(row: Record<string, unknown>): SyncQueueItem {
  return {
    id: row.id as string,
    entity: row.entity as SyncQueueItem['entity'],
    entityId: row.entity_id as string,
    operation: row.operation as SyncQueueItem['operation'],
    payload: row.payload as string,
    status: row.status as SyncQueueItem['status'],
    retryCount: row.retry_count as number,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}
