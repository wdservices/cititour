import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../contexts/ThemeContext';

const DRAWER_W = Math.min(Dimensions.get('window').width * 0.82, 320);

interface MenuSection {
  title: string;
  items: Array<{ label: string; onPress: () => void }>;
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
  visible, onClose, userName = 'User', userEmail = 'user@example.com', sections, onLogout,
}) => {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const slide = useRef(new Animated.Value(-DRAWER_W)).current;

  useEffect(() => {
    Animated.timing(slide, {
      toValue: visible ? 0 : -DRAWER_W,
      duration: visible ? 280 : 220,
      useNativeDriver: true,
    }).start();
  }, [visible, slide]);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View
        style={[
          styles.drawer,
          { width: DRAWER_W, backgroundColor: colors.background, transform: [{ translateX: slide }] },
        ]}
      >
        <View style={[styles.header, { paddingTop: insets.top + 24, backgroundColor: colors.primary }]}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {userName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
            </Text>
          </View>
          <Text style={styles.userName} numberOfLines={1}>{userName}</Text>
          <Text style={styles.userEmail} numberOfLines={1}>{userEmail}</Text>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {sections.map((section, idx) => (
            <View key={idx} style={styles.sectionContainer}>
              <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>{section.title}</Text>
              {section.items.map((item, itemIdx) => (
                <TouchableOpacity
                  key={itemIdx}
                  style={styles.menuItem}
                  onPress={item.onPress}
                  activeOpacity={0.5}
                >
                  <Text style={[styles.menuLabel, { color: colors.foreground }]}>{item.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>

        <View style={[styles.footer, { borderTopColor: colors.border, paddingBottom: insets.bottom + 16 }]}>
          <TouchableOpacity onPress={onLogout} activeOpacity={0.5} style={styles.logoutBtn}>
            <Text style={[styles.logoutText, { color: colors.destructive }]}>Log out</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <TouchableOpacity
        style={styles.backdrop}
        onPress={onClose}
        activeOpacity={1}
        accessibilityLabel="Close menu"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: { flex: 1, flexDirection: 'row' },
  drawer: { height: '100%' },
  backdrop: { flex: 1, backgroundColor: 'rgba(15,23,42,0.45)' },
  header: { paddingHorizontal: 24, paddingBottom: 28 },
  avatar: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  userName: { color: '#fff', fontSize: 18, fontWeight: '700' },
  userEmail: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 2 },
  content: { flex: 1, paddingTop: 16 },
  sectionContainer: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 11, fontWeight: '700',
    paddingHorizontal: 24, marginBottom: 8,
    textTransform: 'uppercase', letterSpacing: 0.8,
  },
  menuItem: { paddingHorizontal: 24, paddingVertical: 13 },
  menuLabel: { fontSize: 15, fontWeight: '500' },
  footer: { borderTopWidth: 1, paddingHorizontal: 24, paddingTop: 16 },
  logoutBtn: { paddingVertical: 8 },
  logoutText: { fontSize: 15, fontWeight: '600' },
});

export default SideMenu;
