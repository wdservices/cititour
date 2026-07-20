import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import GlassHeader from '../components/GlassHeader';
import GlassCard from '../components/GlassCard';
import { spacing, radius, typography } from '../theme/theme';

interface FavouriteItem {
  id: string;
  title: string;
  location: string;
  rating: number;
  reviews: number;
  image: string;
  isFavorited: boolean;
}

export default function FavouritesScreen() {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<any>();
  const [favourites, setFavourites] = useState<FavouriteItem[]>([]);

  const toggleFavourite = (id: string) => {
    setFavourites((prev) =>
      prev.map((fav) =>
        fav.id === id ? { ...fav, isFavorited: !fav.isFavorited } : fav
      )
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
    },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: spacing.lg,
    },
    emptyIcon: {
      fontSize: 64,
    },
    emptyText: {
      fontSize: typography.sizes.lg,
      fontWeight: '600' as const,
      color: colors.foreground,
      textAlign: 'center',
      fontFamily: typography.display.fontFamily,
    },
    emptyDescription: {
      fontSize: typography.sizes.sm,
      color: colors.mutedForeground,
      textAlign: 'center',
      maxWidth: '80%',
      fontFamily: typography.body.fontFamily,
    },
    grid: {
      gap: spacing.md,
    },
    favCard: {
      borderRadius: radius.lg,
      overflow: 'hidden',
      marginBottom: spacing.md,
    },
    cardImage: {
      width: '100%',
      height: 180,
      backgroundColor: colors.muted,
    },
    cardContent: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
    },
    cardHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      gap: spacing.md,
    },
    cardTitle: {
      fontSize: typography.sizes.base,
      fontWeight: '700' as const,
      color: colors.foreground,
      flex: 1,
      fontFamily: typography.display.fontFamily,
    },
    favoriteButton: {
      width: 36,
      height: 36,
      borderRadius: radius.full,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    cardLocation: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginTop: spacing.sm,
      marginBottom: spacing.sm,
    },
    cardLocationText: {
      fontSize: typography.sizes.sm,
      color: colors.mutedForeground,
      fontFamily: typography.body.fontFamily,
    },
    cardRating: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
    },
    ratingText: {
      fontSize: typography.sizes.sm,
      fontWeight: '600' as const,
      color: colors.foreground,
      fontFamily: typography.body.fontFamily,
    },
    reviewCount: {
      fontSize: typography.sizes.xs,
      color: colors.mutedForeground,
      fontFamily: typography.body.fontFamily,
    },
  });

  return (
    <View style={styles.container}>
      <GlassHeader
        title="Favourites"
        subtitle="Your saved places"
        leftIcon="arrow-left"
        onLeftPress={() => navigation.goBack()}
      />

      <View style={styles.content}>
        {favourites.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>❤️</Text>
            <Text style={styles.emptyText}>No favorites yet</Text>
            <Text style={styles.emptyDescription}>
              Start exploring and save your favorite places to visit them later
            </Text>
          </View>
        ) : (
          <ScrollView style={styles.grid} showsVerticalScrollIndicator={false}>
            {favourites.map((item) => (
              <GlassCard key={item.id} style={styles.favCard}>
                <View style={styles.cardImage} />
                <View style={styles.cardContent}>
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      {item.title}
                    </Text>
                    <TouchableOpacity
                      style={styles.favoriteButton}
                      onPress={() => toggleFavourite(item.id)}
                      activeOpacity={0.7}
                    >
                      <Feather
                        name="heart"
                        size={20}
                        color={colors.primaryForeground}
                        fill={colors.primaryForeground}
                      />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.cardLocation}>
                    <Feather name="map-pin" size={16} color={colors.mutedForeground} />
                    <Text style={styles.cardLocationText}>{item.location}</Text>
                  </View>

                  <View style={styles.cardRating}>
                    <Feather name="star" size={16} color={colors.accent} fill={colors.accent} />
                    <Text style={styles.ratingText}>{item.rating.toFixed(1)}</Text>
                    <Text style={styles.reviewCount}>({item.reviews} reviews)</Text>
                  </View>
                </View>
              </GlassCard>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}
