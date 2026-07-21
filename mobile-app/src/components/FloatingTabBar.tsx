import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Compass, CalendarDays, Bookmark, MessageCircle, User,
} from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';

const iconMap: Record<string, React.ComponentType<any>> = {
  compass: Compass,
  calendar: CalendarDays,
  bookmark: Bookmark,
  'message-circle': MessageCircle,
  user: User,
};

export interface TabItem {
  name: string;
  icon: string;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabName: string) => void;
}

export const FloatingTabBar: React.FC<FloatingTabBarProps> = ({
  tabs,
  activeTab,
  onTabChange,
}) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const bottomPad = Math.max(insets.bottom, Platform.OS === 'ios' ? 8 : 6);

  const barBg = isDark ? 'rgba(24, 24, 27, 0.92)' : 'rgba(255, 255, 255, 0.92)';
  const borderColor = colors.border;
  const activeColor = isDark ? '#FAFAFA' : colors.primary;
  const inactive = colors.mutedForeground;

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom: bottomPad,
          backgroundColor: barBg,
          borderTopColor: borderColor,
        },
      ]}
    >
      {tabs.map((tab) => {
        const isActive = tab.name === activeTab;
        const IconComponent = iconMap[tab.icon] || Compass;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabButton}
            onPress={() => onTabChange(tab.name)}
            activeOpacity={0.65}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
          >
            {isActive && (
              <View
                style={[
                  styles.activePill,
                  { backgroundColor: isDark ? 'rgba(250,250,250,0.08)' : 'rgba(9,9,11,0.06)' },
                ]}
              />
            )}
            <IconComponent
              size={22}
              color={isActive ? activeColor : inactive}
              strokeWidth={isActive ? 2.25 : 1.75}
            />
            {isActive && <View style={[styles.dot, { backgroundColor: activeColor }]} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 6,
    position: 'relative',
    minHeight: 48,
  },
  activePill: {
    position: 'absolute',
    width: 44,
    height: 36,
    borderRadius: 12,
    top: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    marginTop: 4,
  },
});

export default FloatingTabBar;
