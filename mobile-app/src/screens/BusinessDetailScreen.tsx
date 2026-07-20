import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import GlassHeader from '../components/GlassHeader';
import GlassButton from '../components/GlassButton';
import { spacing, radius, typography, glass } from '../theme/theme';
import { ensureChatExists } from '../lib/chat';

export default function BusinessDetailScreen({ route }: any) {
  const { colors, isDark } = useTheme();
  const { businessId, businessName } = route.params;
  const { user } = useAuth();
  const navigation = useNavigation<any>();

  const handleMessagePress = async () => {
    if (!user?.id || !businessName || !businessId) return;

    try {
      // Ensure chat exists in Firestore
      const chatId = await ensureChatExists(
        businessId,
        user.id,
        businessName,
        user.displayName || 'User'
      );

      // Navigate to chat detail screen
      navigation.navigate('ChatDetail', {
        chatId,
        otherUserName: businessName,
        businessId,
        customerId: user.id,
      });
    } catch (error) {
      console.error('[v0] Error starting chat:', error);
    }
  };

  const glassOpacity = isDark ? glass.opacityDark : glass.opacity;
  const cardBackgroundColor = isDark
    ? `rgba(18, 22, 31, ${glassOpacity})`
    : `rgba(255, 255, 255, ${glassOpacity})`;
  const cardBorderColor = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.4)';

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.lg,
    },
    heroImagePlaceholder: { width: '100%', height: 240, backgroundColor: colors.muted },
    content: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
    businessName: {
      fontSize: typography.sizes.xl,
      fontWeight: '800',
      color: colors.foreground,
      fontFamily: typography.display.fontFamily,
    },
    metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md, gap: spacing.sm },
    metaText: { fontSize: typography.sizes.xs, color: colors.mutedForeground, fontFamily: typography.body.fontFamily },
    description: {
      marginTop: spacing.lg,
      fontSize: typography.sizes.sm,
      color: colors.foreground,
      lineHeight: 20,
      fontFamily: typography.body.fontFamily,
    },
    actionRow: { flexDirection: 'row', gap: spacing.md, marginTop: spacing.xl },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <GlassHeader
        title={businessName}
        subtitle="Business Details"
        leftIcon="arrow-left"
        onLeftPress={() => navigation.goBack()}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.heroImagePlaceholder} />

        <View style={styles.content}>
          <Text style={styles.businessName}>{businessName}</Text>
          <View style={styles.metaRow}>
            <Feather name="star" size={14} color={colors.accent} />
            <Text style={styles.metaText}>4.8 (120 reviews)</Text>
            <Feather name="map-pin" size={14} color={colors.mutedForeground} />
            <Text style={styles.metaText}>Victoria Island, Lagos</Text>
          </View>

          <Text style={styles.description}>
            Description of the business goes here — pulled from the same Firestore businesses/{businessId} document used on the website.
          </Text>

          <View style={styles.actionRow}>
            <View style={{ flex: 1 }}>
              <GlassButton label="Call" onPress={() => {}} />
            </View>
            <View style={{ flex: 1 }}>
              <GlassButton
                label="Message"
                onPress={handleMessagePress}
                variant="outline"
                color="primary"
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

