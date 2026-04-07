import { transactionDao } from '../db/dao/transaction.dao';
import { walletDao } from '../db/dao/wallet.dao';
import { syncQueueDao } from '../db/dao/sync_queue.dao';
import { budgetDao } from '../db/dao/budget.dao';
import { Transaction, CreateTransactionPayload, TransactionFilter } from '../../domain/transaction/transaction.types';
import { generateId } from '../../utils/id';
import { notificationService } from '../../services/notifications/notification.service';

export const transactionRepository = {
  async getAll(filter?: TransactionFilter): Promise<Transaction[]> {
    return transactionDao.findAll(filter);
  },

  async getById(id: string): Promise<Transaction | null> {
    return transactionDao.findById(id);
  },

  /**
   * Core rule:
   * 1. Insert transaction
   * 2. Update wallet balance
   * 3. Enqueue in sync_queue
   */
  async create(payload: CreateTransactionPayload): Promise<Transaction> {
    const now = new Date().toISOString();
    const tx: Transaction = {
      id: generateId(),
      walletId: payload.walletId,
      categoryId: payload.categoryId,
      amount: payload.amount,
      type: payload.type,
      note: payload.note ?? '',
      date: payload.date,
      isRecurring: payload.isRecurring ?? false,
      recurringInterval: payload.recurringInterval,
      syncStatus: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    // 1. Insert transaction
    await transactionDao.insert(tx);

    // 2. Update wallet balance
    const wallet = await walletDao.findById(payload.walletId);
    if (wallet) {
      const delta = payload.type === 'income' ? payload.amount : -payload.amount;
      await walletDao.updateBalance(wallet.id, wallet.balance + delta);
    }

    // 3. Enqueue sync
    await syncQueueDao.enqueue('transactions', 'INSERT', tx);

    // 4. Update budgets and trigger >80% notification for expenses
    if (payload.type === 'expense') {
      const budgets = await budgetDao.findAll();
      const txDate = new Date(payload.date);
      for (const budget of budgets) {
        const inRange = txDate >= new Date(budget.startDate) && txDate <= new Date(budget.endDate);
        const matchCategory = !budget.categoryId || budget.categoryId === payload.categoryId;
        if (!inRange || !matchCategory) continue;

        const nextSpent = budget.spent + payload.amount;
        await budgetDao.updateSpent(budget.id, nextSpent);
        await syncQueueDao.enqueue('budgets', 'UPDATE', { id: budget.id, spent: nextSpent });

        const ratio = budget.amount > 0 ? nextSpent / budget.amount : 0;
        if (ratio >= 0.8) {
          await notificationService.notifyBudgetNearLimit(budget.name, ratio * 100);
        }
      }
    }

    return tx;
  },

  async update(id: string, payload: Partial<CreateTransactionPayload>): Promise<void> {
    const now = new Date().toISOString();
    await transactionDao.update({ id, ...payload, updatedAt: now });
    await syncQueueDao.enqueue('transactions', 'UPDATE', { id, ...payload, updatedAt: now });
  },

  async delete(id: string): Promise<void> {
    await transactionDao.delete(id);
    await syncQueueDao.enqueue('transactions', 'DELETE', { id });
  },
};
