import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import GlassHeader from '../components/GlassHeader';
import { spacing, radius, typography, glass } from '../theme/theme';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Conversation {
  id: string;
  businessId: string;
  customerId: string;
  businessName: string;
  customerName: string;
  lastMessage: string;
  lastMessageAt: any;
  lastMessageSenderId: string;
  unreadByBusiness: number;
  unreadByCustomer: number;
}

export default function ConversationsScreen() {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  // Determine if current user is a business or customer
  // In a real app, this would come from user profile/role
  const isBusinessUser = false; // TODO: get from user context

  useFocusEffect(
    React.useCallback(() => {
      if (!user?.id) return;

      setLoading(true);
      const chatsRef = collection(db, 'chats');
      
      // Query: show chats where user is either customer or business
      const q = query(
        chatsRef,
        where(isBusinessUser ? 'businessId' : 'customerId', '==', user.id),
        orderBy('lastMessageAt', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Conversation[];
        setConversations(data);
        setLoading(false);
      });

      return unsubscribe;
    }, [user?.id, isBusinessUser])
  );

  const handleSelectConversation = (conversation: Conversation) => {
    navigation.navigate('ChatDetail', {
      chatId: conversation.id,
      otherUserName: isBusinessUser ? conversation.customerName : conversation.businessName,
      businessId: conversation.businessId,
      customerId: conversation.customerId,
    });
  };

  const glassOpacity = isDark ? glass.opacityDark : glass.opacity;
  const cardBackgroundColor = isDark
    ? `rgba(18, 22, 31, ${glassOpacity})`
    : `rgba(255, 255, 255, ${glassOpacity})`;
  const cardBorderColor = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.4)';

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    emptyContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.lg,
    },
    emptyText: {
      fontSize: typography.sizes.base,
      color: colors.mutedForeground,
      textAlign: 'center',
      fontFamily: typography.body.fontFamily,
    },
    conversationCard: {
      backgroundColor: cardBackgroundColor,
      borderRadius: radius.lg,
      borderWidth: 1,
      borderColor: cardBorderColor,
      marginHorizontal: spacing.lg,
      marginBottom: spacing.md,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.md,
    },
    avatar: {
      width: 48,
      height: 48,
      borderRadius: radius.full,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      color: colors.primaryForeground,
      fontSize: typography.sizes.base,
      fontWeight: '700',
      fontFamily: typography.body.fontFamily,
    },
    content: { flex: 1 },
    nameRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    name: {
      fontSize: typography.sizes.base,
      fontWeight: '700',
      color: colors.foreground,
      fontFamily: typography.body.fontFamily,
    },
    timestamp: {
      fontSize: typography.sizes.xs,
      color: colors.mutedForeground,
      fontFamily: typography.body.fontFamily,
    },
    messagePreview: {
      fontSize: typography.sizes.sm,
      color: colors.mutedForeground,
      marginTop: spacing.xs,
      fontFamily: typography.body.fontFamily,
    },
    unreadBadge: {
      backgroundColor: colors.primary,
      borderRadius: radius.full,
      width: 20,
      height: 20,
      alignItems: 'center',
      justifyContent: 'center',
    },
    unreadBadgeText: {
      color: colors.primaryForeground,
      fontSize: typography.sizes.xs,
      fontWeight: '700',
      fontFamily: typography.body.fontFamily,
    },
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <GlassHeader title="Messages" subtitle="Your conversations" />
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <GlassHeader title="Messages" subtitle="Your conversations" />

      {conversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="message-circle" size={48} color={colors.mutedForeground} />
          <Text style={[styles.emptyText, { marginTop: spacing.md }]}>
            No conversations yet.{'\n'}Start chatting with a business to begin!
          </Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingVertical: spacing.md }}
          renderItem={({ item }) => {
            const unreadCount = isBusinessUser ? item.unreadByBusiness : item.unreadByCustomer;
            const otherUserName = isBusinessUser ? item.customerName : item.businessName;
            const formattedTime = item.lastMessageAt?.toDate
              ? item.lastMessageAt.toDate().toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                })
              : 'Recently';

            return (
              <TouchableOpacity
                style={styles.conversationCard}
                onPress={() => handleSelectConversation(item)}
                activeOpacity={0.7}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {otherUserName.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.content}>
                  <View style={styles.nameRow}>
                    <Text style={styles.name}>{otherUserName}</Text>
                    <Text style={styles.timestamp}>{formattedTime}</Text>
                  </View>
                  <Text
                    style={styles.messagePreview}
                    numberOfLines={1}
                  >
                    {item.lastMessage}
                  </Text>
                </View>
                {unreadCount > 0 && (
                  <View style={styles.unreadBadge}>
                    <Text style={styles.unreadBadgeText}>{unreadCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
        />
      )}
    </SafeAreaView>
  );
}
