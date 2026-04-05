export type WalletType = 'cash' | 'bank' | 'credit_card' | 'savings' | 'e_wallet';

export interface Wallet {
  id: string;
  userId: string;
  name: string;
  type: WalletType;
  balance: number;
  color: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}
