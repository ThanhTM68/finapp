import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Colors, Spacing } from '../../../src/theme';
import { Typography } from '../../../src/components/ui/Typography';
import { Button } from '../../../src/components/ui/Button';
import { useTransactionStore } from '../../../src/stores/transactionStore';
import { formatCurrency } from '../../../src/services/utils';

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const transactions = useTransactionStore((s) => s.transactions);
  const removeTransaction = useTransactionStore((s) => s.removeTransaction);

  const tx = transactions.find((t) => t.id === id);

  if (!tx) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Typography variant="body" style={{ textAlign: 'center', marginTop: Spacing.xl }}>
          Giao dịch không tồn tại.
        </Typography>
        <Button label="Quay lại" onPress={() => router.back()} style={{ margin: Spacing.md }} />
      </SafeAreaView>
    );
  }

  function handleDelete() {
    removeTransaction(tx!.id);
    router.back();
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Typography variant="h2" style={styles.amount}>
          {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
        </Typography>
        <Typography variant="body">Loại: {tx.type}</Typography>
        <Typography variant="body">Ngày: {tx.date}</Typography>
        {tx.note ? <Typography variant="body">Ghi chú: {tx.note}</Typography> : null}

        <Button
          label="Xoá giao dịch"
          variant="outline"
          onPress={handleDelete}
          style={[styles.btn, { borderColor: Colors.expense }]}
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
    padding: Spacing.md,
  },
  amount: {
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  btn: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
});
