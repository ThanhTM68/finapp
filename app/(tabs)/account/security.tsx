import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Switch } from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing } from '../../../src/theme';
import { Typography } from '../../../src/components/ui/Typography';
import { Button } from '../../../src/components/ui/Button';
import { Card } from '../../../src/components/ui/Card';

export default function SecurityScreen() {
  const [biometrics, setBiometrics] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Typography variant="h2" style={styles.title}>Bảo mật</Typography>

        <Card style={styles.card}>
          <View style={styles.row}>
            <View style={styles.rowInfo}>
              <Typography variant="label">Khoá sinh trắc học</Typography>
              <Typography variant="caption" style={{ color: Colors.textSecondary }}>
                Face ID / Vân tay
              </Typography>
            </View>
            <Switch
              value={biometrics}
              onValueChange={setBiometrics}
              trackColor={{ true: Colors.primary, false: Colors.textDisabled }}
            />
          </View>
        </Card>

        <Button
          label="Đổi mật khẩu"
          onPress={() => router.push('/(auth)/reset-password')}
          style={styles.btn}
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
    flex: 1,
    padding: Spacing.md,
  },
  title: {
    marginBottom: Spacing.lg,
  },
  card: {
    marginBottom: Spacing.lg,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowInfo: {
    flex: 1,
  },
  btn: {
    marginBottom: Spacing.md,
  },
});
