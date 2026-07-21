import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, ScrollView, Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight } from 'lucide-react-native';

const DRAWER_W = Math.min(Dimensions.get('window').width * 0.82, 320);
const BLUE = '#1E88E5';

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
  const insets = useSafeAreaInsets();
  const slide = useRef(new Animated.Value(-DRAWER_W)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slide, {
        toValue: visible ? 0 : -DRAWER_W,
        duration: visible ? 280 : 220,
        useNativeDriver: true,
      }),
      Animated.timing(backdropOpacity, {
        toValue: visible ? 1 : 0,
        duration: visible ? 280 : 220,
        useNativeDriver: true,
      }),
    ]).start();
  }, [visible, slide, backdropOpacity]);

  if (!visible) return null;

  return (
    <View style={styles.absoluteFill}>
      <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
        <Pressable style={styles.backdropPress} onPress={onClose} />
      </Animated.View>

      <Animated.View
        style={[styles.drawer, { transform: [{ translateX: slide }] }]}
      >
        <View style={[styles.header, { paddingTop: insets.top + 24 }]}>
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
              <Text style={styles.sectionTitle}>{section.title}</Text>
              {section.items.map((item, itemIdx) => (
                <TouchableOpacity
                  key={itemIdx}
                  style={styles.menuItem}
                  onPress={item.onPress}
                  activeOpacity={0.6}
                >
                  <Text style={styles.menuLabel}>{item.label}</Text>
                  <ChevronRight size={16} color="#94A3B8" strokeWidth={2} />
                </TouchableOpacity>
              ))}
            </View>
          ))}
        </ScrollView>

        <View style={[styles.footer, { paddingBottom: insets.bottom + 16 }]}>
          <TouchableOpacity onPress={onLogout} activeOpacity={0.6} style={styles.logoutBtn}>
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  absoluteFill: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    elevation: 999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(15,23,42,0.45)',
  },
  backdropPress: {
    flex: 1,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: DRAWER_W,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 20,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 28,
    backgroundColor: BLUE,
  },
  avatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: '800' },
  userName: { color: '#fff', fontSize: 18, fontWeight: '700' },
  userEmail: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 2 },
  content: { flex: 1, paddingTop: 16 },
  sectionContainer: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 11, fontWeight: '700', color: '#94A3B8',
    paddingHorizontal: 24, marginBottom: 6,
    textTransform: 'uppercase', letterSpacing: 0.8,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingVertical: 14,
  },
  menuLabel: { fontSize: 15, fontWeight: '600', color: '#0F172A' },
  footer: { borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingHorizontal: 24, paddingTop: 16 },
  logoutBtn: { paddingVertical: 8, alignItems: 'center' },
  logoutText: { fontSize: 15, fontWeight: '600', color: '#EF4444' },
});

export default SideMenu;
