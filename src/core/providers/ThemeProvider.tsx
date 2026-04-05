import React, { createContext, useContext, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { COLORS } from '../constants/colors';

interface ThemeContextValue {
  isDark: boolean;
  colors: typeof COLORS;
}

const ThemeContext = createContext<ThemeContextValue>({
  isDark: false,
  colors: COLORS,
});

export function useTheme() {
  return useContext(ThemeContext);
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <ThemeContext.Provider value={{ isDark, colors: COLORS }}>
      {children}
    </ThemeContext.Provider>
  );
}
