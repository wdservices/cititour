import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput,
  KeyboardAvoidingView, Platform, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MapPin, Star, Phone, MessageCircle, Send, ArrowLeft } from 'lucide-react-native';
import { colors, spacing, radius, typography } from '../theme/theme';
import { ensureChatExists, sendMessage, listenToMessages, markThreadRead, ChatMessage } from '../lib/chat';
import { useAuth } from '../contexts/AuthContext';

export default function BusinessDetailScreen({ route }: any) {
  const { businessId, businessName } = route.params;
  const { user } = useAuth(); // real, authenticated user — RootNavigator guarantees this screen only renders when signed in

  const [showChat, setShowChat] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (!showChat || chatId || !user) return;
    ensureChatExists(businessId, user!.id, businessName, user!.name).then((id) => {
      setChatId(id);
      markThreadRead(id, 'customer');
    });
  }, [showChat, businessId, businessName, user, chatId]);

  useEffect(() => {
    if (!chatId) return;
    return listenToMessages(chatId, setMessages);
  }, [chatId]);

  const handleSend = async () => {
    if (!draft.trim() || !chatId || !user) return;
    const text = draft.trim();
    setDraft('');
    await sendMessage(chatId, user!.id, 'customer', text);
  };

  if (showChat) {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={styles.chatHeader}>
            <TouchableOpacity onPress={() => setShowChat(false)} style={styles.backButton}>
              <ArrowLeft size={22} color={colors.foreground} />
            </TouchableOpacity>
            <Text style={styles.chatHeaderTitle}>{businessName}</Text>
            <View style={{ width: 22 }} />
          </View>

          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(m) => m.id}
            contentContainerStyle={{ padding: spacing.md, gap: spacing.sm }}
            onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
            ListEmptyComponent={
              <View style={{ alignItems: 'center', marginTop: 40 }}>
                <Text style={{ color: colors.mutedForeground, fontSize: typography.sizes.sm }}>
                  Say hello to {businessName}
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <View
                style={[
                  styles.messageBubble,
                  item.senderRole === 'customer' ? styles.messageBubbleMine : styles.messageBubbleTheirs,
                ]}
              >
                <Text style={item.senderRole === 'customer' ? styles.messageTextMine : styles.messageTextTheirs}>
                  {item.text}
                </Text>
              </View>
            )}
          />

          <View style={styles.chatInputRow}>
            <TextInput
              value={draft}
              onChangeText={setDraft}
              placeholder="Type a message..."
              placeholderTextColor={colors.mutedForeground}
              style={styles.chatInput}
              onSubmitEditing={handleSend}
            />
            <TouchableOpacity onPress={handleSend} style={styles.sendButton} disabled={!draft.trim()}>
              <Send size={18} color={colors.primaryForeground} />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.heroImagePlaceholder} />

        <View style={{ padding: spacing.md }}>
          <Text style={styles.businessName}>{businessName}</Text>
          <View style={styles.metaRow}>
            <Star size={14} color={colors.accent} fill={colors.accent} />
            <Text style={styles.metaText}>4.8 (120 reviews)</Text>
            <MapPin size={14} color={colors.mutedForeground} style={{ marginLeft: spacing.sm }} />
            <Text style={styles.metaText}>Victoria Island, Lagos</Text>
          </View>

          <Text style={styles.description}>
            Description of the business goes here — pulled from the same
            Firestore businesses/{'{businessId}'} document used on the website.
          </Text>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.primaryAction}>
              <Phone size={16} color={colors.primaryForeground} />
              <Text style={styles.primaryActionText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryAction} onPress={() => setShowChat(true)}>
              <MessageCircle size={16} color={colors.primary} />
              <Text style={styles.secondaryActionText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  heroImagePlaceholder: { width: '100%', height: 220, backgroundColor: colors.muted },
  businessName: { fontSize: typography.sizes.xl, fontWeight: '800', color: colors.foreground },
  metaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 4 },
  metaText: { fontSize: typography.sizes.xs, color: colors.mutedForeground },
  description: { marginTop: spacing.md, fontSize: typography.sizes.sm, color: colors.foreground, lineHeight: 20 },
  actionRow: { flexDirection: 'row', gap: spacing.sm, marginTop: spacing.lg },
  primaryAction: {
    flex: 1, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center',
    backgroundColor: colors.primary, paddingVertical: 12, borderRadius: radius.full,
  },
  primaryActionText: { color: colors.primaryForeground, fontWeight: '700', fontSize: typography.sizes.sm },
  secondaryAction: {
    flex: 1, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: colors.primary, paddingVertical: 12, borderRadius: radius.full,
  },
  secondaryActionText: { color: colors.primary, fontWeight: '700', fontSize: typography.sizes.sm },

  chatHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.md, paddingVertical: spacing.sm,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  backButton: { padding: 4 },
  chatHeaderTitle: { fontSize: typography.sizes.base, fontWeight: '700', color: colors.foreground },
  messageBubble: { maxWidth: '78%', paddingHorizontal: 14, paddingVertical: 9, borderRadius: radius.lg },
  messageBubbleMine: { alignSelf: 'flex-end', backgroundColor: colors.primary, borderBottomRightRadius: 4 },
  messageBubbleTheirs: { alignSelf: 'flex-start', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderBottomLeftRadius: 4 },
  messageTextMine: { color: colors.primaryForeground, fontSize: typography.sizes.sm },
  messageTextTheirs: { color: colors.foreground, fontSize: typography.sizes.sm },
  chatInputRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    padding: spacing.sm, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: colors.card,
  },
  chatInput: {
    flex: 1, backgroundColor: colors.background, borderRadius: radius.full,
    paddingHorizontal: spacing.md, paddingVertical: 10, fontSize: typography.sizes.sm, color: colors.foreground,
    borderWidth: 1, borderColor: colors.border,
  },
  sendButton: {
    width: 38, height: 38, borderRadius: radius.full, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
});
