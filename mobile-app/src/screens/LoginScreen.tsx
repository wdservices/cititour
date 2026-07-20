import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, radius, typography, glass } from '../theme/theme';
import GlassCard from '../components/GlassCard';
import GlassButton from '../components/GlassButton';
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

  const glassOpacity = isDark ? glass.opacityDark : glass.opacity;
  const formBackgroundColor = isDark
    ? `rgba(18, 22, 31, ${glassOpacity})`
    : `rgba(255, 255, 255, ${glassOpacity})`;
  const inputBackgroundColor = isDark
    ? 'rgba(18, 22, 31, 0.5)'
    : 'rgba(255, 255, 255, 0.6)';
  const inputBorderColor = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.4)';

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    scrollContent: { flexGrow: 1, justifyContent: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.xl },
    logoWrap: { alignItems: 'center', marginBottom: spacing.xl },
    logoCircle: {
      width: 80, height: 80, borderRadius: radius.full, backgroundColor: colors.primary,
      alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md,
      shadowColor: colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 5,
    },
    logoLetter: { color: colors.primaryForeground, fontSize: 36, fontWeight: '800', fontFamily: typography.display.fontFamily },
    appName: { fontSize: typography.sizes.xl, fontWeight: '800', color: colors.foreground, fontFamily: typography.display.fontFamily },
    tagline: { fontSize: typography.sizes.sm, color: colors.mutedForeground, marginTop: 4, textAlign: 'center', fontFamily: typography.body.fontFamily },
    
    formCard: { backgroundColor: formBackgroundColor, borderRadius: radius.lg, borderWidth: 1, borderColor: isDark ? 'rgba(255,255,255,0.2)' : glass.border },
    formContainer: { paddingHorizontal: spacing.lg, paddingVertical: spacing.xl },
    
    tabRow: { flexDirection: 'row', gap: spacing.md, marginBottom: spacing.xl, borderBottomWidth: 1, borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : colors.border },
    tab: { paddingBottomassistant: spacing.md, flex: 1, alignItems: 'center' },
    tabActive: { borderBottomWidth: 2, borderBottomColor: colors.primary, paddingBottom: spacing.md },
    tabText: { fontSize: typography.sizes.base, fontWeight: '600', color: colors.mutedForeground, fontFamily: typography.body.fontFamily },
    tabTextActive: { color: colors.primary },
    
    inputGroup: { marginBottom: spacing.lg },
    inputLabel: { fontSize: typography.sizes.sm, fontWeight: '600', color: colors.foreground, marginBottom: spacing.sm, fontFamily: typography.body.fontFamily },
    inputWrap: {
      flexDirection: 'row', alignItems: 'center', gap: spacing.md,
      borderWidth: 1, borderColor: inputBorderColor, borderRadius: radius.md,
      paddingHorizontal: spacing.md, backgroundColor: inputBackgroundColor,
    },
    input: { flex: 1, paddingVertical: spacing.md, fontSize: typography.sizes.base, color: colors.foreground, fontFamily: typography.body.fontFamily },
    inputIcon: { width: 20, height: 20, justifyContent: 'center', alignItems: 'center' },
    
    termsRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: spacing.lg, gap: spacing.md },
    checkbox: { width: 20, height: 20, borderWidth: 2, borderColor: colors.primary, borderRadius: spacing.xs, marginTop: spacing.xs, justifyContent: 'center', alignItems: 'center' },
    termsText: { flex: 1, fontSize: typography.sizes.sm, color: colors.foreground, lineHeight: 20, fontFamily: typography.body.fontFamily },
    termsLink: { color: colors.primary, fontWeight: '600' },
    
    errorText: { color: colors.destructive, fontSize: typography.sizes.sm, marginBottom: spacing.lg, textAlign: 'center', fontFamily: typography.body.fontFamily },
    
    buttonGap: { marginBottom: spacing.lg },
    divider: { flexDirection: 'row', alignItems: 'center', marginVertical: spacing.lg, gap: spacing.md },
    dividerLine: { flex: 1, height: 1, backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : colors.border },
    dividerText: { fontSize: typography.sizes.xs, color: colors.mutedForeground, fontFamily: typography.body.fontFamily },
    
    googleButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.md, borderWidth: 1, borderColor: inputBorderColor, borderRadius: radius.full, paddingVertical: spacing.md, backgroundColor: inputBackgroundColor },
    googleButtonText: { fontSize: typography.sizes.base, fontWeight: '600', color: colors.foreground, fontFamily: typography.body.fontFamily },
    
    toggleRow: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: spacing.xl },
    toggleText: { fontSize: typography.sizes.sm, color: colors.mutedForeground, fontFamily: typography.body.fontFamily },
    toggleLink: { fontSize: typography.sizes.sm, color: colors.primary, fontWeight: '700', fontFamily: typography.body.fontFamily },
    
    footerNote: { fontSize: typography.sizes.xs, color: colors.mutedForeground, textAlign: 'center', marginTop: spacing.lg, lineHeight: 16, fontFamily: typography.body.fontFamily },
  });

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={styles.logoWrap}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoLetter}>C</Text>
            </View>
            <Text style={styles.appName}>CitiTour</Text>
            <Text style={styles.tagline}>
              {isSignUp ? 'Create your account to explore' : 'Sign in to your account'}
            </Text>
          </View>

          <View style={styles.formCard}>
            <View style={styles.formContainer}>
              {/* Tab Toggle */}
              <View style={styles.tabRow}>
                <TouchableOpacity
                  style={[styles.tab, !isSignUp && styles.tabActive]}
                  onPress={() => { setIsSignUp(false); setErrorMessage(null); }}
                >
                  <Text style={[styles.tabText, !isSignUp && styles.tabTextActive]}>Sign In</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.tab, isSignUp && styles.tabActive]}
                  onPress={() => { setIsSignUp(true); setErrorMessage(null); }}
                >
                  <Text style={[styles.tabText, isSignUp && styles.tabTextActive]}>Create Account</Text>
                </TouchableOpacity>
              </View>

              {/* Name Field (Sign Up Only) */}
              {isSignUp && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Full Name</Text>
                  <View style={styles.inputWrap}>
                    <Feather name="user" size={20} color={colors.mutedForeground} />
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

              {/* Email Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email Address</Text>
                <View style={styles.inputWrap}>
                  <Feather name="mail" size={20} color={colors.mutedForeground} />
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

              {/* Password Field */}
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={styles.inputWrap}>
                  <Feather name="lock" size={20} color={colors.mutedForeground} />
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="Enter your password"
                    placeholderTextColor={colors.mutedForeground}
                    secureTextEntry={!showPassword}
                    style={styles.input}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Feather
                      name={showPassword ? 'eye-off' : 'eye'}
                      size={20}
                      color={colors.mutedForeground}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password Field (Sign Up Only) */}
              {isSignUp && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Confirm Password</Text>
                  <View style={styles.inputWrap}>
                    <Feather name="lock" size={20} color={colors.mutedForeground} />
                    <TextInput
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholder="Confirm your password"
                      placeholderTextColor={colors.mutedForeground}
                      secureTextEntry={!showConfirmPassword}
                      style={styles.input}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                      <Feather
                        name={showConfirmPassword ? 'eye-off' : 'eye'}
                        size={20}
                        color={colors.mutedForeground}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {/* Terms Checkbox (Sign Up Only) */}
              {isSignUp && (
                <View style={styles.termsRow}>
                  <TouchableOpacity
                    style={[styles.checkbox, acceptTerms && { backgroundColor: colors.primary }]}
                    onPress={() => setAcceptTerms(!acceptTerms)}
                  >
                    {acceptTerms && <Feather name="check" size={12} color={colors.primaryForeground} />}
                  </TouchableOpacity>
                  <Text style={styles.termsText}>
                    I accept the{' '}
                    <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                    <Text style={styles.termsLink}>Privacy Policy</Text>
                  </Text>
                </View>
              )}

              {/* Error Message */}
              {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

              {/* Submit Button */}
              <View style={styles.buttonGap}>
                <GlassButton
                  label={isSignUp ? 'Create Account' : 'Sign In'}
                  onPress={handleSubmit}
                  disabled={isWorking}
                  variant="solid"
                />
              </View>

              {/* Forgot Password Link (Sign In Only) */}
              {!isSignUp && (
                <TouchableOpacity onPress={handleForgotPassword} style={{ alignSelf: 'center', marginBottom: spacing.lg }}>
                  <Text style={[styles.toggleLink, { fontSize: typography.sizes.sm }]}>Forgot password?</Text>
                </TouchableOpacity>
              )}

              {/* Divider */}
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or continue with</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Google Button */}
              <TouchableOpacity style={styles.googleButton} activeOpacity={0.7}>
                <Text style={styles.googleButtonText}>🔵 Continue with Google</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Toggle SignUp/SignIn */}
          <View style={styles.toggleRow}>
            <Text style={styles.toggleText}>
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            </Text>
            <TouchableOpacity onPress={() => { setIsSignUp(!isSignUp); setErrorMessage(null); }}>
              <Text style={styles.toggleLink}>{isSignUp ? 'Sign In' : 'Sign Up'}</Text>
            </TouchableOpacity>
          </View>

          {/* Footer Note */}
          {!isSignUp && (
            <Text style={styles.footerNote}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          )}
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
