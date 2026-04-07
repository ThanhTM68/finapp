import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, Switch } from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing } from '../../../src/theme';
import { Typography } from '../../../src/components/ui/Typography';
import { Button } from '../../../src/components/ui/Button';
import { Input } from '../../../src/components/ui/Input';

export default function RecurringScreen() {
  const [isActive, setIsActive] = useState(true);
  const [frequency, setFrequency] = useState<'weekly' | 'monthly'>('monthly');

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Typography variant="h2" style={styles.title}>Thiết lập giao dịch định kỳ</Typography>

        <Input label="Số tiền" placeholder="0 đ" keyboardType="numeric" />
        <Input label="Ghi chú" placeholder="Thêm ghi chú" />
        <Input label="Ngày bắt đầu" placeholder="YYYY-MM-DD" />

        {/* Frequency */}
        <Typography variant="label" style={styles.sectionLabel}>Tần suất</Typography>
        <View style={styles.row}>
          <Typography variant="body">Bật định kỳ</Typography>
          <Switch
            value={isActive}
            onValueChange={setIsActive}
            trackColor={{ true: Colors.primary, false: Colors.textDisabled }}
          />
        </View>
        <View style={styles.freqRow}>
          {(['weekly', 'monthly'] as const).map((f) => (
            <Button
              key={f}
              label={f === 'weekly' ? 'Hàng tuần' : 'Hàng tháng'}
              variant={frequency === f ? 'primary' : 'outline'}
              size="sm"
              onPress={() => setFrequency(f)}
              style={styles.freqBtn}
            />
          ))}
        </View>

        <Button label="Lưu" onPress={() => router.back()} style={styles.saveBtn} />
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
  sectionLabel: {
    marginBottom: Spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  freqRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.xl,
  },
  freqBtn: {
    flex: 1,
  },
  saveBtn: {
    marginTop: Spacing.md,
  },
});
