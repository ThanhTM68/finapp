import React from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing } from '../../../src/theme';
import { Typography } from '../../../src/components/ui/Typography';
import { Button } from '../../../src/components/ui/Button';

export default function ExportScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Typography variant="h2" style={styles.title}>Xuất dữ liệu</Typography>
        <Typography variant="bodySmall" style={styles.subtitle}>
          Xuất toàn bộ giao dịch của bạn sang định dạng CSV hoặc Excel.
        </Typography>

        <Button label="Xuất CSV" onPress={() => { /* TODO */ }} style={styles.btn} />
        <Button label="Xuất Excel (.xlsx)" variant="outline" onPress={() => { /* TODO */ }} style={styles.btn} />
        <Button label="Xuất JSON (Backup)" variant="outline" onPress={() => { /* TODO */ }} style={styles.btn} />
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
    flex: 1,
    padding: Spacing.md,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: Spacing.xl,
    color: Colors.textSecondary,
  },
  btn: {
    marginBottom: Spacing.md,
  },
});
