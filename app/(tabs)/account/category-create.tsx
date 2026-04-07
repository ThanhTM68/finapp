import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing } from '../../../src/theme';
import { Typography } from '../../../src/components/ui/Typography';
import { Button } from '../../../src/components/ui/Button';
import { Input } from '../../../src/components/ui/Input';
import { useCategoryStore } from '../../../src/stores/categoryStore';
import { generateId, nowIso } from '../../../src/services/utils';
import { CategoryKind } from '../../../src/types';

const ICONS = ['🛒', '🍔', '🚌', '🏠', '🎬', '❤️', '💡', '💰', '🎓', '✈️', '👗', '💊'];
const COLORS = ['#1DB954', '#2196F3', '#FF9800', '#E91E63', '#9C27B0', '#E53935', '#00BCD4', '#FF7043'];

export default function CategoryCreateScreen() {
  const [name, setName] = useState('');
  const [kind, setKind] = useState<CategoryKind>('expense');
  const [icon, setIcon] = useState(ICONS[0]);
  const [color, setColor] = useState(COLORS[0]);
  const [loading, setLoading] = useState(false);

  const addCategory = useCategoryStore((s) => s.addCategory);

  async function handleSave() {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const now = nowIso();
      addCategory({
        id: generateId(),
        name: name.trim(),
        kind,
        icon,
        color,
        isDefault: false,
        createdAt: now,
        updatedAt: now,
      });
      router.back();
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <Typography variant="h2" style={styles.title}>Tạo danh mục</Typography>

        <Input label="Tên danh mục" placeholder="Nhập tên danh mục" value={name} onChangeText={setName} />

        {/* Kind */}
        <Typography variant="label" style={styles.subLabel}>Loại</Typography>
        <View style={styles.kindRow}>
          {(['income', 'expense'] as const).map((k) => (
            <TouchableOpacity
              key={k}
              style={[styles.kindBtn, kind === k && styles.kindBtnActive]}
              onPress={() => setKind(k)}
            >
              <Typography variant="label" style={kind === k ? { color: Colors.white } : undefined}>
                {k === 'income' ? 'Thu' : 'Chi'}
              </Typography>
            </TouchableOpacity>
          ))}
        </View>

        {/* Icon picker */}
        <Typography variant="label" style={styles.subLabel}>Chọn biểu tượng</Typography>
        <View style={styles.iconGrid}>
          {ICONS.map((ic) => (
            <TouchableOpacity
              key={ic}
              style={[styles.iconItem, icon === ic && styles.iconItemActive]}
              onPress={() => setIcon(ic)}
            >
              <Typography style={styles.iconText}>{ic}</Typography>
            </TouchableOpacity>
          ))}
        </View>

        {/* Color picker */}
        <Typography variant="label" style={styles.subLabel}>Chọn màu sắc</Typography>
        <View style={styles.colorRow}>
          {COLORS.map((c) => (
            <TouchableOpacity
              key={c}
              style={[styles.colorDot, { backgroundColor: c }, color === c && styles.colorDotSelected]}
              onPress={() => setColor(c)}
            />
          ))}
        </View>

        {/* Preview */}
        <Typography variant="label" style={styles.subLabel}>Xem trước</Typography>
        <View style={[styles.preview, { backgroundColor: color }]}>
          <Typography style={styles.previewIcon}>{icon}</Typography>
          <Typography variant="label" style={{ color: Colors.white }}>{name || 'Danh mục'}</Typography>
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
  subLabel: {
    marginBottom: Spacing.sm,
  },
  kindRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  kindBtn: {
    flex: 1,
    paddingVertical: Spacing.sm,
    borderRadius: 20,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    shadowColor: Colors.shadow.dark,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  kindBtnActive: {
    backgroundColor: Colors.primary,
  },
  iconGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  iconItem: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.shadow.dark,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconItemActive: {
    backgroundColor: Colors.primaryLight,
  },
  iconText: {
    fontSize: 22,
  },
  colorRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    flexWrap: 'wrap',
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
  preview: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    gap: Spacing.sm,
  },
  previewIcon: {
    fontSize: 24,
  },
  saveBtn: {
    marginBottom: Spacing.md,
  },
});
