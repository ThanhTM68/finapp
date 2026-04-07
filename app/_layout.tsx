import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme, AppState } from 'react-native';
import { useEffect } from 'react';
import { AppProvider } from '@/core/providers/AppProvider';
import { useSettingsStore } from '@/store/settings.store';
import { appLock } from '@/security/appLock';
import { router } from 'expo-router';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isAppLockEnabled = useSettingsStore((state) => state.isAppLockEnabled);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active' || !isAppLockEnabled) return;
      void (async () => {
        const hasPin = await appLock.hasPin();
        if (hasPin) {
          router.replace('/lock');
        }
      })();
    });
    return () => sub.remove();
  }, [isAppLockEnabled]);

  return (
    <AppProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="lock" />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </AppProvider>
  );
}
