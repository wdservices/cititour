import React, { useMemo, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator,
} from 'react-native';
import { Heart, MapPin } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import GlassHeader from '../components/GlassHeader';
import FilterPills from '../components/FilterPills';
import { useExploreData } from '../lib/useExploreData';
import { getMockImage } from '../lib/mockImages';

export default function MarketplaceScreen() {
  const { colors } = useTheme();
  const [activeCategory, setActiveCategory] = useState('All');
  const { marketplace, properties, loading } = useExploreData();

  const items = useMemo(() => {
    const all = [...marketplace, ...properties];
    if (activeCategory === 'All') return all;
    if (activeCategory === 'Property') return properties;
    return all.filter((i) => i.category.toLowerCase().includes(activeCategory.toLowerCase()));
  }, [activeCategory, marketplace, properties]);

  const categories = ['All', 'Electronics', 'Fashion', 'Home', 'Property'];

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <GlassHeader title="Marketplace" subtitle="Products & stays" />
      <FilterPills options={categories} active={activeCategory} onChange={setActiveCategory} />

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
            <Text style={[s.empty, { color: colors.mutedForeground }]}>No listings yet.</Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[s.productCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              activeOpacity={0.85}
            >
              <View style={s.productImage}>
                <Image
                  source={{ uri: item.image || getMockImage(item.category) }}
                  style={StyleSheet.absoluteFillObject}
                  resizeMode="cover"
                />
                <TouchableOpacity style={s.heartBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  <Heart size={16} color="#fff" strokeWidth={2} />
                </TouchableOpacity>
              </View>
              <View style={s.productContent}>
                <Text style={[s.productCat, { color: colors.mutedForeground }]}>{item.category}</Text>
                <Text style={[s.productName, { color: colors.foreground }]} numberOfLines={1}>
                  {item.title}
                </Text>
                {item.location ? (
                  <View style={s.productLocationRow}>
                    <MapPin size={11} color={colors.mutedForeground} strokeWidth={2} />
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
          )}
        />
      )}

      <View style={{ height: 90 }} />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  gridContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 20, gap: 12 },
  gridRow: { gap: 12 },
  empty: { textAlign: 'center', marginTop: 48, fontSize: 14 },
  productCard: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
  },
  productImage: {
    height: 120,
    backgroundColor: '#E2E8F0',
  },
  heartBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0,0,0,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productContent: { padding: 10 },
  productCat: { fontSize: 10, fontWeight: '700', letterSpacing: 0.4 },
  productName: { fontSize: 13, fontWeight: '700', marginTop: 2 },
  productLocationRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 4 },
  productLocation: { fontSize: 11, flex: 1 },
  productPrice: { fontSize: 13, fontWeight: '800', marginTop: 6 },
});
