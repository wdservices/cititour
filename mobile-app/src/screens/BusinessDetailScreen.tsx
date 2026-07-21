import React, { useEffect, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Dimensions, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Star, MapPin, Phone, MessageCircle, Sparkles } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { ensureChatExists } from '../lib/chat';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getMockImage } from '../lib/mockImages';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

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
  ownerId?: string;
}

export default function BusinessDetailScreen({ route }: any) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { businessId, businessName } = route.params;
  const [business, setBusiness] = useState<BusinessData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const snap = await getDoc(doc(db, 'businesses', businessId));
        if (snap.exists()) {
          const d = snap.data();
          setBusiness({
            id: snap.id,
            name: d.name || d.title || businessName,
            category: d.category || 'Business',
            description: d.description || '',
            city: d.city || '',
            state: d.state || '',
            phone: d.phone || '',
            rating: d.rating || 0,
            reviewCount: d.reviewCount || 0,
            images: d.images || [],
            amenities: d.amenities || [],
            priceFrom: d.priceFrom,
            ownerId: d.ownerId,
          });
        }
      } catch {}
      setLoading(false);
    })();
  }, [businessId, businessName]);

  const handleMessagePress = async () => {
    if (!user?.id || !business) return;
    try {
      const chatId = await ensureChatExists(business.id, user.id, business.name, user.name || 'User');
      navigation.navigate('ChatDetail', {
        chatId,
        otherUserName: business.name,
        businessId: business.id,
        customerId: user.id,
      });
    } catch {}
  };

  if (loading) {
    return (
      <View style={[s.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <ActivityIndicator style={{ marginTop: 60 }} color={colors.primary} size="large" />
      </View>
    );
  }

  const b = business;
  if (!b) {
    return (
      <View style={[s.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <View style={s.notFound}>
          <Text style={[s.notFoundTitle, { color: colors.foreground }]}>Listing not found</Text>
          <Text style={[s.notFoundDesc, { color: colors.mutedForeground }]}>
            This business may no longer be available.
          </Text>
        </View>
      </View>
    );
  }

  const heroImage = b.images?.[0] || getMockImage(b.category);
  const location = [b.city, b.state].filter(Boolean).join(', ');

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Hero Image */}
        <View style={[s.heroContainer, { height: 280 + insets.top }]}>
          <Image source={{ uri: heroImage }} style={s.heroImage} resizeMode="cover" />
          <View style={s.heroOverlay} />

          {/* Title overlay */}
          <View style={[s.heroContent, { bottom: insets.top + 16 }]}>
            <View style={s.badgeRow}>
              <View style={[s.categoryBadge, { backgroundColor: `${colors.primary}E6` }]}>
                <Text style={s.categoryBadgeText}>{b.category.toUpperCase()}</Text>
              </View>
              {b.rating > 0 && (
                <View style={[s.ratingPill, { backgroundColor: 'rgba(0,0,0,0.35)' }]}>
                  <Star size={13} color={colors.warning} fill={colors.warning} strokeWidth={0} />
                  <Text style={s.ratingText}>{b.rating.toFixed(1)}</Text>
                </View>
              )}
            </View>
            <Text style={s.businessName}>{b.name}</Text>
            {location ? (
              <View style={s.locationRow}>
                <MapPin size={13} color="rgba(255,255,255,0.85)" strokeWidth={2} />
                <Text style={s.locationText}>{location}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Action buttons */}
        <View style={[s.actionRow, { paddingHorizontal: 16, marginTop: 20 }]}>
          {b.phone ? (
            <TouchableOpacity
              style={[s.actionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
              activeOpacity={0.7}
            >
              <Phone size={17} color={colors.primary} strokeWidth={2} />
              <Text style={[s.actionBtnText, { color: colors.primary }]}>Call</Text>
            </TouchableOpacity>
          ) : null}
          <TouchableOpacity
            style={[s.actionBtn, s.messageBtn, { backgroundColor: colors.primary }]}
            activeOpacity={0.7}
            onPress={handleMessagePress}
          >
            <MessageCircle size={17} color="#fff" strokeWidth={2} />
            <Text style={s.messageBtnText}>Message</Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        {b.description ? (
          <View style={[s.section, { paddingHorizontal: 16, marginTop: 24 }]}>
            <Text style={[s.sectionTitle, { color: colors.foreground }]}>About</Text>
            <Text style={[s.aboutText, { color: colors.mutedForeground }]}>{b.description}</Text>
          </View>
        ) : null}

        {/* Amenities */}
        {b.amenities.length > 0 ? (
          <View style={[s.section, { paddingHorizontal: 16, marginTop: 24 }]}>
            <Text style={[s.sectionTitle, { color: colors.foreground }]}>Amenities</Text>
            <View style={s.amenitiesRow}>
              {b.amenities.slice(0, 6).map((amenity, i) => (
                <View key={i} style={[s.amenityChip, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Sparkles size={13} color={colors.primary} strokeWidth={2} />
                  <Text style={[s.amenityText, { color: colors.foreground }]}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* Pricing */}
        {b.priceFrom ? (
          <View style={[s.section, { paddingHorizontal: 16, marginTop: 24 }]}>
            <View style={[s.pricingCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[s.pricingLabel, { color: colors.mutedForeground }]}>STARTING FROM</Text>
              <Text style={[s.pricingValue, { color: colors.primary }]}>
                ₦{b.priceFrom.toLocaleString()}
              </Text>
              <TouchableOpacity style={[s.checkBtn, { backgroundColor: colors.primary }]} activeOpacity={0.7}>
                <Text style={s.checkBtnText}>Check Availability</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  heroContainer: { width: SCREEN_WIDTH, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  heroContent: { position: 'absolute', left: 16, right: 16 },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  categoryBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  categoryBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
  ratingPill: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  ratingText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  businessName: { color: '#fff', fontSize: 24, fontWeight: '800', letterSpacing: -0.5, marginBottom: 6 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationText: { color: 'rgba(255,255,255,0.85)', fontSize: 13 },

  actionRow: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 12, paddingVertical: 13, borderWidth: 1 },
  actionBtnText: { fontSize: 15, fontWeight: '700' },
  messageBtn: { borderWidth: 0 },
  messageBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  section: { marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.2, marginBottom: 12 },
  aboutText: { fontSize: 14, lineHeight: 22 },

  amenitiesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  amenityChip: { flexDirection: 'row', alignItems: 'center', gap: 6, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1 },
  amenityText: { fontSize: 13, fontWeight: '500' },

  pricingCard: { borderRadius: 16, padding: 20, borderWidth: 1 },
  pricingLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
  pricingValue: { fontSize: 28, fontWeight: '800', marginTop: 4 },
  checkBtn: { borderRadius: 12, paddingVertical: 13, alignItems: 'center', marginTop: 16 },
  checkBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  notFound: { alignItems: 'center', marginTop: 80, gap: 8 },
  notFoundTitle: { fontSize: 18, fontWeight: '700' },
  notFoundDesc: { fontSize: 14, textAlign: 'center' },
});
