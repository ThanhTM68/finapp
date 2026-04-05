export type CategoryType = 'income' | 'expense';

export interface Category {
  id: string;
  userId: string | null; // null = default category
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}
