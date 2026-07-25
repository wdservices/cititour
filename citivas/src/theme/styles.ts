import { StyleSheet } from 'react-native';
import { spacing, radius, typography } from './theme';

export const commonStyles = StyleSheet.create({
  // Layout utilities
  flex: { flex: 1 },
  row: { flexDirection: 'row' as const },
  column: { flexDirection: 'column' as const },
  center: { justifyContent: 'center', alignItems: 'center' },
  spaceBetween: { justifyContent: 'space-between' },
  
  // Spacing utilities
  p4: { padding: spacing.md },
  p6: { padding: spacing.lg },
  px4: { paddingHorizontal: spacing.md },
  px6: { paddingHorizontal: spacing.lg },
  py4: { paddingVertical: spacing.md },
  py6: { paddingVertical: spacing.lg },
  
  // Common shadow
  shadow: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  
  shadowLarge: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
});

// Generate glass styles dynamically based on colors
export const getGlassStyle = (isDark: boolean, opacity: number) => ({
  backgroundColor: isDark
    ? `rgba(18, 22, 31, ${opacity})`
    : `rgba(255, 255, 255, ${opacity})`,
  borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.4)',
});
