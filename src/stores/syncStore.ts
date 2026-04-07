import { create } from 'zustand';
import { SyncQueueItem } from '../types';

interface SyncState {
  isSyncing: boolean;
  lastSyncAt: string | null;
  failedCount: number;
  pendingCount: number;
  queue: SyncQueueItem[];

  setIsSyncing: (syncing: boolean) => void;
  setLastSyncAt: (date: string | null) => void;
  setQueue: (queue: SyncQueueItem[]) => void;
  updateQueueItem: (item: SyncQueueItem) => void;
  removeQueueItem: (id: string) => void;
}

export const useSyncStore = create<SyncState>((set) => ({
  isSyncing: false,
  lastSyncAt: null,
  failedCount: 0,
  pendingCount: 0,
  queue: [],

  setIsSyncing: (isSyncing) => set({ isSyncing }),

  setLastSyncAt: (lastSyncAt) => set({ lastSyncAt }),

  setQueue: (queue) =>
    set({
      queue,
      pendingCount: queue.filter((q) => q.status === 'pending').length,
      failedCount: queue.filter((q) => q.status === 'failed').length,
    }),

  updateQueueItem: (item) =>
    set((state) => {
      const queue = state.queue.map((q) => (q.id === item.id ? item : q));
      return {
        queue,
        pendingCount: queue.filter((q) => q.status === 'pending').length,
        failedCount: queue.filter((q) => q.status === 'failed').length,
      };
    }),

  removeQueueItem: (id) =>
    set((state) => {
      const queue = state.queue.filter((q) => q.id !== id);
      return {
        queue,
        pendingCount: queue.filter((q) => q.status === 'pending').length,
        failedCount: queue.filter((q) => q.status === 'failed').length,
      };
    }),
}));
