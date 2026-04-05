import { transactionRepository } from '../../data/repositories/transaction.repository';
import { Transaction, CreateTransactionPayload, TransactionFilter } from '../../domain/transaction/transaction.types';

export const transactionService = {
  async getAll(filter?: TransactionFilter): Promise<Transaction[]> {
    return transactionRepository.getAll(filter);
  },

  async getById(id: string): Promise<Transaction | null> {
    return transactionRepository.getById(id);
  },

  async create(payload: CreateTransactionPayload): Promise<Transaction> {
    return transactionRepository.create(payload);
  },

  async update(id: string, payload: Partial<CreateTransactionPayload>): Promise<void> {
    return transactionRepository.update(id, payload);
  },

  async delete(id: string): Promise<void> {
    return transactionRepository.delete(id);
  },
};
