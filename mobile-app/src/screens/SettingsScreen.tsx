import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sun, Moon, ChevronRight, Bell, Shield, HelpCircle, LogOut } from 'lucide-react-native';
import { colors, spacing, radius, typography } from '../theme/theme';
import { useAuth } from '../contexts/AuthContext';

export default function SettingsScreen() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <Text style={styles.title}>Settings</Text>

        <Text style={styles.sectionLabel}>Appearance</Text>
        <View style={styles.card}>
          <View style={styles.themeRow}>
            <TouchableOpacity
              style={[styles.themeOption, theme === 'light' && styles.themeOptionActive]}
              onPress={() => setTheme('light')}
            >
              <Sun size={20} color={theme === 'light' ? colors.primary : colors.mutedForeground} />
              <Text style={[styles.themeOptionText, theme === 'light' && styles.themeOptionTextActive]}>Light</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.themeOption, theme === 'dark' && styles.themeOptionActive]}
              onPress={() => setTheme('dark')}
            >
              <Moon size={20} color={theme === 'dark' ? colors.primary : colors.mutedForeground} />
              <Text style={[styles.themeOptionText, theme === 'dark' && styles.themeOptionTextActive]}>Dark</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.themeHint}>
            CitiTour is light by default — switch to dark if you prefer it.
          </Text>
        </View>

        <Text style={styles.sectionLabel}>Account</Text>
        <View style={styles.card}>
          {[
            { icon: Bell, label: 'Notifications' },
            { icon: Shield, label: 'Privacy & Security' },
            { icon: HelpCircle, label: 'Help & Support' },
          ].map((row, i) => (
            <TouchableOpacity key={row.label} style={[styles.row, i > 0 && styles.rowBorder]}>
              <row.icon size={18} color={colors.foreground} />
              <Text style={styles.rowLabel}>{row.label}</Text>
              <ChevronRight size={16} color={colors.mutedForeground} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.signOutButton} onPress={logout}>
          <LogOut size={18} color={colors.destructive} />
          <Text style={styles.signOutText}>Sign Out{user?.email ? ` (${user.email})` : ''}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { fontSize: typography.sizes.xxl, fontWeight: '800', color: colors.foreground, marginBottom: spacing.lg },
  sectionLabel: { fontSize: typography.sizes.xs, fontWeight: '700', color: colors.mutedForeground, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: spacing.sm },
  card: { backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, marginBottom: spacing.lg, overflow: 'hidden' },
  themeRow: { flexDirection: 'row', gap: spacing.sm, padding: spacing.md },
  themeOption: {
    flex: 1, alignItems: 'center', gap: 6, paddingVertical: spacing.md,
    borderRadius: radius.md, borderWidth: 2, borderColor: colors.border,
  },
  themeOptionActive: { borderColor: colors.primary, backgroundColor: colors.primary + '10' },
  themeOptionText: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.mutedForeground },
  themeOptionTextActive: { color: colors.primary },
  themeHint: { fontSize: typography.sizes.xs, color: colors.mutedForeground, paddingHorizontal: spacing.md, paddingBottom: spacing.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.md },
  rowBorder: { borderTopWidth: 1, borderTopColor: colors.border },
  rowLabel: { flex: 1, fontSize: typography.sizes.sm, color: colors.foreground },
  signOutButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.destructive + '40',
    borderRadius: radius.md, paddingVertical: spacing.md,
  },
  signOutText: { color: colors.destructive, fontWeight: '700', fontSize: typography.sizes.sm },
});
