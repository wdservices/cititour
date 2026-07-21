import React, { useEffect, useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MessageCircle } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import GlassHeader from '../components/GlassHeader';
import { spacing, radius, typography } from '../theme/theme';
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
  unreadByBusiness: number;
  unreadByCustomer: number;
}

const BLUE = '#1E88E5';

export default function ConversationsScreen() {
  const { colors } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const isBusinessUser = false;

  useFocusEffect(
    React.useCallback(() => {
      if (!user?.id) return;
      setLoading(true);
      const chatsRef = collection(db, 'chats');
      const q = query(
        chatsRef,
        where(isBusinessUser ? 'businessId' : 'customerId', '==', user.id),
        orderBy('lastMessageAt', 'desc')
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id, ...doc.data(),
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

  if (loading) {
    return (
      <View style={s.container}>
        <GlassHeader title="Messages" subtitle="Your conversations" />
        <View style={s.emptyContainer}>
          <ActivityIndicator size="large" color={BLUE} />
        </View>
      </View>
    );
  }

  return (
    <View style={s.container}>
      <GlassHeader title="Messages" subtitle="Your conversations" />

      {conversations.length === 0 ? (
        <View style={s.emptyContainer}>
          <MessageCircle size={48} color="#CBD5E1" strokeWidth={1.5} />
          <Text style={s.emptyText}>No conversations yet</Text>
          <Text style={s.emptyDesc}>Start chatting with a business to begin!</Text>
        </View>
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item) => item.id}
          contentContainerStyle={s.listContent}
          renderItem={({ item }) => {
            const unreadCount = isBusinessUser ? item.unreadByBusiness : item.unreadByCustomer;
            const otherUserName = isBusinessUser ? item.customerName : item.businessName;
            const formattedTime = item.lastMessageAt?.toDate
              ? item.lastMessageAt.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
              : 'Recently';
            return (
              <TouchableOpacity
                style={s.convoCard}
                onPress={() => handleSelectConversation(item)}
                activeOpacity={0.7}
              >
                <View style={s.avatar}>
                  <Text style={s.avatarText}>{otherUserName.charAt(0).toUpperCase()}</Text>
                </View>
                <View style={s.convoContent}>
                  <View style={s.nameRow}>
                    <Text style={s.name} numberOfLines={1}>{otherUserName}</Text>
                    <Text style={s.timestamp}>{formattedTime}</Text>
                  </View>
                  <Text style={s.lastMessage} numberOfLines={1}>{item.lastMessage}</Text>
                </View>
                {unreadCount > 0 && (
                  <View style={s.unreadBadge}>
                    <Text style={s.unreadText}>{unreadCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          }}
        />
      )}
      <View style={{ height: 90 }} />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#0F172A' },
  emptyDesc: { fontSize: 13, color: '#94A3B8' },
  listContent: { paddingHorizontal: 20, paddingVertical: 12, gap: 12 },

  convoCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#fff', borderRadius: 18, padding: 14,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  avatar: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: BLUE, alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { color: '#fff', fontSize: 20, fontWeight: '700' },
  convoContent: { flex: 1 },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontSize: 15, fontWeight: '700', color: '#0F172A', flex: 1 },
  timestamp: { fontSize: 12, color: '#94A3B8' },
  lastMessage: { fontSize: 13, color: '#64748B', marginTop: 4 },
  unreadBadge: {
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: BLUE, alignItems: 'center', justifyContent: 'center',
  },
  unreadText: { color: '#fff', fontSize: 11, fontWeight: '700' },
});
