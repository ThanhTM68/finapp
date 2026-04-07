// ─── User ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Wallet ───────────────────────────────────────────────────────────────────

export type WalletType = 'cash' | 'bank' | 'credit' | 'savings' | 'ewallet';

export interface Wallet {
  id: string;
  name: string;
  type: WalletType;
  balance: number;
  color: string;
  icon?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

// ─── Category ─────────────────────────────────────────────────────────────────

export type CategoryKind = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  kind: CategoryKind;
  icon: string;
  color: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

// ─── Transaction ──────────────────────────────────────────────────────────────

export type TransactionType = 'income' | 'expense' | 'transfer';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  note?: string;
  date: string;
  walletId: string;
  categoryId?: string;
  /** For transfer: the destination wallet */
  toWalletId?: string;
  /** Links two transfer transactions together */
  transferId?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

// ─── Budget ───────────────────────────────────────────────────────────────────

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  /** ISO year-month, e.g. "2024-04" */
  period: string;
  spent: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Recurring Rule ───────────────────────────────────────────────────────────

export type RecurringFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface RecurringRule {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId?: string;
  walletId: string;
  frequency: RecurringFrequency;
  startDate: string;
  nextDate: string;
  note?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Sync ─────────────────────────────────────────────────────────────────────

export type SyncStatus = 'pending' | 'syncing' | 'synced' | 'failed';
export type SyncOperation = 'create' | 'update' | 'delete';
export type SyncEntity =
  | 'wallet'
  | 'category'
  | 'transaction'
  | 'budget'
  | 'recurring_rule';

export interface SyncQueueItem {
  id: string;
  entity: SyncEntity;
  entityId: string;
  operation: SyncOperation;
  payload: string; // JSON
  status: SyncStatus;
  retryCount: number;
  createdAt: string;
  updatedAt: string;
}
