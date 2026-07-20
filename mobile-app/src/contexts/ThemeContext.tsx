import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, darkColors } from '../theme/theme';

export type ThemeType = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  isDark: boolean;
  themeMode: ThemeType;
  setThemeMode: (mode: ThemeType) => Promise<void>;
  colors: typeof colors;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeType>('auto');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load saved theme preference on mount
  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const saved = await AsyncStorage.getItem('cititour_theme');
      if (saved) {
        setThemeModeState(saved as ThemeType);
      }
    } catch (error) {
      console.log('[v0] Failed to load theme preference:', error);
    } finally {
      setIsLoaded(true);
    }
  };

  const setThemeMode = async (mode: ThemeType) => {
    try {
      await AsyncStorage.setItem('cititour_theme', mode);
      setThemeModeState(mode);
    } catch (error) {
      console.log('[v0] Failed to save theme preference:', error);
    }
  };

  // Determine if dark mode is active
  const isDark = 
    themeMode === 'dark' || 
    (themeMode === 'auto' && systemColorScheme === 'dark');

  const currentColors = isDark ? darkColors : colors;

  if (!isLoaded) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        themeMode,
        setThemeMode,
        colors: currentColors,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
