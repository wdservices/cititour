import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { radius } from '../theme/theme';

type StampCategory = 'hotels' | 'restaurants' | 'events' | 'attractions' | 'fun' | 'marketplace' | 'lifestyle' | 'shopping';

interface PassportStampIconProps {
  category: StampCategory;
  size?: number;
  style?: ViewStyle;
}

const getCategoryColor = (category: StampCategory, colors: any): string => {
  const colorMap: Record<StampCategory, string> = {
    hotels: colors.primary,
    restaurants: colors.accent,
    events: colors.success,
    attractions: colors.primary,
    fun: colors.accent,
    marketplace: colors.destructive,
    lifestyle: colors.primary,
    shopping: colors.accent,
  };
  return colorMap[category];
};

const getCategoryIcon = (category: StampCategory): string => {
  const iconMap: Record<StampCategory, string> = {
    hotels: 'home',
    restaurants: 'utensils',
    events: 'calendar',
    attractions: 'map-pin',
    fun: 'smile',
    marketplace: 'shopping-bag',
    lifestyle: 'heart',
    shopping: 'shopping-cart',
  };
  return iconMap[category];
};

export const PassportStampIcon: React.FC<PassportStampIconProps> = ({
  category,
  size = 60,
  style,
}) => {
  const { colors, isDark } = useTheme();
  const color = getCategoryColor(category, colors);
  const icon = getCategoryIcon(category);

  const styles = StyleSheet.create({
    container: {
      width: size,
      height: size,
      alignItems: 'center',
      justifyContent: 'center',
    },
    stamp: {
      width: size,
      height: size,
      borderRadius: radius.full,
      borderWidth: 2,
      borderStyle: 'dashed' as const,
      borderColor: color,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark
        ? 'rgba(18, 22, 31, 0.5)'
        : 'rgba(255, 255, 255, 0.5)',
    },
  });

  return (
    <View style={[styles.container, style]}>
      <View style={styles.stamp}>
        <Feather name={icon as any} size={size * 0.5} color={color} />
      </View>
    </View>
  );
};

export default PassportStampIcon;
