import { budgetDao } from '../db/dao/budget.dao';
import { syncQueueDao } from '../db/dao/sync_queue.dao';
import { Budget, CreateBudgetPayload } from '../../domain/budget/budget.types';
import { generateId } from '../../utils/id';

export const budgetRepository = {
  async getAll(): Promise<Budget[]> {
    return budgetDao.findAll();
  },

  async getById(id: string): Promise<Budget | null> {
    return budgetDao.findById(id);
  },

  async create(payload: CreateBudgetPayload): Promise<Budget> {
    const now = new Date().toISOString();
    const budget: Budget = {
      id: generateId(),
      ...payload,
      spent: 0,
      syncStatus: 'pending',
      createdAt: now,
      updatedAt: now,
    };
    await budgetDao.insert(budget);
    await syncQueueDao.enqueue('budgets', 'INSERT', budget);
    return budget;
  },

  async delete(id: string): Promise<void> {
    await budgetDao.delete(id);
    await syncQueueDao.enqueue('budgets', 'DELETE', { id });
  },
};
