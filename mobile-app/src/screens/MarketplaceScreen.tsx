import React, { useMemo, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart, MapPin, ArrowLeft } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { useMainNavigation } from '../contexts/MainNavigationContext';
import { FilterPills } from '../components/FilterPills';
import { useExploreData } from '../lib/useExploreData';
import { getMockImage } from '../lib/mockImages';

const CATEGORIES = ['All', 'Electronics', 'Fashion', 'Home', 'Vehicles', 'Property'];

export default function MarketplaceScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { setActiveTab } = useMainNavigation();
  const [activeCategory, setActiveCategory] = useState('All');
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const { marketplace, properties, loading } = useExploreData();

  const items = useMemo(() => {
    const all = [...marketplace, ...properties];
    if (activeCategory === 'All') return all;
    if (activeCategory === 'Property') return properties;
    return all.filter((i) => i.category.toLowerCase().includes(activeCategory.toLowerCase()));
  }, [activeCategory, marketplace, properties]);

  const toggleLike = (id: string) => {
    setLikedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <View style={[s.header, { paddingTop: insets.top + 6, borderBottomColor: colors.border }]}>
        <View style={s.headerRow}>
          <TouchableOpacity onPress={() => setActiveTab('explore')} style={s.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <ArrowLeft size={22} color={colors.foreground} strokeWidth={2} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={[s.headerTitle, { color: colors.foreground }]}>Marketplace</Text>
            <Text style={[s.headerSub, { color: colors.mutedForeground }]}>Products & stays</Text>
          </View>
        </View>
      </View>

      <FilterPills options={CATEGORIES} active={activeCategory} onChange={setActiveCategory} />

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => `${i.kind}-${i.id}`}
          numColumns={2}
          contentContainerStyle={s.gridContent}
          columnWrapperStyle={s.gridRow}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={s.emptyState}>
              <Text style={[s.emptyTitle, { color: colors.foreground }]}>Nothing listed yet</Text>
              <Text style={[s.emptyDesc, { color: colors.mutedForeground }]}>
                New products are added regularly
              </Text>
            </View>
          }
          renderItem={({ item }) => {
            const liked = likedIds.has(item.id);
            return (
              <TouchableOpacity
                style={[s.productCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('ProductDetail', {
                  productId: item.id,
                  productTitle: item.title,
                  productImage: item.image,
                  productCategory: item.category,
                  productPrice: item.price,
                  productPromoPrice: item.promoPrice,
                  productCondition: item.condition,
                  productLocation: item.location,
                  productDescription: item.description,
                  productBusinessId: item.businessId,
                  productOwnerId: item.ownerId,
                })}
              >
                <View style={[s.productImage, { backgroundColor: colors.muted }]}>
                  <Image
                    source={{ uri: item.image || getMockImage(item.category) }}
                    style={StyleSheet.absoluteFillObject}
                    resizeMode="cover"
                  />
                  <TouchableOpacity
                    style={s.heartBtn}
                    onPress={() => toggleLike(item.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Heart
                      size={15}
                      color={liked ? colors.destructive : '#fff'}
                      fill={liked ? colors.destructive : 'transparent'}
                      strokeWidth={2}
                    />
                  </TouchableOpacity>
                </View>
                <View style={s.productContent}>
                  <Text style={[s.productCat, { color: colors.mutedForeground }]}>
                    {(item.category || 'Item').toUpperCase()}
                  </Text>
                  <Text style={[s.productName, { color: colors.foreground }]} numberOfLines={1}>
                    {item.title}
                  </Text>
                  {item.location ? (
                    <View style={s.productLocationRow}>
                      <MapPin size={10} color={colors.mutedForeground} strokeWidth={2} />
                      <Text style={[s.productLocation, { color: colors.mutedForeground }]} numberOfLines={1}>
                        {item.location}
                      </Text>
                    </View>
                  ) : null}
                  <Text style={[s.productPrice, { color: colors.primary }]}>
                    {item.price || 'Price on request'}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
      <View style={{ height: insets.bottom + 80 }} />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 10, borderBottomWidth: 1 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  headerSub: { fontSize: 13, marginTop: 2 },
  gridContent: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 20, gap: 10 },
  gridRow: { gap: 10 },
  productCard: { flex: 1, borderRadius: 14, overflow: 'hidden', borderWidth: 1 },
  productImage: { aspectRatio: 1 },
  heartBtn: {
    position: 'absolute', top: 8, right: 8, width: 28, height: 28, borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.25)', alignItems: 'center', justifyContent: 'center',
  },
  productContent: { padding: 10 },
  productCat: { fontSize: 10, fontWeight: '700', letterSpacing: 0.4 },
  productName: { fontSize: 13, fontWeight: '700', marginTop: 2 },
  productLocationRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 4 },
  productLocation: { fontSize: 11, flex: 1 },
  productPrice: { fontSize: 13, fontWeight: '800', marginTop: 6 },
  emptyState: { alignItems: 'center', marginTop: 60, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '700' },
  emptyDesc: { fontSize: 13, textAlign: 'center' },
});
