import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft, Star, MapPin, Phone, MessageCircle,
  Waves, UtensilsCrossed, Dumbbell, Sparkles, BedDouble, Map,
} from 'lucide-react-native';
import { useAuth } from '../contexts/AuthContext';
import { ensureChatExists } from '../lib/chat';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const BLUE = '#1E88E5';
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const amenityIcons: Record<string, React.ComponentType<any>> = {
  'Infinity Pool': Waves,
  'Fine Dining': UtensilsCrossed,
  'Pro Gym': Dumbbell,
  'Luxury Spa': Sparkles,
};

interface BusinessData {
  id: string;
  name: string;
  category: string;
  description: string;
  city: string;
  state: string;
  phone: string;
  rating: number;
  reviewCount: number;
  images: string[];
  amenities: string[];
  priceFrom?: number;
}

export default function BusinessDetailScreen({ route }: any) {
  const { businessId, businessName } = route.params;
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const [business, setBusiness] = useState<BusinessData | null>(null);

  useEffect(() => {
    loadBusiness();
  }, [businessId]);

  const loadBusiness = async () => {
    try {
      const snap = await getDoc(doc(db, 'businesses', businessId));
      if (snap.exists()) {
        const d = snap.data();
        setBusiness({
          id: snap.id,
          name: d.name || d.title || businessName,
          category: d.category || 'Business',
          description: d.description || '',
          city: d.city || 'Lagos',
          state: d.state || 'Lagos',
          phone: d.phone || '',
          rating: d.rating || 4.8,
          reviewCount: d.reviewCount || 0,
          images: d.images || [],
          amenities: d.amenities || ['Infinity Pool', 'Fine Dining', 'Pro Gym', 'Luxury Spa'],
          priceFrom: d.priceFrom,
        });
        // Backfill ownerId + participants on existing chats
        if (d.ownerId || d.userId || d.uid) {
          // Already has owner — nothing to do
        }
      }
    } catch {
      // Use defaults from route params
      setBusiness({
        id: businessId,
        name: businessName,
        category: 'Business',
        description: 'Experience the pinnacle of metropolitan sophistication. Nestled in the heart of the city, this architectural marvel offers unparalleled views and amenities.',
        city: 'Lagos',
        state: 'Lagos',
        phone: '',
        rating: 4.8,
        reviewCount: 120,
        images: [],
        amenities: ['Infinity Pool', 'Fine Dining', 'Pro Gym', 'Luxury Spa'],
        priceFrom: 245000,
      });
    }
  };

  const handleMessagePress = async () => {
    if (!user?.id || !business) return;
    try {
      const chatId = await ensureChatExists(
        business.id, user.id, business.name, user.name || 'User'
      );
      navigation.navigate('ChatDetail', {
        chatId,
        otherUserName: business.name,
        businessId: business.id,
        customerId: user.id,
      });
    } catch (error) {
      console.error('Error starting chat:', error);
    }
  };

  const s = styles();
  const b = business;
  const heroImage = b?.images?.[0];
  const location = b ? `${b.city}, ${b.state}` : '';

  return (
    <View style={s.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
        {/* ── Hero Image ── */}
        <View style={s.heroContainer}>
          {heroImage ? (
            <Image source={{ uri: heroImage }} style={s.heroImage} resizeMode="cover" />
          ) : (
            <View style={s.heroPlaceholder} />
          )}
          <View style={s.heroOverlay} />

          {/* Back button */}
          <TouchableOpacity style={s.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <ArrowLeft size={22} color="#fff" strokeWidth={2.5} />
          </TouchableOpacity>

          {/* Info Card */}
          <View style={s.infoCard}>
            <View style={s.badgeRow}>
              <View style={s.categoryBadge}>
                <Text style={s.categoryBadgeText}>{b?.category?.toUpperCase() || 'BUSINESS'}</Text>
              </View>
              <View style={s.ratingRow}>
                <Star size={14} color="#F59E0B" fill="#F59E0B" strokeWidth={0} />
                <Text style={s.ratingText}>{b?.rating?.toFixed(1) || '4.8'}</Text>
              </View>
            </View>

            <Text style={s.businessName}>{b?.name || businessName}</Text>

            <View style={s.locationRow}>
              <MapPin size={14} color="rgba(255,255,255,0.8)" strokeWidth={2} />
              <Text style={s.locationText}>{location}</Text>
            </View>

            <View style={s.actionRow}>
              <TouchableOpacity
                style={s.callBtn}
                activeOpacity={0.8}
                onPress={() => {/* phone call */}}
              >
                <Phone size={16} color="#fff" strokeWidth={2} />
                <Text style={s.callBtnText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.messageBtn}
                activeOpacity={0.8}
                onPress={handleMessagePress}
              >
                <MessageCircle size={16} color={BLUE} strokeWidth={2} />
                <Text style={s.messageBtnText}>Message</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── Overview ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Overview</Text>
          <Text style={s.overviewText}>{b?.description || 'Experience the pinnacle of metropolitan sophistication. Nestled in the heart of the city, this architectural marvel offers unparalleled views of the coastline. Every detail is curated for the global traveler seeking a fusion of modern architectural excellence and authentic Nigerian hospitality.'}</Text>
        </View>

        {/* ── Premium Amenities ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Premium Amenities</Text>
          <View style={s.amenitiesGrid}>
            {(b?.amenities || ['Infinity Pool', 'Fine Dining', 'Pro Gym', 'Luxury Spa']).slice(0, 4).map((amenity, i) => {
              const IconComp = amenityIcons[amenity] || Sparkles;
              return (
                <View key={i} style={s.amenityCard}>
                  <View style={s.amenityIconCircle}>
                    <IconComp size={22} color={BLUE} strokeWidth={2} />
                  </View>
                  <Text style={s.amenityLabel}>{amenity}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* ── Pricing Card ── */}
        {(b?.priceFrom || 245000) && (
          <View style={s.section}>
            <View style={s.pricingCard}>
              <View style={s.pricingTop}>
                <View style={s.pricingIconWrap}>
                  <BedDouble size={28} color={BLUE} strokeWidth={1.5} />
                </View>
                <View>
                  <Text style={s.pricingLabel}>STARTING FROM</Text>
                  <View style={s.priceRow}>
                    <Text style={s.priceValue}>₦{(b?.priceFrom || 245000).toLocaleString()}</Text>
                    <Text style={s.priceUnit}> / night</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={s.checkAvailabilityBtn} activeOpacity={0.8}>
                <Text style={s.checkAvailabilityText}>Check Availability</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── The Neighborhood ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>The Neighborhood</Text>
          <View style={s.mapCard}>
            <View style={s.mapPlaceholder}>
              <Map size={32} color="#94A3B8" strokeWidth={1.5} />
              <Text style={s.mapPlaceholderText}>Map preview</Text>
            </View>
            <TouchableOpacity style={s.exploreAreaPill} activeOpacity={0.8}>
              <MapPin size={14} color={BLUE} strokeWidth={2} />
              <Text style={s.exploreAreaText}>Explore {b?.city || 'Victoria Island'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

function styles() {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    scrollContent: { paddingBottom: 20 },

    /* Hero */
    heroContainer: {
      width: SCREEN_WIDTH,
      height: 360,
      position: 'relative',
    },
    heroImage: { width: '100%', height: '100%' },
    heroPlaceholder: {
      width: '100%', height: '100%',
      backgroundColor: '#1A5276',
    },
    heroOverlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.15)',
    },
    backBtn: {
      position: 'absolute',
      top: 48,
      left: 16,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(255,255,255,0.2)',
      alignItems: 'center',
      justifyContent: 'center',
    },

    /* Info Card */
    infoCard: {
      position: 'absolute',
      bottom: 0,
      left: 16,
      right: 16,
      backgroundColor: BLUE,
      borderRadius: 20,
      paddingHorizontal: 20,
      paddingTop: 18,
      paddingBottom: 20,
      shadowColor: BLUE,
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.35,
      shadowRadius: 16,
      elevation: 8,
    },
    badgeRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
    },
    categoryBadge: {
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 8,
      paddingHorizontal: 10,
      paddingVertical: 4,
    },
    categoryBadgeText: {
      color: '#fff',
      fontSize: 11,
      fontWeight: '700',
      letterSpacing: 0.8,
    },
    ratingRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 8,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    ratingText: {
      color: '#fff',
      fontSize: 13,
      fontWeight: '700',
    },
    businessName: {
      color: '#fff',
      fontSize: 24,
      fontWeight: '800',
      marginBottom: 6,
    },
    locationRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      marginBottom: 16,
    },
    locationText: {
      color: 'rgba(255,255,255,0.85)',
      fontSize: 13,
    },
    actionRow: {
      flexDirection: 'row',
      gap: 12,
    },
    callBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: '#fff',
      borderRadius: 12,
      paddingVertical: 12,
    },
    callBtnText: {
      color: BLUE,
      fontSize: 15,
      fontWeight: '700',
    },
    messageBtn: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      backgroundColor: 'rgba(255,255,255,0.15)',
      borderWidth: 1.5,
      borderColor: 'rgba(255,255,255,0.4)',
      borderRadius: 12,
      paddingVertical: 12,
    },
    messageBtnText: {
      color: '#fff',
      fontSize: 15,
      fontWeight: '700',
    },

    /* Sections */
    section: {
      paddingHorizontal: 20,
      marginTop: 28,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '800',
      color: '#0F172A',
      marginBottom: 14,
    },
    overviewText: {
      fontSize: 14,
      color: '#475569',
      lineHeight: 22,
    },

    /* Amenities */
    amenitiesGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
    },
    amenityCard: {
      width: '47%',
      alignItems: 'center',
      backgroundColor: '#fff',
      borderRadius: 16,
      paddingVertical: 20,
      paddingHorizontal: 12,
      gap: 10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
      elevation: 1,
    },
    amenityIconCircle: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor: 'rgba(30,136,229,0.1)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    amenityLabel: {
      fontSize: 13,
      fontWeight: '600',
      color: '#334155',
      textAlign: 'center',
    },

    /* Pricing */
    pricingCard: {
      backgroundColor: '#fff',
      borderRadius: 20,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    pricingTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 16,
      marginBottom: 16,
    },
    pricingIconWrap: {
      width: 56,
      height: 56,
      borderRadius: 16,
      backgroundColor: 'rgba(30,136,229,0.1)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    pricingLabel: {
      fontSize: 11,
      fontWeight: '700',
      color: '#94A3B8',
      letterSpacing: 0.8,
    },
    priceRow: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: 4,
      marginTop: 2,
    },
    priceValue: {
      fontSize: 28,
      fontWeight: '800',
      color: BLUE,
    },
    priceUnit: {
      fontSize: 14,
      color: '#94A3B8',
      fontWeight: '500',
    },
    checkAvailabilityBtn: {
      backgroundColor: BLUE,
      borderRadius: 14,
      paddingVertical: 14,
      alignItems: 'center',
    },
    checkAvailabilityText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '700',
    },

    /* Map */
    mapCard: {
      borderRadius: 20,
      overflow: 'hidden',
      backgroundColor: '#E2E8F0',
      position: 'relative',
    },
    mapPlaceholder: {
      height: 180,
      backgroundColor: '#D4E6F1',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    mapPlaceholderText: {
      fontSize: 12,
      color: '#94A3B8',
    },
    exploreAreaPill: {
      position: 'absolute',
      bottom: 12,
      left: 12,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      backgroundColor: '#fff',
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingVertical: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 3,
    },
    exploreAreaText: {
      fontSize: 13,
      fontWeight: '600',
      color: BLUE,
    },
  });
}
