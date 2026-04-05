import { create } from 'zustand';
import { Wallet } from '../domain/wallet/wallet.types';

interface WalletState {
  wallets: Wallet[];
  selectedWalletId: string | null;
  setWallets: (wallets: Wallet[]) => void;
  selectWallet: (id: string | null) => void;
  upsertWallet: (wallet: Wallet) => void;
  removeWallet: (id: string) => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  wallets: [],
  selectedWalletId: null,
  setWallets: (wallets) => set({ wallets }),
  selectWallet: (selectedWalletId) => set({ selectedWalletId }),
  upsertWallet: (wallet) =>
    set((state) => {
      const index = state.wallets.findIndex((w) => w.id === wallet.id);
      const updated = [...state.wallets];
      if (index >= 0) {
        updated[index] = wallet;
      } else {
        updated.push(wallet);
      }
      return { wallets: updated };
    }),
  removeWallet: (id) =>
    set((state) => ({ wallets: state.wallets.filter((w) => w.id !== id) })),
}));
