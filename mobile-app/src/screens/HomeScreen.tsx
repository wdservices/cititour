import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, MapPin, Calendar, Hotel, Utensils, Compass } from 'lucide-react-native';
import * as Location from 'expo-location';
import { colors, spacing, radius, typography } from '../theme/theme';

// Same GPS-to-city heuristic as RegionContext.tsx on the website — kept in
// sync so the native app's "Tour Lagos" / "Tour Abuja" branding matches.
function detectCityFromCoords(lat: number, lon: number): { code: string; label: string } {
  if (lat > 11.5 && lon > 7.5 && lon < 9.5) return { code: 'KAN', label: 'Kano' };
  if (lat > 10.0 && lon > 6.5 && lon < 8.5) return { code: 'KAD', label: 'Kaduna' };
  if (lat > 8.0 && lon > 6.5) return { code: 'ABJ', label: 'Abuja' };
  if (lat > 5.0 && lat <= 6.0 && lon > 6.5 && lon < 7.5) return { code: 'OWR', label: 'Owerri' };
  if (lat > 6.0 && lon > 3.0 && lon < 4.5) return { code: 'LAG', label: 'Lagos' };
  return { code: 'PH', label: 'Port Harcourt' };
}

const categories = [
  { icon: Hotel, label: 'Hotels', color: colors.primary },
  { icon: Utensils, label: 'Restaurants', color: colors.accent },
  { icon: Calendar, label: 'Events', color: colors.success },
  { icon: Compass, label: 'Fun Places', color: colors.primaryDark },
];

export default function HomeScreen({ navigation }: any) {
  const [cityLabel, setCityLabel] = useState('Nigeria');

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const location = await Location.getCurrentPositionAsync({});
      const city = detectCityFromCoords(location.coords.latitude, location.coords.longitude);
      setCityLabel(city.label);
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header — city-adaptive greeting, mirrors "Tour Lagos" branding */}
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>CITITOUR CONCIERGE</Text>
            <Text style={styles.title}>
              Tour <Text style={{ color: colors.primary }}>{cityLabel}</Text>
            </Text>
          </View>
          <TouchableOpacity style={styles.locationPill}>
            <MapPin size={14} color={colors.primary} />
            <Text style={styles.locationPillText}>{cityLabel}</Text>
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate('Search')}
        >
          <Search size={18} color={colors.mutedForeground} />
          <Text style={styles.searchPlaceholder}>Search restaurants, events, hotels...</Text>
        </TouchableOpacity>

        {/* Category grid — passport-stamp motif, dashed circular rings */}
        <View style={styles.categoryGrid}>
          {categories.map((cat, i) => (
            <TouchableOpacity
              key={cat.label}
              style={styles.categoryItem}
              onPress={() => navigation.navigate('CategoryResults', { category: cat.label })}
            >
              <View style={[styles.stampRing, { borderColor: cat.color }]}>
                <cat.icon size={26} color={cat.color} />
              </View>
              <Text style={styles.categoryLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Featured / trending section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending in {cityLabel}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[1, 2, 3].map((i) => (
              <TouchableOpacity key={i} style={styles.featuredCard}>
                <View style={styles.featuredImagePlaceholder} />
                <Text style={styles.featuredCardTitle}>Featured Listing {i}</Text>
                <Text style={styles.featuredCardSubtitle}>{cityLabel}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Upcoming events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          {[1, 2].map((i) => (
            <TouchableOpacity key={i} style={styles.eventRow}>
              <View style={styles.eventDateBadge}>
                <Text style={styles.eventDateDay}>18</Text>
                <Text style={styles.eventDateMonth}>JUL</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.eventTitle}>Sample Event {i}</Text>
                <Text style={styles.eventSubtitle}>{cityLabel} · From ₦5,000</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
  },
  eyebrow: {
    fontSize: typography.sizes.xs,
    fontWeight: '700',
    color: colors.accent,
    letterSpacing: 1.5,
  },
  title: {
    fontSize: typography.sizes.xxl,
    fontWeight: '800',
    color: colors.foreground,
    marginTop: 4,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.primary + '15',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radius.full,
  },
  locationPillText: { fontSize: typography.sizes.xs, color: colors.primary, fontWeight: '600' },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.card,
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingVertical: 14,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchPlaceholder: { color: colors.mutedForeground, fontSize: typography.sizes.sm },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginTop: spacing.xl,
  },
  categoryItem: { width: '23%', alignItems: 'center' },
  stampRing: {
    width: 60,
    height: 60,
    borderRadius: radius.full,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  categoryLabel: { fontSize: 11, fontWeight: '600', color: colors.foreground, textAlign: 'center' },
  section: { marginTop: spacing.xl, paddingHorizontal: spacing.md },
  sectionTitle: { fontSize: typography.sizes.lg, fontWeight: '700', color: colors.foreground, marginBottom: spacing.sm },
  featuredCard: { width: 160, marginRight: spacing.sm },
  featuredImagePlaceholder: {
    width: '100%',
    height: 110,
    borderRadius: radius.md,
    backgroundColor: colors.muted,
    marginBottom: 6,
  },
  featuredCardTitle: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.foreground },
  featuredCardSubtitle: { fontSize: typography.sizes.xs, color: colors.mutedForeground },
  eventRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.card,
    padding: spacing.sm,
    borderRadius: radius.md,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  eventDateBadge: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    backgroundColor: colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventDateDay: { fontSize: typography.sizes.base, fontWeight: '800', color: colors.primary },
  eventDateMonth: { fontSize: 10, fontWeight: '700', color: colors.primary },
  eventTitle: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.foreground },
  eventSubtitle: { fontSize: typography.sizes.xs, color: colors.mutedForeground },
});
