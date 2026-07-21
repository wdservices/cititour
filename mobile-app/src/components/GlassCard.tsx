import React from 'react';
import { View, ViewProps, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { radius } from '../theme/theme';

interface GlassCardProps extends ViewProps {
  borderColor?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({ borderColor, style, ...props }) => {
  const { isDark } = useTheme();
  const bg = isDark ? 'rgba(18,22,31,0.7)' : 'rgba(255,255,255,0.7)';
  const border = borderColor || (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.4)');

  return (
    <View
      style={[{ backgroundColor: bg, borderRadius: radius.sm, borderWidth: 1, borderColor: border }, style]}
      {...props}
    />
  );
};

export default GlassCard;
