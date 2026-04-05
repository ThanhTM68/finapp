import { budgetRepository } from '../../data/repositories/budget.repository';
import { Budget, CreateBudgetPayload, BudgetProgress } from '../../domain/budget/budget.types';

const NEAR_LIMIT_THRESHOLD = 0.8;

export const budgetService = {
  async getAll(): Promise<Budget[]> {
    return budgetRepository.getAll();
  },

  async create(payload: CreateBudgetPayload): Promise<Budget> {
    return budgetRepository.create(payload);
  },

  async delete(id: string): Promise<void> {
    return budgetRepository.delete(id);
  },

  async getBudgetProgress(budget: Budget): Promise<BudgetProgress> {
    const percentage = budget.amount > 0 ? budget.spent / budget.amount : 0;
    return {
      budget,
      percentage: percentage * 100,
      isOverLimit: percentage >= 1,
      isNearLimit: percentage >= NEAR_LIMIT_THRESHOLD,
    };
  },

  async getAllWithProgress(): Promise<BudgetProgress[]> {
    const budgets = await budgetRepository.getAll();
    return Promise.all(budgets.map((b) => budgetService.getBudgetProgress(b)));
  },
};
