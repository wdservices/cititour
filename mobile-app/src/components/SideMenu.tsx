import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ViewStyle,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, radius, typography } from '../theme/theme';
import GlassCard from './GlassCard';
import GlassButton from './GlassButton';

interface MenuSection {
  title: string;
  items: Array<{
    icon: string;
    label: string;
    description: string;
    onPress: () => void;
  }>;
}

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  sections: MenuSection[];
  onLogout: () => void;
  style?: ViewStyle;
}

export const SideMenu: React.FC<SideMenuProps> = ({
  visible,
  onClose,
  userName = 'User',
  userEmail = 'user@example.com',
  userAvatar,
  sections,
  onLogout,
  style,
}) => {
  const { colors, isDark } = useTheme();

  const styles = StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: isDark
        ? 'rgba(0, 0, 0, 0.6)'
        : 'rgba(0, 0, 0, 0.4)',
    },
    drawerContainer: {
      width: '75%',
      height: '100%',
      backgroundColor: colors.background,
    },
    header: {
      backgroundColor: colors.primary,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.xl,
      paddingTop: spacing.xxl,
    },
    userSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    avatar: {
      width: 56,
      height: 56,
      borderRadius: radius.full,
      backgroundColor: colors.muted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      fontSize: typography.sizes.xl,
      fontWeight: '700' as const,
      color: colors.primary,
      fontFamily: typography.display.fontFamily,
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: typography.sizes.base,
      fontWeight: '700' as const,
      color: colors.primaryForeground,
      fontFamily: typography.display.fontFamily,
    },
    userEmail: {
      fontSize: typography.sizes.sm,
      color: 'rgba(255,255,255,0.9)',
      marginTop: 4,
      fontFamily: typography.body.fontFamily,
    },
    tagline: {
      fontSize: typography.sizes.xs,
      color: 'rgba(255,255,255,0.7)',
      marginTop: 2,
      fontFamily: typography.body.fontFamily,
    },
    content: {
      flex: 1,
      paddingVertical: spacing.lg,
    },
    sectionContainer: {
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      fontSize: typography.sizes.xs,
      fontWeight: '700' as const,
      color: colors.mutedForeground,
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.md,
      textTransform: 'uppercase' as const,
      letterSpacing: 0.5,
      fontFamily: typography.body.fontFamily,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      gap: spacing.md,
      marginHorizontal: spacing.md,
      marginVertical: spacing.xs,
      borderRadius: radius.md,
      backgroundColor: isDark
        ? 'rgba(255,255,255,0.05)'
        : 'rgba(30, 136, 229, 0.05)',
    },
    iconCircle: {
      width: 40,
      height: 40,
      borderRadius: radius.full,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    menuItemText: {
      flex: 1,
    },
    menuLabel: {
      fontSize: typography.sizes.base,
      fontWeight: '600' as const,
      color: colors.foreground,
      fontFamily: typography.body.fontFamily,
    },
    menuDescription: {
      fontSize: typography.sizes.xs,
      color: colors.mutedForeground,
      marginTop: 2,
      fontFamily: typography.body.fontFamily,
    },
    footer: {
      borderTopWidth: 1,
      borderTopColor: isDark ? 'rgba(255,255,255,0.1)' : colors.border,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
    },
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <TouchableOpacity
          style={styles.backdrop}
          onPress={onClose}
          activeOpacity={1}
        />
        <View style={styles.drawerContainer}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.userSection}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {userName
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .toUpperCase()}
                </Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{userName}</Text>
                <Text style={styles.userEmail}>{userEmail}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 }}>
                  <View
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: radius.full,
                      backgroundColor: '#34D399',
                    }}
                  />
                  <Text style={styles.tagline}>CitiTour Explorer</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Menu Items */}
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {sections.map((section, idx) => (
              <View key={idx} style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>{section.title}</Text>
                {section.items.map((item, itemIdx) => (
                  <TouchableOpacity
                    key={itemIdx}
                    style={styles.menuItem}
                    onPress={item.onPress}
                    activeOpacity={0.7}
                  >
                    <View style={styles.iconCircle}>
                      <Feather
                        name={item.icon as any}
                        size={20}
                        color={colors.primaryForeground}
                      />
                    </View>
                    <View style={styles.menuItemText}>
                      <Text style={styles.menuLabel}>{item.label}</Text>
                      <Text style={styles.menuDescription}>
                        {item.description}
                      </Text>
                    </View>
                    <Feather
                      name="chevron-right"
                      size={20}
                      color={colors.mutedForeground}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <GlassButton
              label="Log Out"
              onPress={onLogout}
              variant="glass"
              color="destructive"
              style={{ width: '100%' }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SideMenu;
