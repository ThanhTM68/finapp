import { query } from '../db/client';

interface SyncChange {
  tableName: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  payload: Record<string, unknown>;
  updatedAt?: string;
}

export async function recordSyncEvent(
  userId: string,
  tableName: string,
  operation: SyncChange['operation'],
  payload: Record<string, unknown>,
): Promise<void> {
  await query(
    `INSERT INTO sync_events (user_id, table_name, operation, payload)
     VALUES ($1, $2, $3, $4::jsonb)`,
    [userId, tableName, operation, JSON.stringify(payload)],
  );
}

export const syncService = {
  async push(_userId: string, payload: { items: Array<{ id?: number; tableName: string; operation: string; payload: string }> }) {
    const syncedIds = payload.items
      .map((item) => item.id)
      .filter((id): id is number => typeof id === 'number');
    return { syncedIds };
  },

  async pull(userId: string, since?: string): Promise<{ changes: SyncChange[] }> {
    const rows = await query<{
      table_name: string;
      operation: 'INSERT' | 'UPDATE' | 'DELETE';
      payload: Record<string, unknown>;
      updated_at: Date;
    }>(
      `SELECT table_name, operation, payload, updated_at
       FROM sync_events
       WHERE user_id = $1
         AND ($2::timestamptz IS NULL OR updated_at > $2::timestamptz)
       ORDER BY updated_at ASC`,
      [userId, since ?? null],
    );

    return {
      changes: rows.map((row) => ({
        tableName: row.table_name,
        operation: row.operation,
        payload: row.payload,
        updatedAt: row.updated_at.toISOString(),
      })),
    };
  },
};
