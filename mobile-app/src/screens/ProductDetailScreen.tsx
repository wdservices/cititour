import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Image, Dimensions, ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft, MapPin, Heart, ShoppingCart, MessageCircle,
  ShieldCheck, Truck, RefreshCcw, Store, ChevronRight, Share, Star,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { ensureChatExists } from '../lib/chat';
import { getMockImage } from '../lib/mockImages';
import { useProductDetail } from '../lib/useProductDetail';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProductDetailScreen({ route }: any) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();
  const { user } = useAuth();
  const params = route.params || {};

  const {
    productId,
    productTitle = 'Product',
    productImage,
    productCategory = 'Item',
    productPrice,
    productPromoPrice,
    productCondition,
    productLocation,
    productDescription,
    productBusinessId,
    productOwnerId,
  } = params;

  const { loading: loadingBiz, parentBusiness, avgRating, reviewCount } = useProductDetail(productId, productBusinessId);
  const [liked, setLiked] = useState(false);

  const handleContactSeller = async () => {
    if (!user?.id || !productOwnerId || productOwnerId === user.id) return;
    try {
      const bizName = parentBusiness?.title || productOwnerId;
      const chatId = await ensureChatExists(productOwnerId, user.id, bizName, user.name || 'User');
      navigation.navigate('ChatDetail', {
        chatId,
        otherUserName: bizName,
        businessId: productOwnerId,
        customerId: user.id,
      });
    } catch {}
  };

  const handleBuyNow = () => {
    if (!user?.id) return;
    alert('Purchase request sent! The seller will be notified.');
  };

  const heroImage = productImage || getMockImage(productCategory);
  const hasPromo = productPromoPrice && productPrice &&
    Number(productPromoPrice.replace(/[^0-9]/g, '')) < Number(productPrice.replace(/[^0-9]/g, ''));

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 140 }}>
        {/* Hero */}
        <View style={[s.heroContainer, { height: 320 + insets.top }]}>
          <Image source={{ uri: heroImage }} style={s.heroImage} resizeMode="cover" />
          <View style={s.heroOverlay} />

          {/* Top bar */}
          <View style={[s.topBar, { top: insets.top + 12 }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={s.circleBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <ArrowLeft size={22} color="#fff" strokeWidth={2} />
            </TouchableOpacity>
            <View style={s.topRightBtns}>
              <TouchableOpacity onPress={() => setLiked(!liked)} style={s.circleBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Heart size={20} color={liked ? '#ef4444' : '#fff'} fill={liked ? '#ef4444' : 'transparent'} strokeWidth={2} />
              </TouchableOpacity>
              <TouchableOpacity style={s.circleBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                <Share size={20} color="#fff" strokeWidth={2} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Info overlay */}
          <View style={[s.heroContent, { bottom: insets.top + 16 }]}>
            <View style={s.badgeRow}>
              <View style={[s.categoryBadge, { backgroundColor: `${colors.primary}E6` }]}>
                <Text style={s.categoryBadgeText}>{productCategory.toUpperCase()}</Text>
              </View>
              {productCondition ? (
                <View style={[s.conditionBadge, { backgroundColor: 'rgba(34,197,94,0.85)' }]}>
                  <Text style={s.conditionBadgeText}>{productCondition.toUpperCase()}</Text>
                </View>
              ) : null}
              {avgRating !== null ? (
                <View style={[s.conditionBadge, { backgroundColor: 'rgba(0,0,0,0.35)' }]}>
                  <Star size={11} color={colors.warning} fill={colors.warning} strokeWidth={0} />
                  <Text style={s.conditionBadgeText}>{avgRating.toFixed(1)} ({reviewCount})</Text>
                </View>
              ) : null}
            </View>
            <Text style={s.productName}>{productTitle}</Text>
            {productLocation ? (
              <View style={s.locationRow}>
                <MapPin size={13} color="rgba(255,255,255,0.85)" strokeWidth={2} />
                <Text style={s.locationText}>{productLocation}</Text>
              </View>
            ) : null}
          </View>
        </View>

        {/* Price card */}
        <View style={[s.section, { paddingHorizontal: 16, marginTop: 20 }]}>
          <View style={[s.priceCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[s.priceLabel, { color: colors.mutedForeground }]}>PRICE</Text>
            <View style={s.priceRow}>
              {hasPromo ? (
                <>
                  <Text style={[s.priceOriginal, { color: colors.mutedForeground }]}>{productPrice}</Text>
                  <Text style={[s.pricePromo, { color: colors.primary }]}>{productPromoPrice}</Text>
                </>
              ) : (
                <Text style={[s.priceMain, { color: colors.primary }]}>{productPrice || 'Price on request'}</Text>
              )}
            </View>
            <View style={[s.secureRow, { backgroundColor: `${colors.primary}15`, borderColor: `${colors.primary}30` }]}>
              <ShieldCheck size={15} color={colors.primary} strokeWidth={2} />
              <Text style={[s.secureText, { color: colors.primary }]}>Secure payment through Citivas</Text>
            </View>
          </View>
        </View>

        {/* View Storefront */}
        {!loadingBiz && parentBusiness && (
          <TouchableOpacity
            style={[s.section, { paddingHorizontal: 16, marginTop: 16 }]}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('BusinessDetail', { businessId: parentBusiness.id, businessName: parentBusiness.title })}
          >
            <View style={[s.storeCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[s.storeImage, { backgroundColor: colors.muted }]}>
                {parentBusiness.image ? (
                  <Image source={{ uri: parentBusiness.image }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
                ) : (
                  <Store size={24} color={colors.mutedForeground} strokeWidth={1.5} />
                )}
              </View>
              <View style={s.storeInfo}>
                <Text style={[s.storeLabel, { color: colors.mutedForeground }]}>SOLD BY</Text>
                <Text style={[s.storeName, { color: colors.foreground }]} numberOfLines={1}>{parentBusiness.title}</Text>
                {parentBusiness.location ? (
                  <View style={s.storeLocRow}>
                    <MapPin size={10} color={colors.mutedForeground} strokeWidth={2} />
                    <Text style={[s.storeLoc, { color: colors.mutedForeground }]} numberOfLines={1}>{parentBusiness.location}</Text>
                  </View>
                ) : null}
              </View>
              <View style={s.storeArrow}>
                <Text style={[s.storeArrowText, { color: colors.primary }]}>View Store</Text>
                <ChevronRight size={16} color={colors.primary} strokeWidth={2} />
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* Description */}
        {productDescription ? (
          <View style={[s.section, { paddingHorizontal: 16, marginTop: 24 }]}>
            <Text style={[s.sectionTitle, { color: colors.foreground }]}>Description</Text>
            <Text style={[s.aboutText, { color: colors.mutedForeground }]}>{productDescription}</Text>
          </View>
        ) : null}

        {/* Trust badges */}
        <View style={[s.trustRow, { paddingHorizontal: 16, marginTop: 24 }]}>
          {[
            { icon: ShieldCheck, label: 'Buyer Protection' },
            { icon: Truck, label: 'Fast Delivery' },
            { icon: RefreshCcw, label: 'Easy Returns' },
          ].map(({ icon: Icon, label }) => (
            <View key={label} style={[s.trustItem, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Icon size={20} color={colors.primary} strokeWidth={1.75} />
              <Text style={[s.trustLabel, { color: colors.foreground }]}>{label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View style={[s.ctaBar, { paddingBottom: insets.bottom + 12, backgroundColor: colors.background, borderTopColor: colors.border }]}>
        <TouchableOpacity
          style={[s.ctaBuyBtn, { backgroundColor: colors.primary }]}
          activeOpacity={0.8}
          onPress={handleBuyNow}
        >
          <ShoppingCart size={18} color="#fff" strokeWidth={2} />
          <Text style={s.ctaBuyText}>Buy Now</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[s.ctaContactBtn, { borderColor: colors.border, backgroundColor: colors.card }]}
          activeOpacity={0.8}
          onPress={handleContactSeller}
        >
          <MessageCircle size={18} color={colors.foreground} strokeWidth={2} />
          <Text style={[s.ctaContactText, { color: colors.foreground }]}>Contact Seller</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  heroContainer: { width: SCREEN_WIDTH, position: 'relative', overflow: 'hidden' },
  heroImage: { ...StyleSheet.absoluteFillObject },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)' },
  topBar: { position: 'absolute', left: 16, right: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  circleBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' },
  topRightBtns: { flexDirection: 'row', gap: 10 },
  heroContent: { position: 'absolute', left: 16, right: 16 },
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 8 },
  categoryBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  categoryBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
  conditionBadge: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  conditionBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
  productName: { color: '#fff', fontSize: 24, fontWeight: '800', letterSpacing: -0.5, marginBottom: 6 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  locationText: { color: 'rgba(255,255,255,0.85)', fontSize: 13 },

  section: { marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '800', letterSpacing: -0.2, marginBottom: 12 },
  aboutText: { fontSize: 14, lineHeight: 22 },

  priceCard: { borderRadius: 16, padding: 20, borderWidth: 1 },
  priceLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8 },
  priceRow: { flexDirection: 'row', alignItems: 'baseline', gap: 10, marginTop: 4 },
  priceMain: { fontSize: 28, fontWeight: '800' },
  priceOriginal: { fontSize: 18, fontWeight: '500', textDecorationLine: 'line-through' },
  pricePromo: { fontSize: 28, fontWeight: '800' },
  secureRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 14, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, borderWidth: 1 },
  secureText: { fontSize: 12, fontWeight: '600' },

  storeCard: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 16, padding: 14, borderWidth: 1 },
  storeImage: { width: 52, height: 52, borderRadius: 12, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  storeInfo: { flex: 1 },
  storeLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.6 },
  storeName: { fontSize: 15, fontWeight: '700', marginTop: 2 },
  storeLocRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2 },
  storeLoc: { fontSize: 12 },
  storeArrow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  storeArrowText: { fontSize: 13, fontWeight: '600' },

  trustRow: { flexDirection: 'row', gap: 8 },
  trustItem: { flex: 1, alignItems: 'center', paddingVertical: 14, borderRadius: 12, borderWidth: 1, gap: 6 },
  trustLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.3, textAlign: 'center' },

  ctaBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', gap: 12, paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1 },
  ctaBuyBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, paddingVertical: 15 },
  ctaBuyText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  ctaContactBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, paddingVertical: 15, borderWidth: 1.5 },
  ctaContactText: { fontSize: 16, fontWeight: '700' },
});
