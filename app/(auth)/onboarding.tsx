import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing } from '../../src/theme';
import { Typography } from '../../src/components/ui/Typography';
import { Button } from '../../src/components/ui/Button';

export default function OnboardingScreen() {
  return (
    <View style={styles.container}>
      {/* Illustration placeholder */}
      <View style={styles.illustration}>
        <Typography variant="h1" style={styles.emoji}>🐷</Typography>
      </View>

      <Typography variant="h2" style={styles.title}>
        Gia tăng tiết kiệm đều đặn hàng tháng
      </Typography>
      <Typography variant="bodySmall" style={styles.subtitle}>
        Bắt đầu hành trình tài chính vững chắc cùng chúng tôi.
      </Typography>

      {/* Dot indicators */}
      <View style={styles.dots}>
        {[0, 1, 2].map((i) => (
          <View key={i} style={[styles.dot, i === 0 && styles.dotActive]} />
        ))}
      </View>

      <Button
        label="Đăng ký miễn phí"
        onPress={() => router.push('/(auth)/register')}
        style={styles.primaryBtn}
      />
      <Button
        label="Đăng nhập"
        variant="ghost"
        onPress={() => router.push('/(auth)/login')}
        style={styles.ghostBtn}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
  },
  illustration: {
    marginBottom: Spacing.xl,
  },
  emoji: {
    fontSize: 80,
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  dots: {
    flexDirection: 'row',
    marginBottom: Spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.textDisabled,
    marginHorizontal: 4,
  },
  dotActive: {
    backgroundColor: Colors.primary,
    width: 24,
  },
  primaryBtn: {
    width: '100%',
    marginBottom: Spacing.md,
  },
  ghostBtn: {
    width: '100%',
  },
});
