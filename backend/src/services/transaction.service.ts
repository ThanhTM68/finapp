import { Transaction, TransactionType } from '../models/transaction.model';
import { generateId } from '../utils/response';
import { walletService } from './wallet.service';

// In-memory store placeholder
const transactions: Transaction[] = [];

export const transactionService = {
  async getAll(userId: string, filter: Record<string, unknown> = {}): Promise<Transaction[]> {
    let result = transactions.filter((t) => t.userId === userId);
    if (filter['type']) result = result.filter((t) => t.type === filter['type']);
    if (filter['walletId']) result = result.filter((t) => t.walletId === filter['walletId']);
    return result.sort((a, b) => b.date.getTime() - a.date.getTime());
  },

  async getById(id: string, userId: string): Promise<Transaction | undefined> {
    return transactions.find((t) => t.id === id && t.userId === userId);
  },

  async create(userId: string, payload: {
    walletId: string; categoryId: string; amount: number;
    type: TransactionType; note?: string; date: string;
  }): Promise<Transaction> {
    const now = new Date();
    const tx: Transaction = {
      id: generateId(),
      userId,
      walletId: payload.walletId,
      categoryId: payload.categoryId,
      amount: payload.amount,
      type: payload.type,
      note: payload.note ?? '',
      date: new Date(payload.date),
      isRecurring: false,
      createdAt: now,
      updatedAt: now,
    };
    transactions.push(tx);

    // Update wallet balance
    const wallet = await walletService.getById(payload.walletId, userId);
    if (wallet) {
      const delta = payload.type === 'income' ? payload.amount : -payload.amount;
      await walletService.update(payload.walletId, userId, { balance: wallet.balance + delta });
    }

    return tx;
  },

  async update(id: string, userId: string, payload: Partial<Transaction>): Promise<Transaction> {
    const index = transactions.findIndex((t) => t.id === id && t.userId === userId);
    if (index < 0) throw new Error('Không tìm thấy giao dịch');
    transactions[index] = { ...transactions[index]!, ...payload, updatedAt: new Date() };
    return transactions[index]!;
  },

  async delete(id: string, userId: string): Promise<void> {
    const index = transactions.findIndex((t) => t.id === id && t.userId === userId);
    if (index < 0) throw new Error('Không tìm thấy giao dịch');
    transactions.splice(index, 1);
  },
};
