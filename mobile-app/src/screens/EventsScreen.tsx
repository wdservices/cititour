import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, radius, typography, glass } from '../theme/theme';
import GlassHeader from '../components/GlassHeader';
import GlassButton from '../components/GlassButton';

const filters = ['All', 'Food & Drink', 'Music', 'Business', 'Sports'];

export default function EventsScreen() {
  const { colors, isDark } = useTheme();
  const [activeFilter, setActiveFilter] = useState('All');

  const glassOpacity = isDark ? glass.opacityDark : glass.opacity;
  const cardBackgroundColor = isDark
    ? `rgba(18, 22, 31, ${glassOpacity})`
    : `rgba(255, 255, 255, ${glassOpacity})`;
  const cardBorderColor = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.4)';

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    filterContainer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
    filterChip: {
      paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.full,
      backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(30, 136, 229, 0.1)',
      borderWidth: 1, borderColor: cardBorderColor, marginRight: spacing.md,
    },
    filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    filterChipText: { fontSize: typography.sizes.sm, color: colors.foreground, fontWeight: '600', fontFamily: typography.body.fontFamily },
    filterChipTextActive: { color: colors.primaryForeground },
    eventCard: {
      backgroundColor: cardBackgroundColor, borderRadius: radius.lg, overflow: 'hidden',
      borderWidth: 1, borderColor: cardBorderColor, marginHorizontal: spacing.lg, marginBottom: spacing.md,
      shadowColor: '#000000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 3,
    },
    eventImagePlaceholder: { height: 160, backgroundColor: colors.muted, justifyContent: 'flex-end', alignItems: 'flex-end', padding: spacing.md },
    priceBadge: { backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: spacing.xs, borderRadius: radius.full },
    priceBadgeText: { color: colors.primaryForeground, fontSize: typography.sizes.sm, fontWeight: '700', fontFamily: typography.body.fontFamily },
    eventContent: { padding: spacing.md },
    eventCardTitle: { fontSize: typography.sizes.base, fontWeight: '700', color: colors.foreground, marginBottom: spacing.sm, fontFamily: typography.display.fontFamily },
    metaRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.xs },
    metaText: { fontSize: typography.sizes.xs, color: colors.mutedForeground, fontFamily: typography.body.fontFamily },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <GlassHeader title="Events" subtitle="Find what's happening" leftIcon="menu" />

      <View style={styles.filterContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          data={filters}
          keyExtractor={(f) => f}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setActiveFilter(item)}
              style={[styles.filterChip, activeFilter === item && styles.filterChipActive]}
            >
              <Text style={[styles.filterChipText, activeFilter === item && styles.filterChipTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={[1, 2, 3, 4, 5]}
        keyExtractor={(i) => String(i)}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.eventCard}>
            <View style={styles.eventImagePlaceholder}>
              <View style={styles.priceBadge}>
                <Text style={styles.priceBadgeText}>₦5,000</Text>
              </View>
            </View>
            <View style={styles.eventContent}>
              <Text style={styles.eventCardTitle}>Sample Event {item}</Text>
              <View style={styles.metaRow}>
                <Feather name="map-pin" size={14} color={colors.mutedForeground} />
                <Text style={styles.metaText}>Eko Atlantic, Lagos</Text>
              </View>
              <View style={styles.metaRow}>
                <Feather name="calendar" size={14} color={colors.mutedForeground} />
                <Text style={styles.metaText}>Jul 25, 2026 · 8:00 PM</Text>
              </View>
              <View style={styles.metaRow}>
                <Feather name="star" size={14} color={colors.accent} fill={colors.accent} />
                <Text style={styles.metaText}>4.8 (89 reviews)</Text>
              </View>
              <GlassButton
                label="Book Now"
                onPress={() => {}}
                variant="solid"
                style={{ marginTop: spacing.md }}
              />
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
