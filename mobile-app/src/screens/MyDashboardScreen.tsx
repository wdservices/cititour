import React, { useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import GlassHeader from '../components/GlassHeader';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
import { spacing, radius, typography } from '../theme/theme';

interface Listing {
  id: string;
  title: string;
  type: 'business' | 'event' | 'marketplace';
  status: 'active' | 'pending' | 'expired';
  image: string;
}

export default function MyDashboardScreen() {
  const { colors, isDark } = useTheme();
  const navigation = useNavigation<any>();
  const [activeSection, setActiveSection] = useState<'businesses' | 'events' | 'marketplace'>('businesses');

  const sections = [
    { key: 'businesses', label: 'Businesses' },
    { key: 'events', label: 'Events' },
    { key: 'marketplace', label: 'Marketplace' },
  ];

  const listings: Listing[] = [];

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    sectionButtons: {
      flexDirection: 'row',
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      gap: spacing.md,
    },
    sectionButton: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.sm,
      borderRadius: radius.full,
      borderWidth: 2,
    },
    sectionButtonActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    sectionButtonInactive: {
      backgroundColor: 'transparent',
      borderColor: isDark ? 'rgba(255,255,255,0.3)' : colors.border,
    },
    sectionButtonText: {
      fontSize: typography.sizes.sm,
      fontWeight: '600' as const,
      fontFamily: typography.body.fontFamily,
    },
    sectionButtonTextActive: {
      color: colors.primaryForeground,
    },
    sectionButtonTextInactive: {
      color: colors.foreground,
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
      fontSize: 48,
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
      fontFamily: typography.body.fontFamily,
    },
    createButton: {
      marginTop: spacing.md,
    },
    listingCard: {
      marginBottom: spacing.md,
      flexDirection: 'row',
      gap: spacing.md,
      alignItems: 'center',
    },
    listingImage: {
      width: 80,
      height: 80,
      borderRadius: radius.md,
      backgroundColor: colors.muted,
    },
    listingContent: {
      flex: 1,
    },
    listingTitle: {
      fontSize: typography.sizes.base,
      fontWeight: '600' as const,
      color: colors.foreground,
      fontFamily: typography.body.fontFamily,
    },
    listingStatus: {
      marginTop: spacing.xs,
      paddingHorizontal: spacing.sm,
      paddingVertical: spacing.xs,
      borderRadius: radius.sm,
      alignSelf: 'flex-start',
    },
    listingStatusActive: {
      backgroundColor: 'rgba(52, 211, 153, 0.2)',
    },
    listingStatusPending: {
      backgroundColor: 'rgba(249, 115, 22, 0.2)',
    },
    listingStatusExpired: {
      backgroundColor: 'rgba(239, 68, 68, 0.2)',
    },
    listingStatusText: {
      fontSize: typography.sizes.xs,
      fontWeight: '600' as const,
      fontFamily: typography.body.fontFamily,
    },
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return colors.success;
      case 'pending':
        return colors.accent;
      case 'expired':
        return colors.destructive;
      default:
        return colors.muted;
    }
  };

  return (
    <View style={styles.container}>
      <GlassHeader
        title="My Dashboard"
        subtitle="Manage your listings"
        leftIcon="arrow-left"
        onLeftPress={() => navigation.goBack()}
      />

      <View style={styles.sectionButtons}>
        {sections.map((section) => (
          <TouchableOpacity
            key={section.key}
            style={[
              styles.sectionButton,
              activeSection === section.key
                ? styles.sectionButtonActive
                : styles.sectionButtonInactive,
            ]}
            onPress={() => setActiveSection(section.key as any)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.sectionButtonText,
                activeSection === section.key
                  ? styles.sectionButtonTextActive
                  : styles.sectionButtonTextInactive,
              ]}
            >
              {section.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.content}>
        {listings.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>
              {activeSection === 'businesses' && '🏢'}
              {activeSection === 'events' && '🎉'}
              {activeSection === 'marketplace' && '🛍️'}
            </Text>
            <Text style={styles.emptyText}>No listings yet</Text>
            <Text style={styles.emptyDescription}>
              {activeSection === 'businesses' && 'Create your first business listing'}
              {activeSection === 'events' && 'Organize your first event'}
              {activeSection === 'marketplace' && 'Post your first item'}
            </Text>
            <GlassButton
              label={`+ Create ${activeSection === 'businesses' ? 'Business' : activeSection === 'events' ? 'Event' : 'Listing'}`}
              onPress={() => {
                // Navigate to create screen
              }}
              style={styles.createButton}
            />
          </View>
        ) : (
          <ScrollView showsVerticalScrollIndicator={false}>
            {listings.map((listing) => (
              <GlassCard key={listing.id} style={styles.listingCard}>
                <View style={styles.listingImage} />
                <View style={styles.listingContent}>
                  <Text style={styles.listingTitle}>{listing.title}</Text>
                  <View
                    style={[
                      styles.listingStatus,
                      listing.status === 'active' && styles.listingStatusActive,
                      listing.status === 'pending' && styles.listingStatusPending,
                      listing.status === 'expired' && styles.listingStatusExpired,
                    ]}
                  >
                    <Text
                      style={[
                        styles.listingStatusText,
                        { color: getStatusColor(listing.status) },
                      ]}
                    >
                      {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                    </Text>
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
