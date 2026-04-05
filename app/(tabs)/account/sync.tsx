import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing } from '../../../src/theme';
import { Typography } from '../../../src/components/ui/Typography';
import { Button } from '../../../src/components/ui/Button';
import { Card } from '../../../src/components/ui/Card';
import { useSyncStore } from '../../../src/stores/syncStore';
import { processSyncQueue } from '../../../src/services/syncService';

export default function SyncScreen() {
  const { isSyncing, lastSyncAt, pendingCount, failedCount } = useSyncStore();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Typography variant="h2" style={styles.title}>Đồng bộ dữ liệu</Typography>

        <Card style={styles.card}>
          <View style={styles.row}>
            <Typography variant="label">Lần sync gần nhất</Typography>
            <Typography variant="bodySmall">
              {lastSyncAt ? new Date(lastSyncAt).toLocaleString('vi-VN') : 'Chưa sync'}
            </Typography>
          </View>
          <View style={styles.row}>
            <Typography variant="label">Đang chờ sync</Typography>
            <Typography variant="bodySmall">{pendingCount}</Typography>
          </View>
          <View style={styles.row}>
            <Typography variant="label" style={{ color: failedCount > 0 ? Colors.expense : undefined }}>
              Thất bại
            </Typography>
            <Typography variant="bodySmall" style={{ color: failedCount > 0 ? Colors.expense : undefined }}>
              {failedCount}
            </Typography>
          </View>
        </Card>

        <Button
          label={isSyncing ? 'Đang sync…' : 'Sync ngay'}
          onPress={processSyncQueue}
          loading={isSyncing}
          style={styles.btn}
        />
        <Button label="Quay lại" variant="ghost" onPress={() => router.back()} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    padding: Spacing.md,
  },
  title: {
    marginBottom: Spacing.lg,
  },
  card: {
    marginBottom: Spacing.lg,
    gap: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  btn: {
    marginBottom: Spacing.md,
  },
});
