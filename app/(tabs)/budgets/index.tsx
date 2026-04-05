import React from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing } from '../../../src/theme';
import { Typography } from '../../../src/components/ui/Typography';
import { Card } from '../../../src/components/ui/Card';
import { useBudgetStore } from '../../../src/stores/budgetStore';
import { useCategoryStore } from '../../../src/stores/categoryStore';
import { formatCurrency } from '../../../src/services/utils';
import { Budget } from '../../../src/types';

function ProgressBar({ progress, color }: { progress: number; color: string }) {
  const pct = Math.min(Math.max(progress, 0), 1) * 100;
  return (
    <View style={styles.progressBg}>
      <View style={[styles.progressFill, { width: `${pct}%`, backgroundColor: color }]} />
    </View>
  );
}

function budgetColor(pct: number): string {
  if (pct >= 1) return Colors.expense;
  if (pct >= 0.8) return Colors.warning;
  return Colors.primary;
}

export default function BudgetsScreen() {
  const { budgets, totalBudget, totalSpent, totalRemaining } = useBudgetStore();
  const categories = useCategoryStore((s) => s.categories);

  const overallPct = totalBudget() > 0 ? totalSpent() / totalBudget() : 0;

  function getCategoryName(id: string): string {
    return categories.find((c) => c.id === id)?.name ?? 'Danh mục';
  }

  function renderBudget({ item }: { item: Budget }) {
    const pct = item.amount > 0 ? item.spent / item.amount : 0;
    const remaining = item.amount - item.spent;
    const color = budgetColor(pct);

    return (
      <Card style={styles.budgetCard}>
        <View style={styles.budgetHeader}>
          <Typography variant="label">{getCategoryName(item.categoryId)}</Typography>
          <Typography variant="caption">{Math.round(pct * 100)}%</Typography>
        </View>
        <ProgressBar progress={pct} color={color} />
        <View style={styles.budgetFooter}>
          <Typography variant="caption">Đã chi: {formatCurrency(item.spent)}</Typography>
          <Typography variant="caption" style={{ color: remaining < 0 ? Colors.expense : Colors.textSecondary }}>
            Còn lại: {formatCurrency(remaining)}
          </Typography>
        </View>
      </Card>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Typography variant="h2">Ngân sách</Typography>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push('/(tabs)/budgets/create')}
        >
          <Typography variant="label" style={{ color: Colors.white }}>+</Typography>
        </TouchableOpacity>
      </View>

      {/* Overview card */}
      <Card style={styles.overviewCard}>
        <Typography variant="bodySmall">Ngân sách tháng này</Typography>
        <Typography variant="h2" bold style={{ color: Colors.white, marginVertical: Spacing.xs }}>
          {formatCurrency(totalBudget())}
        </Typography>
        <ProgressBar progress={overallPct} color={Colors.white} />
        <View style={styles.overviewFooter}>
          <Typography variant="caption" style={{ color: Colors.white }}>
            Đã chi: {formatCurrency(totalSpent())}
          </Typography>
          <Typography variant="caption" style={{ color: Colors.white }}>
            Còn lại: {formatCurrency(totalRemaining())}
          </Typography>
        </View>
      </Card>

      {/* Budget list */}
      <FlatList
        data={budgets}
        keyExtractor={(item) => item.id}
        renderItem={renderBudget}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Typography variant="bodySmall" style={{ color: Colors.textSecondary, textAlign: 'center' }}>
              Chưa có ngân sách. Nhấn + để tạo ngân sách đầu tiên.
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
  overviewCard: {
    margin: Spacing.md,
    backgroundColor: Colors.primary,
  },
  overviewFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  list: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  budgetCard: {
    marginBottom: Spacing.sm,
  },
  budgetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  budgetFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.xs,
  },
  progressBg: {
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: 8,
    borderRadius: 4,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
});
