import { Stack } from 'expo-router';

export default function AccountLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="wallets" />
      <Stack.Screen name="categories" />
      <Stack.Screen name="security" />
      <Stack.Screen name="export" />
      <Stack.Screen name="sync" />
    </Stack>
  );
}
