import { BaseEntity, SyncStatus, TransactionType } from '../common/base.types';

export interface Transaction extends BaseEntity {
  walletId: string;
  categoryId: string;
  amount: number;
  type: TransactionType;
  note: string;
  date: string;
  isRecurring: boolean;
  recurringInterval?: 'daily' | 'weekly' | 'monthly';
  syncStatus: SyncStatus;
}

export interface CreateTransactionPayload {
  walletId: string;
  categoryId: string;
  amount: number;
  type: TransactionType;
  note?: string;
  date: string;
  isRecurring?: boolean;
  recurringInterval?: Transaction['recurringInterval'];
}

export interface TransactionFilter {
  type?: TransactionType;
  categoryId?: string;
  walletId?: string;
  startDate?: string;
  endDate?: string;
}
