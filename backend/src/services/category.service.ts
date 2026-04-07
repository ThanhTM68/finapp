import { Category, CategoryType } from '../models/category.model';
import { generateId } from '../utils/response';
import { query, queryOne } from '../db/client';
import { recordSyncEvent } from './sync.service';

interface CategoryRow {
  id: string;
  user_id: string | null;
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
  is_default: boolean;
  created_at: Date;
  updated_at: Date;
}

function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    type: row.type,
    icon: row.icon,
    color: row.color,
    isDefault: row.is_default,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const categoryService = {
  async getAll(userId: string): Promise<Category[]> {
    const rows = await query<CategoryRow>(
      `SELECT * FROM categories
       WHERE is_default = TRUE OR user_id = $1
       ORDER BY is_default DESC, name ASC`,
      [userId],
    );
    return rows.map(mapCategory);
  },

  async create(userId: string, payload: { name: string; type: CategoryType; icon: string; color: string }): Promise<Category> {
    const row = await queryOne<CategoryRow>(
      `INSERT INTO categories (id, user_id, name, type, icon, color, is_default)
       VALUES ($1, $2, $3, $4, $5, $6, FALSE)
       RETURNING *`,
      [generateId(), userId, payload.name, payload.type, payload.icon ?? '', payload.color ?? '#16a34a'],
    );
    if (!row) throw new Error('Không thể tạo danh mục');
    const category = mapCategory(row);
    await recordSyncEvent(userId, 'categories', 'INSERT', category as unknown as Record<string, unknown>);
    return category;
  },

  async update(id: string, userId: string, payload: Partial<Category>): Promise<Category> {
    const row = await queryOne<CategoryRow>(
      `UPDATE categories
       SET name = COALESCE($3, name),
           icon = COALESCE($4, icon),
           color = COALESCE($5, color),
           updated_at = NOW()
       WHERE id = $1 AND user_id = $2 AND is_default = FALSE
       RETURNING *`,
      [id, userId, payload.name ?? null, payload.icon ?? null, payload.color ?? null],
    );
    if (!row) throw new Error('Không tìm thấy danh mục');
    const category = mapCategory(row);
    await recordSyncEvent(userId, 'categories', 'UPDATE', category as unknown as Record<string, unknown>);
    return category;
  },

  async delete(id: string, userId: string): Promise<void> {
    const row = await queryOne<{ id: string }>(
      'DELETE FROM categories WHERE id = $1 AND user_id = $2 AND is_default = FALSE RETURNING id',
      [id, userId],
    );
    if (!row) throw new Error('Không tìm thấy danh mục');
    await recordSyncEvent(userId, 'categories', 'DELETE', { id });
  },
};
