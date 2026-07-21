import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft, Phone, MoreVertical, Plus, Smile, Send,
} from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { spacing, radius, typography } from '../theme/theme';
import { sendMessage, listenToMessages, markThreadRead, ChatMessage } from '../lib/chat';

const BLUE = '#1E88E5';

export default function ChatDetailScreen({ route }: any) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const { chatId, otherUserName } = route.params;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!chatId) return;
    markThreadRead(chatId, user?.role === 'business' ? 'business' : 'customer');
    const unsubscribe = listenToMessages(chatId, (msgs) => {
      setMessages(msgs);
      setLoading(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    });
    return unsubscribe;
  }, [chatId, user?.role]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !chatId || !user?.id) return;
    const text = messageText.trim();
    setMessageText('');
    try {
      await sendMessage(chatId, user.id, user?.role === 'business' ? 'business' : 'customer', text);
    } catch {
      setMessageText(text);
    }
  };

  return (
    <View style={s.container}>
      {/* ── Header ── */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <ArrowLeft size={22} color={colors.foreground} strokeWidth={2} />
        </TouchableOpacity>
        <View style={s.headerAvatar}>
          <Text style={s.headerAvatarText}>{otherUserName?.charAt(0)?.toUpperCase() || 'B'}</Text>
        </View>
        <View style={s.headerInfo}>
          <Text style={s.headerName} numberOfLines={1}>{otherUserName}</Text>
          <View style={s.onlineRow}>
            <View style={s.onlineDot} />
            <Text style={s.onlineText}>Online</Text>
          </View>
        </View>
        <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Phone size={20} color={colors.foreground} strokeWidth={2} />
        </TouchableOpacity>
        <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <MoreVertical size={20} color={colors.foreground} strokeWidth={2} />
        </TouchableOpacity>
      </View>

      {/* ── Date divider ── */}
      <View style={s.dateDivider}>
        <View style={s.dateDividerLine} />
        <Text style={s.dateDividerText}>Today</Text>
        <View style={s.dateDividerLine} />
      </View>

      {/* ── Messages ── */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={s.messagesContainer}
          onContentSizeChange={() => {
            if (messages.length > 0) listRef.current?.scrollToEnd({ animated: false });
          }}
          ListEmptyComponent={
            !loading ? (
              <View style={s.emptyChat}>
                <Text style={s.emptyChatText}>Send a message to start the conversation!</Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => {
            const isCustomer = item.senderRole === 'customer';
            const timestamp = item.createdAt?.toDate
              ? item.createdAt.toDate().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
              : '';

            return (
              <View style={[s.messageRow, isCustomer ? s.messageRowRight : s.messageRowLeft]}>
                {!isCustomer && (
                  <View style={s.msgAvatar}>
                    <Text style={s.msgAvatarText}>{otherUserName?.charAt(0)?.toUpperCase()}</Text>
                  </View>
                )}
                <View style={s.messageColumn}>
                  <View style={isCustomer ? s.customerBubble : s.businessBubble}>
                    <Text style={isCustomer ? s.customerText : s.businessText}>
                      {item.text}
                    </Text>
                  </View>
                  <Text style={[s.timestamp, isCustomer && s.timestampRight]}>
                    {timestamp} {isCustomer && '✓✓'}
                  </Text>
                </View>
              </View>
            );
          }}
        />

        {/* ── Input Bar ── */}
        <View style={s.inputBar}>
          <TouchableOpacity style={s.inputAction} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Plus size={22} color="#64748B" strokeWidth={2} />
          </TouchableOpacity>
          <TextInput
            style={s.inputField}
            placeholder="Type a message..."
            placeholderTextColor="#94A3B8"
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity style={s.inputAction} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Smile size={22} color="#64748B" strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.sendBtn, !messageText.trim() && { opacity: 0.4 }]}
            onPress={handleSendMessage}
            disabled={!messageText.trim()}
            activeOpacity={0.7}
          >
            <Send size={18} color="#fff" strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },

  /* Header */
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingVertical: 14,
    backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#F1F5F9',
  },
  headerAvatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: BLUE, alignItems: 'center', justifyContent: 'center',
  },
  headerAvatarText: { color: '#fff', fontSize: 18, fontWeight: '700' },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 16, fontWeight: '700', color: '#0F172A' },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  onlineDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#10B981' },
  onlineText: { fontSize: 12, color: '#10B981', fontWeight: '500' },

  /* Date divider */
  dateDivider: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, gap: 12,
  },
  dateDividerLine: { flex: 1, height: 1, backgroundColor: '#E2E8F0' },
  dateDividerText: { fontSize: 12, fontWeight: '600', color: '#94A3B8' },

  /* Messages */
  messagesContainer: { paddingHorizontal: 16, paddingBottom: 16 },
  emptyChat: { alignItems: 'center', marginTop: 80 },
  emptyChatText: { fontSize: 14, color: '#94A3B8' },
  messageRow: { flexDirection: 'row', marginBottom: 12, gap: 8 },
  messageRowRight: { justifyContent: 'flex-end' },
  messageRowLeft: { justifyContent: 'flex-start' },
  msgAvatar: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center', marginTop: 4,
  },
  msgAvatarText: { fontSize: 13, fontWeight: '700', color: '#64748B' },
  messageColumn: { maxWidth: '78%' },
  customerBubble: {
    backgroundColor: BLUE, borderRadius: 18, borderTopRightRadius: 4,
    paddingHorizontal: 16, paddingVertical: 12,
  },
  businessBubble: {
    backgroundColor: '#fff', borderRadius: 18, borderTopLeftRadius: 4,
    paddingHorizontal: 16, paddingVertical: 12,
    borderWidth: 1, borderColor: '#E2E8F0',
  },
  customerText: { color: '#fff', fontSize: 15, lineHeight: 21 },
  businessText: { color: '#1E293B', fontSize: 15, lineHeight: 21 },
  timestamp: { fontSize: 11, color: '#94A3B8', marginTop: 4 },
  timestampRight: { textAlign: 'right' },

  /* Input */
  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 8,
    paddingHorizontal: 12, paddingVertical: 10,
    backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#F1F5F9',
  },
  inputAction: { padding: 8 },
  inputField: {
    flex: 1, backgroundColor: '#F1F5F9', borderRadius: 22,
    paddingHorizontal: 16, paddingVertical: 10,
    fontSize: 15, color: '#0F172A', maxHeight: 100,
  },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: BLUE, alignItems: 'center', justifyContent: 'center',
  },
});
