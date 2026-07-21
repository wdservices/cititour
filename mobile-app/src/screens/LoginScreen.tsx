import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
  const { colors, isDark } = useTheme();
  const { loginWithEmail, signUpWithEmailPassword, resetPassword } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter your email and password.');
      return;
    }
    if (isSignUp && !acceptTerms) {
      setErrorMessage('You must accept the Terms of Service and Privacy Policy.');
      return;
    }
    if (isSignUp && password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    setErrorMessage(null);
    setIsWorking(true);
    try {
      if (isSignUp) {
        await signUpWithEmailPassword(email.trim(), password);
      } else {
        await loginWithEmail(email.trim(), password);
      }
    } catch (error: any) {
      setErrorMessage(friendlyAuthError(error?.code));
    } finally {
      setIsWorking(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      setErrorMessage('Enter your email above first, then tap "Forgot password?" again.');
      return;
    }
    try {
      await resetPassword(email.trim());
      Alert.alert('Check your email', 'A password reset link has been sent.');
    } catch (error: any) {
      setErrorMessage(friendlyAuthError(error?.code));
    }
  };

  const iconColor = colors.mutedForeground;
  const iconSize = 18;

  return (
    <SafeAreaView style={s.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* ── Blue Header ── */}
          <View style={s.header}>
            <View style={s.logoCircle}>
              <Text style={s.logoLetter}>C</Text>
            </View>
            <Text style={s.brand}>CitiTour</Text>
            <Text style={s.subtitle}>
              {isSignUp ? 'Create your account to explore Nigeria' : 'Welcome back — discover your city'}
            </Text>
          </View>

          {/* ── Form Card ── */}
          <View style={s.card}>
            {/* Tab Toggle */}
            <View style={s.tabs}>
              <TouchableOpacity
                style={[s.tab, !isSignUp && s.tabActive]}
                onPress={() => { setIsSignUp(false); setErrorMessage(null); }}
              >
                <Text style={[s.tabText, !isSignUp && s.tabTextActive]}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.tab, isSignUp && s.tabActive]}
                onPress={() => { setIsSignUp(true); setErrorMessage(null); }}
              >
                <Text style={[s.tabText, isSignUp && s.tabTextActive]}>Sign Up</Text>
              </TouchableOpacity>
            </View>

            {/* Name (Sign Up) */}
            {isSignUp && (
              <View style={s.field}>
                <Text style={s.label}>Full Name</Text>
                <View style={s.inputRow}>
                  <User size={iconSize} color={iconColor} />
                  <TextInput
                    value={name}
                    onChangeText={setName}
                    placeholder="John Doe"
                    placeholderTextColor={colors.mutedForeground}
                    style={s.input}
                  />
                </View>
              </View>
            )}

            {/* Email */}
            <View style={s.field}>
              <Text style={s.label}>Email</Text>
              <View style={s.inputRow}>
                <Mail size={iconSize} color={iconColor} />
                <TextInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@email.com"
                  placeholderTextColor={colors.mutedForeground}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={s.input}
                />
              </View>
            </View>

            {/* Password */}
            <View style={s.field}>
              <Text style={s.label}>Password</Text>
              <View style={s.inputRow}>
                <Lock size={iconSize} color={iconColor} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Enter your password"
                  placeholderTextColor={colors.mutedForeground}
                  secureTextEntry={!showPassword}
                  style={s.input}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                  {showPassword
                    ? <EyeOff size={iconSize} color={iconColor} />
                    : <Eye size={iconSize} color={iconColor} />}
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password (Sign Up) */}
            {isSignUp && (
              <View style={s.field}>
                <Text style={s.label}>Confirm Password</Text>
                <View style={s.inputRow}>
                  <Lock size={iconSize} color={iconColor} />
                  <TextInput
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="Re-enter password"
                    placeholderTextColor={colors.mutedForeground}
                    secureTextEntry={!showConfirmPassword}
                    style={s.input}
                  />
                  <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                    {showConfirmPassword
                      ? <EyeOff size={iconSize} color={iconColor} />
                      : <Eye size={iconSize} color={iconColor} />}
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* Terms (Sign Up) */}
            {isSignUp && (
              <TouchableOpacity style={s.termsRow} onPress={() => setAcceptTerms(!acceptTerms)} activeOpacity={0.7}>
                <View style={[s.checkbox, acceptTerms && s.checkboxChecked]}>
                  {acceptTerms && <Text style={s.checkMark}>✓</Text>}
                </View>
                <Text style={s.termsText}>
                  I agree to the{' '}
                  <Text style={s.termsLink}>Terms of Service</Text> and{' '}
                  <Text style={s.termsLink}>Privacy Policy</Text>
                </Text>
              </TouchableOpacity>
            )}

            {/* Error */}
            {errorMessage ? <Text style={s.error}>{errorMessage}</Text> : null}

            {/* Submit */}
            <TouchableOpacity
              style={[s.submitBtn, isWorking && s.submitBtnDisabled]}
              onPress={handleSubmit}
              disabled={isWorking}
              activeOpacity={0.8}
            >
              {isWorking ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={s.submitText}>{isSignUp ? 'Create Account' : 'Sign In'}</Text>
              )}
            </TouchableOpacity>

            {/* Forgot Password */}
            {!isSignUp && (
              <TouchableOpacity onPress={handleForgotPassword} style={{ alignSelf: 'center', marginTop: 12 }}>
                <Text style={s.forgotText}>Forgot password?</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Toggle */}
          <View style={s.toggleRow}>
            <Text style={s.toggleLabel}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </Text>
            <TouchableOpacity onPress={() => { setIsSignUp(!isSignUp); setErrorMessage(null); }}>
              <Text style={s.toggleLink}>{isSignUp ? 'Sign In' : 'Sign Up'}</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <Text style={s.footer}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function friendlyAuthError(code?: string): string {
  switch (code) {
    case 'auth/invalid-email': return 'That email address looks invalid.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential': return 'Incorrect email or password.';
    case 'auth/email-already-in-use': return 'An account with this email already exists — try signing in.';
    case 'auth/weak-password': return 'Password should be at least 6 characters.';
    default: return 'Something went wrong. Please try again.';
  }
}

const BLUE = '#1E88E5';

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F7FA' },
  scroll: { flexGrow: 1, paddingHorizontal: 20, paddingBottom: 40 },

  /* Header */
  header: {
    backgroundColor: BLUE,
    paddingTop: 32,
    paddingBottom: 40,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    alignItems: 'center',
  },
  logoCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  logoLetter: { color: '#fff', fontSize: 28, fontWeight: '800' },
  brand: { color: '#fff', fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
  subtitle: { color: 'rgba(255,255,255,0.85)', fontSize: 14, marginTop: 6, textAlign: 'center' },

  /* Card */
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    marginTop: -20,
    marginHorizontal: 4,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },

  /* Tabs */
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  tabActive: { backgroundColor: '#fff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2 },
  tabText: { fontSize: 14, fontWeight: '600', color: '#94A3B8' },
  tabTextActive: { color: BLUE },

  /* Fields */
  field: { marginBottom: 16 },
  label: { fontSize: 13, fontWeight: '600', color: '#334155', marginBottom: 6 },
  inputRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5, borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    gap: 10,
  },
  input: { flex: 1, fontSize: 15, color: '#0F172A', paddingVertical: 0 },

  /* Terms */
  termsRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16, gap: 10 },
  checkbox: {
    width: 20, height: 20, borderRadius: 6,
    borderWidth: 1.5, borderColor: '#CBD5E1',
    alignItems: 'center', justifyContent: 'center',
    marginTop: 1,
  },
  checkboxChecked: { backgroundColor: BLUE, borderColor: BLUE },
  checkMark: { color: '#fff', fontSize: 12, fontWeight: '700' },
  termsText: { flex: 1, fontSize: 13, color: '#475569', lineHeight: 18 },
  termsLink: { color: BLUE, fontWeight: '600' },

  /* Error */
  error: { color: '#EF4444', fontSize: 13, textAlign: 'center', marginBottom: 12 },

  /* Submit */
  submitBtn: {
    backgroundColor: BLUE,
    borderRadius: 12,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BLUE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  /* Forgot */
  forgotText: { color: BLUE, fontSize: 13, fontWeight: '600' },

  /* Toggle */
  toggleRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 24, gap: 6 },
  toggleLabel: { fontSize: 14, color: '#64748B' },
  toggleLink: { fontSize: 14, color: BLUE, fontWeight: '700' },

  /* Footer */
  footer: { fontSize: 11, color: '#94A3B8', textAlign: 'center', marginTop: 20, lineHeight: 16 },
});
