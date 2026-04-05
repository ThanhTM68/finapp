export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPassword(password: string): boolean {
  return password.length >= 8;
}

export function isValidAmount(amount: number): boolean {
  return amount > 0 && isFinite(amount);
}

export function isValidName(name: string): boolean {
  return name.trim().length >= 1 && name.trim().length <= 100;
}
