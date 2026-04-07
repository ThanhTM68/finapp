import { Budget } from '../models/budget.model';
import { generateId } from '../utils/response';
import { query, queryOne } from '../db/client';
import { recordSyncEvent } from './sync.service';

interface BudgetRow {
  id: string;
  user_id: string;
  name: string;
  category_id: string | null;
  amount: number;
  spent: number;
  start_date: Date;
  end_date: Date;
  created_at: Date;
  updated_at: Date;
}

function mapBudget(row: BudgetRow): Budget {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    categoryId: row.category_id ?? undefined,
    amount: row.amount,
    spent: row.spent,
    startDate: row.start_date,
    endDate: row.end_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const budgetService = {
  async getAll(userId: string): Promise<Budget[]> {
    const rows = await query<BudgetRow>('SELECT * FROM budgets WHERE user_id = $1 ORDER BY start_date DESC', [userId]);
    return rows.map(mapBudget);
  },

  async create(userId: string, payload: {
    name: string; categoryId?: string;
    amount: number; startDate: string; endDate: string;
  }): Promise<Budget> {
    const row = await queryOne<BudgetRow>(
      `INSERT INTO budgets (id, user_id, name, category_id, amount, spent, start_date, end_date)
       VALUES ($1, $2, $3, $4, $5, 0, $6, $7)
       RETURNING *`,
      [generateId(), userId, payload.name, payload.categoryId ?? null, payload.amount, payload.startDate, payload.endDate],
    );
    if (!row) throw new Error('Không thể tạo ngân sách');
    const budget = mapBudget(row);
    await recordSyncEvent(userId, 'budgets', 'INSERT', budget as unknown as Record<string, unknown>);
    return budget;
  },

  async delete(id: string, userId: string): Promise<void> {
    const row = await queryOne<{ id: string }>('DELETE FROM budgets WHERE id = $1 AND user_id = $2 RETURNING id', [id, userId]);
    if (!row) throw new Error('Không tìm thấy ngân sách');
    await recordSyncEvent(userId, 'budgets', 'DELETE', { id });
  },
};
