import { BaseEntity, SyncStatus, TransactionType } from '../common/base.types';

export interface Category extends BaseEntity {
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
  isDefault: boolean;
  syncStatus: SyncStatus;
}

export interface CreateCategoryPayload {
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
}
