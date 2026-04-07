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
  /** Links the two legs of a transfer (same value on both debit and credit rows). */
  transferId?: string;
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
  transferId?: string;
}

export interface TransactionFilter {
  type?: TransactionType;
  categoryId?: string;
  walletId?: string;
  startDate?: string;
  endDate?: string;
}
