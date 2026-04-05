import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { budgetService } from '../services/budget/budget.service';
import { useBudgetStore } from '../store/budget.store';
import { CreateBudgetPayload } from '../domain/budget/budget.types';

const QUERY_KEY = ['budgets'];

export function useBudgets() {
  const { budgets, setBudgets, setProgress } = useBudgetStore();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: budgetService.getAllWithProgress,
  });

  useEffect(() => {
    if (query.data) {
      setBudgets(query.data.map((p) => p.budget));
      setProgress(query.data);
    }
  }, [query.data, setBudgets, setProgress]);

  const createMutation = useMutation({
    mutationFn: (payload: CreateBudgetPayload) => budgetService.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => budgetService.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  return {
    budgets,
    isLoading: query.isLoading,
    create: createMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
  };
}
