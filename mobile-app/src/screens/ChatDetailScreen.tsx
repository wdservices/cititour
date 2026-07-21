import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Send } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { sendMessage, listenToMessages, markThreadRead, ChatMessage } from '../lib/chat';

export default function ChatDetailScreen({ route }: any) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const { chatId, otherUserName } = route.params;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!chatId) return;
    markThreadRead(chatId, 'customer');
    const unsubscribe = listenToMessages(chatId, (msgs) => {
      setMessages(msgs);
      setLoading(false);
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 100);
    });
    return unsubscribe;
  }, [chatId]);

  const handleSend = async () => {
    if (!messageText.trim() || !chatId || !user?.id) return;
    const text = messageText.trim();
    setMessageText('');
    try {
      await sendMessage(chatId, user.id, 'customer', text);
    } catch {
      setMessageText(text);
    }
  };

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <View style={[s.header, { paddingTop: insets.top + 6, borderBottomColor: colors.border }]}>
        <View style={[s.headerAvatar, { backgroundColor: colors.primary }]}>
          <Text style={s.headerAvatarText}>
            {otherUserName?.charAt(0)?.toUpperCase() || 'B'}
          </Text>
        </View>
        <View style={s.headerInfo}>
          <Text style={[s.headerName, { color: colors.foreground }]} numberOfLines={1}>{otherUserName}</Text>
          <View style={s.onlineRow}>
            <View style={[s.onlineDot, { backgroundColor: colors.success }]} />
            <Text style={[s.onlineText, { color: colors.success }]}>Online</Text>
          </View>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(i) => i.id}
          contentContainerStyle={s.messagesContainer}
          showsVerticalScrollIndicator={false}
          onContentSizeChange={() => messages.length > 0 && listRef.current?.scrollToEnd({ animated: false })}
          ListEmptyComponent={
            !loading ? (
              <View style={s.emptyChat}>
                <Text style={[s.emptyChatText, { color: colors.mutedForeground }]}>
                  Send a message to start the conversation
                </Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => {
            const isCustomer = item.senderRole === 'customer';
            const time = item.createdAt?.toDate
              ? item.createdAt.toDate().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
              : '';
            return (
              <View style={[s.messageRow, isCustomer ? s.messageRowRight : s.messageRowLeft]}>
                <View style={isCustomer ? [s.customerBubble, { backgroundColor: colors.primary }] : [s.businessBubble, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <Text style={isCustomer ? [s.customerText, { color: colors.primaryForeground }] : [s.businessText, { color: colors.foreground }]}>
                    {item.text}
                  </Text>
                </View>
                <Text style={[s.timestamp, { color: colors.mutedForeground }, isCustomer && s.timestampRight]}>
                  {time}
                </Text>
              </View>
            );
          }}
        />

        <View style={[s.inputBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
          <TextInput
            style={[s.inputField, { backgroundColor: colors.muted, color: colors.foreground }]}
            placeholder="Type a message..."
            placeholderTextColor={colors.mutedForeground}
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[s.sendBtn, { backgroundColor: colors.primary }, !messageText.trim() && { opacity: 0.4 }]}
            onPress={handleSend}
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
  container: { flex: 1 },
  header: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1,
  },
  headerAvatar: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  headerAvatarText: { color: '#fff', fontSize: 17, fontWeight: '700' },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 16, fontWeight: '700' },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  onlineDot: { width: 7, height: 7, borderRadius: 4 },
  onlineText: { fontSize: 12, fontWeight: '500' },

  messagesContainer: { paddingHorizontal: 16, paddingVertical: 16 },
  emptyChat: { alignItems: 'center', marginTop: 80 },
  emptyChatText: { fontSize: 14 },
  messageRow: { marginBottom: 12 },
  messageRowRight: { alignItems: 'flex-end' },
  messageRowLeft: { alignItems: 'flex-start' },
  customerBubble: { borderRadius: 16, borderTopRightRadius: 4, paddingHorizontal: 14, paddingVertical: 10, maxWidth: '78%' },
  businessBubble: { borderRadius: 16, borderTopLeftRadius: 4, paddingHorizontal: 14, paddingVertical: 10, maxWidth: '78%', borderWidth: 1 },
  customerText: { fontSize: 15, lineHeight: 21 },
  businessText: { fontSize: 15, lineHeight: 21 },
  timestamp: { fontSize: 11, marginTop: 4 },
  timestampRight: { textAlign: 'right' },

  inputBar: {
    flexDirection: 'row', alignItems: 'flex-end', gap: 8,
    paddingHorizontal: 12, paddingVertical: 10, borderTopWidth: 1,
  },
  inputField: {
    flex: 1, borderRadius: 20, paddingHorizontal: 16, paddingVertical: 10,
    fontSize: 15, maxHeight: 100,
  },
  sendBtn: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
});
