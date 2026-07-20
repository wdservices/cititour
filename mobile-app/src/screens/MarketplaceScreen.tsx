import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, radius, typography, glass } from '../theme/theme';
import GlassHeader from '../components/GlassHeader';
import GlassButton from '../components/GlassButton';

const categories = ['Electronics', 'Fashion', 'Home', 'Vehicles', 'Property'];

export default function MarketplaceScreen() {
  const { colors, isDark } = useTheme();
  const [activeCategory, setActiveCategory] = useState(0);

  const glassOpacity = isDark ? glass.opacityDark : glass.opacity;
  const cardBackgroundColor = isDark
    ? `rgba(18, 22, 31, ${glassOpacity})`
    : `rgba(255, 255, 255, ${glassOpacity})`;
  const cardBorderColor = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.4)';

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    headerContainer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    listItemButton: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, backgroundColor: colors.primary, paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.full },
    listItemButtonText: { color: colors.primaryForeground, fontSize: typography.sizes.xs, fontWeight: '700', fontFamily: typography.body.fontFamily },
    categoryContainer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
    categoryChip: {
      paddingHorizontal: spacing.md, paddingVertical: spacing.sm, borderRadius: radius.full,
      backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(30, 136, 229, 0.1)',
      borderWidth: 1, borderColor: cardBorderColor, marginRight: spacing.md,
    },
    categoryChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    categoryChipText: { fontSize: typography.sizes.sm, color: colors.foreground, fontWeight: '600', fontFamily: typography.body.fontFamily },
    categoryChipTextActive: { color: colors.primaryForeground },
    productCard: {
      flex: 1, backgroundColor: cardBackgroundColor, borderRadius: radius.lg, overflow: 'hidden',
      borderWidth: 1, borderColor: cardBorderColor,
    },
    productImagePlaceholder: { height: 140, backgroundColor: colors.muted, alignItems: 'flex-end', justifyContent: 'flex-end', padding: spacing.md },
    heartButton: { width: 36, height: 36, borderRadius: radius.full, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
    productContent: { padding: spacing.md },
    productTitle: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.foreground, fontFamily: typography.body.fontFamily },
    productLocation: { fontSize: typography.sizes.xs, color: colors.mutedForeground, marginTop: spacing.xs, fontFamily: typography.body.fontFamily },
    productPrice: { fontSize: typography.sizes.base, fontWeight: '700', color: colors.primary, marginTop: spacing.sm, fontFamily: typography.body.fontFamily },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <GlassHeader title="Marketplace" subtitle="Buy & sell local" leftIcon="menu" />

      <View style={styles.headerContainer}>
        <GlassButton label="+ List Item" onPress={() => {}} size="sm" />
      </View>

      <View style={styles.categoryContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          data={categories}
          keyExtractor={(c) => c}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[styles.categoryChip, activeCategory === index && styles.categoryChipActive]}
              onPress={() => setActiveCategory(index)}
            >
              <Text style={[styles.categoryChipText, activeCategory === index && styles.categoryChipTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      <FlatList
        data={[1, 2, 3, 4, 5, 6]}
        keyExtractor={(i) => String(i)}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: spacing.xl, gap: spacing.md }}
        columnWrapperStyle={{ gap: spacing.md }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.productCard}>
            <View style={styles.productImagePlaceholder}>
              <TouchableOpacity style={styles.heartButton}>
                <Feather name="heart" size={18} color={colors.primaryForeground} />
              </TouchableOpacity>
            </View>
            <View style={styles.productContent}>
              <Text style={styles.productTitle} numberOfLines={1}>Product Item {item}</Text>
              <Text style={styles.productLocation}>Lekki, Lagos</Text>
              <Text style={styles.productPrice}>₦{(item * 150000).toLocaleString()}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}
