import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput,
  ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Send, CheckCircle } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

const FEEDBACK_TYPES = ['Bug Report', 'Feature Request', 'General Feedback', 'Complaint'];

export default function FeedbackScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const navigation = useNavigation<any>();

  const [type, setType] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);

  const canSubmit = type.trim() && message.trim().length >= 10;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    try {
      await addDoc(collection(db, 'feedback'), {
        type,
        message: message.trim(),
        userId: user?.id || '',
        userName: user?.name || '',
        userEmail: user?.email || '',
        createdAt: serverTimestamp(),
        status: 'new',
      });
      setSubmitted(true);
    } catch (e: any) {
      Alert.alert('Error', e?.message || 'Failed to submit feedback');
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <View style={[s.container, { backgroundColor: colors.background }]}>
        <View style={[s.header, { paddingTop: insets.top + 6, borderBottomColor: colors.border }]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <ArrowLeft size={22} color={colors.foreground} strokeWidth={2} />
          </TouchableOpacity>
          <Text style={[s.headerTitle, { color: colors.foreground }]}>Feedback</Text>
          <View style={{ width: 30 }} />
        </View>
        <View style={s.successContainer}>
          <CheckCircle size={64} color={colors.success} strokeWidth={1.5} />
          <Text style={[s.successTitle, { color: colors.foreground }]}>Thank you!</Text>
          <Text style={[s.successDesc, { color: colors.mutedForeground }]}>
            Your feedback has been submitted. We review all submissions and will get back to you if needed.
          </Text>
          <TouchableOpacity
            style={[s.successBtn, { backgroundColor: colors.primary }]}
            onPress={() => navigation.goBack()}
          >
            <Text style={[s.successBtnText, { color: '#fff' }]}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <View style={[s.header, { paddingTop: insets.top + 6, borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={s.backBtn} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <ArrowLeft size={22} color={colors.foreground} strokeWidth={2} />
        </TouchableOpacity>
        <Text style={[s.headerTitle, { color: colors.foreground }]}>Feedback</Text>
        <View style={{ width: 30 }} />
      </View>

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={s.scrollContent}>
          <Text style={[s.intro, { color: colors.mutedForeground }]}>
            Help us improve CitiTour. Your feedback is sent directly to our admin team.
          </Text>

          {/* Type selector */}
          <Text style={[s.label, { color: colors.mutedForeground }]}>Feedback Type *</Text>
          <TouchableOpacity
            style={[s.input, { borderColor: colors.border, backgroundColor: colors.card, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}
            onPress={() => setShowTypeDropdown(true)}
            activeOpacity={0.7}
          >
            <Text style={{ color: type ? colors.foreground : colors.mutedForeground, fontSize: 14 }}>
              {type || 'Select type'}
            </Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>▼</Text>
          </TouchableOpacity>

          {/* Message */}
          <Text style={[s.label, { color: colors.mutedForeground }]}>Your Message *</Text>
          <TextInput
            style={[s.textArea, { borderColor: colors.border, color: colors.foreground, backgroundColor: colors.card }]}
            value={message}
            onChangeText={setMessage}
            placeholder="Tell us what's on your mind (min 10 characters)..."
            placeholderTextColor={colors.mutedForeground}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
          <Text style={[s.charCount, { color: colors.mutedForeground }]}>
            {message.length} characters
          </Text>

          <TouchableOpacity
            style={[s.submitBtn, { backgroundColor: colors.primary, opacity: canSubmit && !submitting ? 1 : 0.5 }]}
            onPress={handleSubmit}
            disabled={!canSubmit || submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <>
                <Send size={16} color="#fff" strokeWidth={2} />
                <Text style={s.submitBtnText}>Submit Feedback</Text>
              </>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Type dropdown modal */}
      {showTypeDropdown && (
        <View style={s.modalOverlay}>
          <TouchableOpacity style={s.modalBackdrop} onPress={() => setShowTypeDropdown(false)} activeOpacity={1} />
          <View style={[s.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[s.modalTitle, { color: colors.foreground }]}>Select Feedback Type</Text>
            {FEEDBACK_TYPES.map((t) => (
              <TouchableOpacity
                key={t}
                style={[s.modalItem, type === t && { backgroundColor: colors.primary + '15' }]}
                onPress={() => { setType(t); setShowTypeDropdown(false); }}
              >
                <Text style={[s.modalItemText, { color: type === t ? colors.primary : colors.foreground }]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingBottom: 10, borderBottomWidth: 1, gap: 12 },
  backBtn: { padding: 4 },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '800', letterSpacing: -0.3, textAlign: 'center' },
  scrollContent: { paddingHorizontal: 16, paddingTop: 20 },

  intro: { fontSize: 14, lineHeight: 20, marginBottom: 20 },
  label: { fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: 16, marginBottom: 6 },
  input: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14 },
  textArea: { borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, height: 140 },
  charCount: { fontSize: 11, textAlign: 'right', marginTop: 4 },

  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderRadius: 14, paddingVertical: 15, marginTop: 24, marginBottom: 40 },
  submitBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  successContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 32, gap: 12 },
  successTitle: { fontSize: 22, fontWeight: '800' },
  successDesc: { fontSize: 14, textAlign: 'center', lineHeight: 20 },
  successBtn: { borderRadius: 14, paddingVertical: 14, paddingHorizontal: 32, marginTop: 16 },
  successBtnText: { fontSize: 15, fontWeight: '700' },

  modalOverlay: { ...StyleSheet.absoluteFillObject, zIndex: 1000 },
  modalBackdrop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  modalContent: { position: 'absolute', bottom: 0, left: 0, right: 0, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, paddingBottom: 32 },
  modalTitle: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  modalItem: { paddingVertical: 14, paddingHorizontal: 12, borderRadius: 10, marginBottom: 4 },
  modalItemText: { fontSize: 14, fontWeight: '500' },
});
