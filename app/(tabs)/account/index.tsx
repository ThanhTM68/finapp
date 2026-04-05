import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function AccountScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileCard}>
        <View style={styles.avatar} />
        <Text style={styles.name}>Người dùng</Text>
        <Text style={styles.email}>email@example.com</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/account/profile')}>
          <Text style={styles.editBtn}>Chỉnh sửa hồ sơ</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ví &amp; Dữ liệu</Text>
        <TouchableOpacity style={styles.item} onPress={() => router.push('/(tabs)/account/wallets')}>
          <Text style={styles.itemText}>Quản lý ví</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => router.push('/(tabs)/account/categories')}>
          <Text style={styles.itemText}>Danh mục</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.item} onPress={() => router.push('/(tabs)/account/export')}>
          <Text style={styles.itemText}>Xuất dữ liệu (CSV/Excel)</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Bảo mật</Text>
        <TouchableOpacity style={styles.item} onPress={() => router.push('/(tabs)/account/security')}>
          <Text style={styles.itemText}>Đổi mật khẩu</Text>
        </TouchableOpacity>
        <View style={styles.item}>
          <Text style={styles.itemText}>Khóa ứng dụng</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tùy chọn</Text>
        <View style={styles.item}>
          <Text style={styles.itemText}>Chế độ tối</Text>
        </View>
        <View style={styles.item}>
          <Text style={styles.itemText}>Ẩn số dư</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hệ thống</Text>
        <TouchableOpacity style={styles.item} onPress={() => router.push('/(tabs)/account/sync')}>
          <Text style={styles.itemText}>Đồng bộ dữ liệu</Text>
        </TouchableOpacity>
        <View style={styles.item}>
          <Text style={[styles.itemText, { color: '#dc2626' }]}>Xóa tài khoản</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn}>
        <Text style={styles.logoutText}>Đăng xuất</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  profileCard: {
    backgroundColor: '#16a34a', padding: 24, paddingTop: 56, alignItems: 'center',
  },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#d1fae5', marginBottom: 12 },
  name: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  email: { color: '#d1fae5', fontSize: 14, marginTop: 4 },
  editBtn: { color: '#fff', marginTop: 12, borderWidth: 1, borderColor: '#fff', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 8 },
  section: { backgroundColor: '#fff', margin: 16, borderRadius: 12, overflow: 'hidden' },
  sectionTitle: { fontSize: 12, fontWeight: '600', color: '#6b7280', padding: 12, paddingBottom: 4, textTransform: 'uppercase' },
  item: { paddingHorizontal: 16, paddingVertical: 14, borderTopWidth: 1, borderTopColor: '#f3f4f6' },
  itemText: { fontSize: 16, color: '#111827' },
  logoutBtn: {
    margin: 16, backgroundColor: '#16a34a', padding: 16, borderRadius: 12, alignItems: 'center', marginBottom: 32,
  },
  logoutText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
