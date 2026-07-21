import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Hotel, UtensilsCrossed, CalendarDays, MapPin,
  ShoppingBag, Heart, ShoppingCart, Smile,
} from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { radius } from '../theme/theme';

type StampCategory = 'hotels' | 'restaurants' | 'events' | 'attractions' | 'fun' | 'marketplace' | 'lifestyle' | 'shopping';

const iconMap: Record<StampCategory, React.ComponentType<any>> = {
  hotels: Hotel,
  restaurants: UtensilsCrossed,
  events: CalendarDays,
  attractions: MapPin,
  fun: Smile,
  marketplace: ShoppingBag,
  lifestyle: Heart,
  shopping: ShoppingCart,
};

const colorMap: Record<StampCategory, string> = {
  hotels: '#1E88E5',
  restaurants: '#D9891F',
  events: '#10B981',
  attractions: '#1E88E5',
  fun: '#D9891F',
  marketplace: '#EF4444',
  lifestyle: '#1E88E5',
  shopping: '#D9891F',
};

interface PassportStampIconProps {
  category: StampCategory;
  size?: number;
}

export const PassportStampIcon: React.FC<PassportStampIconProps> = ({
  category,
  size = 60,
}) => {
  const { isDark } = useTheme();
  const color = colorMap[category];
  const IconComponent = iconMap[category];

  const styles = StyleSheet.create({
    container: { width: size, height: size, alignItems: 'center', justifyContent: 'center' },
    stamp: {
      width: size,
      height: size,
      borderRadius: radius.full,
      borderWidth: 2,
      borderStyle: 'dashed' as const,
      borderColor: color,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: isDark ? 'rgba(18,22,31,0.5)' : 'rgba(255,255,255,0.5)',
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.stamp}>
        <IconComponent size={size * 0.45} color={color} strokeWidth={2} />
      </View>
    </View>
  );
};

export default PassportStampIcon;
