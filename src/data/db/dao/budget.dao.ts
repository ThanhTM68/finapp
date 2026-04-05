import { getDatabase } from '../sqlite';
import { Budget } from '../../../domain/budget/budget.types';

export const budgetDao = {
  async findAll(): Promise<Budget[]> {
    const db = await getDatabase();
    return db.getAllAsync<Budget>('SELECT * FROM budgets ORDER BY start_date DESC');
  },

  async findById(id: string): Promise<Budget | null> {
    const db = await getDatabase();
    return db.getFirstAsync<Budget>('SELECT * FROM budgets WHERE id = ?', [id]);
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
