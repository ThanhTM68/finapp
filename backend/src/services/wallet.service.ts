import { Wallet, WalletType } from '../models/wallet.model';
import { generateId } from '../utils/response';

// In-memory store placeholder
const wallets: Wallet[] = [];

export const walletService = {
  async getAll(userId: string): Promise<Wallet[]> {
    return wallets.filter((w) => w.userId === userId && !w.isDeleted);
  },

  async getById(id: string, userId: string): Promise<Wallet | undefined> {
    return wallets.find((w) => w.id === id && w.userId === userId && !w.isDeleted);
  },

  async create(userId: string, payload: { name: string; type: WalletType; balance: number; color: string }): Promise<Wallet> {
    const now = new Date();
    const wallet: Wallet = {
      id: generateId(),
      userId,
      name: payload.name,
      type: payload.type,
      balance: payload.balance ?? 0,
      color: payload.color ?? '#16a34a',
      isDeleted: false,
      createdAt: now,
      updatedAt: now,
    };
    wallets.push(wallet);
    return wallet;
  },

  async update(id: string, userId: string, payload: Partial<Wallet>): Promise<Wallet> {
    const index = wallets.findIndex((w) => w.id === id && w.userId === userId);
    if (index < 0) throw new Error('Không tìm thấy ví');
    wallets[index] = { ...wallets[index]!, ...payload, updatedAt: new Date() };
    return wallets[index]!;
  },

  async delete(id: string, userId: string): Promise<void> {
    const wallet = wallets.find((w) => w.id === id && w.userId === userId);
    if (!wallet) throw new Error('Không tìm thấy ví');
    wallet.isDeleted = true;
    wallet.updatedAt = new Date();
  },

  async transfer(userId: string, fromId: string, toId: string, amount: number, note?: string): Promise<void> {
    const from = wallets.find((w) => w.id === fromId && w.userId === userId);
    const to = wallets.find((w) => w.id === toId && w.userId === userId);
    if (!from || !to) throw new Error('Ví không tồn tại');
    if (from.balance < amount) throw new Error('Số dư không đủ');
    from.balance -= amount;
    to.balance += amount;
    from.updatedAt = to.updatedAt = new Date();
  },
};
