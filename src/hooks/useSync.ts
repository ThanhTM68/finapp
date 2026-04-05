import { useCallback, useEffect, useState } from 'react';
import { syncService } from '../services/sync/sync.service';

export function useSync() {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    syncService.start();
    return () => syncService.stop();
  }, []);

  useEffect(() => {
    void syncService.getPendingCount().then(setPendingCount);
  }, []);

  const syncNow = useCallback(async () => {
    setIsSyncing(true);
    try {
      await syncService.syncNow();
      const count = await syncService.getPendingCount();
      setPendingCount(count);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  return { isOnline, pendingCount, isSyncing, syncNow };
}
