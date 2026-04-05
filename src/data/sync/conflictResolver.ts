import { logger } from '../../utils/logger';

export type ConflictStrategy = 'server_wins' | 'client_wins' | 'latest_wins';

export interface ConflictPayload {
  tableName: string;
  id: string;
  clientData: object;
  serverData: object;
  clientUpdatedAt: string;
  serverUpdatedAt: string;
}

export const conflictResolver = {
  resolve(conflict: ConflictPayload, strategy: ConflictStrategy = 'latest_wins'): object {
    logger.info(`[ConflictResolver] Resolving conflict for ${conflict.tableName}:${conflict.id} using ${strategy}`);

    switch (strategy) {
      case 'server_wins':
        return conflict.serverData;
      case 'client_wins':
        return conflict.clientData;
      case 'latest_wins':
      default: {
        const clientTime = new Date(conflict.clientUpdatedAt).getTime();
        const serverTime = new Date(conflict.serverUpdatedAt).getTime();
        return clientTime >= serverTime ? conflict.clientData : conflict.serverData;
      }
    }
  },
};
