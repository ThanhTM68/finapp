import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing } from '../../../src/theme';
import { Typography } from '../../../src/components/ui/Typography';
import { Button } from '../../../src/components/ui/Button';
import { Input } from '../../../src/components/ui/Input';
import { useBudgetStore } from '../../../src/stores/budgetStore';
import { useCategoryStore } from '../../../src/stores/categoryStore';
import { generateId, nowIso, currentPeriod } from '../../../src/services/utils';

export default function CreateBudgetScreen() {
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [loading, setLoading] = useState(false);

  const addBudget = useBudgetStore((s) => s.addBudget);
  const expenseCategories = useCategoryStore((s) => s.expenseCategories);

  async function handleSave() {
    const numAmount = parseFloat(amount.replace(/\D/g, ''));
    if (!numAmount || !categoryId) return;

    setLoading(true);
    try {
      addBudget({
        id: generateId(),
        categoryId,
        amount: numAmount,
        period: currentPeriod(),
        spent: 0,
        createdAt: nowIso(),
        updatedAt: nowIso(),
      });
      router.back();
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Typography variant="h2" style={styles.title}>Tạo ngân sách</Typography>

        <Input
          label="Ngân sách"
          placeholder="0 đ"
          value={amount}
          onChangeText={setAmount}
          keyboardType="numeric"
        />

        {/* Category picker – simplified */}
        <Typography variant="label" style={{ marginBottom: Spacing.xs }}>Danh mục</Typography>
        <View style={styles.categoryGrid}>
          {expenseCategories().map((cat) => (
            <Button
              key={cat.id}
              label={cat.name}
              variant={categoryId === cat.id ? 'primary' : 'outline'}
              size="sm"
              onPress={() => setCategoryId(cat.id)}
              style={styles.catBtn}
            />
          ))}
          {expenseCategories().length === 0 && (
            <Typography variant="caption" style={{ color: Colors.textSecondary }}>
              Chưa có danh mục. Tạo danh mục trong phần Tài khoản.
            </Typography>
          )}
        </View>

        <Button label="Lưu" onPress={handleSave} loading={loading} style={styles.saveBtn} />
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
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  catBtn: {
    minWidth: 80,
  },
  saveBtn: {
    marginBottom: Spacing.md,
  },
});
