import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useBusinesses, useEvents, useMarketplaceItems, useHouseListings } from '@/hooks/useFirestore';
import { useRegion } from '@/context/RegionContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH * 0.7;
const SMALL_CARD_WIDTH = (SCREEN_WIDTH - 48) / 2;

const getMockImage = (category?: string): string => {
  const defaults: Record<string, string> = {
    Restaurant: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop',
    Hotel: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop',
    Shopping: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
    Attraction: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    Event: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop',
    default: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=300&fit=crop',
  };
  return defaults[category || ''] || defaults.default;
};

interface ListingRowProps {
  title: string;
  items: any[];
  type: string;
  onItemPress: (item: any) => void;
  onViewAll?: () => void;
}

function ListingRow({ title, items, type, onItemPress, onViewAll }: ListingRowProps) {
  const displayItems = items.slice(0, 4);

  if (displayItems.length === 0) return null;

  return (
    <View style={styles.rowSection}>
      <View style={styles.rowHeader}>
        <Text style={styles.rowTitle}>{title}</Text>
        {items.length > 4 && onViewAll && (
          <TouchableOpacity onPress={onViewAll}>
            <Text style={styles.viewAll}>View All ({items.length})</Text>
          </TouchableOpacity>
        )}
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollRow}>
        {displayItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.listingCard}
            onPress={() => onItemPress(item)}
            activeOpacity={0.7}
          >
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: item.image || getMockImage(item.category) }}
                style={styles.listingImage}
                resizeMode="cover"
              />
              {item.category && (
                <View style={styles.categoryBadge}>
                  <Text style={styles.categoryText}>{item.category}</Text>
                </View>
              )}
            </View>
            <View style={styles.listingInfo}>
              <Text style={styles.listingTitle} numberOfLines={1}>{item.title}</Text>
              {item.location && (
                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={12} color="#888" />
                  <Text style={styles.listingLocation} numberOfLines={1}>{item.location}</Text>
                </View>
              )}
              {type === 'product' && item.price != null && (
                <Text style={styles.listingPrice}>₦{Number(item.price || 0).toLocaleString()}</Text>
              )}
              {type === 'property' && item.price != null && (
                <Text style={styles.listingPrice}>₦{Number(item.price || 0).toLocaleString()}/night</Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

export default function ExploreScreen() {
  const navigation = useNavigation<any>();
  const { brandName } = useRegion();

  const { data: businesses = [], isLoading: loadingBiz, refetch: refetchBiz } = useBusinesses();
  const { data: events = [], isLoading: loadingEvents, refetch: refetchEvents } = useEvents();
  const { data: products = [], isLoading: loadingProducts, refetch: refetchProducts } = useMarketplaceItems();
  const { data: properties = [], isLoading: loadingProperties, refetch: refetchProperties } = useHouseListings();

  const isLoading = loadingBiz || loadingEvents || loadingProducts || loadingProperties;

  const onRefresh = async () => {
    await Promise.all([refetchBiz(), refetchEvents(), refetchProducts(), refetchProperties()]);
  };

  const featuredBusinesses = useMemo(() => businesses.filter((b: any) => b.isFeatured || b.rating >= 4).slice(0, 8), [businesses]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={<RefreshControl refreshing={isLoading} onRefresh={onRefresh} tintColor="#D4A017" />}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.brandName}>{brandName}</Text>
        <Text style={styles.headerSubtitle}>Discover amazing places & events</Text>
      </View>

      {/* Search Bar */}
      <TouchableOpacity
        style={styles.searchBar}
        onPress={() => navigation.navigate('Search')}
        activeOpacity={0.7}
      >
        <Ionicons name="search" size={18} color="#888" />
        <Text style={styles.searchPlaceholder}>Search businesses, events, products...</Text>
      </TouchableOpacity>

      {/* Quick Category Chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
        {['All', 'Events', 'Marketplace', 'Properties'].map((chip) => (
          <TouchableOpacity key={chip} style={styles.chip} activeOpacity={0.7}>
            <Text style={styles.chipText}>{chip}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Featured Businesses */}
      <ListingRow
        title="Featured"
        items={featuredBusinesses.length > 0 ? featuredBusinesses : businesses.slice(0, 4)}
        type="business"
        onItemPress={(item) => navigation.navigate('BusinessDetail', { id: item.id })}
        onViewAll={() => navigation.navigate('AllBusinesses')}
      />

      {/* Events */}
      <ListingRow
        title="Upcoming Events"
        items={events}
        type="event"
        onItemPress={(item) => navigation.navigate('EventDetail', { id: item.id })}
        onViewAll={() => navigation.navigate('Events')}
      />

      {/* Marketplace */}
      <ListingRow
        title="Marketplace"
        items={products}
        type="product"
        onItemPress={(item) => navigation.navigate('MarketplaceDetail', { id: item.id })}
        onViewAll={() => navigation.navigate('Marketplace')}
      />

      {/* Properties */}
      <ListingRow
        title="Properties"
        items={properties}
        type="property"
        onItemPress={(item) => navigation.navigate('PropertyDetail', { id: item.id })}
        onViewAll={() => navigation.navigate('Properties')}
      />

      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#D4A017" />
        </View>
      )}

      {!isLoading && businesses.length === 0 && events.length === 0 && products.length === 0 && (
        <View style={styles.emptyContainer}>
          <Ionicons name="compass-outline" size={48} color="#ccc" />
          <Text style={styles.emptyText}>Nothing to explore yet</Text>
          <Text style={styles.emptySubtext}>Be the first to add a listing!</Text>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  contentContainer: {
    paddingTop: 60,
  },
  header: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  brandName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#888',
    marginTop: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    gap: 10,
  },
  searchPlaceholder: {
    fontSize: 14,
    color: '#999',
  },
  chipRow: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#E5E5E5',
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  rowSection: {
    marginBottom: 24,
  },
  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  rowTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  viewAll: {
    fontSize: 13,
    fontWeight: '600',
    color: '#D4A017',
  },
  scrollRow: {
    paddingLeft: 16,
    paddingRight: 8,
    gap: 12,
  },
  listingCard: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  imageContainer: {
    position: 'relative',
  },
  listingImage: {
    width: '100%',
    height: 160,
  },
  categoryBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listingInfo: {
    padding: 12,
  },
  listingTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  listingLocation: {
    fontSize: 12,
    color: '#888',
    flex: 1,
  },
  listingPrice: {
    fontSize: 14,
    fontWeight: '800',
    color: '#D4A017',
    marginTop: 4,
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: 'center',
    gap: 8,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
  },
  emptySubtext: {
    fontSize: 13,
    color: '#ccc',
  },
});
