import { create } from 'zustand';
import { Category } from '../types';

interface CategoryState {
  categories: Category[];
  isLoading: boolean;

  setCategories: (categories: Category[]) => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  removeCategory: (id: string) => void;
  setLoading: (loading: boolean) => void;

  expenseCategories: () => Category[];
  incomeCategories: () => Category[];
}

export const useCategoryStore = create<CategoryState>((set, get) => ({
  categories: [],
  isLoading: false,

  setCategories: (categories) => set({ categories }),

  addCategory: (category) =>
    set((state) => ({ categories: [...state.categories, category] })),

  updateCategory: (category) =>
    set((state) => ({
      categories: state.categories.map((c) =>
        c.id === category.id ? category : c,
      ),
    })),

  removeCategory: (id) =>
    set((state) => ({
      categories: state.categories.filter((c) => c.id !== id),
    })),

  setLoading: (isLoading) => set({ isLoading }),

  expenseCategories: () =>
    get().categories.filter((c) => c.kind === 'expense'),

  incomeCategories: () =>
    get().categories.filter((c) => c.kind === 'income'),
}));
