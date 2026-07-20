import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, Plus } from 'lucide-react-native';
import { colors, spacing, radius, typography } from '../theme/theme';

const categories = ['Electronics', 'Fashion', 'Home', 'Vehicles', 'Property'];

export default function MarketplaceScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Marketplace</Text>
        <TouchableOpacity style={styles.listItemButton}>
          <Plus size={16} color={colors.primaryForeground} />
          <Text style={styles.listItemButtonText}>List Item</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={categories}
        keyExtractor={(c) => c}
        contentContainerStyle={{ paddingHorizontal: spacing.md, gap: spacing.sm }}
        style={{ flexGrow: 0, marginBottom: spacing.md }}
        renderItem={({ item, index }) => (
          <TouchableOpacity style={[styles.categoryChip, index === 0 && styles.categoryChipActive]}>
            <Text style={[styles.categoryChipText, index === 0 && styles.categoryChipTextActive]}>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={[1, 2, 3, 4, 5, 6]}
        keyExtractor={(i) => String(i)}
        numColumns={2}
        contentContainerStyle={{ paddingHorizontal: spacing.md, gap: spacing.md }}
        columnWrapperStyle={{ gap: spacing.md }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.productCard}>
            <View style={styles.productImagePlaceholder}>
              <TouchableOpacity style={styles.heartButton}>
                <Heart size={14} color={colors.foreground} />
              </TouchableOpacity>
            </View>
            <Text style={styles.productTitle} numberOfLines={1}>Product Item {item}</Text>
            <Text style={styles.productLocation}>Lekki, Lagos</Text>
            <Text style={styles.productPrice}>₦{(item * 150000).toLocaleString()}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: spacing.md, marginBottom: spacing.md },
  title: { fontSize: typography.sizes.xxl, fontWeight: '800', color: colors.foreground },
  listItemButton: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 8, borderRadius: radius.full },
  listItemButtonText: { color: colors.primaryForeground, fontSize: typography.sizes.xs, fontWeight: '700' },
  categoryChip: { paddingHorizontal: spacing.md, paddingVertical: 8, borderRadius: radius.full, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border },
  categoryChipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  categoryChipText: { fontSize: typography.sizes.sm, color: colors.foreground, fontWeight: '600' },
  categoryChipTextActive: { color: colors.primaryForeground },
  productCard: { flex: 1, backgroundColor: colors.card, borderRadius: radius.md, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, marginBottom: spacing.md },
  productImagePlaceholder: { height: 110, backgroundColor: colors.muted, alignItems: 'flex-end', padding: 6 },
  heartButton: { width: 28, height: 28, borderRadius: radius.full, backgroundColor: colors.card, alignItems: 'center', justifyContent: 'center' },
  productTitle: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.foreground, paddingHorizontal: 8, marginTop: 6 },
  productLocation: { fontSize: 11, color: colors.mutedForeground, paddingHorizontal: 8 },
  productPrice: { fontSize: typography.sizes.sm, fontWeight: '700', color: colors.primary, paddingHorizontal: 8, marginBottom: 8, marginTop: 2 },
});
