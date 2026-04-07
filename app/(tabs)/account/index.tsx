import React from 'react';
import { View, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { router } from 'expo-router';
import { Colors, Spacing } from '../../../src/theme';
import { Typography } from '../../../src/components/ui/Typography';
import { Card } from '../../../src/components/ui/Card';
import { Button } from '../../../src/components/ui/Button';
import { useAuthStore } from '../../../src/stores/authStore';

interface SettingRowProps {
  label: string;
  onPress?: () => void;
  right?: React.ReactNode;
  danger?: boolean;
}

function SettingRow({ label, onPress, right, danger }: SettingRowProps) {
  return (
    <TouchableOpacity style={styles.settingRow} onPress={onPress} disabled={!onPress}>
      <Typography variant="body" style={danger ? styles.dangerText : undefined}>
        {label}
      </Typography>
      {right ?? <Typography variant="body" style={styles.chevron}>›</Typography>}
    </TouchableOpacity>
  );
}

interface SettingSectionProps {
  title: string;
  children: React.ReactNode;
}

function SettingSection({ title, children }: SettingSectionProps) {
  return (
    <View style={styles.section}>
      <Typography variant="label" style={styles.sectionTitle}>{title}</Typography>
      <Card style={styles.sectionCard}>{children}</Card>
    </View>
  );
}

export default function AccountScreen() {
  const { user, logout } = useAuthStore();
  const [darkMode, setDarkMode] = React.useState(false);
  const [hideBalance, setHideBalance] = React.useState(false);
  const [appLock, setAppLock] = React.useState(false);

  function handleLogout() {
    logout();
    router.replace('/(auth)/login');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Profile card */}
        <Card style={styles.profileCard}>
          <View style={styles.avatar}>
            <Typography style={styles.avatarText}>
              {user?.name?.charAt(0)?.toUpperCase() ?? 'U'}
            </Typography>
          </View>
          <Typography variant="h3">{user?.name ?? 'Người dùng'}</Typography>
          <Typography variant="bodySmall">{user?.email ?? ''}</Typography>
        </Card>

        {/* Ví & Dữ liệu */}
        <SettingSection title="Ví & Dữ liệu">
          <SettingRow label="Quản lý ví" onPress={() => router.push('/(tabs)/account/wallets')} />
          <SettingRow label="Danh mục" onPress={() => router.push('/(tabs)/account/categories')} />
          <SettingRow label="Xuất dữ liệu (CSV/Excel)" onPress={() => router.push('/(tabs)/account/export')} />
        </SettingSection>

        {/* Bảo mật */}
        <SettingSection title="Bảo mật">
          <SettingRow label="Đổi mật khẩu" onPress={() => router.push('/(auth)/reset-password')} />
          <SettingRow
            label="Khóa ứng dụng"
            right={
              <Switch
                value={appLock}
                onValueChange={setAppLock}
                trackColor={{ true: Colors.primary, false: Colors.textDisabled }}
              />
            }
          />
        </SettingSection>

        {/* Tùy chọn */}
        <SettingSection title="Tùy chọn">
          <SettingRow
            label="Chế độ tối"
            right={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ true: Colors.primary, false: Colors.textDisabled }}
              />
            }
          />
          <SettingRow
            label="Ẩn số dư"
            right={
              <Switch
                value={hideBalance}
                onValueChange={setHideBalance}
                trackColor={{ true: Colors.primary, false: Colors.textDisabled }}
              />
            }
          />
        </SettingSection>

        {/* Hệ thống */}
        <SettingSection title="Hệ thống">
          <SettingRow label="Đồng bộ dữ liệu" onPress={() => router.push('/(tabs)/account/sync')} />
          <SettingRow label="Xoá tài khoản" danger />
        </SettingSection>

        <Button label="Đăng xuất" onPress={handleLogout} style={styles.logoutBtn} />
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
  profileCard: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  avatarText: {
    fontSize: 32,
    color: Colors.white,
    fontWeight: '700',
  },
  section: {
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    marginBottom: Spacing.xs,
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    fontSize: 11,
    letterSpacing: 1,
  },
  sectionCard: {
    paddingVertical: 0,
    overflow: 'hidden',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.06)',
  },
  chevron: {
    color: Colors.textSecondary,
    fontSize: 20,
  },
  dangerText: {
    color: Colors.expense,
  },
  logoutBtn: {
    marginTop: Spacing.md,
  },
});
