import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';
import { Category } from '../../domain/category/category.types';

interface CategoryPickerProps {
  visible: boolean;
  categories: Category[];
  selectedCategoryId?: string;
  onSelect: (categoryId: string) => void;
  onClose: () => void;
}

export function CategoryPicker({
  visible,
  categories,
  selectedCategoryId,
  onSelect,
  onClose,
}: CategoryPickerProps) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <TouchableOpacity style={StyleSheet.absoluteFillObject} onPress={onClose} />
        <View style={styles.sheet}>
          <Text style={styles.title}>Chọn danh mục</Text>
          <FlatList
            data={categories}
            keyExtractor={(item) => item.id}
            numColumns={3}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[styles.item, item.id === selectedCategoryId && styles.itemSelected]}
                onPress={() => {
                  onSelect(item.id);
                  onClose();
                }}
              >
                <View style={[styles.iconWrap, { backgroundColor: item.color }]}>
                  <Text style={styles.icon}>{item.icon || '•'}</Text>
                </View>
                <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={styles.list}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.35)' },
  sheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '65%',
    paddingBottom: 24,
  },
  title: { fontSize: 18, fontWeight: '700', color: '#111827', padding: 16 },
  list: { paddingHorizontal: 8 },
  item: { width: '33.33%', alignItems: 'center', marginBottom: 16, paddingVertical: 8 },
  itemSelected: { backgroundColor: '#f3f4f6', borderRadius: 12 },
  iconWrap: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  icon: { fontSize: 20, color: '#fff' },
  name: { marginTop: 6, fontSize: 12, color: '#111827' },
});
