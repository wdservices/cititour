import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  GestureResponderEvent,
} from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, radius, typography } from '../theme/theme';

type ButtonVariant = 'solid' | 'outline' | 'glass';
type ButtonSize = 'sm' | 'md' | 'lg';

interface GlassButtonProps {
  label: string;
  onPress: (event: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  color?: 'primary' | 'accent' | 'success' | 'destructive';
  disabled?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
  label,
  onPress,
  variant = 'solid',
  size = 'md',
  color = 'primary',
  disabled = false,
  style,
  textStyle,
}) => {
  const { colors, isDark } = useTheme();

  // Get the color value based on the color prop
  const getColorValue = (colorName: string) => {
    switch (colorName) {
      case 'primary':
        return colors.primary;
      case 'accent':
        return colors.accent;
      case 'success':
        return colors.success;
      case 'destructive':
        return colors.destructive;
      default:
        return colors.primary;
    }
  };

  const colorValue = getColorValue(color);
  const paddingMap = {
    sm: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
    md: { paddingVertical: spacing.md, paddingHorizontal: spacing.lg },
    lg: { paddingVertical: spacing.lg, paddingHorizontal: spacing.xl },
  };

  const padding = paddingMap[size];

  const styles = StyleSheet.create({
    solid: {
      backgroundColor: colorValue,
      borderRadius: radius.full,
      ...padding,
      opacity: disabled ? 0.6 : 1,
    },
    outline: {
      backgroundColor: 'transparent',
      borderColor: colorValue,
      borderWidth: 2,
      borderRadius: radius.full,
      ...padding,
      opacity: disabled ? 0.6 : 1,
    },
    glass: {
      backgroundColor: isDark
        ? 'rgba(18, 22, 31, 0.7)'
        : 'rgba(255, 255, 255, 0.7)',
      borderColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.4)',
      borderWidth: 1,
      borderRadius: radius.full,
      ...padding,
      opacity: disabled ? 0.6 : 1,
    },
    solidText: {
      color: colors.primaryForeground,
      fontSize: typography.sizes.base,
      fontWeight: '600' as const,
      textAlign: 'center',
      fontFamily: typography.body.fontFamily,
    },
    outlineText: {
      color: colorValue,
      fontSize: typography.sizes.base,
      fontWeight: '600' as const,
      textAlign: 'center',
      fontFamily: typography.body.fontFamily,
    },
    glassText: {
      color: isDark ? colors.foreground : colors.foreground,
      fontSize: typography.sizes.base,
      fontWeight: '600' as const,
      textAlign: 'center',
      fontFamily: typography.body.fontFamily,
    },
  });

  const variantStyle = styles[variant];
  const textVariantStyle = styles[`${variant}Text`];

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={[variantStyle, style]}
      activeOpacity={0.7}
    >
      <Text style={[textVariantStyle, textStyle]}>{label}</Text>
    </TouchableOpacity>
  );
};

export default GlassButton;
