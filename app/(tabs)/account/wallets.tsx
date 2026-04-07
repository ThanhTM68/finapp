import React from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing } from '../../../src/theme';
import { Typography } from '../../../src/components/ui/Typography';
import { Card } from '../../../src/components/ui/Card';
import { useWalletStore } from '../../../src/stores/walletStore';
import { formatCurrency } from '../../../src/services/utils';
import { Wallet } from '../../../src/types';

const WALLET_ICONS: Record<string, string> = {
  cash: '💵',
  bank: '🏦',
  credit: '💳',
  savings: '🐷',
  ewallet: '📱',
};

export default function WalletsScreen() {
  const { wallets, totalBalance } = useWalletStore();

  function renderWallet({ item }: { item: Wallet }) {
    return (
      <Card style={[styles.walletCard, { borderLeftColor: item.color, borderLeftWidth: 4 }]}>
        <View style={styles.walletRow}>
          <Typography style={styles.walletIcon}>{WALLET_ICONS[item.type] ?? '💰'}</Typography>
          <View style={styles.walletInfo}>
            <Typography variant="label">{item.name}</Typography>
            <Typography
              variant="body"
              bold
              style={{ color: item.balance < 0 ? Colors.expense : Colors.textPrimary }}
            >
              {formatCurrency(item.balance)}
            </Typography>
          </View>
        </View>
      </Card>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Typography variant="body" style={{ color: Colors.primary }}>← Trở về</Typography>
        </TouchableOpacity>
        <Typography variant="h3">Ví của tôi</Typography>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push('/(tabs)/account/wallet-create')}
        >
          <Typography variant="label" style={{ color: Colors.white }}>+</Typography>
        </TouchableOpacity>
      </View>

      {/* Total balance card */}
      <Card style={styles.totalCard}>
        <Typography variant="bodySmall" style={{ color: Colors.white }}>Tổng số dư</Typography>
        <Typography variant="h2" bold style={{ color: Colors.white }}>
          {formatCurrency(totalBalance())}
        </Typography>
      </Card>

      <FlatList
        data={wallets.filter((w) => !w.isArchived)}
        keyExtractor={(item) => item.id}
        renderItem={renderWallet}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Typography variant="bodySmall" style={{ color: Colors.textSecondary, textAlign: 'center' }}>
              Chưa có ví. Nhấn + để tạo ví đầu tiên.
            </Typography>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  totalCard: {
    margin: Spacing.md,
    backgroundColor: Colors.primary,
  },
  list: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  walletCard: {
    marginBottom: Spacing.sm,
  },
  walletRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  walletIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  walletInfo: {
    flex: 1,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
});
