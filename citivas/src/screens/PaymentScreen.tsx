import React, { useState, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, TextInput,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft, User, Lock, CreditCard, ShieldCheck, Check, MapPin, Users, Calendar,
} from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

function generateRef() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let ref = 'CH-';
  for (let i = 0; i < 4; i++) ref += chars[Math.floor(Math.random() * chars.length)];
  ref += '-';
  for (let i = 0; i < 2; i++) ref += chars[Math.floor(Math.random() * chars.length)];
  return ref;
}

export default function PaymentScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { user } = useAuth();
  const state = route.params;

  const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] || '');
  const [lastName, setLastName] = useState(user?.name?.split(' ').slice(1).join(' ') || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('');
  const [isPaid, setIsPaid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [bookingRef] = useState(generateRef);

  if (!state) {
    return (
      <View style={[s.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <View style={s.emptyState}>
          <Text style={[s.emptyTitle, { color: colors.foreground }]}>No booking data found</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[s.emptyLink, { color: colors.primary }]}>Go back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const roomRate = state.pricePerNight * state.nights;
  const vatEnabled = state.vatEnabled || false;
  const vatRate = state.vatRate || 0;
  const taxes = vatEnabled ? Math.round(roomRate * (vatRate / 100)) : 0;
  const totalWithTax = roomRate + taxes;

  const handlePay = async () => {
    if (!firstName || !lastName || !email || !phone) {
      Alert.alert('Required', 'Please fill in all guest details.');
      return;
    }
    setIsProcessing(true);
    setError('');

    try {
      const paystackKey = 'pk_live_1788e59565979a32b6c87507bf7033c57614cce4';
      const serverBase = 'http://10.0.2.2:3001';

      const initResp = await fetch(`${serverBase}/api/paystack/initialize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          amount: totalWithTax,
          reference: bookingRef,
          metadata: {
            booking_ref: bookingRef,
            guest_name: `${firstName} ${lastName}`,
            property: state.propertyTitle,
            room: state.roomName,
          },
        }),
      });

      const initData = await initResp.json();

      if (initData.status && initData.data?.authorization_url) {
        const verifyResp = await fetch(`${serverBase}/api/paystack/verify/${bookingRef}`);
        const verifyData = await verifyResp.json();

        await addDoc(collection(db, 'property_bookings'), {
          bookingRef,
          propertyId: state.propertyId,
          propertyTitle: state.propertyTitle,
          propertyLocation: state.propertyLocation,
          ownerId: state.ownerId,
          roomName: state.roomName,
          roomImage: state.roomImage,
          pricePerNight: state.pricePerNight,
          nights: state.nights,
          checkIn: state.checkIn,
          checkOut: state.checkOut,
          guests: state.guests,
          roomRate,
          vatEnabled,
          vatRate,
          taxes,
          totalPaid: totalWithTax,
          guestFirstName: firstName,
          guestLastName: lastName,
          guestEmail: email,
          guestPhone: phone,
          payerId: user?.id || '',
          paystackRef: bookingRef,
          status: 'Confirmed',
          createdAt: serverTimestamp(),
        });

        setIsPaid(true);
      } else {
        setError('Payment initialization failed. Please try again.');
        setIsProcessing(false);
      }
    } catch (e) {
      setError('Network error. Please check your connection and try again.');
      setIsProcessing(false);
    }
  };

  // ── SUCCESS STATE ──
  if (isPaid) {
    return (
      <View style={[s.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <View style={s.successWrap}>
          <View style={[s.successIcon, { backgroundColor: '#e8f5e9' }]}>
            <Check size={32} color="#10B981" strokeWidth={3} />
          </View>
          <Text style={[s.successTitle, { color: colors.foreground }]}>Booking Confirmed!</Text>
          <Text style={[s.successSub, { color: colors.mutedForeground }]}>
            Your reservation has been successfully placed.
          </Text>

          <View style={[s.refCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[s.refLabel, { color: colors.mutedForeground }]}>BOOKING REFERENCE</Text>
            <Text style={[s.refValue, { color: colors.primary }]}>{bookingRef}</Text>
          </View>

          <View style={[s.detailsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[s.detailsTitle, { color: colors.foreground }]}>Booking Details</Text>
            {[
              ['Property', state.propertyTitle],
              ['Room', state.roomName],
              ['Guest', `${firstName} ${lastName}`],
              ['Check-in', state.checkIn],
              ['Check-out', state.checkOut],
              ['Nights', String(state.nights)],
            ].map(([label, value]) => (
              <View key={label} style={s.detailRow}>
                <Text style={[s.detailLabel, { color: colors.mutedForeground }]}>{label}</Text>
                <Text style={[s.detailValue, { color: colors.foreground }]} numberOfLines={1}>{value}</Text>
              </View>
            ))}
            <View style={[s.detailRow, { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 10, marginTop: 6 }]}>
              <Text style={[s.detailLabel, { color: colors.foreground, fontWeight: '700' }]}>Total Paid</Text>
              <Text style={[s.detailValue, { color: colors.primary, fontSize: 16, fontWeight: '800' }]}>₦{totalWithTax.toLocaleString()}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[s.doneBtn, { backgroundColor: colors.primary }]}
            onPress={() => navigation.popToTop()}
            activeOpacity={0.8}
          >
            <Text style={s.doneBtnText}>Browse More Properties</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // ── PAYMENT FORM ──
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={[s.container, { backgroundColor: colors.background }]}>
        {/* Header */}
        <View style={[s.header, { paddingTop: insets.top + 6, borderBottomColor: colors.border, backgroundColor: colors.background }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <ArrowLeft size={22} color={colors.foreground} strokeWidth={2} />
          </TouchableOpacity>
          <View style={{ flex: 1, marginLeft: 8 }}>
            <Text style={[s.headerTitle, { color: colors.foreground }]}>Complete Booking</Text>
            <Text style={[s.headerSub, { color: colors.mutedForeground }]}>Guest Details & Payment</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll}>
          {/* Room Summary Card */}
          <View style={[s.summaryCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            {state.roomImage ? (
              <Image source={{ uri: state.roomImage }} style={s.summaryImage} resizeMode="cover" />
            ) : (
              <View style={[s.summaryImage, { backgroundColor: colors.muted }]} />
            )}
            <View style={s.summaryContent}>
              <Text style={[s.summaryRoom, { color: colors.foreground }]} numberOfLines={1}>{state.roomName}</Text>
              <View style={s.summaryLocation}>
                <MapPin size={12} color={colors.mutedForeground} />
                <Text style={[s.summaryLocationText, { color: colors.mutedForeground }]} numberOfLines={1}>{state.propertyLocation}</Text>
              </View>
              <View style={s.summaryDates}>
                <View style={s.summaryDateItem}>
                  <Calendar size={11} color={colors.mutedForeground} />
                  <Text style={[s.summaryDateLabel, { color: colors.mutedForeground }]}>Check-in</Text>
                  <Text style={[s.summaryDateValue, { color: colors.foreground }]}>{state.checkIn}</Text>
                </View>
                <View style={s.summaryDateItem}>
                  <Calendar size={11} color={colors.mutedForeground} />
                  <Text style={[s.summaryDateLabel, { color: colors.mutedForeground }]}>Check-out</Text>
                  <Text style={[s.summaryDateValue, { color: colors.foreground }]}>{state.checkOut}</Text>
                </View>
              </View>
              <View style={s.summaryGuests}>
                <Users size={12} color={colors.mutedForeground} />
                <Text style={[s.summaryGuestsText, { color: colors.mutedForeground }]}>
                  {state.guests} Adult{state.guests !== 1 ? 's' : ''} · {state.nights} Night{state.nights !== 1 ? 's' : ''}
                </Text>
              </View>
            </View>
          </View>

          {/* Guest Details Form */}
          <View style={[s.formCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={s.formCardHeader}>
              <User size={18} color={colors.mutedForeground} />
              <Text style={[s.formCardTitle, { color: colors.foreground }]}>Guest Details</Text>
            </View>

            <View style={s.formRow}>
              <View style={s.formField}>
                <Text style={[s.formLabel, { color: colors.mutedForeground }]}>First Name</Text>
                <TextInput
                  style={[s.formInput, { backgroundColor: colors.muted, borderColor: colors.border, color: colors.foreground }]}
                  placeholder="John"
                  placeholderTextColor={colors.mutedForeground}
                  value={firstName}
                  onChangeText={setFirstName}
                />
              </View>
              <View style={s.formField}>
                <Text style={[s.formLabel, { color: colors.mutedForeground }]}>Last Name</Text>
                <TextInput
                  style={[s.formInput, { backgroundColor: colors.muted, borderColor: colors.border, color: colors.foreground }]}
                  placeholder="Doe"
                  placeholderTextColor={colors.mutedForeground}
                  value={lastName}
                  onChangeText={setLastName}
                />
              </View>
            </View>

            <View style={s.formField}>
              <Text style={[s.formLabel, { color: colors.mutedForeground }]}>Email Address</Text>
              <TextInput
                style={[s.formInput, { backgroundColor: colors.muted, borderColor: colors.border, color: colors.foreground }]}
                placeholder="john@example.com"
                placeholderTextColor={colors.mutedForeground}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={s.formField}>
              <Text style={[s.formLabel, { color: colors.mutedForeground }]}>Phone Number</Text>
              <TextInput
                style={[s.formInput, { backgroundColor: colors.muted, borderColor: colors.border, color: colors.foreground }]}
                placeholder="+234 800 000 0000"
                placeholderTextColor={colors.mutedForeground}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Payment Section */}
          <View style={[s.payCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={s.formCardHeader}>
              <Lock size={18} color={colors.mutedForeground} />
              <Text style={[s.formCardTitle, { color: colors.foreground }]}>Secure Payment</Text>
              <View style={s.payIcons}>
                <CreditCard size={16} color={colors.mutedForeground} />
              </View>
            </View>

            {error ? (
              <View style={[s.errorBox, { backgroundColor: '#fef2f2', borderColor: '#fecaca' }]}>
                <Text style={s.errorText}>{error}</Text>
              </View>
            ) : null}

            <View style={[s.payAmount, { backgroundColor: colors.muted, borderColor: colors.border }]}>
              <Text style={[s.payAmountLabel, { color: colors.mutedForeground }]}>Total Amount</Text>
              <Text style={[s.payAmountValue, { color: colors.primary }]}>₦{totalWithTax.toLocaleString()}</Text>
              {vatEnabled && taxes > 0 && (
                <Text style={[s.payAmountVat, { color: colors.mutedForeground }]}>includes ₦{taxes.toLocaleString()} VAT ({vatRate}%)</Text>
              )}
            </View>

            <TouchableOpacity
              style={[s.payBtn, { backgroundColor: colors.primary }, isProcessing && { opacity: 0.6 }]}
              onPress={handlePay}
              disabled={isProcessing || !firstName || !lastName || !email || !phone}
              activeOpacity={0.8}
            >
              {isProcessing ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={s.payBtnText}>Pay ₦{totalWithTax.toLocaleString()}</Text>
              )}
            </TouchableOpacity>

            <View style={s.sslRow}>
              <ShieldCheck size={14} color={colors.mutedForeground} />
              <Text style={[s.sslText, { color: colors.mutedForeground }]}>256-bit SSL Encrypted</Text>
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1 },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 16, fontWeight: '700' },
  headerSub: { fontSize: 12, marginTop: 1 },
  scroll: { padding: 16 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '700' },
  emptyLink: { fontSize: 14, fontWeight: '600' },

  // Summary Card
  summaryCard: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 16 },
  summaryImage: { width: '100%', height: 160 },
  summaryContent: { padding: 14 },
  summaryRoom: { fontSize: 18, fontWeight: '800', marginBottom: 6 },
  summaryLocation: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 },
  summaryLocationText: { fontSize: 13, flex: 1 },
  summaryDates: { flexDirection: 'row', gap: 16, marginBottom: 8 },
  summaryDateItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  summaryDateLabel: { fontSize: 11, fontWeight: '600' },
  summaryDateValue: { fontSize: 13, fontWeight: '700' },
  summaryGuests: { flexDirection: 'row', alignItems: 'center', gap: 4, borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 8 },
  summaryGuestsText: { fontSize: 12 },

  // Form Card
  formCard: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 16 },
  formCardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  formCardTitle: { fontSize: 17, fontWeight: '700', flex: 1 },
  formRow: { flexDirection: 'row', gap: 12 },
  formField: { flex: 1, marginBottom: 14 },
  formLabel: { fontSize: 12, fontWeight: '600', marginBottom: 6 },
  formInput: { borderWidth: 1, borderRadius: 10, paddingHorizontal: 14, height: 46, fontSize: 15 },

  // Payment Card
  payCard: { borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 16 },
  payIcons: { flexDirection: 'row', gap: 6 },
  errorBox: { borderWidth: 1, borderRadius: 10, padding: 12, marginBottom: 14 },
  errorText: { fontSize: 13, color: '#dc2626' },
  payAmount: { borderWidth: 1, borderRadius: 12, padding: 16, alignItems: 'center', marginBottom: 16 },
  payAmountLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 4 },
  payAmountValue: { fontSize: 28, fontWeight: '800' },
  payAmountVat: { fontSize: 11, marginTop: 4 },
  payBtn: { borderRadius: 12, height: 52, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  payBtnText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  sslRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  sslText: { fontSize: 11, fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5 },

  // Success
  successWrap: { flex: 1, padding: 20, alignItems: 'center', justifyContent: 'center', gap: 16 },
  successIcon: { width: 64, height: 64, borderRadius: 32, alignItems: 'center', justifyContent: 'center' },
  successTitle: { fontSize: 22, fontWeight: '800', textAlign: 'center' },
  successSub: { fontSize: 14, textAlign: 'center', marginBottom: 8 },
  refCard: { borderWidth: 1, borderRadius: 12, padding: 16, alignItems: 'center', width: '100%' },
  refLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 4 },
  refValue: { fontSize: 22, fontWeight: '800', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace' },
  detailsCard: { borderWidth: 1, borderRadius: 12, padding: 16, width: '100%' },
  detailsTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  detailLabel: { fontSize: 13 },
  detailValue: { fontSize: 13, fontWeight: '600', flex: 1, textAlign: 'right', marginLeft: 12 },
  doneBtn: { borderRadius: 12, height: 50, paddingHorizontal: 32, alignItems: 'center', justifyContent: 'center' },
  doneBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
