import React, { useEffect, useMemo, useState } from 'react';
import {
  View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Search, Menu, User } from 'lucide-react-native';
import * as Location from 'expo-location';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useMainNavigation } from '../contexts/MainNavigationContext';
import ExploreHero from '../components/ExploreHero';
import ExploreCategoryShortcuts from '../components/ExploreCategoryShortcuts';
import ListingCarousel from '../components/ListingCarousel';
import {
  useExploreData,
  rotateListingWindow,
  filterListings,
  ExploreListing,
} from '../lib/useExploreData';

const ROTATE_MS = 8000;
const VISIBLE_COUNT = 5;

function detectCityFromCoords(lat: number, lon: number): string {
  if (lat > 11.5 && lon > 7.5 && lon < 9.5) return 'Kano';
  if (lat > 10.0 && lon > 6.5 && lon < 8.5) return 'Kaduna';
  if (lat > 8.0 && lon > 6.5) return 'Abuja';
  if (lat > 5.0 && lat <= 6.0 && lon > 6.5 && lon < 7.5) return 'Owerri';
  if (lat > 6.0 && lon > 3.0 && lon < 4.5) return 'Lagos';
  return 'Port Harcourt';
}

export default function HomeScreen({ navigation }: { navigation: any }) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const { openMenu, setActiveTab } = useMainNavigation();
  const insets = useSafeAreaInsets();
  const [cityLabel, setCityLabel] = useState('Port Harcourt');
  const [searchQuery, setSearchQuery] = useState('');
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const [rotateTick, setRotateTick] = useState(0);

  const { loading, businesses, events, marketplace, properties, refresh } = useExploreData();

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const location = await Location.getCurrentPositionAsync({});
      setCityLabel(detectCityFromCoords(location.coords.latitude, location.coords.longitude));
    })();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setRotateTick((t) => t + 1), ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  const toggleLike = (id: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredBiz = useMemo(
    () => filterListings(businesses, searchQuery),
    [businesses, searchQuery],
  );
  const filteredEvents = useMemo(
    () => filterListings(events, searchQuery),
    [events, searchQuery],
  );
  const filteredMkt = useMemo(
    () => filterListings(marketplace, searchQuery),
    [marketplace, searchQuery],
  );
  const filteredProps = useMemo(
    () => filterListings(properties, searchQuery),
    [properties, searchQuery],
  );

  const visibleBiz = useMemo(
    () => rotateListingWindow(filteredBiz, VISIBLE_COUNT, rotateTick, 0),
    [filteredBiz, rotateTick],
  );
  const visibleEvents = useMemo(
    () => rotateListingWindow(filteredEvents, VISIBLE_COUNT, rotateTick, 2),
    [filteredEvents, rotateTick],
  );
  const visibleMkt = useMemo(
    () => rotateListingWindow(filteredMkt, VISIBLE_COUNT, rotateTick, 4),
    [filteredMkt, rotateTick],
  );
  const visibleProps = useMemo(
    () => rotateListingWindow(filteredProps, VISIBLE_COUNT, rotateTick, 6),
    [filteredProps, rotateTick],
  );

  const openListing = (item: ExploreListing) => {
    if (item.kind === 'marketplace') {
      setActiveTab('marketplace');
      return;
    }
    if (item.kind === 'property') {
      setActiveTab('marketplace');
      return;
    }
    if (item.kind === 'event') {
      setActiveTab('events');
      return;
    }
    navigation.navigate('BusinessDetail', {
      businessId: item.id,
      businessName: item.title,
    });
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* App header — single search (matches web: top bar only on mobile) */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 6,
            backgroundColor: colors.background,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <TouchableOpacity onPress={openMenu} style={styles.iconBtn} accessibilityLabel="Menu">
            <Menu size={22} color={colors.foreground} strokeWidth={1.75} />
          </TouchableOpacity>
          <View style={styles.brand}>
            <Text style={[styles.brandTitle, { color: colors.primary }]}>CitiTour</Text>
            <Text style={[styles.brandSub, { color: colors.mutedForeground }]}>Explore</Text>
          </View>
          <TouchableOpacity
            style={[styles.avatar, { borderColor: `${colors.primary}40`, backgroundColor: colors.muted }]}
            onPress={() => setActiveTab('profile')}
          >
            <User size={16} color={colors.mutedForeground} strokeWidth={2} />
          </TouchableOpacity>
        </View>
        <View style={[styles.search, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Search size={18} color={colors.mutedForeground} strokeWidth={2} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search restaurants, events, hotels..."
            placeholderTextColor={colors.mutedForeground}
            style={[styles.searchInput, { color: colors.foreground }]}
            returnKeyType="search"
          />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={colors.primary} />}
        contentContainerStyle={styles.scroll}
      >
        <ExploreHero cityLabel={cityLabel} />
        <ExploreCategoryShortcuts />

        <View style={styles.discovered}>
          <Text style={[styles.discoveredTitle, { color: colors.foreground }]}>
            Discovered in {cityLabel}
          </Text>
          <Text style={[styles.discoveredSub, { color: colors.mutedForeground }]}>
            Businesses, events, marketplace, and stays — refreshed every few seconds.
          </Text>
        </View>

        <ListingCarousel
          title="Local Businesses"
          items={visibleBiz}
          loading={loading}
          viewAllLabel="View all"
          onViewAll={() => navigation.navigate('BusinessesList')}
          onPressItem={openListing}
          likedIds={likedIds}
          onToggleLike={toggleLike}
        />
        <ListingCarousel
          title="Upcoming Events"
          items={visibleEvents}
          loading={loading}
          viewAllLabel="View all events"
          onViewAll={() => setActiveTab('events')}
          onPressItem={openListing}
          likedIds={likedIds}
          onToggleLike={toggleLike}
          subtitle={(item) => (item.price ? `₦${item.price}` : 'Free')}
        />
        <ListingCarousel
          title="Marketplace"
          items={visibleMkt}
          loading={loading}
          viewAllLabel="View products"
          onViewAll={() => setActiveTab('marketplace')}
          onPressItem={openListing}
          likedIds={likedIds}
          onToggleLike={toggleLike}
          subtitle={(item) => item.price || 'Price on request'}
        />
        <ListingCarousel
          title="Properties & Stays"
          items={visibleProps}
          loading={loading}
          viewAllLabel="View stays"
          onViewAll={() => setActiveTab('marketplace')}
          onPressItem={openListing}
          likedIds={likedIds}
          onToggleLike={toggleLike}
          subtitle={(item) => item.price || '₦0/night'}
        />

        <View style={{ height: 96 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconBtn: { padding: 6, marginRight: 4 },
  brand: { flex: 1 },
  brandTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.3 },
  brandSub: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1.2 },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  search: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 15, paddingVertical: 0 },
  scroll: { paddingBottom: 16 },
  discovered: { paddingHorizontal: 16, marginTop: 24 },
  discoveredTitle: { fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  discoveredSub: { fontSize: 14, marginTop: 6, lineHeight: 20 },
});
