import { BaseEntity, SyncStatus } from '../common/base.types';

export interface Budget extends BaseEntity {
  name: string;
  categoryId?: string;
  amount: number;
  spent: number;
  startDate: string;
  endDate: string;
  syncStatus: SyncStatus;
}

export interface CreateBudgetPayload {
  name: string;
  categoryId?: string;
  amount: number;
  startDate: string;
  endDate: string;
}

export interface BudgetProgress {
  budget: Budget;
  percentage: number;
  isOverLimit: boolean;
  isNearLimit: boolean; // > 80%
}
