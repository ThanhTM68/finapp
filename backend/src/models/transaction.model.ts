export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  userId: string;
  walletId: string;
  categoryId: string;
  amount: number;
  type: TransactionType;
  note: string;
  date: Date;
  isRecurring: boolean;
  recurringInterval?: 'daily' | 'weekly' | 'monthly';
  createdAt: Date;
  updatedAt: Date;
}
