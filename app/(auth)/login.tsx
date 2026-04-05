import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing } from '../../src/theme';
import { Typography } from '../../src/components/ui/Typography';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { useAuthStore } from '../../src/stores/authStore';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { setUser, setToken } = useAuthStore();

  async function handleLogin() {
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      // TODO: replace with real auth API call
      await new Promise((r) => setTimeout(r, 800));
      setToken('mock-token');
      setUser({ id: '1', name: 'Nguyễn Văn A', email, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
      router.replace('/(tabs)/home');
    } catch {
      setError('Email hoặc mật khẩu không đúng.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Typography variant="h2" style={styles.title}>Chào mừng trở lại</Typography>
        <Typography variant="bodySmall" style={styles.subtitle}>Đăng nhập để tiếp tục</Typography>

        {error ? (
          <Typography variant="caption" style={styles.errorBanner}>{error}</Typography>
        ) : null}

        <Input
          label="Email"
          placeholder="Nhập email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Input
          label="Mật khẩu"
          placeholder="Nhập mật khẩu"
          value={password}
          onChangeText={setPassword}
          secure
        />

        <Button
          label="Đăng nhập"
          onPress={handleLogin}
          loading={loading}
          style={styles.btn}
        />
        <Button
          label="Tạo tài khoản"
          variant="outline"
          onPress={() => router.push('/(auth)/register')}
          style={styles.btn}
        />
        <Button
          label="Quên mật khẩu?"
          variant="ghost"
          onPress={() => router.push('/(auth)/reset-password')}
          style={styles.ghostBtn}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: Spacing.xl,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: Spacing.xl,
  },
  errorBanner: {
    color: Colors.expense,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  btn: {
    marginBottom: Spacing.md,
  },
  ghostBtn: {
    alignSelf: 'center',
  },
});
