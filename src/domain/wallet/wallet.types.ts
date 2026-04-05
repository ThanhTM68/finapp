import { BaseEntity, SyncStatus, WalletType } from '../common/base.types';

export interface Wallet extends BaseEntity {
  name: string;
  type: WalletType;
  balance: number;
  color: string;
  isDeleted: boolean;
  syncStatus: SyncStatus;
}

export interface CreateWalletPayload {
  name: string;
  type: WalletType;
  initialBalance: number;
  color: string;
}

export interface UpdateWalletPayload extends Partial<CreateWalletPayload> {
  id: string;
}
