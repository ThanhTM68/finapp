import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing } from '../../../src/theme';
import { Typography } from '../../../src/components/ui/Typography';
import { Card } from '../../../src/components/ui/Card';
import { useCategoryStore } from '../../../src/stores/categoryStore';
import { Category } from '../../../src/types';

const KIND_TABS = [
  { label: 'Chi', value: 'expense' },
  { label: 'Thu', value: 'income' },
] as const;

export default function CategoriesScreen() {
  const [kind, setKind] = useState<'expense' | 'income'>('expense');
  const categories = useCategoryStore((s) => s.categories);
  const removeCategory = useCategoryStore((s) => s.removeCategory);

  const filtered = categories.filter((c) => c.kind === kind && !c.deletedAt);

  function renderCategory({ item }: { item: Category }) {
    return (
      <Card style={[styles.catCard, { borderLeftColor: item.color, borderLeftWidth: 4 }]}>
        <View style={styles.catRow}>
          <Typography style={styles.catIcon}>{item.icon}</Typography>
          <Typography variant="label" style={styles.catName}>{item.name}</Typography>
          <TouchableOpacity
            onPress={() => removeCategory(item.id)}
            style={styles.deleteBtn}
          >
            <Typography variant="caption" style={{ color: Colors.expense }}>🗑</Typography>
          </TouchableOpacity>
        </View>
      </Card>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Typography variant="body" style={{ color: Colors.primary }}>← Trở về</Typography>
        </TouchableOpacity>
        <Typography variant="h3">Quản lý danh mục</Typography>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => router.push('/(tabs)/account/category-create')}
        >
          <Typography variant="label" style={{ color: Colors.white }}>+</Typography>
        </TouchableOpacity>
      </View>

      {/* Kind tabs */}
      <View style={styles.tabs}>
        {KIND_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.value}
            style={[styles.tab, kind === tab.value && styles.tabActive]}
            onPress={() => setKind(tab.value)}
          >
            <Typography
              variant="label"
              style={kind === tab.value ? styles.tabLabelActive : styles.tabLabel}
            >
              {tab.label}
            </Typography>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderCategory}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Typography variant="bodySmall" style={{ color: Colors.textSecondary, textAlign: 'center' }}>
              Chưa có danh mục. Nhấn + để tạo.
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
  tabs: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
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
  list: {
    padding: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  catCard: {
    marginBottom: Spacing.sm,
  },
  catRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  catIcon: {
    fontSize: 24,
    marginRight: Spacing.sm,
  },
  catName: {
    flex: 1,
  },
  deleteBtn: {
    padding: Spacing.xs,
  },
  empty: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
});
