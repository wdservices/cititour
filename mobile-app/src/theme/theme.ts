/**
 * CitiTour — matches web app design tokens (index.css)
 */

export const colors = {
  background: '#F5F7FA',
  foreground: '#0F172A',

  card: '#FFFFFF',
  cardForeground: '#0F172A',

  primary: '#1E88E5',
  primaryForeground: '#FFFFFF',
  primaryLight: '#5FB0F0',
  primaryDark: '#1565B8',

  secondary: '#0F172A',
  secondaryForeground: '#FFFFFF',

  muted: '#EEF1F5',
  mutedForeground: '#64748B',

  accent: '#D9891F',
  accentForeground: '#FFFFFF',

  success: '#10B981',
  successForeground: '#FFFFFF',

  warning: '#F59E0B',
  warningForeground: '#FFFFFF',

  destructive: '#EF4444',
  destructiveForeground: '#FFFFFF',

  border: '#E2E8F0',
};

export const darkColors = {
  background: '#0B0E14',
  foreground: '#F4EFE6',

  card: '#12161F',
  cardForeground: '#F4EFE6',

  primary: '#5FB0F0',
  primaryForeground: '#0B0E14',
  primaryLight: '#8CC8F5',
  primaryDark: '#1E88E5',

  secondary: '#F4EFE6',
  secondaryForeground: '#0B0E14',

  muted: '#1B2028',
  mutedForeground: '#94A3B8',

  accent: '#F2A93B',
  accentForeground: '#0B0E14',

  success: '#34D399',
  successForeground: '#0B0E14',

  warning: '#FBBF24',
  warningForeground: '#0B0E14',

  destructive: '#F87171',
  destructiveForeground: '#0B0E14',

  border: '#2A3140',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radius = {
  xs: 8,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  full: 999,
};

export const typography = {
  display: {
    fontFamily: 'System',
    fontWeight: '800' as const,
    letterSpacing: -0.4,
  },
  body: {
    fontFamily: 'System',
    fontWeight: '400' as const,
  },
  sizes: {
    xs: 12,
    sm: 14,
    base: 16,
    lg: 18,
    xl: 22,
    xxl: 28,
    display: 32,
  },
};
