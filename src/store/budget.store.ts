import { create } from 'zustand';
import { Budget, BudgetProgress } from '../domain/budget/budget.types';

interface BudgetState {
  budgets: Budget[];
  progress: BudgetProgress[];
  setBudgets: (budgets: Budget[]) => void;
  setProgress: (progress: BudgetProgress[]) => void;
  removeBudget: (id: string) => void;
}

export const useBudgetStore = create<BudgetState>((set) => ({
  budgets: [],
  progress: [],
  setBudgets: (budgets) => set({ budgets }),
  setProgress: (progress) => set({ progress }),
  removeBudget: (id) =>
    set((state) => ({ budgets: state.budgets.filter((b) => b.id !== id) })),
}));
