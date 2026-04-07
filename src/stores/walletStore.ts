import { create } from 'zustand';
import { Wallet } from '../types';

interface WalletState {
  wallets: Wallet[];
  selectedWalletId: string | null;
  isLoading: boolean;

  setWallets: (wallets: Wallet[]) => void;
  addWallet: (wallet: Wallet) => void;
  updateWallet: (wallet: Wallet) => void;
  removeWallet: (id: string) => void;
  selectWallet: (id: string | null) => void;
  setLoading: (loading: boolean) => void;

  totalBalance: () => number;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  wallets: [],
  selectedWalletId: null,
  isLoading: false,

  setWallets: (wallets) => set({ wallets }),

  addWallet: (wallet) =>
    set((state) => ({ wallets: [...state.wallets, wallet] })),

  updateWallet: (wallet) =>
    set((state) => ({
      wallets: state.wallets.map((w) => (w.id === wallet.id ? wallet : w)),
    })),

  removeWallet: (id) =>
    set((state) => ({
      wallets: state.wallets.filter((w) => w.id !== id),
    })),

  selectWallet: (id) => set({ selectedWalletId: id }),

  setLoading: (isLoading) => set({ isLoading }),

  totalBalance: () =>
    get().wallets.reduce((sum, w) => sum + w.balance, 0),
}));
