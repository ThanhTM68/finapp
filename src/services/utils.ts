/** Generate a pseudo-UUID (v4-style). */
export function generateId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Current UTC datetime as ISO string */
export function nowIso(): string {
  return new Date().toISOString();
}

/** Format a number as Vietnamese currency (e.g. 1.200.000 đ) */
export function formatCurrency(amount: number): string {
  return (
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(amount)
  );
}

/** Returns "2024-04" for the current month */
export function currentPeriod(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}
