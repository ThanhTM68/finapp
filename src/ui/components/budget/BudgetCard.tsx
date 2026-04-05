import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../../core/constants/colors';
import { formatCurrency } from '../../../utils/currency';
import { BudgetProgress } from '../../../domain/budget/budget.types';

interface BudgetCardProps {
  progress: BudgetProgress;
}

export function BudgetCard({ progress }: BudgetCardProps) {
  const { budget, percentage, isOverLimit, isNearLimit } = progress;
  const barColor = isOverLimit ? COLORS.error : isNearLimit ? COLORS.warning : COLORS.primary;

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{budget.name}</Text>
      <View style={styles.progressBg}>
        <View style={[styles.progressBar, { width: `${Math.min(percentage, 100)}%`, backgroundColor: barColor }]} />
      </View>
      <View style={styles.row}>
        <Text style={styles.spent}>{formatCurrency(budget.spent)}</Text>
        <Text style={styles.limit}>/ {formatCurrency(budget.amount)}</Text>
      </View>
      {isOverLimit && <Text style={styles.alert}>⚠️ Vượt hạn mức!</Text>}
      {!isOverLimit && isNearLimit && <Text style={styles.warn}>⚠️ Gần đạt hạn mức</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
    elevation: 2,
  },
  name: { fontSize: 16, fontWeight: '600', color: COLORS.text, marginBottom: SPACING.sm },
  progressBg: { height: 8, backgroundColor: '#e5e7eb', borderRadius: 4, overflow: 'hidden', marginBottom: SPACING.sm },
  progressBar: { height: '100%', borderRadius: 4 },
  row: { flexDirection: 'row', gap: 4 },
  spent: { fontSize: 14, fontWeight: '600', color: COLORS.text },
  limit: { fontSize: 14, color: COLORS.textSecondary },
  alert: { color: COLORS.error, fontSize: 12, marginTop: 4 },
  warn: { color: COLORS.warning, fontSize: 12, marginTop: 4 },
});
