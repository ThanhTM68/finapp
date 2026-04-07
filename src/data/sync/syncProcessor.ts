import { syncQueueDao } from '../db/dao/sync_queue.dao';
import { syncApi } from '../api/sync.api';
import { logger } from '../../utils/logger';
import { getDatabase } from '../db/sqlite';
import { secureStorage } from '../../security/secureStore';

const LAST_SYNC_KEY = 'last_sync_at';

interface ServerChange {
  tableName: 'wallets' | 'categories' | 'transactions' | 'budgets';
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  payload: Record<string, unknown>;
  updatedAt?: string;
}

async function applyChange(change: ServerChange): Promise<void> {
  const db = await getDatabase();
  const payload = change.payload;

  if (change.operation === 'DELETE') {
    const id = String(payload.id ?? '');
    if (!id) return;
    switch (change.tableName) {
      case 'wallets':
        await db.runAsync('DELETE FROM wallets WHERE id = ?', [id]);
        break;
      case 'categories':
        await db.runAsync('DELETE FROM categories WHERE id = ?', [id]);
        break;
      case 'transactions':
        await db.runAsync('DELETE FROM transactions WHERE id = ?', [id]);
        break;
      case 'budgets':
        await db.runAsync('DELETE FROM budgets WHERE id = ?', [id]);
        break;
      default:
        break;
    }
    return;
  }

  switch (change.tableName) {
    case 'wallets':
      await db.runAsync(
        `INSERT INTO wallets (id, name, type, balance, color, is_deleted, sync_status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, 'synced', ?, ?)
         ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            type = excluded.type,
            balance = excluded.balance,
            color = excluded.color,
            is_deleted = excluded.is_deleted,
            sync_status = 'synced',
            updated_at = excluded.updated_at`,
        [
          String(payload.id),
          String(payload.name ?? ''),
          String(payload.type ?? 'cash'),
          Number(payload.balance ?? 0),
          String(payload.color ?? '#16a34a'),
          payload.isDeleted ? 1 : 0,
          String(payload.createdAt ?? new Date().toISOString()),
          String(payload.updatedAt ?? new Date().toISOString()),
        ],
      );
      break;
    case 'categories':
      await db.runAsync(
        `INSERT INTO categories (id, name, type, icon, color, is_default, sync_status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, 'synced', ?, ?)
         ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            type = excluded.type,
            icon = excluded.icon,
            color = excluded.color,
            is_default = excluded.is_default,
            sync_status = 'synced',
            updated_at = excluded.updated_at`,
        [
          String(payload.id),
          String(payload.name ?? ''),
          String(payload.type ?? 'expense'),
          String(payload.icon ?? ''),
          String(payload.color ?? '#16a34a'),
          payload.isDefault ? 1 : 0,
          String(payload.createdAt ?? new Date().toISOString()),
          String(payload.updatedAt ?? new Date().toISOString()),
        ],
      );
      break;
    case 'transactions':
      await db.runAsync(
        `INSERT INTO transactions
         (id, wallet_id, category_id, amount, type, note, date, is_recurring, recurring_interval, transfer_id, sync_status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'synced', ?, ?)
         ON CONFLICT(id) DO UPDATE SET
            wallet_id = excluded.wallet_id,
            category_id = excluded.category_id,
            amount = excluded.amount,
            type = excluded.type,
            note = excluded.note,
            date = excluded.date,
            is_recurring = excluded.is_recurring,
            recurring_interval = excluded.recurring_interval,
            sync_status = 'synced',
            updated_at = excluded.updated_at`,
        [
          String(payload.id),
          String(payload.walletId ?? ''),
          String(payload.categoryId ?? ''),
          Number(payload.amount ?? 0),
          String(payload.type ?? 'expense'),
          String(payload.note ?? ''),
          String(payload.date ?? new Date().toISOString()),
          payload.isRecurring ? 1 : 0,
          payload.recurringInterval ? String(payload.recurringInterval) : null,
          payload.transferId ? String(payload.transferId) : null,
          String(payload.createdAt ?? new Date().toISOString()),
          String(payload.updatedAt ?? new Date().toISOString()),
        ],
      );
      break;
    case 'budgets':
      await db.runAsync(
        `INSERT INTO budgets (id, name, category_id, amount, spent, start_date, end_date, sync_status, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, 'synced', ?, ?)
         ON CONFLICT(id) DO UPDATE SET
            name = excluded.name,
            category_id = excluded.category_id,
            amount = excluded.amount,
            spent = excluded.spent,
            start_date = excluded.start_date,
            end_date = excluded.end_date,
            sync_status = 'synced',
            updated_at = excluded.updated_at`,
        [
          String(payload.id),
          String(payload.name ?? ''),
          payload.categoryId ? String(payload.categoryId) : null,
          Number(payload.amount ?? 0),
          Number(payload.spent ?? 0),
          String(payload.startDate ?? new Date().toISOString()),
          String(payload.endDate ?? new Date().toISOString()),
          String(payload.createdAt ?? new Date().toISOString()),
          String(payload.updatedAt ?? new Date().toISOString()),
        ],
      );
      break;
    default:
      break;
  }
}

export const syncProcessor = {
  async push(): Promise<void> {
    const pending = await syncQueueDao.findPending();
    if (pending.length === 0) return;

    logger.info(`[SyncProcessor] Pushing ${pending.length} items`);

    try {
      const result = await syncApi.push({
        items: pending.map((item) => ({
          id: item.id,
          tableName: item.tableName,
          operation: item.operation,
          payload: item.payload,
        })),
      });

      for (const id of result.syncedIds) {
        await syncQueueDao.markSynced(id);
      }

      await syncQueueDao.clearSynced();
      logger.info('[SyncProcessor] Push complete');
    } catch (error) {
      logger.error('[SyncProcessor] Push failed', error);
    }
  },

  async pull(lastSyncAt?: string): Promise<void> {
    try {
      const since = lastSyncAt ?? (await secureStorage.getString(LAST_SYNC_KEY)) ?? undefined;
      const result = await syncApi.pull(since);
      const changes = result.changes as ServerChange[];
      for (const change of changes) {
        await applyChange(change);
      }

      const newest = changes.reduce<string | undefined>((latest, item) => {
        if (!item.updatedAt) return latest;
        if (!latest) return item.updatedAt;
        return item.updatedAt > latest ? item.updatedAt : latest;
      }, undefined);
      if (newest) {
        await secureStorage.setString(LAST_SYNC_KEY, newest);
      }

      logger.info(`[SyncProcessor] Pulled ${changes.length} changes`);
    } catch (error) {
      logger.error('[SyncProcessor] Pull failed', error);
    }
  },
};
