export const ENV = {
  API_URL: process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1',
  APP_ENV: process.env.EXPO_PUBLIC_APP_ENV ?? 'development',
  IS_DEV: process.env.EXPO_PUBLIC_APP_ENV !== 'production',
} as const;
