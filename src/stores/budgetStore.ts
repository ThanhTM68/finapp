import { create } from 'zustand';
import { Budget } from '../types';

interface BudgetState {
  budgets: Budget[];
  currentPeriod: string;
  isLoading: boolean;

  setBudgets: (budgets: Budget[]) => void;
  addBudget: (budget: Budget) => void;
  updateBudget: (budget: Budget) => void;
  removeBudget: (id: string) => void;
  setCurrentPeriod: (period: string) => void;
  setLoading: (loading: boolean) => void;

  totalBudget: () => number;
  totalSpent: () => number;
  totalRemaining: () => number;
}

function currentPeriodDefault(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export const useBudgetStore = create<BudgetState>((set, get) => ({
  budgets: [],
  currentPeriod: currentPeriodDefault(),
  isLoading: false,

  setBudgets: (budgets) => set({ budgets }),

  addBudget: (budget) =>
    set((state) => ({ budgets: [...state.budgets, budget] })),

  updateBudget: (budget) =>
    set((state) => ({
      budgets: state.budgets.map((b) => (b.id === budget.id ? budget : b)),
    })),

  removeBudget: (id) =>
    set((state) => ({
      budgets: state.budgets.filter((b) => b.id !== id),
    })),

  setCurrentPeriod: (currentPeriod) => set({ currentPeriod }),

  setLoading: (isLoading) => set({ isLoading }),

  totalBudget: () => get().budgets.reduce((s, b) => s + b.amount, 0),
  totalSpent: () => get().budgets.reduce((s, b) => s + b.spent, 0),
  totalRemaining: () => get().totalBudget() - get().totalSpent(),
}));
