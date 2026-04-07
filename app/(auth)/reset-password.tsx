import React, { useState } from 'react';
import { View, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing } from '../../src/theme';
import { Typography } from '../../src/components/ui/Typography';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    if (!email.includes('@')) return;
    setLoading(true);
    try {
      // TODO: real reset-password API call
      await new Promise((r) => setTimeout(r, 800));
      setSent(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Typography variant="h2" style={styles.title}>Đặt lại mật khẩu</Typography>
        <Typography variant="bodySmall" style={styles.subtitle}>
          Nhập email để nhận liên kết đặt lại mật khẩu
        </Typography>

        <Input
          label="Email"
          placeholder="Nhập email của bạn"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {sent ? (
          <View style={styles.successBox}>
            <Typography variant="bodySmall" style={styles.successText}>
              ✅ Liên kết reset đã được gửi. Vui lòng kiểm tra email của bạn.
            </Typography>
          </View>
        ) : null}

        <Button
          label="Gửi liên kết reset"
          onPress={handleSend}
          loading={loading}
          style={styles.btn}
        />
        <Button
          label="Quay lại đăng nhập"
          variant="ghost"
          onPress={() => router.back()}
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
  successBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  successText: {
    color: Colors.primary,
    textAlign: 'center',
  },
  btn: {
    marginBottom: Spacing.md,
  },
});
