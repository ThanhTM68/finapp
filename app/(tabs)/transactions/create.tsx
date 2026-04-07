import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Numpad } from '@/ui/components/form/Numpad';
import { useTransactions } from '@/hooks/useTransactions';
import { useCategories } from '@/hooks/useCategories';
import { useWallets } from '@/hooks/useWallets';
import { CategoryPicker } from '@/components/ui/CategoryPicker';
import { TransactionType } from '@/domain/common/base.types';

const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;

function formatDateLabel(value: Date): string {
  return value.toISOString().slice(0, 10);
}

export default function CreateTransactionScreen() {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [date, setDate] = useState(new Date());
  const [isPickerVisible, setPickerVisible] = useState(false);

  const { create } = useTransactions();
  const { categories } = useCategories(type);
  const { wallets } = useWallets();

  const selectedWallet = wallets[0];
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined);

  const selectedCategory = useMemo(
    () => categories.find((item) => item.id === selectedCategoryId) ?? categories[0],
    [categories, selectedCategoryId],
  );

  const canSave = Number(amount) > 0 && selectedWallet && selectedCategory;

  const onSave = async () => {
    if (!canSave || !selectedWallet || !selectedCategory) return;
    await create({
      walletId: selectedWallet.id,
      categoryId: selectedCategory.id,
      amount: Number(amount),
      type,
      note,
      date: date.toISOString(),
    });
    router.back();
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Thêm giao dịch</Text>

        <View style={styles.typeRow}>
          {(['expense', 'income'] as const).map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.typeButton, type === item && styles.typeButtonActive]}
              onPress={() => setType(item)}
            >
              <Text style={[styles.typeText, type === item && styles.typeTextActive]}>
                {item === 'expense' ? 'Chi tiêu' : 'Thu nhập'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.amountLabel}>{type === 'income' ? 'Số tiền thu' : 'Số tiền chi'}</Text>
        <Text style={[styles.amountValue, type === 'income' ? styles.income : styles.expense]}>
          {amount || '0'} ₫
        </Text>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Danh mục</Text>
          <TouchableOpacity style={styles.fieldButton} onPress={() => setPickerVisible(true)}>
            <Text style={styles.fieldValue}>{selectedCategory ? `${selectedCategory.icon} ${selectedCategory.name}` : 'Chọn danh mục'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.fieldRow}>
          <Text style={styles.fieldLabel}>Ngày</Text>
          <View style={styles.dateActions}>
            <TouchableOpacity style={styles.dateButton} onPress={() => setDate(new Date(date.getTime() - MILLISECONDS_PER_DAY))}>
              <Text style={styles.dateButtonText}>-1 ngày</Text>
            </TouchableOpacity>
            <Text style={styles.dateText}>{formatDateLabel(date)}</Text>
            <TouchableOpacity style={styles.dateButton} onPress={() => setDate(new Date(date.getTime() + MILLISECONDS_PER_DAY))}>
              <Text style={styles.dateButtonText}>+1 ngày</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TextInput
          style={styles.input}
          value={note}
          onChangeText={setNote}
          placeholder='Ghi chú'
          placeholderTextColor='#9ca3af'
        />

        <Numpad value={amount} onChange={setAmount} />
      </ScrollView>

      <TouchableOpacity style={[styles.button, !canSave && styles.buttonDisabled]} onPress={() => void onSave()} disabled={!canSave}>
        <Text style={styles.buttonText}>Lưu giao dịch</Text>
      </TouchableOpacity>

      <CategoryPicker
        visible={isPickerVisible}
        categories={categories}
        selectedCategoryId={selectedCategory?.id}
        onSelect={setSelectedCategoryId}
        onClose={() => setPickerVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { padding: 16, paddingTop: 48, paddingBottom: 24 },
  title: { fontSize: 24, fontWeight: '700', color: '#111827', marginBottom: 16 },
  typeRow: { flexDirection: 'row', marginBottom: 16, gap: 8 },
  typeButton: { flex: 1, borderRadius: 10, borderWidth: 1, borderColor: '#d1d5db', paddingVertical: 10, alignItems: 'center' },
  typeButtonActive: { backgroundColor: '#16a34a', borderColor: '#16a34a' },
  typeText: { color: '#374151', fontWeight: '600' },
  typeTextActive: { color: '#fff' },
  amountLabel: { color: '#6b7280', marginBottom: 4 },
  amountValue: { fontSize: 34, fontWeight: '700', marginBottom: 12, textAlign: 'center' },
  income: { color: '#16a34a' },
  expense: { color: '#dc2626' },
  fieldRow: { marginBottom: 12 },
  fieldLabel: { color: '#6b7280', marginBottom: 6 },
  fieldButton: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, padding: 12 },
  fieldValue: { color: '#111827', fontSize: 16 },
  dateActions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  dateButton: { borderWidth: 1, borderColor: '#d1d5db', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  dateButtonText: { color: '#374151', fontSize: 12 },
  dateText: { color: '#111827', fontWeight: '600' },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 12, padding: 12, marginBottom: 16, color: '#111827' },
  button: { backgroundColor: '#16a34a', padding: 16, alignItems: 'center' },
  buttonDisabled: { backgroundColor: '#9ca3af' },
  buttonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
