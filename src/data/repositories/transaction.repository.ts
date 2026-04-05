import { transactionDao } from '../db/dao/transaction.dao';
import { walletDao } from '../db/dao/wallet.dao';
import { syncQueueDao } from '../db/dao/sync_queue.dao';
import { Transaction, CreateTransactionPayload, TransactionFilter } from '../../domain/transaction/transaction.types';
import { generateId } from '../../utils/id';

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
