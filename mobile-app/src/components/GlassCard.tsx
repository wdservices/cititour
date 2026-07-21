import React from 'react';
import {
  View,
  ViewProps,
  StyleSheet,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { radius, glass } from '../theme/theme';

interface GlassCardProps extends ViewProps {
  intensity?: number;
  borderColor?: string;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  intensity = 20,
  borderColor,
  style,
  ...props
}) => {
  const { isDark } = useTheme();

  const glassOpacity = isDark ? glass.opacityDark : glass.opacity;
  const backgroundColor = isDark
    ? `rgba(18, 22, 31, ${glassOpacity})`
    : `rgba(255, 255, 255, ${glassOpacity})`;

  const borderColorValue =
    borderColor || (isDark ? 'rgba(255,255,255,0.2)' : glass.border);

  const styles = StyleSheet.create({
    glass: {
      backgroundColor,
      borderRadius: radius.sm,
      borderWidth: 1,
      borderColor: borderColorValue,
    },
  });

  return (
    <View
      style={[styles.glass, style]}
      {...props}
    />
  );
};

export default GlassCard;
