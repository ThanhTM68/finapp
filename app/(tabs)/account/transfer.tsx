import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing } from '../../../src/theme';
import { Typography } from '../../../src/components/ui/Typography';
import { Button } from '../../../src/components/ui/Button';
import { Input } from '../../../src/components/ui/Input';
import { Card } from '../../../src/components/ui/Card';
import { useWalletStore } from '../../../src/stores/walletStore';
import { transferBetweenWallets } from '../../../src/services/transactionService';
import { useTransactionStore } from '../../../src/stores/transactionStore';
import { formatCurrency } from '../../../src/services/utils';

export default function TransferScreen() {
  const wallets = useWalletStore((s) => s.wallets).filter((w) => !w.isArchived);
  const [fromId, setFromId] = useState(wallets[0]?.id ?? '');
  const [toId, setToId] = useState(wallets[1]?.id ?? '');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const addTx = useTransactionStore((s) => s.addTransaction);
  const updateWallet = useWalletStore((s) => s.updateWallet);

  const fromWallet = wallets.find((w) => w.id === fromId);
  const toWallet = wallets.find((w) => w.id === toId);

  async function handleTransfer() {
    const numAmount = parseFloat(amount.replace(/\D/g, ''));
    if (!numAmount || fromId === toId || !fromId || !toId) return;
    setLoading(true);
    try {
      const result = transferBetweenWallets(
        fromId,
        toId,
        numAmount,
        note.trim() || undefined,
        new Date().toISOString().split('T')[0],
      );
      addTx(result.out);
      addTx(result.in);
      router.back();
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Typography variant="h2" style={styles.title}>Chuyển tiền</Typography>

        {/* From wallet */}
        <Typography variant="label" style={styles.subLabel}>Từ ví</Typography>
        <View style={styles.walletGrid}>
          {wallets.map((w) => (
            <TouchableOpacity
              key={w.id}
              style={[styles.walletItem, fromId === w.id && styles.walletItemActive]}
              onPress={() => setFromId(w.id)}
            >
              <Typography variant="label" style={fromId === w.id ? { color: Colors.white } : undefined}>
                {w.name}
              </Typography>
              <Typography variant="caption" style={fromId === w.id ? { color: Colors.white } : { color: Colors.textSecondary }}>
                {formatCurrency(w.balance)}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>

        {/* To wallet */}
        <Typography variant="label" style={styles.subLabel}>Đến ví</Typography>
        <View style={styles.walletGrid}>
          {wallets.map((w) => (
            <TouchableOpacity
              key={w.id}
              style={[styles.walletItem, toId === w.id && styles.walletItemActive]}
              onPress={() => setToId(w.id)}
            >
              <Typography variant="label" style={toId === w.id ? { color: Colors.white } : undefined}>
                {w.name}
              </Typography>
              <Typography variant="caption" style={toId === w.id ? { color: Colors.white } : { color: Colors.textSecondary }}>
                {formatCurrency(w.balance)}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>

        <Input
          label="Số tiền"
          placeholder="0 đ"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />
        <Input
          label="Ghi chú"
          placeholder="Thêm ghi chú (tùy chọn)"
          value={note}
          onChangeText={setNote}
        />

        <Button label="Xác nhận chuyển" onPress={handleTransfer} loading={loading} style={styles.btn} />
        <Button label="Huỷ" variant="ghost" onPress={() => router.back()} />
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
  title: {
    marginBottom: Spacing.lg,
  },
  subLabel: {
    marginBottom: Spacing.sm,
  },
  walletGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  walletItem: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    shadowColor: Colors.shadow.dark,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 100,
  },
  walletItemActive: {
    backgroundColor: Colors.primary,
  },
  btn: {
    marginBottom: Spacing.md,
  },
});
