// Sync service placeholder – processes batch changes from clients
export const syncService = {
  async push(userId: string, payload: {
    items: Array<{ tableName: string; operation: string; payload: string }>;
  }): Promise<{ syncedIds: number[] }> {
    // TODO: Apply each item to the database and return synced IDs
    const syncedIds = payload.items.map((_, i) => i + 1);
    return { syncedIds };
  },

  async pull(userId: string, since?: string): Promise<{ changes: object[] }> {
    // TODO: Return all changes since the given timestamp for this user
    return { changes: [] };
  },
};
