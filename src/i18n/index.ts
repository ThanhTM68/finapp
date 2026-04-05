import vi from './vi.json';
import en from './en.json';

type TranslationKeys = typeof vi;
type Language = 'vi' | 'en';

const translations: Record<Language, TranslationKeys> = { vi, en };

let currentLanguage: Language = 'vi';

export function setLanguage(lang: Language): void {
  currentLanguage = lang;
}

export function t(key: string): string {
  const keys = key.split('.');
  let result: unknown = translations[currentLanguage];
  for (const k of keys) {
    if (result && typeof result === 'object') {
      result = (result as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }
  return typeof result === 'string' ? result : key;
}

export { vi, en };
