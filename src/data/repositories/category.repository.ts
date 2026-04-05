import { categoryDao } from '../db/dao/category.dao';
import { syncQueueDao } from '../db/dao/sync_queue.dao';
import { Category, CreateCategoryPayload } from '../../domain/category/category.types';
import { generateId } from '../../utils/id';

export const categoryRepository = {
  async getAll(): Promise<Category[]> {
    return categoryDao.findAll();
  },

  async getById(id: string): Promise<Category | null> {
    return categoryDao.findById(id);
  },

  async create(payload: CreateCategoryPayload): Promise<Category> {
    const now = new Date().toISOString();
    const category: Category = {
      id: generateId(),
      ...payload,
      isDefault: false,
      syncStatus: 'pending',
      createdAt: now,
      updatedAt: now,
    };
    await categoryDao.insert(category);
    await syncQueueDao.enqueue('categories', 'INSERT', category);
    return category;
  },

  async update(id: string, payload: Partial<CreateCategoryPayload>): Promise<void> {
    const now = new Date().toISOString();
    await categoryDao.update({ id, ...payload, updatedAt: now });
    await syncQueueDao.enqueue('categories', 'UPDATE', { id, ...payload, updatedAt: now });
  },

  async delete(id: string): Promise<void> {
    const isUsed = await categoryDao.isUsedInTransaction(id);
    if (isUsed) {
      throw new Error('Không thể xóa danh mục đang được sử dụng trong giao dịch');
    }
    await categoryDao.delete(id);
    await syncQueueDao.enqueue('categories', 'DELETE', { id });
  },
};
