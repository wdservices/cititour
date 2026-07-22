import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, ActivityIndicator, RefreshControl, Alert, Modal,
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
  collection: string;
  raw: Record<string, any>;
}

type Tab = 'businesses' | 'products' | 'events';

const TAB_COLLECTIONS: Record<Tab, string> = {
  businesses: 'businesses',
  products: 'marketplace',
  events: 'events',
};

export default function MyDashboardScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const [tab, setTab] = useState<Tab>('businesses');
  const [listings, setListings] = useState<OwnerListing[]>([]);
  const [loading, setLoading] = useState(true);

  // Delete confirmation state
  const [deleteTarget, setDeleteTarget] = useState<OwnerListing | null>(null);
  const [deleteStep, setDeleteStep] = useState<0 | 1 | 2>(0);

  const loadListings = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const results: OwnerListing[] = [];

      // Businesses
      const bizQ = query(collection(db, 'businesses'), where('ownerId', '==', user.id));
      const bizSnap = await getDocs(bizQ);
      for (const d of bizSnap.docs) {
        const data = d.data();
        results.push({
          id: d.id,
          title: data.name || data.title || 'Untitled',
          category: data.category || 'Business',
          location: data.city || data.location || '',
          image: data.image || (Array.isArray(data.images) && data.images[0]) || '',
          status: data.status || 'Active',
          collection: 'businesses',
          raw: data,
        });
      }

      // Products
      const prodQ = query(collection(db, 'marketplace'), where('ownerId', '==', user.id));
      const prodSnap = await getDocs(prodQ);
      for (const d of prodSnap.docs) {
        const data = d.data();
        results.push({
          id: d.id,
          title: data.name || data.title || 'Untitled',
          category: data.category || 'Product',
          location: '',
          image: data.image || (Array.isArray(data.images) && data.images[0]) || '',
          status: data.status || 'Active',
          collection: 'marketplace',
          raw: data,
        });
      }

      // Events
      const evQ = query(collection(db, 'events'), where('ownerId', '==', user.id));
      const evSnap = await getDocs(evQ);
      for (const d of evSnap.docs) {
        const data = d.data();
        results.push({
          id: d.id,
          title: data.name || data.title || 'Untitled',
          category: data.category || 'Event',
          location: data.city || data.state || '',
          image: data.image || (Array.isArray(data.images) && data.images[0]) || '',
          status: data.status || 'Active',
          collection: 'events',
          raw: data,
        });
      }

      setListings(results);
    } catch {
      setListings([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(useCallback(() => { loadListings(); }, [loadListings]));

  const filteredListings = listings.filter((l) => {
    if (tab === 'businesses') return l.collection === 'businesses';
    if (tab === 'products') return l.collection === 'marketplace';
    if (tab === 'events') return l.collection === 'events';
    return false;
  });

  const handleEdit = (item: OwnerListing) => {
    navigation.navigate('CreateListing', {
      editType: item.collection === 'businesses' ? 'business' : item.collection === 'marketplace' ? 'product' : 'event',
      editData: { id: item.id, ...item.raw },
    });
  };

  const initiateDelete = (item: OwnerListing) => {
    setDeleteTarget(item);
    setDeleteStep(1);
  };

  const confirmDeleteStep1 = () => {
    setDeleteStep(2);
  };

  const confirmDeleteStep2 = async () => {
    if (!deleteTarget) return;
    const collectionName = deleteTarget.collection;
    setListings((prev) => prev.filter((l) => l.id !== deleteTarget.id));
    setDeleteStep(0);
    setDeleteTarget(null);
    try {
      await deleteDoc(doc(db, collectionName, deleteTarget.id));
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to delete');
      loadListings();
    }
  };

  const cancelDelete = () => {
    setDeleteStep(0);
    setDeleteTarget(null);
  };

  const handleCreate = () => {
    navigation.navigate('CreateListing');
  };

  const bizCount = listings.filter((l) => l.collection === 'businesses').length;
  const eventCount = listings.filter((l) => l.collection === 'events').length;
  const prodCount = listings.filter((l) => l.collection === 'marketplace').length;

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
          onPress={handleCreate}
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
            <Text style={[s.statValue, { color: colors.primary }]}>{bizCount}</Text>
            <Text style={[s.statLabel, { color: colors.mutedForeground }]}>Businesses</Text>
          </View>
          <View style={[s.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[s.statValue, { color: colors.accent }]}>{prodCount}</Text>
            <Text style={[s.statLabel, { color: colors.mutedForeground }]}>Products</Text>
          </View>
          <View style={[s.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[s.statValue, { color: colors.success }]}>{eventCount}</Text>
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
        ) : filteredListings.length === 0 ? (
          <View style={[s.emptyState, { borderColor: colors.border, backgroundColor: colors.muted }]}>
            <Package size={36} color={colors.mutedForeground} strokeWidth={1.5} />
            <Text style={[s.emptyTitle, { color: colors.foreground }]}>No {tab} yet</Text>
            <Text style={[s.emptyDesc, { color: colors.mutedForeground }]}>
              {tab === 'businesses' && 'Create your first business to get started'}
              {tab === 'products' && 'Register a business first, then post products'}
              {tab === 'events' && 'Create your first event to get started'}
            </Text>
            {tab === 'businesses' ? (
              <TouchableOpacity style={[s.emptyBtn, { borderColor: colors.primary }]} onPress={handleCreate}>
                <Text style={{ color: colors.primary, fontWeight: '700', fontSize: 13 }}>Create Business</Text>
              </TouchableOpacity>
            ) : null}
          </View>
        ) : (
          <View style={s.listingsList}>
            {filteredListings.map((item) => (
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
                  <TouchableOpacity style={s.actionIcon} onPress={() => handleEdit(item)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Edit3 size={16} color={colors.mutedForeground} strokeWidth={2} />
                  </TouchableOpacity>
                  <TouchableOpacity style={s.actionIcon} onPress={() => initiateDelete(item)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Trash2 size={16} color={colors.destructive} strokeWidth={2} />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}
        <View style={{ height: insets.bottom + 40 }} />
      </ScrollView>

      {/* ── Delete Confirmation: Step 1 ── */}
      <Modal visible={deleteStep === 1} transparent animationType="fade" onRequestClose={cancelDelete}>
        <TouchableOpacity style={s.modalOverlay} activeOpacity={1} onPress={cancelDelete}>
          <View style={[s.modalCard, { backgroundColor: colors.card }]}>
            <Text style={[s.modalTitle, { color: colors.foreground }]}>Delete "{deleteTarget?.title}"?</Text>
            <Text style={[s.modalDesc, { color: colors.mutedForeground }]}>
              This listing will be removed from public view immediately.
            </Text>
            <View style={s.modalBtnRow}>
              <TouchableOpacity style={[s.modalBtn, { backgroundColor: colors.muted }]} onPress={cancelDelete}>
                <Text style={[s.modalBtnText, { color: colors.foreground }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.modalBtn, { backgroundColor: colors.destructive }]} onPress={confirmDeleteStep1}>
                <Text style={[s.modalBtnText, { color: '#fff' }]}>Yes, Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── Delete Confirmation: Step 2 (final) ── */}
      <Modal visible={deleteStep === 2} transparent animationType="fade" onRequestClose={cancelDelete}>
        <TouchableOpacity style={s.modalOverlay} activeOpacity={1} onPress={cancelDelete}>
          <View style={[s.modalCard, { backgroundColor: colors.card }]}>
            <Text style={[s.modalTitle, { color: colors.destructive }]}>Final Confirmation</Text>
            <Text style={[s.modalDesc, { color: colors.mutedForeground }]}>
              Are you absolutely sure? This will permanently delete <Text style={{ fontWeight: '700', color: colors.foreground }}>"{deleteTarget?.title}"</Text>. This cannot be undone.
            </Text>
            <View style={s.modalBtnRow}>
              <TouchableOpacity style={[s.modalBtn, { backgroundColor: colors.muted }]} onPress={cancelDelete}>
                <Text style={[s.modalBtnText, { color: colors.foreground }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.modalBtn, { backgroundColor: colors.destructive }]} onPress={confirmDeleteStep2}>
                <Text style={[s.modalBtnText, { color: '#fff' }]}>Delete Permanently</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
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
  emptyBtn: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 8, marginTop: 8 },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', padding: 24 },
  modalCard: { borderRadius: 16, padding: 24, gap: 10 },
  modalTitle: { fontSize: 18, fontWeight: '800' },
  modalDesc: { fontSize: 14, lineHeight: 20 },
  modalBtnRow: { flexDirection: 'row', gap: 12, marginTop: 12 },
  modalBtn: { flex: 1, borderRadius: 12, paddingVertical: 13, alignItems: 'center', justifyContent: 'center' },
  modalBtnText: { fontSize: 14, fontWeight: '700' },
});
