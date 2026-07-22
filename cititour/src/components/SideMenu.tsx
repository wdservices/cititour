import React, { useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions, ScrollView, Pressable, Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ChevronRight, Compass, Building2, Calendar, ShoppingBag, LayoutDashboard,
  Bookmark, Wallet, MessageCircle, Share2, MessageSquare, Settings, Headphones,
} from 'lucide-react-native';

const DRAWER_W = Math.min(Dimensions.get('window').width * 0.82, 320);
const BLUE = '#1E88E5';

interface MenuSection {
  title: string;
  items: Array<{ label: string; onPress: () => void; icon?: any }>;
}

interface SideMenuProps {
  visible: boolean;
  onClose: () => void;
  userName?: string;
  userEmail?: string;
  photoURL?: string | null;
  brandName?: string;
  sections: MenuSection[];
  onLogout: () => void;
}

export const SideMenu: React.FC<SideMenuProps> = ({
  visible, onClose, userName = 'User', userEmail = 'user@example.com', photoURL, brandName, sections, onLogout,
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
            {photoURL ? (
              <Image source={{ uri: photoURL }} style={styles.avatarImage} />
            ) : (
              <Text style={styles.avatarText}>
                {userName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)}
              </Text>
            )}
          </View>
          <Text style={styles.userName} numberOfLines={1}>{userName}</Text>
          <Text style={styles.userEmail} numberOfLines={1}>{userEmail}</Text>
          {brandName ? <Text style={styles.brandName}>{brandName}</Text> : null}
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
                  <View style={styles.menuItemLeft}>
                    {item.icon ? <item.icon size={18} color="#64748B" strokeWidth={2} /> : null}
                    <Text style={styles.menuLabel}>{item.label}</Text>
                  </View>
                  <ChevronRight size={16} color="#CBD5E1" strokeWidth={2} />
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
    overflow: 'hidden',
  },
  avatarImage: {
    width: 52, height: 52, borderRadius: 26,
  },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: '800' },
  userName: { color: '#fff', fontSize: 18, fontWeight: '700' },
  userEmail: { color: 'rgba(255,255,255,0.75)', fontSize: 13, marginTop: 2 },
  brandName: { color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: '600', marginTop: 6 },
  content: { flex: 1, paddingTop: 16 },
  sectionContainer: { marginBottom: 20 },
  sectionTitle: {
    fontSize: 10, fontWeight: '700', color: '#94A3B8',
    paddingHorizontal: 24, marginBottom: 6,
    textTransform: 'uppercase', letterSpacing: 0.8,
  },
  menuItem: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 24, paddingVertical: 11,
  },
  menuItemLeft: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
  },
  menuLabel: { fontSize: 13, fontWeight: '600', color: '#334155' },
  footer: { borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingHorizontal: 24, paddingTop: 16 },
  logoutBtn: { paddingVertical: 8, alignItems: 'center' },
  logoutText: { fontSize: 15, fontWeight: '600', color: '#EF4444' },
});

export default SideMenu;
