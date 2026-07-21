import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Heart, MapPin, Star } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { concierge } from '../theme/theme';
import GlassHeader from '../components/GlassHeader';
import FilterPills from '../components/FilterPills';

const tabs = ['All Saved', 'Hotels', 'Events'];

const mockFavourites = [
  {
    id: '1', title: 'The Eko Reserve', category: 'LUXURY STAY', location: 'Victoria Island',
    rating: 4.9, price: '$450/night', imageColor: '#1A5276',
  },
  {
    id: '2', title: 'Vibe Lagos Concert', category: 'LIVE EXPERIENCE', location: 'Eko Hotel Gardens',
    date: 'Oct 24', price: '$85', imageColor: '#8B5CF6',
  },
  {
    id: '3', title: 'Artisanal Aso-Oke Set', category: 'MARKETPLACE', location: 'Lagos Artisan Hub',
    sub: 'Limited Edition', price: '$1,200', imageColor: '#D9891F',
  },
  {
    id: '4', title: 'Sky Restaurant', category: 'FINE DINING', location: 'Fine Dining',
    rating: 4.7, price: '$$$$', imageColor: '#EC4899',
  },
];

export default function FavouritesScreen() {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const [activeTab, setActiveTab] = useState('All Saved');
  const [favourites, setFavourites] = useState(mockFavourites);

  const toggleFavourite = (id: string) => {
    setFavourites((prev) => prev.filter((f) => f.id !== id));
  };

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <GlassHeader title="Saved" subtitle="Your bookmarks" />

      <FilterPills options={tabs} active={activeTab} onChange={setActiveTab} />

      {/* Cards */}
      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        {favourites.map((fav) => (
          <TouchableOpacity key={fav.id} style={s.favCard} activeOpacity={0.85}>
            <View style={[s.favImage, { backgroundColor: fav.imageColor }]}>
              <TouchableOpacity
                style={s.heartBtn}
                onPress={() => toggleFavourite(fav.id)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Heart size={18} color={concierge.primary} fill={concierge.primary} strokeWidth={0} />
              </TouchableOpacity>
            </View>
            <View style={s.favOverlay}>
              <View style={s.favBadgeRow}>
                <View style={s.favBadge}>
                  <Text style={s.favBadgeText}>{fav.category}</Text>
                </View>
                {fav.rating && (
                  <View style={s.favRating}>
                    <Star size={12} color="#F59E0B" fill="#F59E0B" strokeWidth={0} />
                    <Text style={s.favRatingText}>{fav.rating}</Text>
                  </View>
                )}
                {fav.date && (
                  <View style={s.favBadge}>
                    <Text style={s.favBadgeText}>{fav.date}</Text>
                  </View>
                )}
              </View>
              <Text style={s.favTitle}>{fav.title}</Text>
              <View style={s.favBottom}>
                <View style={s.favLocationRow}>
                  <MapPin size={12} color="rgba(255,255,255,0.8)" strokeWidth={2} />
                  <Text style={s.favLocationText}>{fav.location}</Text>
                </View>
                <Text style={s.favPrice}>{fav.price}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {favourites.length === 0 && (
          <View style={s.emptyState}>
            <Text style={{ fontSize: 48 }}>❤️</Text>
            <Text style={s.emptyTitle}>No favourites yet</Text>
            <Text style={s.emptyDesc}>Start exploring and save your favourite places</Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20, gap: 16 },

  favCard: {
    borderRadius: 12,
    overflow: 'hidden',
    height: 220,
    borderWidth: 1,
    borderColor: concierge.borderSubtle,
  },
  favImage: { ...StyleSheet.absoluteFillObject },
  favOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(9,9,11,0.35)',
    justifyContent: 'space-between',
    padding: 16,
  },
  favBadgeRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  favBadge: {
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 4,
  },
  favBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  favRating: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  favRatingText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  heartBtn: {
    position: 'absolute', top: 14, right: 14,
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.9)', alignItems: 'center', justifyContent: 'center',
  },
  favTitle: { color: '#fff', fontSize: 22, fontWeight: '800' },
  favBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  favLocationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1 },
  favLocationText: { color: 'rgba(255,255,255,0.85)', fontSize: 13 },
  favPrice: { color: '#fff', fontSize: 16, fontWeight: '800' },

  emptyState: { alignItems: 'center', marginTop: 80, gap: 10 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: concierge.heading },
  emptyDesc: { fontSize: 14, color: concierge.muted, textAlign: 'center' },
});
