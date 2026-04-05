import * as LocalAuthentication from 'expo-local-authentication';

export const appLock = {
  async isAvailable(): Promise<boolean> {
    const compatible = await LocalAuthentication.hasHardwareAsync();
    const enrolled = await LocalAuthentication.isEnrolledAsync();
    return compatible && enrolled;
  },

  async authenticate(): Promise<boolean> {
    const available = await appLock.isAvailable();
    if (!available) return true; // No biometrics, allow through

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Xác thực để mở ứng dụng',
      fallbackLabel: 'Dùng mật khẩu',
    });

    return result.success;
  },
};
