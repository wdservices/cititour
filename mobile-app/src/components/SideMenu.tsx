import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Modal, Animated, Dimensions, ScrollView,
} from 'react-native';
import {
  Compass, CalendarDays, ShoppingBag, MessageCircle,
  Wallet, Settings, ChevronRight, Heart,
  HelpCircle, LayoutDashboard, Share2, MessageSquare,
} from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, radius, typography } from '../theme/theme';
import GlassButton from './GlassButton';

const DRAWER_W = Math.min(Dimensions.get('window').width * 0.82, 320);

const iconMap: Record<string, React.ComponentType<any>> = {
  compass: Compass,
  calendar: CalendarDays,
  'shopping-bag': ShoppingBag,
  'message-circle': MessageCircle,
  wallet: Wallet,
  settings: Settings,
  heart: Heart,
  'help-circle': HelpCircle,
  'layout-dashboard': LayoutDashboard,
  'share-2': Share2,
  'message-square': MessageSquare,
};

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
  sections: MenuSection[];
  onLogout: () => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({
  visible,
  onClose,
  userName = 'User',
  userEmail = 'user@example.com',
  sections,
  onLogout,
}) => {
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const slide = useRef(new Animated.Value(-DRAWER_W)).current;

  useEffect(() => {
    Animated.timing(slide, {
      toValue: visible ? 0 : -DRAWER_W,
      duration: visible ? 280 : 220,
      useNativeDriver: true,
    }).start();
  }, [visible, slide]);

  if (!visible) {
    return null;
  }

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.drawer,
            {
              width: DRAWER_W,
              transform: [{ translateX: slide }],
              backgroundColor: colors.background,
            },
          ]}
        >
          <View style={[styles.header, { paddingTop: insets.top + spacing.lg, backgroundColor: colors.primary }]}>
            <View style={styles.userSection}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {userName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
                </Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{userName}</Text>
                <Text style={styles.userEmail}>{userEmail}</Text>
                <View style={styles.taglineRow}>
                  <View style={styles.onlineDot} />
                  <Text style={styles.tagline}>CitiTour Explorer</Text>
                </View>
              </View>
            </View>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {sections.map((section, idx) => (
              <View key={idx} style={styles.sectionContainer}>
                <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>{section.title}</Text>
                {section.items.map((item, itemIdx) => {
                  const IconComp = iconMap[item.icon] || Compass;
                  return (
                    <TouchableOpacity
                      key={itemIdx}
                      style={[
                        styles.menuItem,
                        {
                          backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(30,136,229,0.06)',
                        },
                      ]}
                      onPress={item.onPress}
                      activeOpacity={0.7}
                    >
                      <View style={[styles.iconCircle, { backgroundColor: colors.primary }]}>
                        <IconComp size={18} color="#fff" strokeWidth={2} />
                      </View>
                      <View style={styles.menuItemText}>
                        <Text style={[styles.menuLabel, { color: colors.foreground }]}>{item.label}</Text>
                        <Text style={[styles.menuDescription, { color: colors.mutedForeground }]}>
                          {item.description}
                        </Text>
                      </View>
                      <ChevronRight size={18} color={colors.mutedForeground} strokeWidth={2} />
                    </TouchableOpacity>
                  );
                })}
              </View>
            ))}
          </ScrollView>

          <View style={[styles.footer, { borderTopColor: colors.border, paddingBottom: insets.bottom + spacing.md }]}>
            <GlassButton
              label="Log Out"
              onPress={onLogout}
              variant="glass"
              color="destructive"
              style={{ width: '100%' }}
            />
          </View>
        </Animated.View>

        <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} accessibilityLabel="Close menu" />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    flexDirection: 'row',
  },
  drawer: {
    height: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 16,
    zIndex: 2,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
  },
  userSection: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: typography.sizes.lg,
    fontWeight: '700',
    color: '#fff',
  },
  userInfo: { flex: 1 },
  userName: { fontSize: typography.sizes.base, fontWeight: '700', color: '#fff' },
  userEmail: { fontSize: typography.sizes.sm, color: 'rgba(255,255,255,0.85)', marginTop: 2 },
  taglineRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  onlineDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#34D399' },
  tagline: { fontSize: typography.sizes.xs, color: 'rgba(255,255,255,0.75)' },
  content: { flex: 1, paddingVertical: spacing.md },
  sectionContainer: { marginBottom: spacing.lg },
  sectionTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: '700',
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
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
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuItemText: { flex: 1 },
  menuLabel: { fontSize: typography.sizes.base, fontWeight: '600' },
  menuDescription: { fontSize: typography.sizes.xs, marginTop: 2 },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
});

export default SideMenu;
