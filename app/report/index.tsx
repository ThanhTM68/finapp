import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing } from '../../src/theme';
import { Typography } from '../../src/components/ui/Typography';
import { Card } from '../../src/components/ui/Card';
import { useTransactionStore } from '../../src/stores/transactionStore';
import { useCategoryStore } from '../../src/stores/categoryStore';
import { formatCurrency } from '../../src/services/utils';

const PERIOD_TABS = ['Tuần', 'Tháng', 'Năm'] as const;
type Period = (typeof PERIOD_TABS)[number];

export default function ReportScreen() {
  const [period, setPeriod] = useState<Period>('Tháng');

  const transactions = useTransactionStore((s) => s.transactions);
  const categories = useCategoryStore((s) => s.categories);

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0);

  // Category breakdown
  const categoryTotals = categories
    .map((cat) => ({
      name: cat.name,
      color: cat.color,
      total: transactions
        .filter((t) => t.categoryId === cat.id && t.type === 'expense')
        .reduce((s, t) => s + t.amount, 0),
    }))
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total);

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Typography variant="body" style={{ color: Colors.primary }}>← Trở về</Typography>
          </TouchableOpacity>
          <Typography variant="h3">Báo cáo tài chính</Typography>
          <View style={{ width: 60 }} />
        </View>

        {/* Summary cards */}
        <View style={styles.summaryRow}>
          <Card style={[styles.summaryCard, { backgroundColor: Colors.primary }]}>
            <Typography variant="caption" style={{ color: Colors.white }}>Tổng số dư</Typography>
            <Typography variant="label" bold style={{ color: Colors.white }}>
              {formatCurrency(totalIncome - totalExpense)}
            </Typography>
          </Card>
          <Card style={styles.summaryCard}>
            <Typography variant="caption" style={{ color: Colors.income }}>Thu nhập</Typography>
            <Typography variant="label" bold style={{ color: Colors.income }}>
              +{formatCurrency(totalIncome)}
            </Typography>
          </Card>
          <Card style={styles.summaryCard}>
            <Typography variant="caption" style={{ color: Colors.expense }}>Chi tiêu</Typography>
            <Typography variant="label" bold style={{ color: Colors.expense }}>
              -{formatCurrency(totalExpense)}
            </Typography>
          </Card>
        </View>

        {/* Period selector */}
        <View style={styles.periodRow}>
          {PERIOD_TABS.map((p) => (
            <TouchableOpacity
              key={p}
              style={[styles.periodBtn, period === p && styles.periodBtnActive]}
              onPress={() => setPeriod(p)}
            >
              <Typography
                variant="label"
                style={period === p ? styles.periodLabelActive : styles.periodLabel}
              >
                {p}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>

        {/* Category breakdown */}
        <Typography variant="h3" style={styles.sectionTitle}>Theo danh mục</Typography>
        {categoryTotals.length === 0 ? (
          <Typography variant="bodySmall" style={styles.emptyText}>Chưa có dữ liệu</Typography>
        ) : (
          categoryTotals.map((cat, idx) => (
            <Card key={cat.name} style={styles.catRow}>
              <View style={styles.catInfo}>
                <View style={[styles.catDot, { backgroundColor: cat.color }]} />
                <Typography variant="body">{idx + 1}. {cat.name}</Typography>
              </View>
              <Typography variant="label">
                {totalExpense > 0 ? `${Math.round((cat.total / totalExpense) * 100)}%` : '0%'}
              </Typography>
              <Typography variant="body">{formatCurrency(cat.total)}</Typography>
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
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  summaryCard: {
    flex: 1,
    padding: Spacing.sm,
  },
  periodRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
    backgroundColor: Colors.surface,
    borderRadius: 20,
    padding: 4,
  },
  periodBtn: {
    flex: 1,
    paddingVertical: Spacing.xs,
    borderRadius: 16,
    alignItems: 'center',
  },
  periodBtnActive: {
    backgroundColor: Colors.primary,
  },
  periodLabel: {
    color: Colors.textSecondary,
  },
  periodLabelActive: {
    color: Colors.white,
  },
  sectionTitle: {
    marginBottom: Spacing.sm,
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
  },
  catInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  catDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: Spacing.sm,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.textSecondary,
    marginVertical: Spacing.xl,
  },
});
