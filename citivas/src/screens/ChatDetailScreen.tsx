import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Send, ChevronLeft } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { sendMessage, listenToMessages, markThreadRead, ChatMessage } from '../lib/chat';

export default function ChatDetailScreen({ route, navigation }: any) {
  const { colors } = useTheme();
  const { user } = useAuth();
  const insets = useSafeAreaInsets();
  const { chatId, otherUserName, otherUserPhoto } = route.params;
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
      await sendMessage(chatId, user.id, 'customer', text, user.name, user.photoURL);
    } catch {
      setMessageText(text);
    }
  };

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <View style={[s.header, { paddingTop: insets.top + 6, borderBottomColor: colors.border, backgroundColor: colors.card }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn}>
          <ChevronLeft size={24} color={colors.foreground} />
        </TouchableOpacity>
        {otherUserPhoto ? (
          <Image source={{ uri: otherUserPhoto }} style={s.headerAvatarImg} />
        ) : (
          <View style={[s.headerAvatar, { backgroundColor: colors.primary + '20' }]}>
            <Text style={[s.headerAvatarText, { color: colors.primary }]}>
              {otherUserName?.charAt(0)?.toUpperCase() || 'B'}
            </Text>
          </View>
        )}
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
            const isMe = item.senderRole === 'customer';
            const time = item.createdAt?.toDate
              ? item.createdAt.toDate().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
              : '';
            return (
              <View style={[s.messageWrapper, isMe ? s.messageWrapperRight : s.messageWrapperLeft]}>
                {!isMe && (
                  <View style={s.senderRow}>
                    {item.senderPhoto ? (
                      <Image source={{ uri: item.senderPhoto }} style={s.senderAvatar} />
                    ) : (
                      <View style={[s.senderAvatarFallback, { backgroundColor: colors.primary + '20' }]}>
                        <Text style={[s.senderAvatarFallbackText, { color: colors.primary }]}>
                          {(item.senderName || otherUserName || 'B').charAt(0).toUpperCase()}
                        </Text>
                      </View>
                    )}
                    <Text style={[s.senderName, { color: colors.mutedForeground }]} numberOfLines={1}>
                      {item.senderName || otherUserName}
                    </Text>
                  </View>
                )}
                <View style={isMe ? s.bubbleRowRight : s.bubbleRowLeft}>
                  <View style={isMe
                    ? [s.customerBubble, { backgroundColor: colors.primary }]
                    : [s.businessBubble, { backgroundColor: colors.card, borderColor: colors.border }]
                  }>
                    <Text style={isMe
                      ? [s.customerText, { color: colors.primaryForeground }]
                      : [s.businessText, { color: colors.foreground }]
                    }>
                      {item.text}
                    </Text>
                  </View>
                  {time ? (
                    <Text style={[s.timestamp, { color: colors.mutedForeground }, isMe && s.timestampRight]}>
                      {time}
                    </Text>
                  ) : null}
                </View>
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
    flexDirection: 'row', alignItems: 'center', gap: 10,
    paddingHorizontal: 12, paddingBottom: 12, borderBottomWidth: 1,
  },
  backBtn: { padding: 4 },
  headerAvatar: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  headerAvatarImg: { width: 38, height: 38, borderRadius: 19 },
  headerAvatarText: { fontSize: 16, fontWeight: '700' },
  headerInfo: { flex: 1 },
  headerName: { fontSize: 15, fontWeight: '700' },
  onlineRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 2 },
  onlineDot: { width: 7, height: 7, borderRadius: 4 },
  onlineText: { fontSize: 11, fontWeight: '500' },

  messagesContainer: { paddingHorizontal: 12, paddingVertical: 12 },
  emptyChat: { alignItems: 'center', marginTop: 80 },
  emptyChatText: { fontSize: 14 },
  messageWrapper: { marginBottom: 6 },
  messageWrapperRight: { alignItems: 'flex-end' },
  messageWrapperLeft: { alignItems: 'flex-start' },
  senderRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3, marginLeft: 4 },
  senderAvatar: { width: 18, height: 18, borderRadius: 9 },
  senderAvatarFallback: { width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  senderAvatarFallbackText: { fontSize: 9, fontWeight: '700' },
  senderName: { fontSize: 11, fontWeight: '500' },
  bubbleRowRight: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  bubbleRowLeft: { flexDirection: 'row', alignItems: 'flex-end', gap: 4 },
  customerBubble: { borderRadius: 16, borderTopRightRadius: 4, paddingHorizontal: 12, paddingVertical: 8, maxWidth: '75%' },
  businessBubble: { borderRadius: 16, borderTopLeftRadius: 4, paddingHorizontal: 12, paddingVertical: 8, maxWidth: '75%', borderWidth: 1 },
  customerText: { fontSize: 14, lineHeight: 20 },
  businessText: { fontSize: 14, lineHeight: 20 },
  timestamp: { fontSize: 10, marginBottom: 2 },
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
