import { create } from 'zustand';
import { Transaction } from '../types';

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  filter: {
    type: 'all' | 'income' | 'expense';
    walletId: string | null;
    categoryId: string | null;
    dateFrom: string | null;
    dateTo: string | null;
    search: string;
  };

  setTransactions: (transactions: Transaction[]) => void;
  addTransaction: (transaction: Transaction) => void;
  updateTransaction: (transaction: Transaction) => void;
  removeTransaction: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setFilter: (filter: Partial<TransactionState['filter']>) => void;
  resetFilter: () => void;
}

const defaultFilter: TransactionState['filter'] = {
  type: 'all',
  walletId: null,
  categoryId: null,
  dateFrom: null,
  dateTo: null,
  search: '',
};

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  isLoading: false,
  filter: defaultFilter,

  setTransactions: (transactions) => set({ transactions }),

  addTransaction: (transaction) =>
    set((state) => ({
      transactions: [transaction, ...state.transactions],
    })),

  updateTransaction: (transaction) =>
    set((state) => ({
      transactions: state.transactions.map((t) =>
        t.id === transaction.id ? transaction : t,
      ),
    })),

  removeTransaction: (id) =>
    set((state) => ({
      transactions: state.transactions.filter((t) => t.id !== id),
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setFilter: (filter) =>
    set((state) => ({ filter: { ...state.filter, ...filter } })),

  resetFilter: () => set({ filter: defaultFilter }),
}));
