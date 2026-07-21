import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Plus, MapPin, CreditCard as Edit3, Trash2, Package, ArrowLeft } from 'lucide-react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getMockImage } from '../lib/mockImages';

interface OwnerListing {
  id: string;
  title: string;
  category: string;
  location: string;
  image: string;
  status: string;
}

export default function MyDashboardScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const [tab, setTab] = useState<'businesses' | 'products' | 'events'>('businesses');
  const [listings, setListings] = useState<OwnerListing[]>([]);
  const [loading, setLoading] = useState(true);

  const loadListings = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const q = query(collection(db, 'businesses'), where('ownerId', '==', user.id));
      const snap = await getDocs(q);
      const items = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          title: data.name || data.title || 'Untitled',
          category: data.category || 'Business',
          location: data.city || data.location || '',
          image: data.image || (Array.isArray(data.images) && data.images[0]) || '',
          status: data.status || 'Active',
        } as OwnerListing;
      });
      setListings(items);
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(useCallback(() => { loadListings(); }, [loadListings]));

  const handleDelete = async (id: string) => {
    setListings((prev) => prev.filter((l) => l.id !== id));
    try { await deleteDoc(doc(db, 'businesses', id)); } catch {}
  };

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <View style={[s.header, { paddingTop: insets.top + 6, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <ArrowLeft size={22} color={colors.foreground} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: colors.foreground }]}>My Dashboard</Text>
        <TouchableOpacity
          style={[s.addBtn, { backgroundColor: colors.primary }]}
          activeOpacity={0.7}
        >
          <Plus size={20} color="#fff" strokeWidth={2.5} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadListings} tintColor={colors.primary} />}
        contentContainerStyle={s.scrollContent}
      >
        {/* Stats */}
        <View style={s.statsRow}>
          <View style={[s.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[s.statValue, { color: colors.primary }]}>{listings.length}</Text>
            <Text style={[s.statLabel, { color: colors.mutedForeground }]}>Listings</Text>
          </View>
          <View style={[s.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[s.statValue, { color: colors.accent }]}>0</Text>
            <Text style={[s.statLabel, { color: colors.mutedForeground }]}>Events</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={[s.tabRow, { backgroundColor: colors.muted }]}>
          {(['businesses', 'products', 'events'] as const).map((t) => (
            <TouchableOpacity
              key={t}
              style={[s.tab, tab === t && { backgroundColor: colors.card }]}
              onPress={() => setTab(t)}
              activeOpacity={0.7}
            >
              <Text style={[s.tabText, tab === t && { color: colors.primary }]}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Listings */}
        {loading ? (
          <ActivityIndicator style={{ marginTop: 40 }} color={colors.primary} />
        ) : listings.length === 0 ? (
          <View style={[s.emptyState, { borderColor: colors.border, backgroundColor: colors.muted }]}>
            <Package size={36} color={colors.mutedForeground} strokeWidth={1.5} />
            <Text style={[s.emptyTitle, { color: colors.foreground }]}>No listings yet</Text>
            <Text style={[s.emptyDesc, { color: colors.mutedForeground }]}>
              Create your first listing to get started
            </Text>
          </View>
        ) : (
          <View style={s.listingsList}>
            {listings.map((item) => (
              <View key={item.id} style={[s.listingCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={[s.listingImage, { backgroundColor: colors.muted }]}>
                  <Image
                    source={{ uri: item.image || getMockImage(item.category) }}
                    style={StyleSheet.absoluteFillObject}
                    resizeMode="cover"
                  />
                </View>
                <View style={s.listingContent}>
                  <Text style={[s.listingCat, { color: colors.primary }]}>{item.category.toUpperCase()}</Text>
                  <Text style={[s.listingTitle, { color: colors.foreground }]} numberOfLines={1}>{item.title}</Text>
                  {item.location ? (
                    <View style={s.listingLocRow}>
                      <MapPin size={11} color={colors.mutedForeground} strokeWidth={2} />
                      <Text style={[s.listingLoc, { color: colors.mutedForeground }]} numberOfLines={1}>{item.location}</Text>
                    </View>
                  ) : null}
                </View>
                <View style={s.listingActions}>
                  <TouchableOpacity style={s.actionIcon} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Edit3 size={16} color={colors.mutedForeground} strokeWidth={2} />
                  </TouchableOpacity>
                  <TouchableOpacity style={s.actionIcon} onPress={() => handleDelete(item.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Trash2 size={16} color={colors.destructive} strokeWidth={2} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
        <View style={{ height: insets.bottom + 40 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 10, borderBottomWidth: 1, gap: 12 },
  backBtn: { padding: 4 },
  headerTitle: { flex: 1, fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  addBtn: { width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16 },

  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  statCard: { flex: 1, borderRadius: 14, padding: 16, borderWidth: 1, alignItems: 'center' },
  statValue: { fontSize: 24, fontWeight: '800' },
  statLabel: { fontSize: 12, fontWeight: '600', marginTop: 2 },

  tabRow: { flexDirection: 'row', borderRadius: 12, padding: 4, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 9, alignItems: 'center', borderRadius: 10 },
  tabText: { fontSize: 13, fontWeight: '600' },

  listingsList: { gap: 10 },
  listingCard: { flexDirection: 'row', alignItems: 'center', borderRadius: 14, borderWidth: 1, overflow: 'hidden' },
  listingImage: { width: 64, height: 64 },
  listingContent: { flex: 1, paddingHorizontal: 12, paddingVertical: 10 },
  listingCat: { fontSize: 10, fontWeight: '700', letterSpacing: 0.4 },
  listingTitle: { fontSize: 14, fontWeight: '700', marginTop: 3 },
  listingLocRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  listingLoc: { fontSize: 12 },
  listingActions: { flexDirection: 'row', paddingRight: 14, gap: 12 },
  actionIcon: { padding: 4 },

  emptyState: { borderRadius: 14, borderWidth: 1, borderStyle: 'dashed', padding: 32, alignItems: 'center', gap: 8 },
  emptyTitle: { fontSize: 15, fontWeight: '700' },
  emptyDesc: { fontSize: 13, textAlign: 'center' },
});
