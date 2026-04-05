import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { transactionService } from '../services/transaction/transaction.service';
import { useTransactionStore } from '../store/transaction.store';
import { CreateTransactionPayload, TransactionFilter } from '../domain/transaction/transaction.types';

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
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
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
