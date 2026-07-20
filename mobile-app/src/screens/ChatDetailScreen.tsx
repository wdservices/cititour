import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { spacing, radius, typography, glass } from '../theme/theme';
import { sendMessage, listenToMessages, markThreadRead, ChatMessage } from '../lib/chat';

export default function ChatDetailScreen({ route }: any) {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const navigation = useNavigation<any>();
  const { chatId, otherUserName } = route.params;

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!chatId) return;
    
    // Mark as read when entering chat
    markThreadRead(chatId, user?.role === 'business' ? 'business' : 'customer');

    // Listen to messages
    const unsubscribe = listenToMessages(chatId, (msgs) => {
      setMessages(msgs);
      setLoading(false);
      // Auto-scroll to bottom when new messages arrive
      setTimeout(() => {
        listRef.current?.scrollToEnd({ animated: true });
      }, 100);
    });

    return unsubscribe;
  }, [chatId, user?.role]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !chatId || !user?.id) return;

    const text = messageText.trim();
    setMessageText('');

    try {
      await sendMessage(
        chatId,
        user.id,
        user?.role === 'business' ? 'business' : 'customer',
        text
      );
    } catch (error) {
      console.error('[v0] Error sending message:', error);
      setMessageText(text); // Restore text on error
    }
  };

  const glassOpacity = isDark ? glass.opacityDark : glass.opacity;
  const customerBubbleColor = colors.primary;
  const businessBubbleColor = isDark
    ? `rgba(18, 22, 31, ${glassOpacity})`
    : `rgba(255, 255, 255, ${glassOpacity})`;
  const businessBubbleBorder = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.4)';

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : colors.border,
      gap: spacing.md,
    },
    backButton: { padding: spacing.xs },
    headerContent: { flex: 1 },
    headerName: {
      fontSize: typography.sizes.base,
      fontWeight: '700',
      color: colors.foreground,
      fontFamily: typography.display.fontFamily,
    },
    headerStatus: {
      fontSize: typography.sizes.xs,
      color: colors.mutedForeground,
      marginTop: spacing.xs,
      fontFamily: typography.body.fontFamily,
    },
    messagesContainer: { flex: 1, paddingHorizontal: spacing.lg, paddingVertical: spacing.md },
    messageBubble: { maxWidth: '85%', marginVertical: spacing.xs },
    customerBubble: {
      alignSelf: 'flex-end',
      backgroundColor: customerBubbleColor,
      borderRadius: radius.lg,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      borderBottomRightRadius: 4,
    },
    businessBubble: {
      alignSelf: 'flex-start',
      backgroundColor: businessBubbleColor,
      borderColor: businessBubbleBorder,
      borderWidth: 1,
      borderRadius: radius.lg,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      borderBottomLeftRadius: 4,
    },
    messageText: {
      fontSize: typography.sizes.base,
      lineHeight: 20,
      fontFamily: typography.body.fontFamily,
    },
    customerText: { color: colors.primaryForeground },
    businessText: { color: colors.foreground },
    timestamp: {
      fontSize: typography.sizes.xs,
      marginTop: spacing.xs,
      fontFamily: typography.body.fontFamily,
    },
    customerTimestamp: { color: 'rgba(255,255,255,0.7)', textAlign: 'right' },
    businessTimestamp: { color: colors.mutedForeground },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: spacing.md,
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.md,
      borderTopWidth: 1,
      borderTopColor: isDark ? 'rgba(255,255,255,0.1)' : colors.border,
      backgroundColor: colors.background,
    },
    inputField: {
      flex: 1,
      backgroundColor: isDark
        ? 'rgba(18, 22, 31, 0.7)'
        : 'rgba(255, 255, 255, 0.7)',
      borderColor: businessBubbleBorder,
      borderWidth: 1,
      borderRadius: radius.full,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      fontSize: typography.sizes.base,
      color: colors.foreground,
      fontFamily: typography.body.fontFamily,
      maxHeight: 100,
    },
    sendButton: {
      width: 44,
      height: 44,
      borderRadius: radius.full,
      backgroundColor: colors.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    sendButtonDisabled: { opacity: 0.5 },
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={colors.foreground} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerName}>{otherUserName}</Text>
          <Text style={styles.headerStatus}>Active now</Text>
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesContainer}
          scrollEventThrottle={16}
          onContentSizeChange={() => {
            if (messages.length > 0) {
              listRef.current?.scrollToEnd({ animated: false });
            }
          }}
          ListEmptyComponent={
            !loading ? (
              <View style={{ alignItems: 'center', marginTop: spacing.xl, marginBottom: spacing.xl }}>
                <Feather name="message-circle" size={48} color={colors.mutedForeground} />
                <Text style={[styles.messageText, { color: colors.mutedForeground, marginTop: spacing.md }]}>
                  Start the conversation!
                </Text>
              </View>
            ) : null
          }
          renderItem={({ item }) => {
            const isCustomer = item.senderRole === 'customer';
            const timestamp = item.createdAt?.toDate
              ? item.createdAt.toDate().toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '';

            return (
              <View
                style={[
                  styles.messageBubble,
                  isCustomer ? { alignSelf: 'flex-end' } : { alignSelf: 'flex-start' },
                ]}
              >
                <View style={isCustomer ? styles.customerBubble : styles.businessBubble}>
                  <Text style={[styles.messageText, isCustomer ? styles.customerText : styles.businessText]}>
                    {item.text}
                  </Text>
                  <Text style={[styles.timestamp, isCustomer ? styles.customerTimestamp : styles.businessTimestamp]}>
                    {timestamp}
                  </Text>
                </View>
              </View>
            );
          }}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputField}
            placeholder="Type a message..."
            placeholderTextColor={colors.mutedForeground}
            value={messageText}
            onChangeText={setMessageText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={[styles.sendButton, !messageText.trim() && styles.sendButtonDisabled]}
            onPress={handleSendMessage}
            disabled={!messageText.trim()}
            activeOpacity={0.7}
          >
            <Feather name="send" size={20} color={colors.primaryForeground} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
