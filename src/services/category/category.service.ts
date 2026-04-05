import { categoryRepository } from '../../data/repositories/category.repository';
import { Category, CreateCategoryPayload } from '../../domain/category/category.types';
import { TransactionType } from '../../domain/common/base.types';

const DEFAULT_CATEGORIES: Omit<CreateCategoryPayload, never>[] = [
  { name: 'Ăn uống', type: 'expense', icon: '🍔', color: '#f59e0b' },
  { name: 'Di chuyển', type: 'expense', icon: '🚗', color: '#3b82f6' },
  { name: 'Mua sắm', type: 'expense', icon: '🛍️', color: '#8b5cf6' },
  { name: 'Y tế', type: 'expense', icon: '💊', color: '#ef4444' },
  { name: 'Giải trí', type: 'expense', icon: '🎮', color: '#06b6d4' },
  { name: 'Lương', type: 'income', icon: '💰', color: '#16a34a' },
  { name: 'Thưởng', type: 'income', icon: '🎁', color: '#f97316' },
];

export const categoryService = {
  async getAll(): Promise<Category[]> {
    return categoryRepository.getAll();
  },

  async create(payload: CreateCategoryPayload): Promise<Category> {
    return categoryRepository.create(payload);
  },

  async update(id: string, payload: Partial<CreateCategoryPayload>): Promise<void> {
    return categoryRepository.update(id, payload);
  },

  async delete(id: string): Promise<void> {
    return categoryRepository.delete(id);
  },

  async seedDefaults(): Promise<void> {
    const existing = await categoryRepository.getAll();
    if (existing.length > 0) return;

    for (const cat of DEFAULT_CATEGORIES) {
      await categoryRepository.create(cat);
    }
  },
};
