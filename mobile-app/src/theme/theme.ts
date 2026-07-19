/**
 * theme.ts — ported directly from src/index.css design tokens, so the
 * native app visually matches the live website exactly, not an older
 * version of the design system.
 */

export const colors = {
  background: '#F5F7FA',
  foreground: '#0F172A',

  card: '#FFFFFF',
  cardForeground: '#0F172A',

  primary: '#1E88E5',        // Beautiful Blue
  primaryForeground: '#FFFFFF',
  primaryLight: '#5FB0F0',
  primaryDark: '#1565B8',

  secondary: '#0F172A',
  secondaryForeground: '#FFFFFF',

  muted: '#EEF1F5',
  mutedForeground: '#64748B',

  accent: '#D9891F',         // Warm Marigold Yellow
  accentForeground: '#FFFFFF',

  success: '#10B981',
  successForeground: '#FFFFFF',

  destructive: '#EF4444',
  destructiveForeground: '#FFFFFF',

  border: '#E2E8F0',
};

// Dark theme — user-toggleable in Settings, not the default.
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
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const typography = {
  // Match these to whatever font files you load via expo-font — e.g.
  // 'ClashDisplay-Bold' for display, 'Inter-Regular'/'Inter-SemiBold' for body,
  // mirroring the web app's font-display / font-sans split.
  display: {
    fontFamily: 'System', // replace once custom fonts are loaded
    fontWeight: '800' as const,
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
    display: 34,
  },
};
