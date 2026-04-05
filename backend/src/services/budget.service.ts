import { Budget } from '../models/budget.model';
import { generateId } from '../utils/response';

// In-memory store placeholder
const budgets: Budget[] = [];

export const budgetService = {
  async getAll(userId: string): Promise<Budget[]> {
    return budgets.filter((b) => b.userId === userId);
  },

  async create(userId: string, payload: {
    name: string; categoryId?: string;
    amount: number; startDate: string; endDate: string;
  }): Promise<Budget> {
    const now = new Date();
    const budget: Budget = {
      id: generateId(),
      userId,
      name: payload.name,
      categoryId: payload.categoryId,
      amount: payload.amount,
      spent: 0,
      startDate: new Date(payload.startDate),
      endDate: new Date(payload.endDate),
      createdAt: now,
      updatedAt: now,
    };
    budgets.push(budget);
    return budget;
  },

  async delete(id: string, userId: string): Promise<void> {
    const index = budgets.findIndex((b) => b.id === id && b.userId === userId);
    if (index < 0) throw new Error('Không tìm thấy ngân sách');
    budgets.splice(index, 1);
  },
};
