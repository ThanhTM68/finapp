export function formatCurrency(amount: number, locale = 'vi-VN', currency = 'VND'): string {
  return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
}

export function formatShortCurrency(amount: number): string {
  if (Math.abs(amount) >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M ₫`;
  }
  if (Math.abs(amount) >= 1_000) {
    return `${(amount / 1_000).toFixed(0)}K ₫`;
  }
  return `${amount} ₫`;
}

export function parseAmount(input: string): number {
  return parseFloat(input.replace(/[^0-9.-]/g, '')) || 0;
}
