import { getDatabase } from '../sqlite';
import { Transaction, TransactionFilter } from '../../../domain/transaction/transaction.types';

interface TransactionRow {
  id: string;
  wallet_id: string;
  category_id: string;
  amount: number;
  type: Transaction['type'];
  note: string;
  date: string;
  is_recurring: number;
  recurring_interval: Transaction['recurringInterval'] | null;
  transfer_id: string | null;
  sync_status: Transaction['syncStatus'];
  created_at: string;
  updated_at: string;
}

function mapTransaction(row: TransactionRow): Transaction {
  return {
    id: row.id,
    walletId: row.wallet_id,
    categoryId: row.category_id,
    amount: row.amount,
    type: row.type,
    note: row.note,
    date: row.date,
    isRecurring: row.is_recurring === 1,
    recurringInterval: row.recurring_interval ?? undefined,
    transferId: row.transfer_id ?? undefined,
    syncStatus: row.sync_status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const transactionDao = {
  async findAll(filter?: TransactionFilter): Promise<Transaction[]> {
    const db = await getDatabase();
    let sql = 'SELECT * FROM transactions WHERE 1=1';
    const params: (string | number)[] = [];

    if (filter?.type) {
      sql += ' AND type = ?';
      params.push(filter.type);
    }
    if (filter?.walletId) {
      sql += ' AND wallet_id = ?';
      params.push(filter.walletId);
    }
    if (filter?.categoryId) {
      sql += ' AND category_id = ?';
      params.push(filter.categoryId);
    }
    if (filter?.startDate) {
      sql += ' AND date >= ?';
      params.push(filter.startDate);
    }
    if (filter?.endDate) {
      sql += ' AND date <= ?';
      params.push(filter.endDate);
    }

    sql += ' ORDER BY date DESC';
    const rows = await db.getAllAsync<TransactionRow>(sql, params);
    return rows.map(mapTransaction);
  },

  async findById(id: string): Promise<Transaction | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<TransactionRow>('SELECT * FROM transactions WHERE id = ?', [id]);
    return row ? mapTransaction(row) : null;
  },

  async insert(tx: Transaction): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `INSERT INTO transactions
       (id, wallet_id, category_id, amount, type, note, date, is_recurring, recurring_interval, transfer_id, sync_status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`,
      [
        tx.id, tx.walletId, tx.categoryId, tx.amount, tx.type,
        tx.note, tx.date, tx.isRecurring ? 1 : 0,
        tx.recurringInterval ?? null, tx.transferId ?? null,
        tx.createdAt, tx.updatedAt,
      ],
    );
  },

  async update(tx: Partial<Transaction> & { id: string }): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `UPDATE transactions SET amount = ?, note = ?, date = ?, updated_at = ?, sync_status = 'pending' WHERE id = ?`,
      [tx.amount ?? 0, tx.note ?? '', tx.date ?? '', tx.updatedAt ?? new Date().toISOString(), tx.id],
    );
  },

  async delete(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM transactions WHERE id = ?', [id]);
  },
};
