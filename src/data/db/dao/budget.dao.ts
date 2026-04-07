import { getDatabase } from '../sqlite';
import { Budget } from '../../../domain/budget/budget.types';

interface BudgetRow {
  id: string;
  name: string;
  category_id: string | null;
  amount: number;
  spent: number;
  start_date: string;
  end_date: string;
  sync_status: Budget['syncStatus'];
  created_at: string;
  updated_at: string;
}

function mapBudget(row: BudgetRow): Budget {
  return {
    id: row.id,
    name: row.name,
    categoryId: row.category_id ?? undefined,
    amount: row.amount,
    spent: row.spent,
    startDate: row.start_date,
    endDate: row.end_date,
    syncStatus: row.sync_status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const budgetDao = {
  async findAll(): Promise<Budget[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<BudgetRow>('SELECT * FROM budgets ORDER BY start_date DESC');
    return rows.map(mapBudget);
  },

  async findById(id: string): Promise<Budget | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<BudgetRow>('SELECT * FROM budgets WHERE id = ?', [id]);
    return row ? mapBudget(row) : null;
  },

  async insert(budget: Budget): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `INSERT INTO budgets (id, name, category_id, amount, spent, start_date, end_date, sync_status, created_at, updated_at)
       VALUES (?, ?, ?, ?, 0, ?, ?, 'pending', ?, ?)`,
      [budget.id, budget.name, budget.categoryId ?? null, budget.amount, budget.startDate, budget.endDate, budget.createdAt, budget.updatedAt],
    );
  },

  async updateSpent(id: string, spent: number): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `UPDATE budgets SET spent = ?, updated_at = ?, sync_status = 'pending' WHERE id = ?`,
      [spent, new Date().toISOString(), id],
    );
  },

  async delete(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM budgets WHERE id = ?', [id]);
  },
};
