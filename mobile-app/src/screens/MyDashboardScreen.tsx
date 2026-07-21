import React, { useState } from 'react';
import {
  View, ScrollView, Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  LayoutGrid, CalendarDays, DollarSign, Eye, Plus, MapPin, ChevronRight,
} from 'lucide-react-native';
import GlassHeader from '../components/GlassHeader';

const BLUE = '#1E88E5';
const GOLD = '#D9891F';

const stats = [
  { icon: LayoutGrid, label: 'Total Items', value: '12', color: BLUE },
  { icon: CalendarDays, label: 'Active Events', value: '03', color: GOLD },
  { icon: DollarSign, label: 'Earnings', value: '₦420k', color: '#10B981' },
  { icon: Eye, label: 'Views', value: '1.8k', color: '#8B5CF6' },
];

const businesses = [
  { id: '1', name: 'Eko Art & Style Boutique', location: 'Victoria Island, Lagos', status: 'Active', imageColor: '#2C3E50' },
  { id: '2', name: 'Lekki Sky Lounge', location: 'Lekki Phase 1', status: 'Active', imageColor: '#1A5276' },
];

const hostedEvents = [
  { id: '1', name: 'Sunset Jazz & Jollof', date: 'Aug 28 • 6:00 PM', status: 'SOLD OUT', imageColor: '#D9891F' },
];

export default function MyDashboardScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={s.container}>
      <GlassHeader title="Tour Lagos" />

      <ScrollView contentContainerStyle={s.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Text style={s.bigTitle}>My Dashboard</Text>
        <Text style={s.subtitle}>Manage your premium listings and cultural experiences.</Text>

        {/* Stats grid */}
        <View style={s.statsGrid}>
          {stats.map((stat) => (
            <View key={stat.label} style={s.statCard}>
              <View style={[s.statIcon, { backgroundColor: stat.color + '12' }]}>
                <stat.icon size={22} color={stat.color} strokeWidth={2} />
              </View>
              <Text style={s.statLabel}>{stat.label}</Text>
              <Text style={s.statValue}>{stat.value}</Text>
            </View>
          ))}
        </View>

        {/* My Businesses */}
        <View style={s.sectionHeader}>
          <Text style={s.sectionTitle}>My Businesses</Text>
          <TouchableOpacity style={s.seeAllBtn}>
            <Text style={s.seeAllText}>See all</Text>
            <ChevronRight size={14} color={BLUE} strokeWidth={2.5} />
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.businessScroll}>
          {businesses.map((biz) => (
            <TouchableOpacity key={biz.id} style={s.businessCard} activeOpacity={0.85}>
              <View style={[s.businessImage, { backgroundColor: biz.imageColor }]}>
                <View style={s.statusBadge}>
                  <View style={s.statusDot} />
                  <Text style={s.statusText}>{biz.status}</Text>
                </View>
              </View>
              <View style={s.businessContent}>
                <Text style={s.businessName} numberOfLines={1}>{biz.name}</Text>
                <View style={s.businessLocationRow}>
                  <MapPin size={11} color="#94A3B8" strokeWidth={2} />
                  <Text style={s.businessLocation} numberOfLines={1}>{biz.location}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Hosted Events */}
        <Text style={s.sectionTitle}>Hosted Events</Text>
        {hostedEvents.map((ev) => (
          <TouchableOpacity key={ev.id} style={s.eventCard} activeOpacity={0.85}>
            <View style={[s.eventImage, { backgroundColor: ev.imageColor }]} />
            <View style={s.eventContent}>
              <Text style={s.eventName}>{ev.name}</Text>
              <Text style={s.eventDate}>{ev.date}</Text>
              <View style={s.eventStatusRow}>
                <View style={s.soldOutBadge}>
                  <Text style={s.soldOutText}>{ev.status}</Text>
                </View>
                <TouchableOpacity>
                  <Text style={s.manageText}>Manage Bookings</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Marketplace Items */}
        <Text style={s.sectionTitle}>Marketplace Items</Text>
        <View style={s.emptyMarketplace}>
          <View style={s.emptyIconCircle}>
            <Text style={s.emptyIconEmoji}>🛒</Text>
          </View>
          <Text style={s.emptyTitle}>No active listings</Text>
          <Text style={s.emptyDesc}>Monetize your crafts or cultural artifacts today.</Text>
          <TouchableOpacity style={s.startSellingBtn} activeOpacity={0.8}>
            <Text style={s.startSellingText}>Start Selling</Text>
          </TouchableOpacity>
        </View>

        {/* Create New Listing */}
        <TouchableOpacity style={s.createBtn} activeOpacity={0.8}>
          <Plus size={20} color="#fff" strokeWidth={2.5} />
          <Text style={s.createBtnText}>Create New Listing</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 20 },

  bigTitle: { fontSize: 28, fontWeight: '800', color: '#0F172A', marginTop: 8, marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#64748B', lineHeight: 20, marginBottom: 20 },

  /* Stats */
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 24 },
  statCard: {
    width: '47%', backgroundColor: '#fff', borderRadius: 18, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  statIcon: {
    width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center', marginBottom: 10,
  },
  statLabel: { fontSize: 12, color: '#94A3B8', fontWeight: '500' },
  statValue: { fontSize: 22, fontWeight: '800', color: '#0F172A', marginTop: 2 },

  /* Sections */
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#0F172A', marginBottom: 14 },
  seeAllBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAllText: { fontSize: 13, fontWeight: '600', color: BLUE },

  /* Business cards */
  businessScroll: { gap: 14, marginBottom: 24 },
  businessCard: {
    width: 220, backgroundColor: '#fff', borderRadius: 18, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  businessImage: {
    height: 130, justifyContent: 'flex-start', padding: 12, alignItems: 'flex-end',
  },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4,
  },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' },
  statusText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  businessContent: { padding: 14 },
  businessName: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  businessLocationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 4 },
  businessLocation: { fontSize: 12, color: '#94A3B8', flex: 1 },

  /* Event card */
  eventCard: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 18, overflow: 'hidden', marginBottom: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  eventImage: { width: 80, height: 80 },
  eventContent: { flex: 1, padding: 12, justifyContent: 'center' },
  eventName: { fontSize: 14, fontWeight: '700', color: '#0F172A' },
  eventDate: { fontSize: 12, color: '#94A3B8', marginTop: 3 },
  eventStatusRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 6 },
  soldOutBadge: {
    backgroundColor: '#FEF2F2', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3,
  },
  soldOutText: { color: '#EF4444', fontSize: 11, fontWeight: '700' },
  manageText: { color: BLUE, fontSize: 12, fontWeight: '600' },

  /* Empty marketplace */
  emptyMarketplace: {
    backgroundColor: '#fff', borderRadius: 18, padding: 30, alignItems: 'center',
    borderWidth: 1.5, borderColor: '#E2E8F0', borderStyle: 'dashed' as const, marginBottom: 16,
  },
  emptyIconCircle: {
    width: 56, height: 56, borderRadius: 28,
    backgroundColor: BLUE + '10', alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  emptyIconEmoji: { fontSize: 24 },
  emptyTitle: { fontSize: 15, fontWeight: '700', color: '#0F172A' },
  emptyDesc: { fontSize: 13, color: '#94A3B8', marginTop: 4, textAlign: 'center' },
  startSellingBtn: {
    marginTop: 14, borderWidth: 1.5, borderColor: BLUE, borderRadius: 12,
    paddingHorizontal: 20, paddingVertical: 10,
  },
  startSellingText: { color: BLUE, fontSize: 13, fontWeight: '700' },

  /* Create button */
  createBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: BLUE, borderRadius: 16, paddingVertical: 16,
  },
  createBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
