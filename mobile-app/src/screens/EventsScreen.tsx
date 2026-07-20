import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, MapPin, Star } from 'lucide-react-native';
import { colors, spacing, radius, typography } from '../theme/theme';

const filters = ['All', 'Food & Drink', 'Music', 'Business', 'Sports'];

export default function EventsScreen() {
  const [activeFilter, setActiveFilter] = useState('All');

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>Upcoming Events</Text>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={filters}
        keyExtractor={(f) => f}
        contentContainerStyle={{ paddingHorizontal: spacing.md, gap: spacing.sm }}
        style={{ flexGrow: 0, marginBottom: spacing.md }}
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

      <FlatList
        data={[1, 2, 3, 4, 5]}
        keyExtractor={(i) => String(i)}
        contentContainerStyle={{ padding: spacing.md, gap: spacing.md }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.eventCard}>
            <View style={styles.eventImagePlaceholder}>
              <View style={styles.priceBadge}>
                <Text style={styles.priceBadgeText}>₦5,000</Text>
              </View>
            </View>
            <View style={{ padding: spacing.sm }}>
              <Text style={styles.eventCardTitle}>Sample Event {item}</Text>
              <View style={styles.metaRow}>
                <MapPin size={12} color={colors.mutedForeground} />
                <Text style={styles.metaText}>Eko Atlantic, Lagos</Text>
              </View>
              <View style={styles.metaRow}>
                <Calendar size={12} color={colors.mutedForeground} />
                <Text style={styles.metaText}>Jul 25, 2026 · 8:00 PM</Text>
              </View>
              <View style={styles.metaRow}>
                <Star size={12} color={colors.accent} fill={colors.accent} />
                <Text style={styles.metaText}>4.8 (89 reviews)</Text>
              </View>
              <TouchableOpacity style={styles.bookButton}>
                <Text style={styles.bookButtonText}>Book Now</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { fontSize: typography.sizes.xxl, fontWeight: '800', color: colors.foreground, paddingHorizontal: spacing.md, marginBottom: spacing.md },
  filterChip: {
    paddingHorizontal: spacing.md, paddingVertical: 8, borderRadius: radius.full,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
  },
  filterChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  filterChipText: { fontSize: typography.sizes.sm, color: colors.foreground, fontWeight: '600' },
  filterChipTextActive: { color: colors.primaryForeground },
  eventCard: { backgroundColor: colors.card, borderRadius: radius.lg, overflow: 'hidden', borderWidth: 1, borderColor: colors.border },
  eventImagePlaceholder: { height: 140, backgroundColor: colors.muted, justifyContent: 'flex-end', alignItems: 'flex-end', padding: spacing.sm },
  priceBadge: { backgroundColor: colors.foreground, paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full },
  priceBadgeText: { color: colors.background, fontSize: 12, fontWeight: '700' },
  eventCardTitle: { fontSize: typography.sizes.base, fontWeight: '700', color: colors.foreground, marginBottom: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 3 },
  metaText: { fontSize: typography.sizes.xs, color: colors.mutedForeground },
  bookButton: { backgroundColor: colors.primary, borderRadius: radius.full, paddingVertical: 10, alignItems: 'center', marginTop: spacing.sm },
  bookButtonText: { color: colors.primaryForeground, fontWeight: '700', fontSize: typography.sizes.sm },
});
