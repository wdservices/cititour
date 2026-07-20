import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, radius, typography, glass } from '../theme/theme';

interface GlassHeaderProps {
  title: string;
  subtitle?: string;
  leftIcon?: string;
  rightIcon?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  style?: ViewStyle;
  locationPill?: string;
}

export const GlassHeader: React.FC<GlassHeaderProps> = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  style,
  locationPill,
}) => {
  const { colors, isDark } = useTheme();

  const glassOpacity = isDark ? glass.opacityDark : glass.opacity;
  const backgroundColor = isDark
    ? `rgba(18, 22, 31, ${glassOpacity})`
    : `rgba(255, 255, 255, ${glassOpacity})`;

  const styles = StyleSheet.create({
    header: {
      backgroundColor,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : glass.border,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    leftSection: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    centerSection: {
      flex: 2,
    },
    rightSection: {
      flex: 1,
      alignItems: 'flex-end',
    },
    titleText: {
      fontSize: typography.sizes.xl,
      fontWeight: '700' as const,
      color: colors.foreground,
      fontFamily: typography.display.fontFamily,
    },
    subtitleText: {
      fontSize: typography.sizes.sm,
      color: colors.mutedForeground,
      marginTop: 4,
      fontFamily: typography.body.fontFamily,
    },
    iconButton: {
      padding: spacing.sm,
    },
    locationPill: {
      backgroundColor: isDark
        ? 'rgba(255,255,255,0.2)'
        : `rgba(${colors.primary}, 0.1)`,
      borderRadius: radius.full,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    locationText: {
      fontSize: typography.sizes.xs,
      color: colors.primary,
      fontWeight: '600' as const,
      fontFamily: typography.body.fontFamily,
    },
  });

  return (
    <View style={[styles.header, style]}>
      <View style={styles.leftSection}>
        {leftIcon && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onLeftPress}
          >
            <Feather
              name={leftIcon as any}
              size={24}
              color={colors.foreground}
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.centerSection}>
        <Text style={styles.titleText}>{title}</Text>
        {subtitle && <Text style={styles.subtitleText}>{subtitle}</Text>}
      </View>

      <View style={styles.rightSection}>
        {locationPill && (
          <View style={styles.locationPill}>
            <Feather name="map-pin" size={14} color={colors.primary} />
            <Text style={styles.locationText}>{locationPill}</Text>
          </View>
        )}
        {rightIcon && !locationPill && (
          <TouchableOpacity
            style={styles.iconButton}
            onPress={onRightPress}
          >
            <Feather
              name={rightIcon as any}
              size={24}
              color={colors.foreground}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default GlassHeader;
