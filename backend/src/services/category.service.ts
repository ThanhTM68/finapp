import { Category, CategoryType } from '../models/category.model';
import { generateId } from '../utils/response';

// In-memory store placeholder
const categories: Category[] = [];

export const categoryService = {
  async getAll(userId: string): Promise<Category[]> {
    return categories.filter((c) => c.isDefault || c.userId === userId);
  },

  async create(userId: string, payload: { name: string; type: CategoryType; icon: string; color: string }): Promise<Category> {
    const now = new Date();
    const category: Category = {
      id: generateId(),
      userId,
      name: payload.name,
      type: payload.type,
      icon: payload.icon ?? '',
      color: payload.color ?? '#16a34a',
      isDefault: false,
      createdAt: now,
      updatedAt: now,
    };
    categories.push(category);
    return category;
  },

  async update(id: string, userId: string, payload: Partial<Category>): Promise<Category> {
    const index = categories.findIndex((c) => c.id === id && c.userId === userId && !c.isDefault);
    if (index < 0) throw new Error('Không tìm thấy danh mục');
    categories[index] = { ...categories[index]!, ...payload, updatedAt: new Date() };
    return categories[index]!;
  },

  async delete(id: string, userId: string): Promise<void> {
    const index = categories.findIndex((c) => c.id === id && c.userId === userId && !c.isDefault);
    if (index < 0) throw new Error('Không tìm thấy danh mục');
    categories.splice(index, 1);
  },
};
