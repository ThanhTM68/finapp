import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionService } from '../services/transaction/transaction.service';
import { useTransactionStore } from '../store/transaction.store';
import { CreateTransactionPayload, TransactionFilter, Transaction } from '../domain/transaction/transaction.types';
import { generateId } from '../utils/id';

const QUERY_KEY = ['transactions'];

export function useTransactions(filter?: TransactionFilter) {
  const { transactions, setTransactions } = useTransactionStore();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [...QUERY_KEY, filter],
    queryFn: () => transactionService.getAll(filter),
  });

  useEffect(() => {
    if (query.data) setTransactions(query.data);
  }, [query.data, setTransactions]);

  const createMutation = useMutation({
    mutationFn: (payload: CreateTransactionPayload) => transactionService.create(payload),
    onMutate: async (payload) => {
      const optimisticTx: Transaction = {
        id: generateId(),
        walletId: payload.walletId,
        categoryId: payload.categoryId,
        amount: payload.amount,
        type: payload.type,
        note: payload.note ?? '',
        date: payload.date,
        isRecurring: payload.isRecurring ?? false,
        recurringInterval: payload.recurringInterval,
        transferId: payload.transferId,
        syncStatus: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      useTransactionStore.getState().addTransaction(optimisticTx);
      return optimisticTx;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
    onError: (_error, _payload, optimisticTx) => {
      if (optimisticTx) {
        useTransactionStore.getState().removeTransaction(optimisticTx.id);
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => transactionService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  return {
    transactions,
    isLoading: query.isLoading,
    create: createMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    refetch: query.refetch,
  };
}
