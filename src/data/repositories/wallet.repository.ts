import { walletDao } from '../db/dao/wallet.dao';
import { walletApi } from '../api/wallet.api';
import { syncQueueDao } from '../db/dao/sync_queue.dao';
import { Wallet, CreateWalletPayload, UpdateWalletPayload } from '../../domain/wallet/wallet.types';
import { generateId } from '../../utils/id';

export const walletRepository = {
  async getAll(): Promise<Wallet[]> {
    return walletDao.findAll();
  },

  async getById(id: string): Promise<Wallet | null> {
    return walletDao.findById(id);
  },

  async create(payload: CreateWalletPayload): Promise<Wallet> {
    const now = new Date().toISOString();
    const wallet: Wallet = {
      id: generateId(),
      name: payload.name,
      type: payload.type,
      balance: payload.initialBalance,
      color: payload.color,
      isDeleted: false,
      syncStatus: 'pending',
      createdAt: now,
      updatedAt: now,
    };
    await walletDao.insert(wallet);
    await syncQueueDao.enqueue('wallets', 'INSERT', wallet);
    return wallet;
  },

  async update(payload: UpdateWalletPayload): Promise<void> {
    const now = new Date().toISOString();
    await walletDao.update({ ...payload, updatedAt: now });
    await syncQueueDao.enqueue('wallets', 'UPDATE', { ...payload, updatedAt: now });
  },

  async delete(id: string): Promise<void> {
    await walletDao.softDelete(id);
    await syncQueueDao.enqueue('wallets', 'DELETE', { id });
  },
};
