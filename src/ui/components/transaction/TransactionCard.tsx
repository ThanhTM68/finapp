import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, RADIUS } from '../../../core/constants/colors';
import { formatCurrency } from '../../../utils/currency';
import { formatDate } from '../../../utils/date';
import { Transaction } from '../../../domain/transaction/transaction.types';

interface TransactionCardProps {
  transaction: Transaction;
}

export function TransactionCard({ transaction }: TransactionCardProps) {
  const isIncome = transaction.type === 'income';
  return (
    <View style={styles.card}>
      <View style={styles.left}>
        <Text style={styles.note}>{transaction.note || '—'}</Text>
        <Text style={styles.date}>{formatDate(transaction.date)}</Text>
      </View>
      <Text style={[styles.amount, isIncome ? styles.income : styles.expense]}>
        {isIncome ? '+' : '-'}{formatCurrency(transaction.amount)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: SPACING.md,
    borderRadius: RADIUS.md,
    marginBottom: SPACING.sm,
    elevation: 1,
  },
  left: { flex: 1 },
  note: { fontSize: 15, fontWeight: '500', color: COLORS.text },
  date: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  amount: { fontSize: 16, fontWeight: 'bold' },
  income: { color: COLORS.income },
  expense: { color: COLORS.expense },
});
