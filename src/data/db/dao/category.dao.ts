import { getDatabase } from '../sqlite';
import { Category } from '../../../domain/category/category.types';

export const categoryDao = {
  async findAll(): Promise<Category[]> {
    const db = await getDatabase();
    return db.getAllAsync<Category>('SELECT * FROM categories ORDER BY is_default DESC, name ASC');
  },

  async findById(id: string): Promise<Category | null> {
    const db = await getDatabase();
    return db.getFirstAsync<Category>('SELECT * FROM categories WHERE id = ?', [id]);
  },

  async isUsedInTransaction(id: string): Promise<boolean> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM transactions WHERE category_id = ?',
      [id],
    );
    return (row?.count ?? 0) > 0;
  },

  async insert(category: Category): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `INSERT INTO categories (id, name, type, icon, color, is_default, sync_status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?)`,
      [category.id, category.name, category.type, category.icon, category.color, category.isDefault ? 1 : 0, category.createdAt, category.updatedAt],
    );
  },

  async update(category: Partial<Category> & { id: string }): Promise<void> {
    const db = await getDatabase();
    await db.runAsync(
      `UPDATE categories SET name = ?, icon = ?, color = ?, updated_at = ?, sync_status = 'pending' WHERE id = ?`,
      [category.name ?? '', category.icon ?? '', category.color ?? '', category.updatedAt ?? new Date().toISOString(), category.id],
    );
  },

  async delete(id: string): Promise<void> {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM categories WHERE id = ?', [id]);
  },
};
