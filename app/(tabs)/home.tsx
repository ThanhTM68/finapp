import React, { useState } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing } from '../../src/theme';
import { Typography } from '../../src/components/ui/Typography';
import { Card } from '../../src/components/ui/Card';
import { useWalletStore } from '../../src/stores/walletStore';
import { useTransactionStore } from '../../src/stores/transactionStore';
import { initializeStoresFromDb } from '../../src/services/dataInitService';
import { formatCurrency } from '../../src/services/utils';

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const [hideBalance] = useState(false);

  const totalBalance = useWalletStore((s) => s.totalBalance);
  const transactions = useTransactionStore((s) => s.transactions);

  const recentTransactions = transactions.slice(0, 5);

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  async function onRefresh() {
    setRefreshing(true);
    try {
      await initializeStoresFromDb();
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.primary} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <Typography variant="h2">Ví của bạn</Typography>
        </View>

        {/* Total balance card */}
        <Card style={styles.balanceCard}>
          <Typography variant="bodySmall">Tổng số dư</Typography>
          <Typography variant="h1" bold style={styles.balanceAmount}>
            {hideBalance ? '••••••••' : formatCurrency(totalBalance())}
          </Typography>
          <View style={styles.balanceRow}>
            <View style={styles.balanceMini}>
              <Typography variant="caption" style={{ color: Colors.income }}>▲ Thu nhập</Typography>
              <Typography variant="label" style={{ color: Colors.income }}>
                {formatCurrency(totalIncome)}
              </Typography>
            </View>
            <View style={styles.balanceMini}>
              <Typography variant="caption" style={{ color: Colors.expense }}>▼ Chi tiêu</Typography>
              <Typography variant="label" style={{ color: Colors.expense }}>
                {formatCurrency(totalExpense)}
              </Typography>
            </View>
          </View>
        </Card>

        {/* Recent transactions */}
        <View style={styles.sectionHeader}>
          <Typography variant="h3">Giao dịch gần đây</Typography>
          <Typography
            variant="bodySmall"
            style={styles.seeAll}
            onPress={() => router.push('/(tabs)/transactions')}
          >
            Xem tất cả
          </Typography>
        </View>

        {recentTransactions.length === 0 ? (
          <Card style={styles.emptyState}>
            <Typography variant="bodySmall" style={styles.emptyText}>
              Chưa có giao dịch nào. Nhấn + để thêm giao dịch đầu tiên.
            </Typography>
          </Card>
        ) : (
          recentTransactions.map((tx) => (
            <Card key={tx.id} style={styles.txCard}>
              <View style={styles.txRow}>
                <Typography variant="body">{tx.note ?? tx.type}</Typography>
                <Typography
                  variant="label"
                  style={{ color: tx.type === 'income' ? Colors.income : Colors.expense }}
                >
                  {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                </Typography>
              </View>
              <Typography variant="caption">{tx.date}</Typography>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  balanceCard: {
    marginBottom: Spacing.lg,
    backgroundColor: Colors.primary,
  },
  balanceAmount: {
    color: Colors.white,
    marginVertical: Spacing.xs,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  balanceMini: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 12,
    padding: Spacing.sm,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  seeAll: {
    color: Colors.primary,
  },
  txCard: {
    marginBottom: Spacing.sm,
  },
  txRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.textSecondary,
  },
});
