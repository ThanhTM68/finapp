import { useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { walletService } from '../services/wallet/wallet.service';
import { useWalletStore } from '../store/wallet.store';
import { CreateWalletPayload } from '../domain/wallet/wallet.types';

const QUERY_KEY = ['wallets'];

export function useWallets() {
  const { wallets, setWallets } = useWalletStore();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn: walletService.getAll,
  });

  useEffect(() => {
    if (query.data) setWallets(query.data);
  }, [query.data, setWallets]);

  const createMutation = useMutation({
    mutationFn: walletService.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  const deleteMutation = useMutation({
    mutationFn: walletService.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEY }),
  });

  return {
    wallets,
    isLoading: query.isLoading,
    create: createMutation.mutateAsync,
    remove: deleteMutation.mutateAsync,
    refetch: query.refetch,
  };
}
