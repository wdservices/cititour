import React, { useState, useMemo, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Dimensions,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, ChevronLeft, ChevronRight, Users, CheckCircle2 } from '../lib/icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { usePropertyDetail, RoomCategory } from '../lib/usePropertyDetail';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DAY_CELL = Math.floor((SCREEN_WIDTH - 48) / 7);

function formatMonth(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function isBefore(a: Date, b: Date) {
  return a.getTime() < b.getTime();
}

function isAfter(a: Date, b: Date) {
  return a.getTime() > b.getTime();
}

function addMonths(d: Date, n: number) {
  const r = new Date(d);
  r.setMonth(r.getMonth() + n);
  return r;
}

function getDaysInMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

function getFirstDayOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1).getDay();
}

function formatShort(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function CalendarMonth({ month, selectedStart, selectedEnd, onDateClick }: {
  month: Date;
  selectedStart: Date | null;
  selectedEnd: Date | null;
  onDateClick: (d: Date) => void;
}) {
  const { colors } = useTheme();
  const year = month.getFullYear();
  const mon = month.getMonth();
  const daysInMonth = getDaysInMonth(month);
  const firstDay = getFirstDayOfMonth(month);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const blanks = Array.from({ length: firstDay }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => new Date(year, mon, i + 1));

  const isInRange = (d: Date) => {
    if (!selectedStart || !selectedEnd) return false;
    return isAfter(d, selectedStart) && isBefore(d, selectedEnd);
  };
  const isStart = (d: Date) => selectedStart && isSameDay(d, selectedStart);
  const isEnd = (d: Date) => selectedEnd && isSameDay(d, selectedEnd);

  return (
    <View>
      <View style={s.weekdayRow}>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d, i) => (
          <Text key={i} style={[s.weekdayHeader, { color: colors.mutedForeground }]}>{d}</Text>
        ))}
      </View>
      <View style={s.calendarGrid}>
        {blanks.map((b) => <View key={`b-${b}`} style={{ width: DAY_CELL, height: DAY_CELL }} />)}
        {days.map((d) => {
          const isPast = isBefore(d, today) && !isSameDay(d, today);
          const start = isStart(d);
          const end = isEnd(d);
          const inRange = isInRange(d);
          return (
            <TouchableOpacity
              key={d.getTime()}
              onPress={() => !isPast && onDateClick(d)}
              disabled={isPast}
              style={[
                s.calendarDay,
                { width: DAY_CELL, height: DAY_CELL },
                (start || end) && { backgroundColor: colors.primary, borderRadius: 999 },
                inRange && { backgroundColor: `${colors.primary}18` },
                isPast && { opacity: 0.25 },
              ]}
              activeOpacity={0.7}
            >
              <Text style={[
                s.calendarDayText,
                { color: colors.foreground },
                (start || end) && { color: '#fff', fontWeight: '700' },
                inRange && { color: colors.primary },
                isPast && { color: colors.mutedForeground },
              ]}>
                {d.getDate()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function BookingScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { propertyId, preselectedRoom } = route.params || {};

  const { loading, property } = usePropertyDetail(propertyId);
  const [selectedRoom, setSelectedRoom] = useState<number | null>(preselectedRoom ?? null);
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [calendarStep, setCalendarStep] = useState(0);

  const currentMonth = useMemo(() => addMonths(new Date(), calendarStep), [calendarStep]);

  const handleDateClick = useCallback((d: Date) => {
    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(d);
      setCheckOut(null);
    } else if (isBefore(d, checkIn)) {
      setCheckIn(d);
      setCheckOut(null);
    } else {
      setCheckOut(d);
    }
  }, [checkIn, checkOut]);

  const nights = checkIn && checkOut ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / 86400000) : 0;
  const selectedRoomData = selectedRoom !== null && property?.rooms?.[selectedRoom] ? property.rooms[selectedRoom] : null;
  const roomTotal = selectedRoomData && nights > 0 ? selectedRoomData.pricePerNight * nights : 0;
  const vatEnabled = property?.vatEnabled || false;
  const vatRate = property?.vatRate || 0;
  const vatAmount = vatEnabled && roomTotal > 0 ? Math.round(roomTotal * (vatRate / 100)) : 0;
  const total = roomTotal + vatAmount;

  const handleContinue = () => {
    if (!selectedRoomData || nights === 0) return;
    navigation.navigate('Payment', {
      roomName: selectedRoomData.name || `Room ${(selectedRoom || 0) + 1}`,
      roomImage: selectedRoomData.images?.[0] || '',
      pricePerNight: selectedRoomData.pricePerNight,
      nights,
      checkIn: checkIn ? formatShort(checkIn) : '',
      checkOut: checkOut ? formatShort(checkOut) : '',
      guests: selectedRoomData.maxOccupancy,
      total,
      deposit: selectedRoomData.deposit || 0,
      propertyTitle: property?.title || '',
      propertyLocation: property?.location || [property?.city, property?.state].filter(Boolean).join(', '),
      ownerId: property?.ownerId || '',
      propertyId: property?.id || '',
      vatEnabled,
      vatRate,
    });
  };

  if (loading) {
    return (
      <View style={[s.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: 80 }} />
      </View>
    );
  }

  if (!property) {
    return (
      <View style={[s.container, { backgroundColor: colors.background, paddingTop: insets.top }]}>
        <View style={[s.header, { borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
            <ArrowLeft size={22} color={colors.foreground} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={[s.headerTitle, { color: colors.foreground }]}>Booking</Text>
        </View>
        <View style={s.emptyState}>
          <Text style={[s.emptyTitle, { color: colors.foreground }]}>Property not found</Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={[s.emptyLink, { color: colors.primary }]}>Go back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const rooms = property.rooms || [];

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[s.header, { paddingTop: insets.top + 6, borderBottomColor: colors.border, backgroundColor: colors.background }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <ArrowLeft size={22} color={colors.foreground} strokeWidth={2} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 8 }}>
          <Text style={[s.headerTitle, { color: colors.foreground }]} numberOfLines={1}>{property.title}</Text>
          <Text style={[s.headerSub, { color: colors.mutedForeground }]}>Select dates & room</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scroll} style={{ flex: 1 }}>
        {/* Progress Steps */}
        <View style={[s.stepsRow, { borderBottomColor: colors.border }]}>
          {['DATES & ROOM', 'GUESTS', 'PAYMENT'].map((label, i) => (
            <View key={label} style={s.stepItem}>
              {i > 0 && <View style={[s.stepLine, { backgroundColor: colors.border }]} />}
              <View style={[s.stepDot, {
                borderColor: i === 0 ? colors.primary : colors.border,
                backgroundColor: i === 0 ? `${colors.primary}15` : 'transparent',
                borderStyle: i === 0 ? 'solid' : 'dashed',
              }]}>
                <Text style={[s.stepNum, { color: i === 0 ? colors.primary : colors.mutedForeground }]}>{i + 1}</Text>
              </View>
              <Text style={[s.stepLabel, { color: i === 0 ? colors.primary : colors.mutedForeground }]}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Calendar Section */}
        <View style={[s.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={s.calendarNav}>
            <TouchableOpacity onPress={() => setCalendarStep(Math.max(0, calendarStep - 1))} disabled={calendarStep === 0} style={s.navBtn}>
              <ChevronLeft size={22} color={calendarStep === 0 ? colors.mutedForeground : colors.foreground} />
            </TouchableOpacity>
            <Text style={[s.calendarNavTitle, { color: colors.foreground }]}>{formatMonth(currentMonth)}</Text>
            <TouchableOpacity onPress={() => setCalendarStep(calendarStep + 1)} style={s.navBtn}>
              <ChevronRight size={22} color={colors.foreground} />
            </TouchableOpacity>
          </View>

          <CalendarMonth month={currentMonth} selectedStart={checkIn} selectedEnd={checkOut} onDateClick={handleDateClick} />

          {/* Check-in / Check-out display */}
          <View style={[s.dateDisplay, { backgroundColor: colors.muted, borderColor: colors.border }]}>
            <View>
              <Text style={[s.dateDisplayLabel, { color: colors.mutedForeground }]}>CHECK-IN</Text>
              <Text style={[s.dateDisplayValue, { color: colors.foreground }]}>{checkIn ? formatShort(checkIn) : 'Select'}</Text>
            </View>
            <View style={[s.dateDisplayArrow, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <ChevronRight size={14} color={colors.mutedForeground} />
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={[s.dateDisplayLabel, { color: colors.mutedForeground }]}>CHECK-OUT</Text>
              <Text style={[s.dateDisplayValue, { color: colors.foreground }]}>{checkOut ? formatShort(checkOut) : 'Select'}</Text>
            </View>
          </View>
        </View>

        {/* Room Cards */}
        <View style={s.sectionHeader}>
          <Text style={[s.sectionTitle, { color: colors.foreground }]}>Available Rooms</Text>
        </View>
        {rooms.map((room: RoomCategory, idx: number) => {
          const isSelected = selectedRoom === idx;
          return (
            <TouchableOpacity
              key={idx}
              style={[
                s.roomCard,
                { backgroundColor: colors.card, borderColor: colors.border },
                isSelected && { borderColor: colors.primary, borderWidth: 2 },
              ]}
              onPress={() => setSelectedRoom(isSelected ? null : idx)}
              activeOpacity={0.85}
            >
              {room.images?.[0] ? (
                <Image source={{ uri: room.images[0] }} style={s.roomCardImage} resizeMode="cover" />
              ) : (
                <View style={[s.roomCardImage, { backgroundColor: colors.muted }]} />
              )}
              {isSelected && (
                <View style={[s.selectedBadge, { backgroundColor: '#e8f5e9', borderColor: '#c8e6c9' }]}>
                  <CheckCircle2 size={12} color="#1b5e20" />
                  <Text style={s.selectedBadgeText}>Selected</Text>
                </View>
              )}
              <View style={s.roomCardContent}>
                <View style={s.roomCardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={[s.roomCardName, { color: colors.foreground }]} numberOfLines={1}>{room.name || `Room ${idx + 1}`}</Text>
                    <Text style={[s.roomCardMeta, { color: colors.mutedForeground }]}>{room.bedType} · {room.bathrooms} bath</Text>
                  </View>
                  <View style={s.roomCardPriceWrap}>
                    <Text style={[s.roomCardPrice, { color: colors.primary }]}>
                      {room.pricePerNight > 0 ? `₦${room.pricePerNight.toLocaleString()}` : 'TBD'}
                    </Text>
                    <Text style={[s.roomCardPerNight, { color: colors.mutedForeground }]}>/ NIGHT</Text>
                  </View>
                </View>
                <View style={s.roomCardBottom}>
                  <View style={s.roomCardFeature}>
                    <Users size={13} color={colors.mutedForeground} />
                    <Text style={[s.roomCardFeatureText, { color: colors.mutedForeground }]}>{room.maxOccupancy} Guests</Text>
                  </View>
                  {room.quantity <= 3 && room.quantity > 0 && (
                    <View style={s.roomCardLow}>
                      <Text style={s.roomCardLowText}>🔥 {room.quantity} left</Text>
                    </View>
                  )}
                  <View style={[
                    s.selectBtn,
                    { borderColor: isSelected ? colors.primary : colors.border, backgroundColor: isSelected ? colors.primary : 'transparent' },
                  ]}>
                    <Text style={[s.selectBtnText, { color: isSelected ? '#fff' : colors.foreground }]}>
                      {isSelected ? 'Selected' : 'Select'}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Sticky Bottom Bar */}
      {selectedRoomData && (
        <View style={[s.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border, paddingBottom: insets.bottom + 12 }]}>
          <View style={s.bottomBarContent}>
            <View style={{ flex: 1 }}>
              <Text style={[s.bottomBarInfo, { color: colors.mutedForeground }]}>
                {nights > 0 ? `${nights} Night${nights !== 1 ? 's' : ''}` : 'Select dates'} · {selectedRoomData.name || `Room ${(selectedRoom || 0) + 1}`}
              </Text>
              <View style={s.bottomBarTotalRow}>
                <Text style={[s.bottomBarTotalLabel, { color: colors.mutedForeground }]}>TOTAL:</Text>
                <Text style={[s.bottomBarTotal, { color: colors.primary }]}>₦{total.toLocaleString()}</Text>
              </View>
              {vatEnabled && vatAmount > 0 && (
                <Text style={[s.bottomBarVat, { color: colors.mutedForeground }]}>includes ₦{vatAmount.toLocaleString()} VAT ({vatRate}%)</Text>
              )}
            </View>
            <TouchableOpacity
              style={[s.continueBtn, { backgroundColor: colors.primary }, nights === 0 && { opacity: 0.4 }]}
              onPress={handleContinue}
              disabled={nights === 0}
              activeOpacity={0.8}
            >
              <Text style={s.continueBtnText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1 },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 16, fontWeight: '700' },
  headerSub: { fontSize: 12, marginTop: 1 },
  scroll: { paddingBottom: 20 },
  emptyState: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  emptyTitle: { fontSize: 16, fontWeight: '700' },
  emptyLink: { fontSize: 14, fontWeight: '600' },

  // Steps
  stepsRow: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1 },
  stepItem: { flexDirection: 'row', alignItems: 'center' },
  stepLine: { width: 24, height: 2, marginHorizontal: 6 },
  stepDot: { width: 28, height: 28, borderRadius: 14, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  stepNum: { fontSize: 12, fontWeight: '700' },
  stepLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5, marginLeft: 6 },

  // Calendar
  card: { margin: 16, borderRadius: 16, borderWidth: 1, padding: 16 },
  calendarNav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  navBtn: { padding: 8 },
  calendarNavTitle: { fontSize: 18, fontWeight: '800' },

  calendarWrap: {},
  weekdayRow: { flexDirection: 'row' },
  weekdayHeader: { width: DAY_CELL, textAlign: 'center', fontSize: 12, fontWeight: '600', paddingBottom: 8 },
  calendarGrid: { flexDirection: 'row', flexWrap: 'wrap' },
  calendarDay: { alignItems: 'center', justifyContent: 'center' },
  calendarDayText: { fontSize: 15, fontWeight: '500' },

  dateDisplay: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    marginTop: 16, padding: 14, borderRadius: 12, borderWidth: 1,
  },
  dateDisplayLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 },
  dateDisplayValue: { fontSize: 16, fontWeight: '700' },
  dateDisplayArrow: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },

  // Rooms
  sectionHeader: { paddingHorizontal: 16, marginTop: 8, marginBottom: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '800' },

  roomCard: {
    marginHorizontal: 16, marginBottom: 12, borderRadius: 16, borderWidth: 1, overflow: 'hidden',
  },
  roomCardImage: { width: '100%', height: 140 },
  selectedBadge: {
    position: 'absolute', top: 10, left: 10, flexDirection: 'row', alignItems: 'center', gap: 4,
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1,
  },
  selectedBadgeText: { fontSize: 10, fontWeight: '700', color: '#1b5e20' },
  roomCardContent: { padding: 14 },
  roomCardTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  roomCardName: { fontSize: 16, fontWeight: '700', marginBottom: 2 },
  roomCardMeta: { fontSize: 12 },
  roomCardPriceWrap: { alignItems: 'flex-end' },
  roomCardPrice: { fontSize: 18, fontWeight: '800' },
  roomCardPerNight: { fontSize: 9, fontWeight: '600', letterSpacing: 0.5 },
  roomCardBottom: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#e5e7eb', paddingTop: 10, gap: 12 },
  roomCardFeature: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  roomCardFeatureText: { fontSize: 12 },
  roomCardLow: { backgroundColor: '#fff3e0', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginLeft: 'auto' },
  roomCardLowText: { fontSize: 10, fontWeight: '700', color: '#e65100' },
  selectBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1 },
  selectBtnText: { fontSize: 13, fontWeight: '700' },

  // Bottom Bar
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopWidth: 1, paddingHorizontal: 16, paddingTop: 14 },
  bottomBarContent: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  bottomBarInfo: { fontSize: 13, marginBottom: 2 },
  bottomBarTotalRow: { flexDirection: 'row', alignItems: 'baseline', gap: 6 },
  bottomBarTotalLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  bottomBarTotal: { fontSize: 22, fontWeight: '800' },
  bottomBarVat: { fontSize: 10, marginTop: 2 },
  continueBtn: { paddingHorizontal: 24, paddingVertical: 14, borderRadius: 12 },
  continueBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
});
