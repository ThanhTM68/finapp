/** Fincoin design token – green neumorphism palette */
export const Colors = {
  primary: '#1DB954',
  primaryDark: '#17a349',
  primaryLight: '#4eca77',

  background: '#F0F4F0',
  surface: '#F0F4F0',
  card: '#F0F4F0',

  textPrimary: '#1a2e1a',
  textSecondary: '#5a7a5a',
  textDisabled: '#a0b8a0',

  income: '#1DB954',
  expense: '#E53935',
  transfer: '#1976D2',

  warning: '#FF8F00',
  warningLight: '#FFF3E0',

  white: '#FFFFFF',
  black: '#000000',

  shadow: {
    dark: 'rgba(0,0,0,0.15)',
    light: 'rgba(255,255,255,0.85)',
  },

  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    card: '#2C2C2C',
    textPrimary: '#E8F5E9',
    textSecondary: '#A5D6A7',
  },
} as const;

export type ColorKey = keyof typeof Colors;
