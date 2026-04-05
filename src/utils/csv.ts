import { Transaction } from '../domain/transaction/transaction.types';

export function transactionsToCsv(transactions: Transaction[]): string {
  const headers = ['ID', 'Ngày', 'Loại', 'Số tiền', 'Danh mục', 'Ghi chú'];
  const rows = transactions.map((t) => [
    t.id,
    t.date,
    t.type === 'income' ? 'Thu nhập' : 'Chi tiêu',
    t.amount.toString(),
    t.categoryId,
    t.note,
  ]);
  return [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
}
