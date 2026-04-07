import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing } from '../../../src/theme';
import { Typography } from '../../../src/components/ui/Typography';
import { Button } from '../../../src/components/ui/Button';
import { Input } from '../../../src/components/ui/Input';
import { useWalletStore } from '../../../src/stores/walletStore';
import { getDb } from '../../../src/db/client';
import { generateId, nowIso } from '../../../src/services/utils';
import { WalletType, Wallet } from '../../../src/types';

const WALLET_TYPES: { label: string; value: WalletType; icon: string }[] = [
  { label: 'Tiền mặt', value: 'cash', icon: '💵' },
  { label: 'Ngân hàng', value: 'bank', icon: '🏦' },
  { label: 'Thẻ tín dụng', value: 'credit', icon: '💳' },
  { label: 'Tiết kiệm', value: 'savings', icon: '🐷' },
  { label: 'Ví điện tử', value: 'ewallet', icon: '📱' },
];

const COLORS = ['#1DB954', '#2196F3', '#FF9800', '#E91E63', '#9C27B0', '#00BCD4'];

export default function WalletCreateScreen() {
  const [name, setName] = useState('');
  const [type, setType] = useState<WalletType>('cash');
  const [balance, setBalance] = useState('0');
  const [color, setColor] = useState(COLORS[0]);
  const [loading, setLoading] = useState(false);

  const addWallet = useWalletStore((s) => s.addWallet);

  async function handleSave() {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const now = nowIso();
      const wallet: Wallet = {
        id: generateId(),
        name: name.trim(),
        type,
        balance: parseFloat(balance.replace(/\D/g, '')) || 0,
        color,
        isArchived: false,
        createdAt: now,
        updatedAt: now,
      };

      const db = getDb();
      db.runSync(
        `INSERT INTO wallets (id, name, type, balance, color, is_archived, created_at, updated_at, is_deleted, version)
         VALUES (?, ?, ?, ?, ?, 0, ?, ?, 0, 1)`,
        [wallet.id, wallet.name, wallet.type, wallet.balance, wallet.color, now, now],
      );

      addWallet(wallet);
      router.back();
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Typography variant="h2" style={styles.title}>Tạo ví mới</Typography>

        <Input label="Tên ví" placeholder="Nhập tên ví" value={name} onChangeText={setName} />
        <Input
          label="Số dư ban đầu"
          placeholder="0 đ"
          value={balance}
          onChangeText={setBalance}
          keyboardType="numeric"
        />

        {/* Wallet type */}
        <Typography variant="label" style={styles.subLabel}>Loại ví</Typography>
        <View style={styles.typeGrid}>
          {WALLET_TYPES.map((wt) => (
            <TouchableOpacity
              key={wt.value}
              style={[styles.typeItem, type === wt.value && styles.typeItemActive]}
              onPress={() => setType(wt.value)}
            >
              <Typography style={styles.typeIcon}>{wt.icon}</Typography>
              <Typography variant="caption" style={type === wt.value ? { color: Colors.white } : undefined}>
                {wt.label}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>

        {/* Color picker */}
        <Typography variant="label" style={styles.subLabel}>Màu ví</Typography>
        <View style={styles.colorRow}>
          {COLORS.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.colorDot, { backgroundColor: c }, color === c && styles.colorDotSelected]}
              onPress={() => setColor(c)}
            />
          ))}
        </View>

        <Button label="Lưu ví" onPress={handleSave} loading={loading} style={styles.saveBtn} />
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
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  typeItem: {
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 12,
    backgroundColor: Colors.surface,
    shadowColor: Colors.shadow.dark,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
    minWidth: 80,
  },
  typeItemActive: {
    backgroundColor: Colors.primary,
  },
  typeIcon: {
    fontSize: 24,
    marginBottom: 4,
  },
  colorRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  colorDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  colorDotSelected: {
    borderWidth: 3,
    borderColor: Colors.black,
  },
  saveBtn: {
    marginBottom: Spacing.md,
  },
});
