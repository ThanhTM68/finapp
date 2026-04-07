import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch, TextInput } from 'react-native';
import { router } from 'expo-router';
import { useSettingsStore } from '@/store/settings.store';
import { settingsService } from '@/services/settings/settings.service';
import { appLock } from '@/security/appLock';

export default function SecurityScreen() {
  const isAppLockEnabled = useSettingsStore((state) => state.isAppLockEnabled);
  const setAppLockEnabled = useSettingsStore((state) => state.setAppLockEnabled);
  const [pin, setPin] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    void (async () => {
      const settings = await settingsService.load();
      setAppLockEnabled(settings.isAppLockEnabled);
    })();
  }, [setAppLockEnabled]);

  const toggleAppLock = async (value: boolean) => {
    setAppLockEnabled(value);
    await settingsService.save({ isAppLockEnabled: value });
  };

  const savePin = async () => {
    if (pin.length < 4) {
      setMessage('PIN phải có ít nhất 4 số');
      return;
    }
    await appLock.setPin(pin);
    setPin('');
    setMessage('Đã lưu PIN ứng dụng');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Quay lại</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Bảo mật</Text>
      <Text style={styles.desc}>Khóa ứng dụng bằng PIN và sinh trắc học</Text>

      <View style={styles.row}>
        <Text style={styles.rowLabel}>Bật khóa ứng dụng</Text>
        <Switch value={isAppLockEnabled} onValueChange={(value) => void toggleAppLock(value)} />
      </View>

      <Text style={styles.label}>Thiết lập PIN</Text>
      <TextInput
        style={styles.input}
        value={pin}
        onChangeText={(value) => {
          setMessage('');
          setPin(value.replace(/[^0-9]/g, '').slice(0, 6));
        }}
        keyboardType='number-pad'
        secureTextEntry
        placeholder='Nhập PIN mới'
        placeholderTextColor='#9ca3af'
      />
      <TouchableOpacity style={styles.button} onPress={() => void savePin()}>
        <Text style={styles.buttonText}>Lưu PIN</Text>
      </TouchableOpacity>

      {!!message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#fff', paddingTop: 56 },
  back: { marginBottom: 16 },
  backText: { color: '#16a34a', fontSize: 16 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  desc: { color: '#6b7280', marginBottom: 20 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 },
  rowLabel: { color: '#111827', fontSize: 16, fontWeight: '600' },
  label: { color: '#374151', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, padding: 12, marginBottom: 10 },
  button: { backgroundColor: '#16a34a', borderRadius: 12, padding: 14, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: '700' },
  message: { marginTop: 12, color: '#16a34a' },
});
