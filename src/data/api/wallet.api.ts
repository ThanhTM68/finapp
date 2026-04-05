import { httpClient } from './httpClient';
import { Wallet, CreateWalletPayload, UpdateWalletPayload } from '../../domain/wallet/wallet.types';

export const walletApi = {
  getAll: () => httpClient.get<Wallet[]>('/wallets'),
  getById: (id: string) => httpClient.get<Wallet>(`/wallets/${id}`),
  create: (payload: CreateWalletPayload) => httpClient.post<Wallet>('/wallets', payload),
  update: (payload: UpdateWalletPayload) => httpClient.put<Wallet>(`/wallets/${payload.id}`, payload),
  delete: (id: string) => httpClient.delete<void>(`/wallets/${id}`),
  transfer: (fromId: string, toId: string, amount: number, note?: string) =>
    httpClient.post<void>('/wallets/transfer', { fromId, toId, amount, note }),
};
