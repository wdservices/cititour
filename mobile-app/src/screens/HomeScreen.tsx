import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import * as Location from 'expo-location';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, radius, typography, glass } from '../theme/theme';
import GlassHeader from '../components/GlassHeader';
import PassportStampIcon from '../components/PassportStampIcon';

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

const categories: Array<{ id: string; label: string; icon: 'home' | 'utensils' | 'calendar' | 'map-pin' | 'smile' | 'shopping-bag' | 'heart' | 'shopping-cart' }> = [
  { id: 'hotels', label: 'Hotels', icon: 'home' },
  { id: 'restaurants', label: 'Restaurants', icon: 'utensils' },
  { id: 'events', label: 'Events', icon: 'calendar' },
  { id: 'attractions', label: 'Attractions', icon: 'map-pin' },
];

export default function HomeScreen({ navigation }: any) {
  const { colors, isDark } = useTheme();
  const [cityLabel, setCityLabel] = useState('Lagos');

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const location = await Location.getCurrentPositionAsync({});
      const city = detectCityFromCoords(location.coords.latitude, location.coords.longitude);
      setCityLabel(city.label);
    })();
  }, []);

  const glassOpacity = isDark ? glass.opacityDark : glass.opacity;
  const inputBackgroundColor = isDark
    ? `rgba(18, 22, 31, ${glassOpacity})`
    : `rgba(255, 255, 255, ${glassOpacity})`;
  const inputBorderColor = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.4)';

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    headerContent: { paddingHorizontal: spacing.lg, paddingTop: spacing.md, paddingBottom: spacing.lg },
    eyebrow: {
      fontSize: typography.sizes.xs,
      fontWeight: '700',
      color: colors.accent,
      letterSpacing: 1,
      fontFamily: typography.body.fontFamily,
    },
    title: {
      fontSize: typography.sizes.xxl,
      fontWeight: '800',
      color: colors.foreground,
      marginTop: spacing.sm,
      fontFamily: typography.display.fontFamily,
    },
    titleHighlight: { color: colors.primary },
    searchBarContainer: { paddingHorizontal: spacing.lg, marginBottom: spacing.lg },
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      backgroundColor: inputBackgroundColor,
      borderWidth: 1,
      borderColor: inputBorderColor,
      borderRadius: radius.full,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
    },
    searchInput: {
      flex: 1,
      color: colors.foreground,
      fontSize: typography.sizes.base,
      fontFamily: typography.body.fontFamily,
    },
    categoryGrid: {
      paddingHorizontal: spacing.lg,
      marginBottom: spacing.xl,
      gap: spacing.lg,
    },
    categoryRow: { flexDirection: 'row', justifyContent: 'space-around', gap: spacing.md },
    categoryItem: { alignItems: 'center', flex: 1 },
    categoryLabel: {
      fontSize: typography.sizes.sm,
      fontWeight: '600',
      color: colors.foreground,
      textAlign: 'center',
      marginTop: spacing.sm,
      fontFamily: typography.body.fontFamily,
    },
    section: { marginBottom: spacing.xl, paddingHorizontal: spacing.lg },
    sectionTitle: {
      fontSize: typography.sizes.lg,
      fontWeight: '700',
      color: colors.foreground,
      marginBottom: spacing.md,
      fontFamily: typography.display.fontFamily,
    },
    trendingScroll: { gap: spacing.md },
    featuredCard: {
      width: 160,
      backgroundColor: isDark
        ? 'rgba(18, 22, 31, 0.7)'
        : 'rgba(255, 255, 255, 0.7)',
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: inputBorderColor,
      overflow: 'hidden',
      marginRight: spacing.md,
    },
    featuredImagePlaceholder: {
      width: '100%',
      height: 120,
      backgroundColor: colors.muted,
    },
    featuredCardContent: { padding: spacing.md },
    featuredCardTitle: {
      fontSize: typography.sizes.sm,
      fontWeight: '600',
      color: colors.foreground,
      fontFamily: typography.body.fontFamily,
    },
    featuredCardSubtitle: {
      fontSize: typography.sizes.xs,
      color: colors.mutedForeground,
      marginTop: spacing.xs,
      fontFamily: typography.body.fontFamily,
    },
    eventCard: {
      backgroundColor: isDark
        ? 'rgba(18, 22, 31, 0.7)'
        : 'rgba(255, 255, 255, 0.7)',
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: inputBorderColor,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      marginBottom: spacing.md,
    },
    eventDateBadge: {
      width: 56,
      height: 56,
      borderRadius: radius.md,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    eventDateDay: {
      fontSize: typography.sizes.base,
      fontWeight: '800',
      color: colors.primaryForeground,
      fontFamily: typography.display.fontFamily,
    },
    eventDateMonth: {
      fontSize: typography.sizes.xs,
      fontWeight: '700',
      color: colors.primaryForeground,
      fontFamily: typography.body.fontFamily,
    },
    eventContent: { flex: 1 },
    eventTitle: {
      fontSize: typography.sizes.base,
      fontWeight: '600',
      color: colors.foreground,
      fontFamily: typography.body.fontFamily,
    },
    eventSubtitle: {
      fontSize: typography.sizes.xs,
      color: colors.mutedForeground,
      marginTop: spacing.xs,
      fontFamily: typography.body.fontFamily,
    },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <GlassHeader
          title={`Tour ${cityLabel}`}
          subtitle="CITITOUR CONCIERGE"
          locationPill={cityLabel}
          leftIcon="menu"
          rightIcon="bell"
          onLeftPress={() => {}}
          onRightPress={() => {}}
        />

        {/* Search bar */}
        <View style={styles.searchBarContainer}>
          <View style={styles.searchBar}>
            <Feather name="search" size={20} color={colors.mutedForeground} />
            <TextInput
              placeholder="Search restaurants, events..."
              placeholderTextColor={colors.mutedForeground}
              style={styles.searchInput}
            />
          </View>
        </View>

        {/* Category grid — passport-stamp motif */}
        <View style={styles.categoryGrid}>
          {categories.map((cat, idx) => (
            <View key={idx} style={idx % 2 === 0 ? { flex: 1, flexDirection: 'row', gap: spacing.md } : undefined}>
              {idx % 2 === 0 && (
                <>
                  <TouchableOpacity style={styles.categoryItem} onPress={() => navigation.navigate('CategoryResults', { category: cat.label })}>
                    <PassportStampIcon category={cat.id as any} size={60} />
                    <Text style={styles.categoryLabel}>{cat.label}</Text>
                  </TouchableOpacity>
                  {categories[idx + 1] && (
                    <TouchableOpacity style={styles.categoryItem} onPress={() => navigation.navigate('CategoryResults', { category: categories[idx + 1].label })}>
                      <PassportStampIcon category={categories[idx + 1].id as any} size={60} />
                      <Text style={styles.categoryLabel}>{categories[idx + 1].label}</Text>
                    </TouchableOpacity>
                  )}
                </>
              )}
            </View>
          ))}
        </View>

        {/* Trending section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trending in {cityLabel}</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trendingScroll}>
            {[1, 2, 3].map((i) => (
              <View key={i} style={styles.featuredCard}>
                <View style={styles.featuredImagePlaceholder} />
                <View style={styles.featuredCardContent}>
                  <Text style={styles.featuredCardTitle}>Trending Place {i}</Text>
                  <Text style={styles.featuredCardSubtitle}>{cityLabel}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Upcoming events */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Upcoming Events</Text>
          {[1, 2].map((i) => (
            <TouchableOpacity key={i} style={styles.eventCard} onPress={() => navigation.navigate('EventDetail', { id: i })}>
              <View style={styles.eventDateBadge}>
                <Text style={styles.eventDateDay}>18</Text>
                <Text style={styles.eventDateMonth}>JUL</Text>
              </View>
              <View style={styles.eventContent}>
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

