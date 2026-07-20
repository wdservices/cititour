import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, radius, typography, glass } from '../theme/theme';
import GlassHeader from '../components/GlassHeader';
import GlassCard from '../components/GlassCard';
import { useAuth } from '../contexts/AuthContext';

export default function SettingsScreen() {
  const { colors, isDark, themeMode, setThemeMode } = useTheme();
  const { user, logout } = useAuth();

  const glassOpacity = isDark ? glass.opacityDark : glass.opacity;
  const cardBackgroundColor = isDark
    ? `rgba(18, 22, 31, ${glassOpacity})`
    : `rgba(255, 255, 255, ${glassOpacity})`;
  const cardBorderColor = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.4)';

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
    sectionLabel: {
      fontSize: typography.sizes.xs, fontWeight: '700', color: colors.mutedForeground,
      textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: spacing.md, marginTop: spacing.lg,
      fontFamily: typography.body.fontFamily,
    },
    themeRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.lg },
    themeOption: {
      flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.sm, paddingVertical: spacing.lg,
      borderRadius: radius.lg, borderWidth: 2, borderColor: cardBorderColor,
      backgroundColor: 'transparent',
    },
    themeOptionActive: {
      borderColor: colors.primary,
      backgroundColor: isDark
        ? 'rgba(94, 176, 240, 0.15)'
        : 'rgba(30, 136, 229, 0.1)',
    },
    themeOptionIcon: { fontSize: 28 },
    themeOptionText: {
      fontSize: typography.sizes.sm, fontWeight: '600', color: colors.mutedForeground,
      fontFamily: typography.body.fontFamily,
    },
    themeOptionTextActive: { color: colors.primary },
    settingRow: {
      flexDirection: 'row', alignItems: 'center', gap: spacing.md, paddingHorizontal: spacing.md, paddingVertical: spacing.md,
      backgroundColor: cardBackgroundColor, borderWidth: 1, borderColor: cardBorderColor,
      borderRadius: radius.lg, marginBottom: spacing.md,
    },
    settingIcon: { width: 40, height: 40, borderRadius: radius.full, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
    settingLabel: {
      flex: 1, fontSize: typography.sizes.base, fontWeight: '600', color: colors.foreground,
      fontFamily: typography.body.fontFamily,
    },
    signOutButton: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.md,
      backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.1)',
      borderWidth: 1, borderColor: isDark ? 'rgba(239, 68, 68, 0.3)' : 'rgba(239, 68, 68, 0.2)',
      borderRadius: radius.lg, paddingVertical: spacing.lg, marginTop: spacing.xl,
    },
    signOutText: {
      color: colors.destructive, fontWeight: '700', fontSize: typography.sizes.base,
      fontFamily: typography.body.fontFamily,
    },
  });

  const settings = [
    { icon: 'bell', label: 'Notifications' },
    { icon: 'shield', label: 'Privacy & Security' },
    { icon: 'help-circle', label: 'Help & Support' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <GlassHeader title="Settings" subtitle="Account & Preferences" leftIcon="menu" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>Appearance</Text>
        <View style={styles.themeRow}>
          {['light', 'dark', 'auto'].map((mode) => (
            <TouchableOpacity
              key={mode}
              style={[
                styles.themeOption,
                themeMode === mode && styles.themeOptionActive,
              ]}
              onPress={() => setThemeMode(mode as 'light' | 'dark' | 'auto')}
            >
              <Text style={styles.themeOptionIcon}>
                {mode === 'light' && '☀️'}
                {mode === 'dark' && '🌙'}
                {mode === 'auto' && '⚙️'}
              </Text>
              <Text
                style={[
                  styles.themeOptionText,
                  themeMode === mode && styles.themeOptionTextActive,
                ]}
              >
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionLabel}>Account</Text>
        {settings.map((setting) => (
          <TouchableOpacity
            key={setting.label}
            style={styles.settingRow}
            activeOpacity={0.7}
          >
            <View style={styles.settingIcon}>
              <Feather name={setting.icon as any} size={18} color={colors.primaryForeground} />
            </View>
            <Text style={styles.settingLabel}>{setting.label}</Text>
            <Feather name="chevron-right" size={20} color={colors.mutedForeground} />
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={styles.signOutButton} onPress={logout}>
          <Feather name="log-out" size={20} color={colors.destructive} />
          <Text style={styles.signOutText}>
            Sign Out{user?.email ? ` (${user.email})` : ''}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
