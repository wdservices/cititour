import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ScrollView,
} from 'react-native';
import {
  Sun, Moon, Bell, Shield, CreditCard, HelpCircle, LogOut, ChevronRight,
} from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import GlassHeader from '../components/GlassHeader';

const BLUE = '#1E88E5';

const accountSettings = [
  { icon: Bell, label: 'Notifications', color: BLUE },
  { icon: Shield, label: 'Privacy & Safety', color: BLUE },
  { icon: CreditCard, label: 'Payment Methods', color: BLUE },
  { icon: HelpCircle, label: 'Help & Support', color: BLUE },
];

export default function SettingsScreen() {
  const { colors, themeMode, setThemeMode } = useTheme();
  const { user, logout } = useAuth();

  return (
    <View style={s.container}>
      <GlassHeader title="Tour Lagos" />

      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Large title */}
        <Text style={s.bigTitle}>Settings</Text>
        <Text style={s.subtitle}>Manage your account preferences and app experience.</Text>

        {/* Appearance */}
        <Text style={s.sectionTitle}>⚙️  Appearance</Text>
        <View style={s.themeRow}>
          {(['light', 'dark'] as const).map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[s.themeCard, themeMode === mode && s.themeCardActive]}
              onPress={() => setThemeMode(mode)}
              activeOpacity={0.7}
            >
              <View style={s.themeIconWrap}>
                {mode === 'light' ? (
                  <Sun size={28} color={BLUE} strokeWidth={1.5} />
                ) : (
                  <Moon size={28} color="#94A3B8" strokeWidth={1.5} />
                )}
              </View>
              {themeMode === mode && (
                <View style={s.themeCheck}>
                  <Text style={s.themeCheckText}>✓</Text>
                </View>
              )}
              <Text style={[s.themeLabel, themeMode === mode && s.themeLabelActive]}>
                {mode === 'light' ? 'Light Mode' : 'Dark Mode'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Account */}
        <Text style={s.sectionTitle}>👤  Account</Text>
        <View style={s.accountCard}>
          {accountSettings.map((item, i) => (
            <TouchableOpacity
              key={item.label}
              style={[s.accountRow, i < accountSettings.length - 1 && s.accountRowBorder]}
              activeOpacity={0.7}
            >
              <View style={[s.accountIcon, { backgroundColor: item.color + '12' }]}>
                <item.icon size={20} color={item.color} strokeWidth={2} />
              </View>
              <Text style={s.accountLabel}>{item.label}</Text>
              <ChevronRight size={18} color="#CBD5E1" strokeWidth={2} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Log Out */}
        <TouchableOpacity style={s.logoutBtn} onPress={logout} activeOpacity={0.7}>
          <LogOut size={20} color="#EF4444" strokeWidth={2} />
          <Text style={s.logoutText}>Log Out</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={s.version}>Version 2.4.0 (Build 892)</Text>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },

  bigTitle: {
    fontSize: 32, fontWeight: '800', color: BLUE, marginTop: 8, marginBottom: 6,
  },
  subtitle: { fontSize: 14, color: '#64748B', lineHeight: 20, marginBottom: 28 },

  sectionTitle: {
    fontSize: 18, fontWeight: '700', color: '#0F172A', marginBottom: 14,
  },

  /* Theme */
  themeRow: { flexDirection: 'row', gap: 14, marginBottom: 28 },
  themeCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 18, paddingVertical: 24,
    alignItems: 'center', gap: 10,
    borderWidth: 2, borderColor: '#E2E8F0',
    position: 'relative',
  },
  themeCardActive: { borderColor: BLUE },
  themeIconWrap: {
    width: 60, height: 60, borderRadius: 30,
    borderWidth: 2, borderStyle: 'dashed' as const,
    borderColor: '#E2E8F0',
    alignItems: 'center', justifyContent: 'center',
  },
  themeCheck: {
    position: 'absolute', top: 10, right: 10,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: BLUE, alignItems: 'center', justifyContent: 'center',
  },
  themeCheckText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  themeLabel: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  themeLabelActive: { color: BLUE },

  /* Account */
  accountCard: {
    backgroundColor: '#fff', borderRadius: 18, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  accountRow: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    paddingHorizontal: 16, paddingVertical: 16,
  },
  accountRowBorder: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  accountIcon: {
    width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center',
  },
  accountLabel: { flex: 1, fontSize: 15, fontWeight: '600', color: '#0F172A' },

  /* Logout */
  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
    borderWidth: 1.5, borderColor: 'rgba(239,68,68,0.25)',
    borderRadius: 16, paddingVertical: 16, marginTop: 28,
    backgroundColor: 'rgba(239,68,68,0.04)',
  },
  logoutText: { fontSize: 16, fontWeight: '700', color: '#EF4444' },

  version: {
    fontSize: 12, color: '#94A3B8', textAlign: 'center', marginTop: 16,
  },
});
