import { httpClient } from './httpClient';
import { Transaction, CreateTransactionPayload, TransactionFilter } from '../../domain/transaction/transaction.types';

export const transactionApi = {
  getAll: (filter?: TransactionFilter) => {
    const params = filter ? `?${new URLSearchParams(filter as Record<string, string>).toString()}` : '';
    return httpClient.get<Transaction[]>(`/transactions${params}`);
  },
  getById: (id: string) => httpClient.get<Transaction>(`/transactions/${id}`),
  create: (payload: CreateTransactionPayload) => httpClient.post<Transaction>('/transactions', payload),
  update: (id: string, payload: Partial<CreateTransactionPayload>) =>
    httpClient.put<Transaction>(`/transactions/${id}`, payload),
  delete: (id: string) => httpClient.delete<void>(`/transactions/${id}`),
};
