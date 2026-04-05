import { getDatabase } from '../sqlite';
import { Transaction, TransactionFilter } from '../../../domain/transaction/transaction.types';

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
    return db.getAllAsync<Transaction>(sql, params);
  },

  async findById(id: string): Promise<Transaction | null> {
    const db = await getDatabase();
    return db.getFirstAsync<Transaction>('SELECT * FROM transactions WHERE id = ?', [id]);
  },

  async insert(tx: Transaction): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `INSERT INTO transactions
       (id, wallet_id, category_id, amount, type, note, date, is_recurring, recurring_interval, sync_status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`,
      [
        tx.id, tx.walletId, tx.categoryId, tx.amount, tx.type,
        tx.note, tx.date, tx.isRecurring ? 1 : 0,
        tx.recurringInterval ?? null, tx.createdAt, tx.updatedAt,
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
