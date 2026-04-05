import { create } from 'zustand';
import { Transaction, TransactionFilter } from '../domain/transaction/transaction.types';

interface TransactionState {
  transactions: Transaction[];
  filter: TransactionFilter;
  setTransactions: (txs: Transaction[]) => void;
  setFilter: (filter: TransactionFilter) => void;
  addTransaction: (tx: Transaction) => void;
  removeTransaction: (id: string) => void;
}

export const useTransactionStore = create<TransactionState>((set) => ({
  transactions: [],
  filter: {},
  setTransactions: (transactions) => set({ transactions }),
  setFilter: (filter) => set({ filter }),
  addTransaction: (tx) =>
    set((state) => ({ transactions: [tx, ...state.transactions] })),
  removeTransaction: (id) =>
    set((state) => ({ transactions: state.transactions.filter((t) => t.id !== id) })),
}));
