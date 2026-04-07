import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing } from '../../src/theme';
import { Typography } from '../../src/components/ui/Typography';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate(): boolean {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = 'Vui lòng nhập họ tên.';
    if (!email.includes('@')) newErrors.email = 'Email không hợp lệ.';
    if (password.length < 6) newErrors.password = 'Mật khẩu tối thiểu 6 ký tự.';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Mật khẩu không khớp.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleRegister() {
    if (!validate()) return;
    setLoading(true);
    try {
      // TODO: replace with real API call
      await new Promise((r) => setTimeout(r, 800));
      router.replace('/(tabs)/home');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Typography variant="h2" style={styles.title}>Tạo tài khoản mới</Typography>
        <Typography variant="bodySmall" style={styles.subtitle}>
          Nhập thông tin của bạn để bắt đầu
        </Typography>

        <Input
          label="Họ tên"
          placeholder="Nhập họ tên"
          value={name}
          onChangeText={setName}
          error={errors.name}
        />
        <Input
          label="Email"
          placeholder="Nhập email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          error={errors.email}
        />
        <Input
          label="Mật khẩu"
          placeholder="Nhập mật khẩu"
          value={password}
          onChangeText={setPassword}
          secure
          error={errors.password}
        />
        <Input
          label="Nhập lại mật khẩu"
          placeholder="Nhập lại mật khẩu"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secure
          error={errors.confirmPassword}
        />

        <Button
          label="Tạo tài khoản"
          onPress={handleRegister}
          loading={loading}
          style={styles.btn}
        />
        <Button
          label="Đã có tài khoản? Đăng nhập"
          variant="ghost"
          onPress={() => router.back()}
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
  btn: {
    marginBottom: Spacing.md,
  },
  ghostBtn: {
    alignSelf: 'center',
  },
});
