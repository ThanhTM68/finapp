import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing } from '../../../src/theme';
import { Typography } from '../../../src/components/ui/Typography';
import { Button } from '../../../src/components/ui/Button';
import { Input } from '../../../src/components/ui/Input';
import { useWalletStore } from '../../../src/stores/walletStore';
import { useCategoryStore } from '../../../src/stores/categoryStore';
import { useTransactionStore } from '../../../src/stores/transactionStore';
import { addTransaction } from '../../../src/services/transactionService';
import { TransactionType } from '../../../src/types';

const TYPES: { label: string; value: TransactionType }[] = [
  { label: 'Chi', value: 'expense' },
  { label: 'Thu', value: 'income' },
  { label: 'Chuyển', value: 'transfer' },
];

export default function CreateTransactionScreen() {
  const [type, setType] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);

  const wallets = useWalletStore((s) => s.wallets);
  const [walletId, setWalletId] = useState('');

  // Keep walletId in sync when wallets load
  useEffect(() => {
    if (!walletId && wallets.length > 0) {
      setWalletId(wallets[0].id);
    }
  }, [wallets, walletId]);

  const addTx = useTransactionStore((s) => s.addTransaction);

  async function handleSave() {
    const numAmount = parseFloat(amount.replace(/\D/g, ''));
    if (!numAmount || !walletId) return;

    setLoading(true);
    try {
      const tx = addTransaction({
        type,
        amount: numAmount,
        note: note.trim() || undefined,
        date,
        walletId,
      });
      addTx(tx);
      router.back();
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()}>
              <Typography variant="body" style={{ color: Colors.primary }}>← Huỷ</Typography>
            </TouchableOpacity>
            <Typography variant="h3">Thêm giao dịch</Typography>
            <View style={{ width: 48 }} />
          </View>

          {/* Type selector */}
          <View style={styles.typeRow}>
            {TYPES.map((t) => (
              <TouchableOpacity
                key={t.value}
                style={[styles.typeBtn, type === t.value && styles.typeBtnActive]}
                onPress={() => setType(t.value)}
              >
                <Typography
                  variant="label"
                  style={type === t.value ? styles.typeLabelActive : styles.typeLabel}
                >
                  {t.label}
                </Typography>
              </TouchableOpacity>
            ))}
          </View>

          {/* Amount */}
          <Input
            label="Số tiền"
            placeholder="0 đ"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />

          {/* Note */}
          <Input
            label="Ghi chú"
            placeholder="Thêm ghi chú (tùy chọn)"
            value={note}
            onChangeText={setNote}
          />

          {/* Date */}
          <Input
            label="Ngày"
            placeholder="YYYY-MM-DD"
            value={date}
            onChangeText={setDate}
          />

          <Button
            label="Lưu giao dịch"
            onPress={handleSave}
            loading={loading}
            style={styles.saveBtn}
          />
        </ScrollView>
      </KeyboardAvoidingView>
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
    marginBottom: Spacing.lg,
  },
  typeRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  typeBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
  },
  typeBtnActive: {
    backgroundColor: Colors.primary,
  },
  typeLabel: {
    color: Colors.textSecondary,
  },
  typeLabelActive: {
    color: Colors.white,
  },
  saveBtn: {
    marginTop: Spacing.md,
  },
});
