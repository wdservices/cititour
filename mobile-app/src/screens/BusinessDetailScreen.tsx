import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Dimensions,
  ActivityIndicator, Linking, TextInput, Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Star, MapPin, Phone, MessageCircle, Sparkles, ArrowLeft,
  Calendar, Clock, Ticket, Users, Minus, Plus, ChevronRight, Share,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { ensureChatExists } from '../lib/chat';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { getMockImage } from '../lib/mockImages';
import { ReadOnlyMap } from '../components/ReadOnlyMap';
import { useBusinessDetail } from '../lib/useBusinessDetail';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface TicketTier {
  name: string;
  price: number;
  quantity: number;
}

type BookingStep = 'details' | 'register' | 'payment' | 'success';

export default function BusinessDetailScreen({ route }: any) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { businessId, businessName, isEvent, eventData } = route.params || {};

  const { loading, business } = useBusinessDetail(businessId);
  const avgRating = business?.avgRating ?? null;
  const reviewCount = business?.reviewCount ?? 0;

  // Event booking state
  const [selectedTier, setSelectedTier] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [bookingStep, setBookingStep] = useState<BookingStep>('details');
  const [regName, setRegName] = useState(user?.name || '');
  const [regEmail, setRegEmail] = useState(user?.email || '');
  const [regPhone, setRegPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet' | 'transfer'>('wallet');
  const [submitting, setSubmitting] = useState(false);

  const handleMessagePress = async () => {
    const ownerId = eventData?.ownerId || business?.ownerId;
    if (!user?.id || !ownerId || ownerId === user.id) return;
    try {
      const chatId = await ensureChatExists(ownerId, user.id, business?.name || businessName, user.name || 'User');
      navigation.navigate('ChatDetail', {
        chatId,
        otherUserName: business?.name || businessName,
        businessId: ownerId,
        customerId: user.id,
      });
    } catch {}
  };

  const handleCallPress = () => {
    if (business?.phone) {
      Linking.openURL(`tel:${business.phone}`);
    }
  };

  // Event booking handlers
  const totalCost = isEvent && selectedTier !== null && eventData?.ticketTypes
    ? (eventData.ticketTypes[selectedTier]?.price || 0) * quantity
    : 0;

  const handleBookNow = () => {
    if (!user?.id) { Alert.alert('Sign In', 'Please sign in to book events.'); return; }
    if (eventData?.ticketTypes && eventData.ticketTypes.length > 0 && selectedTier === null) {
      Alert.alert('Select Ticket', 'Please select a ticket type first.');
      return;
    }
    setBookingStep('register');
  };

  const handleRegisterSubmit = () => {
    if (!regName.trim() || !regEmail.trim()) {
      Alert.alert('Required', 'Please fill in your name and email.');
      return;
    }
    if (totalCost > 0) {
      setBookingStep('payment');
    } else {
      submitOrder();
    }
  };

  const submitOrder = async () => {
    setSubmitting(true);
    try {
      const tier = eventData?.ticketTypes?.[selectedTier || 0];
      await addDoc(collection(db, 'ticket_orders'), {
        eventId: businessId,
        eventTitle: business?.name || businessName,
        ownerId: eventData?.ownerId || business?.ownerId || '',
        buyerId: user?.id || '',
        buyerName: regName,
        buyerEmail: regEmail,
        buyerPhone: regPhone,
        ticketTier: tier?.name || 'General',
        quantity,
        amount: totalCost,
        totalAmount: totalCost,
        paymentMethod: totalCost === 0 ? 'free' : paymentMethod,
        status: 'confirmed',
        createdAt: serverTimestamp(),
      });
      setBookingStep('success');
    } catch {
      Alert.alert('Error', 'Failed to complete booking. Please try again.');
    }
    setSubmitting(false);
  };

  const resetBooking = () => {
    setBookingStep('details');
    setSelectedTier(null);
    setQuantity(1);
  };

  // ── RENDER: SUCCESS ──
  if (bookingStep === 'success') {
    return (
      <View style={[s.container, { backgroundColor: colors.background, paddingTop: insets.top + 20 }]}>
        <View style={s.successWrap}>
          <View style={[s.successIcon, { backgroundColor: `${colors.primary}20` }]}>
            <Text style={{ fontSize: 40 }}>🎉</Text>
          </View>
          <Text style={[s.successTitle, { color: colors.foreground }]}>You're In!</Text>
          <Text style={[s.successSub, { color: colors.mutedForeground }]}>
            {businessName || 'Event'}
          </Text>
          {selectedTier !== null && eventData?.ticketTypes?.[selectedTier] && (
            <Text style={[s.successDetail, { color: colors.mutedForeground }]}>
              {eventData.ticketTypes[selectedTier].name} × {quantity}
            </Text>
          )}
          {totalCost > 0 && (
            <Text style={[s.successPrice, { color: colors.primary }]}>₦{totalCost.toLocaleString()}</Text>
          )}
          <Text style={[s.successNote, { color: colors.mutedForeground }]}>
            A confirmation has been sent to {regEmail}
          </Text>
          <TouchableOpacity
            style={[s.successBtn, { backgroundColor: colors.primary }]}
            onPress={() => { resetBooking(); navigation.goBack(); }}
          >
            <Text style={s.successBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── RENDER: PAYMENT ──
  if (bookingStep === 'payment') {
    return (
      <View style={[s.container, { backgroundColor: colors.background }]}>
        <View style={[s.bookingHeader, { paddingTop: insets.top + 6, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => setBookingStep('register')} style={s.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <ArrowLeft size={22} color={colors.foreground} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={[s.bookingTitle, { color: colors.foreground }]}>Payment</Text>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <View style={[s.orderSummary, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[s.orderLabel, { color: colors.mutedForeground }]}>ORDER SUMMARY</Text>
            <Text style={[s.orderEvent, { color: colors.foreground }]}>{businessName}</Text>
            {selectedTier !== null && eventData?.ticketTypes?.[selectedTier] && (
              <>
                <Text style={[s.orderTier, { color: colors.mutedForeground }]}>
                  {eventData.ticketTypes[selectedTier].name} × {quantity}
                </Text>
                <View style={[s.orderDivider, { backgroundColor: colors.border }]} />
                <View style={s.orderTotalRow}>
                  <Text style={[s.orderTotalLabel, { color: colors.foreground }]}>Total</Text>
                  <Text style={[s.orderTotalPrice, { color: colors.primary }]}>₦{totalCost.toLocaleString()}</Text>
                </View>
              </>
            )}
          </View>

          <Text style={[s.payMethodLabel, { color: colors.foreground, marginTop: 20 }]}>Payment Method</Text>
          {(['wallet', 'card', 'transfer'] as const).map((method) => (
            <TouchableOpacity
              key={method}
              style={[s.payOption, { backgroundColor: colors.card, borderColor: paymentMethod === method ? colors.primary : colors.border }]}
              onPress={() => setPaymentMethod(method)}
            >
              <View style={[s.payRadio, { borderColor: paymentMethod === method ? colors.primary : colors.mutedForeground, backgroundColor: paymentMethod === method ? colors.primary : 'transparent' }]} />
              <Text style={[s.payOptionText, { color: colors.foreground }]}>
                {method === 'wallet' ? 'Wallet (In-App)' : method === 'card' ? 'Credit / Debit Card' : 'Bank Transfer'}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[s.payBtn, { backgroundColor: colors.primary, opacity: submitting ? 0.6 : 1 }]}
            onPress={submitOrder}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={s.payBtnText}>Pay ₦{totalCost.toLocaleString()}</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // ── RENDER: REGISTER ──
  if (bookingStep === 'register') {
    return (
      <View style={[s.container, { backgroundColor: colors.background }]}>
        <View style={[s.bookingHeader, { paddingTop: insets.top + 6, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => setBookingStep('details')} style={s.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <ArrowLeft size={22} color={colors.foreground} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={[s.bookingTitle, { color: colors.foreground }]}>Registration</Text>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          <View style={[s.regForm, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[s.regLabel, { color: colors.foreground }]}>Full Name *</Text>
            <TextInput
              value={regName}
              onChangeText={setRegName}
              placeholder="Your full name"
              placeholderTextColor={colors.mutedForeground}
              style={[s.regInput, { color: colors.foreground, borderColor: colors.border }]}
            />
            <Text style={[s.regLabel, { color: colors.foreground }]}>Email *</Text>
            <TextInput
              value={regEmail}
              onChangeText={setRegEmail}
              placeholder="your@email.com"
              placeholderTextColor={colors.mutedForeground}
              keyboardType="email-address"
              autoCapitalize="none"
              style={[s.regInput, { color: colors.foreground, borderColor: colors.border }]}
            />
            <Text style={[s.regLabel, { color: colors.foreground }]}>Phone (optional)</Text>
            <TextInput
              value={regPhone}
              onChangeText={setRegPhone}
              placeholder="+234..."
              placeholderTextColor={colors.mutedForeground}
              keyboardType="phone-pad"
              style={[s.regInput, { color: colors.foreground, borderColor: colors.border }]}
            />
          </View>

          {totalCost > 0 && (
            <View style={[s.quantityCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[s.quantityLabel, { color: colors.foreground }]}>Quantity</Text>
              <View style={s.quantityRow}>
                <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))} style={[s.qtyBtn, { borderColor: colors.border }]}>
                  <Minus size={16} color={colors.foreground} strokeWidth={2} />
                </TouchableOpacity>
                <Text style={[s.qtyValue, { color: colors.foreground }]}>{quantity}</Text>
                <TouchableOpacity onPress={() => setQuantity(quantity + 1)} style={[s.qtyBtn, { borderColor: colors.border }]}>
                  <Plus size={16} color={colors.foreground} strokeWidth={2} />
                </TouchableOpacity>
                <Text style={[s.qtyTotal, { color: colors.primary }]}>₦{totalCost.toLocaleString()}</Text>
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[s.payBtn, { backgroundColor: colors.primary, opacity: submitting ? 0.6 : 1 }]}
            onPress={handleRegisterSubmit}
            disabled={submitting}
          >
            <Text style={s.payBtnText}>
              {totalCost > 0 ? `Continue to Payment — ₦${totalCost.toLocaleString()}` : 'Confirm Reservation'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  // ── RENDER: DETAILS (default) ──
  const biz = business;
  const heroImage = eventData?.image || biz?.images?.[0] || getMockImage(biz?.category || 'Business');
  const location = isEvent ? (eventData?.location || '') : ([biz?.city, biz?.state].filter(Boolean).join(', '));
  const tags = eventData?.tags || [];
  const ticketTypes: TicketTier[] = eventData?.ticketTypes || [];
  const hasLatLon = eventData?.lat && eventData?.lon;

  if (loading) {
    return (
      <View style={[s.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <ActivityIndicator style={{ marginTop: 60 }} color={colors.primary} size="large" />
      </View>
    );
  }

  const name = biz?.name || businessName || 'Listing';
  if (!biz && !isEvent) {
    return (
      <View style={[s.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <View style={s.notFound}>
          <Text style={[s.notFoundTitle, { color: colors.foreground }]}>Not found</Text>
          <Text style={[s.notFoundDesc, { color: colors.mutedForeground }]}>This listing may no longer be available.</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: isEvent ? 100 : 40 }}>
        {/* Hero Image */}
        <View style={[s.heroContainer, { height: 280 + insets.top }]}>
          <Image source={{ uri: heroImage }} style={s.heroImage} resizeMode="cover" />
          <View style={s.heroOverlay} />

          {/* Back button */}
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[s.backBtnHero, { top: insets.top + 12 }]}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ArrowLeft size={22} color="#fff" strokeWidth={2} />
          </TouchableOpacity>

          {/* Title overlay */}
          <View style={[s.heroContent, { bottom: insets.top + 16 }]}>
            <View style={s.badgeRow}>
              <View style={[s.categoryBadge, { backgroundColor: `${colors.primary}E6` }]}>
                <Text style={s.categoryBadgeText}>{(eventData?.category || biz?.category || 'Business').toUpperCase()}</Text>
              </View>
              {(avgRating !== null || (biz && biz.rating > 0)) && (
                <View style={[s.ratingPill, { backgroundColor: 'rgba(0,0,0,0.35)' }]}>
                  <Star size={13} color={colors.warning} fill={colors.warning} strokeWidth={0} />
                  <Text style={s.ratingText}>{(avgRating || biz?.rating || 0).toFixed(1)}</Text>
                  {reviewCount > 0 && <Text style={s.ratingCountText}>({reviewCount})</Text>}
                </View>
              )}
            </View>
            <Text style={s.businessName}>{name}</Text>
            {location ? (
              <View style={s.locationRow}>
                <MapPin size={13} color="rgba(255,255,255,0.85)" strokeWidth={2} />
                <Text style={s.locationText}>{location}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* ── EVENT-SPECIFIC: Date/Time ── */}
        {isEvent && (eventData?.startDate || eventData?.startTime) ? (
          <View style={[s.dateTimeRow, { paddingHorizontal: 16, marginTop: 16 }]}>
            {eventData.startDate ? (
              <View style={[s.dateTimeChip, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Calendar size={16} color={colors.primary} strokeWidth={2} />
                <View>
                  <Text style={[s.dateTimeLabel, { color: colors.mutedForeground }]}>Date</Text>
                  <Text style={[s.dateTimeValue, { color: colors.foreground }]}>{eventData.startDate}</Text>
                </View>
              </View>
            ) : null}
            {eventData.startTime ? (
              <View style={[s.dateTimeChip, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Clock size={16} color={colors.primary} strokeWidth={2} />
                <View>
                  <Text style={[s.dateTimeLabel, { color: colors.mutedForeground }]}>Time</Text>
                  <Text style={[s.dateTimeValue, { color: colors.foreground }]}>{eventData.startTime}{eventData.endTime ? ` — ${eventData.endTime}` : ''}</Text>
                </View>
              </View>
            ) : null}
          </View>
        ) : null}

        {/* Action buttons (business only) */}
        {!isEvent && (
          <View style={[s.actionRow, { paddingHorizontal: 16, marginTop: 20 }]}>
            {biz?.phone ? (
              <TouchableOpacity
                style={[s.actionBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
                activeOpacity={0.7}
                onPress={handleCallPress}
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
        )}

        {/* ── EVENT-SPECIFIC: Tags ── */}
        {isEvent && tags.length > 0 ? (
          <View style={[s.section, { paddingHorizontal: 16, marginTop: 20 }]}>
            <View style={s.tagsRow}>
              {tags.map((tag: string, i: number) => (
                <View key={i} style={[s.tagChip, { backgroundColor: `${colors.primary}15`, borderColor: `${colors.primary}30` }]}>
                  <Text style={[s.tagText, { color: colors.primary }]}>{tag}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* About */}
        {(biz?.description || eventData?.description) ? (
          <View style={[s.section, { paddingHorizontal: 16, marginTop: 24 }]}>
            <Text style={[s.sectionTitle, { color: colors.foreground }]}>About</Text>
            <Text style={[s.aboutText, { color: colors.mutedForeground }]}>
              {eventData?.description || biz?.description}
            </Text>
          </View>
        ) : null}

        {/* Amenities (business only) */}
        {!isEvent && biz && biz.amenities.length > 0 ? (
          <View style={[s.section, { paddingHorizontal: 16, marginTop: 24 }]}>
            <Text style={[s.sectionTitle, { color: colors.foreground }]}>Amenities</Text>
            <View style={s.amenitiesRow}>
              {biz.amenities.slice(0, 6).map((amenity, i) => (
                <View key={i} style={[s.amenityChip, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Sparkles size={13} color={colors.primary} strokeWidth={2} />
                  <Text style={[s.amenityText, { color: colors.foreground }]}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* Pricing (business only) */}
        {!isEvent && biz?.priceFrom ? (
          <View style={[s.section, { paddingHorizontal: 16, marginTop: 24 }]}>
            <View style={[s.pricingCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[s.pricingLabel, { color: colors.mutedForeground }]}>STARTING FROM</Text>
              <Text style={[s.pricingValue, { color: colors.primary }]}>
                ₦{biz.priceFrom.toLocaleString()}
              </Text>
            </View>
          </View>
        ) : null}

        {/* ── EVENT-SPECIFIC: Ticket Tiers ── */}
        {isEvent && ticketTypes.length > 0 ? (
          <View style={[s.section, { paddingHorizontal: 16, marginTop: 24 }]}>
            <Text style={[s.sectionTitle, { color: colors.foreground }]}>Tickets</Text>
            {ticketTypes.map((tier, i) => (
              <TouchableOpacity
                key={i}
                style={[
                  s.ticketCard,
                  { backgroundColor: colors.card, borderColor: selectedTier === i ? colors.primary : colors.border },
                  selectedTier === i && { borderWidth: 2 },
                ]}
                onPress={() => setSelectedTier(i)}
                activeOpacity={0.7}
              >
                <View style={s.ticketInfo}>
                  <Text style={[s.ticketName, { color: colors.foreground }]}>{tier.name}</Text>
                  <Text style={[s.ticketAvail, { color: colors.mutedForeground }]}>
                    {tier.quantity > 0 ? `${tier.quantity} spots left` : 'Sold out'}
                  </Text>
                </View>
                <Text style={[s.ticketPrice, { color: tier.price > 0 ? colors.primary : colors.mutedForeground }]}>
                  {tier.price > 0 ? `₦${tier.price.toLocaleString()}` : 'Free'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : null}

        {/* Map */}
        {hasLatLon ? (
          <View style={[s.section, { paddingHorizontal: 16, marginTop: 24 }]}>
            <Text style={[s.sectionTitle, { color: colors.foreground }]}>Location</Text>
            <ReadOnlyMap lat={eventData.lat} lon={eventData.lon} label={location || name} />
          </View>
        ) : null}
      </ScrollView>

      {/* ── EVENT: Sticky Book Now ── */}
      {isEvent && (
        <View style={[s.ctaBar, { paddingBottom: insets.bottom + 12, backgroundColor: colors.background, borderTopColor: colors.border }]}>
          {selectedTier !== null && ticketTypes[selectedTier] && (
            <View style={s.ctaPriceInfo}>
              <Text style={[s.ctaTotalLabel, { color: colors.mutedForeground }]}>Total</Text>
              <Text style={[s.ctaTotalPrice, { color: colors.primary }]}>
                {totalCost > 0 ? `₦${totalCost.toLocaleString()}` : 'Free'}
              </Text>
            </View>
          )}
          <TouchableOpacity
            style={[s.ctaBookBtn, { backgroundColor: colors.primary, opacity: submitting ? 0.6 : 1 }]}
            onPress={handleBookNow}
            disabled={submitting}
          >
            <Ticket size={18} color="#fff" strokeWidth={2} />
            <Text style={s.ctaBookText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  heroContainer: { width: SCREEN_WIDTH, position: 'relative', overflow: 'hidden' },
  heroImage: { ...StyleSheet.absoluteFillObject },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  backBtnHero: { position: 'absolute', left: 16, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' },
  heroContent: { position: 'absolute', left: 16, right: 16 },
  badgeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  categoryBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  categoryBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
  ratingPill: { flexDirection: 'row', alignItems: 'center', gap: 4, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  ratingText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  ratingCountText: { color: '#fff', fontSize: 11, fontWeight: '500' },
  businessName: { color: '#fff', fontSize: 24, fontWeight: '800', letterSpacing: -0.5, marginBottom: 6 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationText: { color: 'rgba(255,255,255,0.85)', fontSize: 13 },

  // Date/time row (event)
  dateTimeRow: { flexDirection: 'row', gap: 12 },
  dateTimeChip: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 14, padding: 14, borderWidth: 1 },
  dateTimeLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  dateTimeValue: { fontSize: 14, fontWeight: '700', marginTop: 2 },

  // Tags
  tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  tagChip: { borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6, borderWidth: 1 },
  tagText: { fontSize: 12, fontWeight: '600' },

  // Action buttons
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

  // Ticket tiers
  ticketCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 14, padding: 16, borderWidth: 1, marginBottom: 10 },
  ticketInfo: { flex: 1 },
  ticketName: { fontSize: 15, fontWeight: '700' },
  ticketAvail: { fontSize: 12, marginTop: 2 },
  ticketPrice: { fontSize: 18, fontWeight: '800' },

  // Registration form
  regForm: { borderRadius: 16, padding: 20, borderWidth: 1, gap: 8 },
  regLabel: { fontSize: 13, fontWeight: '600', marginTop: 8 },
  regInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 15, marginTop: 4 },

  quantityCard: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 14, padding: 16, borderWidth: 1, marginTop: 16 },
  quantityLabel: { fontSize: 15, fontWeight: '700' },
  quantityRow: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  qtyBtn: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  qtyValue: { fontSize: 18, fontWeight: '700' },
  qtyTotal: { fontSize: 16, fontWeight: '800', marginLeft: 8 },

  // Booking header
  bookingHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 16, paddingBottom: 10, borderBottomWidth: 1 },
  backBtn: { padding: 4 },
  bookingTitle: { fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },

  // Order summary
  orderSummary: { borderRadius: 16, padding: 20, borderWidth: 1 },
  orderLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
  orderEvent: { fontSize: 18, fontWeight: '700', marginTop: 6 },
  orderTier: { fontSize: 14, marginTop: 4 },
  orderDivider: { height: 1, marginVertical: 12 },
  orderTotalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  orderTotalLabel: { fontSize: 16, fontWeight: '700' },
  orderTotalPrice: { fontSize: 22, fontWeight: '800' },

  // Payment
  payMethodLabel: { fontSize: 16, fontWeight: '700' },
  payOption: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, padding: 16, borderWidth: 1, marginTop: 10 },
  payRadio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2 },
  payOptionText: { fontSize: 15, fontWeight: '600' },
  payBtn: { borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 24 },
  payBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  // Success
  successWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 },
  successIcon: { width: 80, height: 80, borderRadius: 40, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  successTitle: { fontSize: 28, fontWeight: '800', marginBottom: 8 },
  successSub: { fontSize: 16, textAlign: 'center' },
  successDetail: { fontSize: 14, marginTop: 4 },
  successPrice: { fontSize: 22, fontWeight: '800', marginTop: 8 },
  successNote: { fontSize: 13, textAlign: 'center', marginTop: 12 },
  successBtn: { borderRadius: 14, paddingVertical: 16, paddingHorizontal: 60, marginTop: 32 },
  successBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  // Sticky CTA (event)
  ctaBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1 },
  ctaPriceInfo: { flex: 1 },
  ctaTotalLabel: { fontSize: 11, fontWeight: '600' },
  ctaTotalPrice: { fontSize: 18, fontWeight: '800' },
  ctaBookBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, paddingVertical: 15, paddingHorizontal: 32 },
  ctaBookText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  notFound: { alignItems: 'center', marginTop: 80, gap: 8 },
  notFoundTitle: { fontSize: 18, fontWeight: '700' },
  notFoundDesc: { fontSize: 14, textAlign: 'center' },
});
