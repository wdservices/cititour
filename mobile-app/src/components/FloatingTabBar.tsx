import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, radius, glass } from '../theme/theme';

export interface TabItem {
  name: string;
  icon: string;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabName: string) => void;
  style?: ViewStyle;
}

export const FloatingTabBar: React.FC<FloatingTabBarProps> = ({
  tabs,
  activeTab,
  onTabChange,
  style,
}) => {
  const { colors, isDark } = useTheme();

  const glassOpacity = isDark ? glass.opacityDark : glass.opacity;
  const backgroundColor = isDark
    ? `rgba(18, 22, 31, ${glassOpacity})`
    : `rgba(255, 255, 255, ${glassOpacity})`;

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: spacing.md,
      left: spacing.lg,
      right: spacing.lg,
      backgroundColor,
      borderRadius: radius.full,
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255,255,255,0.3)' : glass.border,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingVertical: spacing.sm,
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: isDark ? 0.4 : 0.15,
      shadowRadius: 16,
      elevation: 10,
    },
    tabButton: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: spacing.md,
      position: 'relative',
    },
    activePill: {
      position: 'absolute',
      width: '80%',
      height: '100%',
      backgroundColor: colors.primary,
      borderRadius: radius.full,
      zIndex: 1,
    },
    icon: {
      zIndex: 2,
    },
  });

  return (
    <View style={[styles.container, style]}>
      {tabs.map((tab) => {
        const isActive = tab.name === activeTab;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.tabButton}
            onPress={() => onTabChange(tab.name)}
            activeOpacity={0.7}
          >
            {isActive && <View style={styles.activePill} />}
            <Feather
              name={tab.icon as any}
              size={24}
              color={
                isActive ? colors.primaryForeground : colors.mutedForeground
              }
              style={styles.icon}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default FloatingTabBar;
