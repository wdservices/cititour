import React, { useMemo, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MapPin, Ticket } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { FilterPills } from '../components/FilterPills';
import { useExploreData } from '../lib/useExploreData';
import { getMockImage } from '../lib/mockImages';

const FILTERS = ['All', 'Music', 'Food', 'Art', 'Business', 'Sports'];

export default function EventsScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const [activeFilter, setActiveFilter] = useState('All');
  const { events, loading } = useExploreData();

  const filtered = useMemo(() => {
    if (activeFilter === 'All') return events;
    return events.filter((e) => e.category.toLowerCase().includes(activeFilter.toLowerCase()));
  }, [events, activeFilter]);

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <View style={[s.header, { paddingTop: insets.top + 6, borderBottomColor: colors.border }]}>
        <Text style={[s.headerTitle, { color: colors.foreground }]}>Events</Text>
        <Text style={[s.headerSub, { color: colors.mutedForeground }]}>Upcoming in your city</Text>
      </View>

      <FilterPills options={FILTERS} active={activeFilter} onChange={setActiveFilter} />

      {loading ? (
        <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(i) => i.id}
          contentContainerStyle={s.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={s.emptyState}>
              <Text style={[s.emptyTitle, { color: colors.foreground }]}>No events found</Text>
              <Text style={[s.emptyDesc, { color: colors.mutedForeground }]}>
                Check back soon for upcoming events
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[s.eventCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('BusinessDetail', { businessId: item.id, businessName: item.title })}
            >
              <View style={[s.eventImage, { backgroundColor: colors.muted }]}>
                <Image
                  source={{ uri: item.image || getMockImage('Event') }}
                  style={StyleSheet.absoluteFillObject}
                  resizeMode="cover"
                />
                <View style={[s.priceBadge, { backgroundColor: colors.card }]}>
                  <Ticket size={11} color={colors.foreground} strokeWidth={2} />
                  <Text style={[s.priceBadgeText, { color: colors.foreground }]}>
                    {item.price ? `₦${item.price}` : 'Free'}
                  </Text>
                </View>
              </View>
              <View style={s.eventContent}>
                <Text style={[s.eventCat, { color: colors.primary }]}>
                  {(item.category || 'Event').toUpperCase()}
                </Text>
                <Text style={[s.eventTitle, { color: colors.foreground }]} numberOfLines={2}>{item.title}</Text>
                <View style={s.venueRow}>
                  <MapPin size={11} color={colors.mutedForeground} strokeWidth={2} />
                  <Text style={[s.venueText, { color: colors.mutedForeground }]} numberOfLines={1}>
                    {item.location || 'Venue TBA'}
                  </Text>
                </View>
                {item.description ? (
                  <Text style={[s.eventDesc, { color: colors.mutedForeground }]} numberOfLines={2}>
                    {item.description}
                  </Text>
                ) : null}
              </View>
            </TouchableOpacity>
          )}
        />
      )}
      <View style={{ height: insets.bottom + 80 }} />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 10, borderBottomWidth: 1 },
  headerTitle: { fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  headerSub: { fontSize: 13, marginTop: 2 },
  listContent: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 20, gap: 12 },
  eventCard: { flexDirection: 'row', borderRadius: 14, overflow: 'hidden', borderWidth: 1 },
  eventImage: { width: 100, height: 100 },
  priceBadge: {
    position: 'absolute', bottom: 6, left: 6, flexDirection: 'row', alignItems: 'center', gap: 4,
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4,
  },
  priceBadgeText: { fontSize: 11, fontWeight: '700' },
  eventContent: { flex: 1, padding: 12, justifyContent: 'center' },
  eventCat: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5, marginBottom: 4 },
  eventTitle: { fontSize: 14, fontWeight: '700', letterSpacing: -0.2 },
  venueRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 6 },
  venueText: { fontSize: 12 },
  eventDesc: { fontSize: 12, lineHeight: 17, marginTop: 4 },
  emptyState: { alignItems: 'center', marginTop: 60, gap: 8 },
  emptyTitle: { fontSize: 16, fontWeight: '700' },
  emptyDesc: { fontSize: 13, textAlign: 'center' },
});
