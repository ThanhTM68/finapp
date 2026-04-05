export function formatDate(date: string | Date, format: 'short' | 'long' | 'time' = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  if (format === 'long') {
    return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
  if (format === 'time') {
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  }
  return d.toLocaleDateString('vi-VN');
}

export function getWeekRange(): { startDate: string; endDate: string } {
  const now = new Date();
  const day = now.getDay();
  const startDate = new Date(now);
  startDate.setDate(now.getDate() - day);
  startDate.setHours(0, 0, 0, 0);
  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + 6);
  endDate.setHours(23, 59, 59, 999);
  return { startDate: startDate.toISOString(), endDate: endDate.toISOString() };
}

export function getMonthRange(): { startDate: string; endDate: string } {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  return { startDate: startDate.toISOString(), endDate: endDate.toISOString() };
}

export function getYearRange(): { startDate: string; endDate: string } {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), 0, 1);
  const endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
  return { startDate: startDate.toISOString(), endDate: endDate.toISOString() };
}

export function isToday(date: string): boolean {
  const d = new Date(date);
  const today = new Date();
  return d.toDateString() === today.toDateString();
}
