import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Sun, Moon, ChevronRight, LogOut, ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useMainNavigation } from '../contexts/MainNavigationContext';
import { useAuth } from '../contexts/AuthContext';

export default function SettingsScreen() {
  const { colors, themeMode, setThemeMode } = useTheme();
  const { user, logout } = useAuth();
  const insets = useSafeAreaInsets();
  const { setActiveTab } = useMainNavigation();

  const accountItems = [
    { label: 'Notifications' },
    { label: 'Privacy & Safety' },
    { label: 'Payment Methods' },
    { label: 'Help & Support' },
  ];

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <View style={[s.header, { paddingTop: insets.top + 6, borderBottomColor: colors.border }]}>
        <View style={s.headerRow}>
          <TouchableOpacity onPress={() => setActiveTab('explore')} style={s.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <ArrowLeft size={22} color={colors.foreground} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={[s.headerTitle, { color: colors.foreground }]}>Settings</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={[s.scrollContent, { paddingBottom: insets.bottom + 100 }]} showsVerticalScrollIndicator={false}>
        {/* Profile card */}
        <View style={[s.profileCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[s.profileAvatar, { backgroundColor: colors.primary }]}>
            <Text style={s.profileAvatarText}>
              {user?.name?.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) || 'U'}
            </Text>
          </View>
          <View style={s.profileInfo}>
            <Text style={[s.profileName, { color: colors.foreground }]} numberOfLines={1}>{user?.name || 'User'}</Text>
            <Text style={[s.profileEmail, { color: colors.mutedForeground }]} numberOfLines={1}>{user?.email || 'user@example.com'}</Text>
          </View>
        </View>

        {/* Appearance */}
        <Text style={[s.sectionTitle, { color: colors.mutedForeground }]}>Appearance</Text>
        <View style={[s.themeRow, { gap: 12 }]}>
          {(['light', 'dark'] as const).map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                s.themeCard,
                { backgroundColor: colors.card, borderColor: themeMode === mode ? colors.primary : colors.border },
              ]}
              onPress={() => setThemeMode(mode)}
              activeOpacity={0.7}
            >
              {mode === 'light'
                ? <Sun size={22} color={colors.primary} strokeWidth={1.75} />
                : <Moon size={22} color={colors.mutedForeground} strokeWidth={1.75} />}
              <Text style={[s.themeLabel, { color: themeMode === mode ? colors.primary : colors.mutedForeground }]}>
                {mode === 'light' ? 'Light' : 'Dark'}
              </Text>
              {themeMode === mode && <View style={[s.themeDot, { backgroundColor: colors.primary }]} />}
            </TouchableOpacity>
          ))}
        </View>

        {/* Account */}
        <Text style={[s.sectionTitle, { color: colors.mutedForeground }]}>Account</Text>
        <View style={[s.accountCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {accountItems.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={[s.accountRow, i < accountItems.length - 1 && { borderBottomColor: colors.border, borderBottomWidth: 1 }]}
              activeOpacity={0.6}
            >
              <Text style={[s.accountLabel, { color: colors.foreground }]}>{item.label}</Text>
              <ChevronRight size={18} color={colors.mutedForeground} strokeWidth={2} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={[s.logoutBtn, { borderColor: `${colors.destructive}40`, backgroundColor: `${colors.destructive}08` }]}
          onPress={logout}
          activeOpacity={0.7}
        >
          <LogOut size={19} color={colors.destructive} strokeWidth={2} />
          <Text style={[s.logoutText, { color: colors.destructive }]}>Log Out</Text>
        </TouchableOpacity>

        <Text style={[s.version, { color: colors.mutedForeground }]}>Version 2.4.0</Text>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 10, borderBottomWidth: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 20 },

  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 14, borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 28 },
  profileAvatar: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  profileAvatarText: { color: '#fff', fontSize: 18, fontWeight: '800' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 16, fontWeight: '700' },
  profileEmail: { fontSize: 13, marginTop: 2 },

  sectionTitle: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 12, marginTop: 8 },
  themeRow: { flexDirection: 'row', marginBottom: 28 },
  themeCard: { flex: 1, borderRadius: 14, borderWidth: 1.5, paddingVertical: 20, alignItems: 'center', gap: 8, position: 'relative' },
  themeLabel: { fontSize: 14, fontWeight: '600' },
  themeDot: { position: 'absolute', top: 10, right: 10, width: 8, height: 8, borderRadius: 4 },

  accountCard: { borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  accountRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 15 },
  accountLabel: { fontSize: 15, fontWeight: '500' },

  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, borderWidth: 1.5, borderRadius: 14, paddingVertical: 15, marginTop: 28 },
  logoutText: { fontSize: 16, fontWeight: '700' },

  version: { fontSize: 12, textAlign: 'center', marginTop: 20 },
});
