export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export type SyncStatus = 'pending' | 'synced' | 'failed';
export type TransactionType = 'income' | 'expense' | 'transfer';
export type WalletType = 'cash' | 'bank' | 'credit_card' | 'savings' | 'e_wallet';
