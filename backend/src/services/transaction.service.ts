import { Transaction, TransactionType } from '../models/transaction.model';
import { generateId } from '../utils/response';
import { walletService } from './wallet.service';
import { query, queryOne } from '../db/client';
import { recordSyncEvent } from './sync.service';

interface TransactionRow {
  id: string;
  user_id: string;
  wallet_id: string;
  category_id: string;
  amount: number;
  type: TransactionType;
  note: string;
  date: Date;
  is_recurring: boolean;
  recurring_interval: 'daily' | 'weekly' | 'monthly' | null;
  created_at: Date;
  updated_at: Date;
}

function mapTransaction(row: TransactionRow): Transaction {
  return {
    id: row.id,
    userId: row.user_id,
    walletId: row.wallet_id,
    categoryId: row.category_id,
    amount: row.amount,
    type: row.type,
    note: row.note,
    date: row.date,
    isRecurring: row.is_recurring,
    recurringInterval: row.recurring_interval ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const transactionService = {
  async getAll(userId: string, filter: Record<string, unknown> = {}): Promise<Transaction[]> {
    const values: unknown[] = [userId];
    const where: string[] = ['user_id = $1'];

    if (filter['type']) {
      values.push(filter['type']);
      where.push(`type = $${values.length}`);
    }
    if (filter['walletId']) {
      values.push(filter['walletId']);
      where.push(`wallet_id = $${values.length}`);
    }

    const rows = await query<TransactionRow>(
      `SELECT * FROM transactions WHERE ${where.join(' AND ')} ORDER BY date DESC`,
      values,
    );
    return rows.map(mapTransaction);
  },

  async getById(id: string, userId: string): Promise<Transaction | undefined> {
    const row = await queryOne<TransactionRow>('SELECT * FROM transactions WHERE id = $1 AND user_id = $2', [id, userId]);
    return row ? mapTransaction(row) : undefined;
  },

  async create(userId: string, payload: {
    walletId: string; categoryId: string; amount: number;
    type: TransactionType; note?: string; date: string;
  }): Promise<Transaction> {
    const row = await queryOne<TransactionRow>(
      `INSERT INTO transactions (id, user_id, wallet_id, category_id, amount, type, note, date, is_recurring)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, FALSE)
       RETURNING *`,
      [generateId(), userId, payload.walletId, payload.categoryId, payload.amount, payload.type, payload.note ?? '', payload.date],
    );

    if (!row) throw new Error('Không thể tạo giao dịch');
    const tx = mapTransaction(row);

    const wallet = await walletService.getById(payload.walletId, userId);
    if (wallet) {
      const delta = payload.type === 'income' ? payload.amount : -payload.amount;
      await walletService.update(payload.walletId, userId, { balance: wallet.balance + delta });
    }

    await recordSyncEvent(userId, 'transactions', 'INSERT', tx as unknown as Record<string, unknown>);
    return tx;
  },

  async update(id: string, userId: string, payload: Partial<Transaction>): Promise<Transaction> {
    const row = await queryOne<TransactionRow>(
      `UPDATE transactions
       SET amount = COALESCE($3, amount),
           note = COALESCE($4, note),
           date = COALESCE($5, date),
           updated_at = NOW()
       WHERE id = $1 AND user_id = $2
       RETURNING *`,
      [id, userId, payload.amount ?? null, payload.note ?? null, payload.date ?? null],
    );
    if (!row) throw new Error('Không tìm thấy giao dịch');
    const tx = mapTransaction(row);
    await recordSyncEvent(userId, 'transactions', 'UPDATE', tx as unknown as Record<string, unknown>);
    return tx;
  },

  async delete(id: string, userId: string): Promise<void> {
    const row = await queryOne<{ id: string }>('DELETE FROM transactions WHERE id = $1 AND user_id = $2 RETURNING id', [id, userId]);
    if (!row) throw new Error('Không tìm thấy giao dịch');
    await recordSyncEvent(userId, 'transactions', 'DELETE', { id });
  },
};
