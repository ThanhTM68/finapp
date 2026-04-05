import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#16a34a',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: { height: 60, paddingBottom: 8 },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Tổng quan' }} />
      <Tabs.Screen name="transactions" options={{ title: 'Giao dịch' }} />
      <Tabs.Screen name="budgets" options={{ title: 'Ngân sách' }} />
      <Tabs.Screen name="reports" options={{ title: 'Báo cáo' }} />
      <Tabs.Screen name="account" options={{ title: 'Tài khoản' }} />
    </Tabs>
  );
}
