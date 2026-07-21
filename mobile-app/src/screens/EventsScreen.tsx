import React, { useMemo, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator,
} from 'react-native';
import { MapPin, Ticket } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import GlassHeader from '../components/GlassHeader';
import FilterPills from '../components/FilterPills';
import { useExploreData } from '../lib/useExploreData';
import { getMockImage } from '../lib/mockImages';

const filters = ['All', 'Music', 'Food', 'Art', 'Nightlife'];

export default function EventsScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const [activeFilter, setActiveFilter] = useState('All');
  const { events, loading } = useExploreData();

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return events;
    return events.filter((e) => e.category.toLowerCase().includes(activeFilter.toLowerCase()));
  }, [events, activeFilter]);

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <GlassHeader title="Events" subtitle="Upcoming in your city" />
      <FilterPills options={filters} active={activeFilter} onChange={setActiveFilter} />

      {loading ? (
        <ActivityIndicator style={{ marginTop: 32 }} color={colors.primary} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id}
          contentContainerStyle={s.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={[s.empty, { color: colors.mutedForeground }]}>No events listed yet.</Text>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[s.eventCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              activeOpacity={0.85}
              onPress={() =>
                navigation.navigate('BusinessDetail', {
                  businessId: item.id,
                  businessName: item.title,
                })
              }
            >
              <View style={s.eventImage}>
                <Image
                  source={{ uri: item.image || getMockImage('Event') }}
                  style={StyleSheet.absoluteFillObject}
                  resizeMode="cover"
                />
                <View style={[s.priceBadge, { backgroundColor: colors.card }]}>
                  <Ticket size={12} color={colors.foreground} strokeWidth={2} />
                  <Text style={[s.priceBadgeText, { color: colors.foreground }]}>
                    {item.price ? `₦${item.price}` : 'Free'}
                  </Text>
                </View>
              </View>
              <View style={s.eventContent}>
                <View style={s.venueRow}>
                  <MapPin size={13} color={colors.mutedForeground} strokeWidth={2} />
                  <Text style={[s.venueText, { color: colors.mutedForeground }]}>
                    {item.location || 'Venue TBA'}
                  </Text>
                </View>
                <Text style={[s.eventTitle, { color: colors.foreground }]}>{item.title}</Text>
                <Text style={[s.eventDesc, { color: colors.mutedForeground }]} numberOfLines={2}>
                  {item.description}
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
  listContent: { paddingHorizontal: 16, paddingTop: 12, paddingBottom: 20, gap: 14 },
  empty: { textAlign: 'center', marginTop: 40, fontSize: 14 },
  eventCard: { borderRadius: 12, overflow: 'hidden', borderWidth: 1 },
  eventImage: { height: 160, backgroundColor: '#E2E8F0' },
  priceBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  priceBadgeText: { fontSize: 12, fontWeight: '600' },
  eventContent: { padding: 14 },
  venueRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginBottom: 6 },
  venueText: { fontSize: 12, fontWeight: '500' },
  eventTitle: { fontSize: 17, fontWeight: '700', letterSpacing: -0.3, marginBottom: 6 },
  eventDesc: { fontSize: 13, lineHeight: 18 },
});
