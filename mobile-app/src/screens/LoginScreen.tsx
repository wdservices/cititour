import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Image, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react-native';
import { colors, spacing, radius, typography } from '../theme/theme';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
  const { loginWithEmail, signUpWithEmailPassword, resetPassword } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isWorking, setIsWorking] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter your email and password.');
      return;
    }
    setErrorMessage(null);
    setIsWorking(true);
    try {
      if (isSignUp) {
        await signUpWithEmailPassword(email.trim(), password);
        // NOTE: Firebase Auth doesn't set displayName automatically on
        // sign-up — if you want `name` populated immediately, call
        // updateProfile(auth.currentUser, { displayName: name }) here
        // right after createUserWithEmailAndPassword succeeds.
      } else {
        await loginWithEmail(email.trim(), password);
      }
      // No manual navigation needed — RootNavigator watches auth state
      // and switches to the main tab navigator automatically once
      // isAuthenticated flips to true.
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

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.logoWrap}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoLetter}>C</Text>
            </View>
            <Text style={styles.appName}>CitiTour</Text>
            <Text style={styles.tagline}>
              {isSignUp ? 'Create your account to get started' : 'Sign in to continue your journey'}
            </Text>
          </View>

          {isSignUp && (
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <View style={styles.inputWrap}>
                <User size={18} color={colors.mutedForeground} />
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your full name"
                  placeholderTextColor={colors.mutedForeground}
                  style={styles.input}
                />
              </View>
            </View>
          )}

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputWrap}>
              <Mail size={18} color={colors.mutedForeground} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={colors.mutedForeground}
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputWrap}>
              <Lock size={18} color={colors.mutedForeground} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={colors.mutedForeground}
                secureTextEntry={!showPassword}
                style={styles.input}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                {showPassword ? (
                  <EyeOff size={18} color={colors.mutedForeground} />
                ) : (
                  <Eye size={18} color={colors.mutedForeground} />
                )}
              </TouchableOpacity>
            </View>
            {!isSignUp && (
              <TouchableOpacity onPress={handleForgotPassword} style={{ alignSelf: 'flex-end', marginTop: 6 }}>
                <Text style={styles.forgotPasswordText}>Forgot password?</Text>
              </TouchableOpacity>
            )}
          </View>

          {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

          <TouchableOpacity
            style={[styles.submitButton, isWorking && { opacity: 0.7 }]}
            onPress={handleSubmit}
            disabled={isWorking}
          >
            {isWorking ? (
              <ActivityIndicator color={colors.primaryForeground} />
            ) : (
              <Text style={styles.submitButtonText}>{isSignUp ? 'Create Account' : 'Sign In'}</Text>
            )}
          </TouchableOpacity>

          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </Text>
            <TouchableOpacity onPress={() => { setIsSignUp(!isSignUp); setErrorMessage(null); }}>
              <Text style={styles.toggleLink}>{isSignUp ? 'Sign In' : 'Sign Up'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function friendlyAuthError(code?: string): string {
  switch (code) {
    case 'auth/invalid-email':
      return 'That email address looks invalid.';
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Incorrect email or password.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists — try signing in instead.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: spacing.lg },
  logoWrap: { alignItems: 'center', marginBottom: spacing.xl },
  logoCircle: {
    width: 64, height: 64, borderRadius: radius.full, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', marginBottom: spacing.sm,
  },
  logoLetter: { color: colors.primaryForeground, fontSize: 28, fontWeight: '800' },
  appName: { fontSize: typography.sizes.xl, fontWeight: '800', color: colors.foreground },
  tagline: { fontSize: typography.sizes.sm, color: colors.mutedForeground, marginTop: 4, textAlign: 'center' },
  inputGroup: { marginBottom: spacing.md },
  inputLabel: { fontSize: typography.sizes.xs, fontWeight: '600', color: colors.foreground, marginBottom: 6 },
  inputWrap: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
    paddingHorizontal: spacing.sm, backgroundColor: colors.card,
  },
  input: { flex: 1, paddingVertical: 12, fontSize: typography.sizes.sm, color: colors.foreground },
  forgotPasswordText: { fontSize: typography.sizes.xs, color: colors.primary, fontWeight: '600' },
  errorText: { color: colors.destructive, fontSize: typography.sizes.sm, marginBottom: spacing.sm, textAlign: 'center' },
  submitButton: {
    backgroundColor: colors.primary, borderRadius: radius.full, paddingVertical: 14,
    alignItems: 'center', justifyContent: 'center', marginTop: spacing.sm,
  },
  submitButtonText: { color: colors.primaryForeground, fontWeight: '700', fontSize: typography.sizes.base },
  toggleRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: spacing.lg },
  toggleText: { fontSize: typography.sizes.sm, color: colors.mutedForeground },
  toggleLink: { fontSize: typography.sizes.sm, color: colors.primary, fontWeight: '700' },
});
