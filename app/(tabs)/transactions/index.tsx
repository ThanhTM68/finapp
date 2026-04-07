import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { Colors, Spacing } from '../../../src/theme';
import { Typography } from '../../../src/components/ui/Typography';
import { Card } from '../../../src/components/ui/Card';
import { Input } from '../../../src/components/ui/Input';
import { useTransactionStore } from '../../../src/stores/transactionStore';
import { formatCurrency } from '../../../src/services/utils';
import { Transaction } from '../../../src/types';

const TYPE_TABS = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Thu', value: 'income' },
  { label: 'Chi', value: 'expense' },
] as const;

export default function TransactionsScreen() {
  const [search, setSearch] = useState('');
  const { transactions, filter, setFilter } = useTransactionStore();

  const filtered = transactions.filter((tx) => {
    if (filter.type !== 'all' && tx.type !== filter.type) return false;
    if (search && !(tx.note ?? '').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  function renderItem({ item }: { item: Transaction }) {
    const isIncome = item.type === 'income';
    return (
      <Card style={styles.txCard}>
        <View style={styles.txRow}>
          <View style={styles.txLeft}>
            <Typography variant="body">{item.note ?? item.type}</Typography>
            <Typography variant="caption">{item.date}</Typography>
          </View>
          <Typography
            variant="label"
            bold
            style={{ color: isIncome ? Colors.income : Colors.expense }}
          >
            {isIncome ? '+' : '-'}{formatCurrency(item.amount)}
          </Typography>
        </View>
      </Card>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="h2">Sổ giao dịch</Typography>
      </View>

      {/* Type filter tabs */}
      <View style={styles.tabs}>
        {TYPE_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.value}
            style={[styles.tab, filter.type === tab.value && styles.tabActive]}
            onPress={() => setFilter({ type: tab.value })}
          >
            <Typography
              variant="label"
              style={filter.type === tab.value ? styles.tabLabelActive : styles.tabLabel}
            >
              {tab.label}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <Input
          placeholder="Tìm giao dịch…"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Typography variant="bodySmall" style={styles.emptyText}>
              Không có giao dịch nào.
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
    padding: Spacing.md,
    paddingBottom: 0,
  },
  tabs: {
    flexDirection: 'row',
    padding: Spacing.md,
    gap: Spacing.sm,
  },
  tab: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: 20,
    backgroundColor: Colors.surface,
  },
  tabActive: {
    backgroundColor: Colors.primary,
  },
  tabLabel: {
    color: Colors.textSecondary,
  },
  tabLabelActive: {
    color: Colors.white,
  },
  searchContainer: {
    paddingHorizontal: Spacing.md,
  },
  list: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  txCard: {
    marginBottom: Spacing.sm,
  },
  txRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  txLeft: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  emptyText: {
    color: Colors.textSecondary,
  },
});
