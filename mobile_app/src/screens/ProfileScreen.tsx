import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: () => logout() },
    ]);
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <View style={styles.centered}>
          <Ionicons name="person-outline" size={64} color="#ccc" />
          <Text style={styles.emptyTitle}>Not signed in</Text>
          <Text style={styles.emptySub}>Sign in to access your dashboard</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.avatarSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {(user.displayName || user.email || '?')[0].toUpperCase()}
          </Text>
        </View>
        <Text style={styles.userName}>{user.displayName || 'User'}</Text>
        <Text style={styles.userEmail}>{user.email}</Text>
      </View>

      <View style={styles.menuSection}>
        {[
          { icon: 'briefcase', label: 'My Listings', desc: 'Manage your businesses & products' },
          { icon: 'calendar', label: 'My Events', desc: 'View your organized events' },
          { icon: 'wallet', label: 'Wallet', desc: 'Manage your funds' },
          { icon: 'heart', label: 'Favorites', desc: 'Your saved listings' },
          { icon: 'document-text', label: 'My Tickets', desc: 'Event tickets you purchased' },
        ].map((item) => (
          <TouchableOpacity key={item.label} style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuIcon}>
              <Ionicons name={item.icon as any} size={20} color="#D4A017" />
            </View>
            <View style={styles.menuText}>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuDesc}>{item.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color="#ccc" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout} activeOpacity={0.7}>
        <Ionicons name="log-out-outline" size={18} color="#E53935" />
        <Text style={styles.logoutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  header: { paddingTop: 60, paddingHorizontal: 16, paddingBottom: 16 },
  title: { fontSize: 28, fontWeight: '800', color: '#1A1A1A' },
  avatarSection: { alignItems: 'center', paddingVertical: 24, gap: 8 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#D4A017', alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 28, fontWeight: '800', color: '#fff' },
  userName: { fontSize: 18, fontWeight: '700', color: '#1A1A1A' },
  userEmail: { fontSize: 13, color: '#888' },
  menuSection: { paddingHorizontal: 16, gap: 2 },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    gap: 12,
  },
  menuIcon: { width: 40, height: 40, borderRadius: 10, backgroundColor: '#FFF3D6', alignItems: 'center', justifyContent: 'center' },
  menuText: { flex: 1 },
  menuLabel: { fontSize: 14, fontWeight: '600', color: '#1A1A1A' },
  menuDesc: { fontSize: 11, color: '#888', marginTop: 2 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 24,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#FEE2E2',
  },
  logoutText: { fontSize: 14, fontWeight: '600', color: '#E53935' },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#999' },
  emptySub: { fontSize: 13, color: '#ccc' },
});
