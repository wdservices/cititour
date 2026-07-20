import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, radius, typography, glass } from '../theme/theme';
import GlassHeader from '../components/GlassHeader';
import GlassButton from '../components/GlassButton';
import { useAuth } from '../contexts/AuthContext';

export default function WalletScreen() {
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  const balance = 45000;

  const glassOpacity = isDark ? glass.opacityDark : glass.opacity;
  const transactionCardBackgroundColor = isDark
    ? `rgba(18, 22, 31, ${glassOpacity})`
    : `rgba(255, 255, 255, ${glassOpacity})`;
  const transactionCardBorderColor = isDark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.4)';

  const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background },
    content: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
    balanceCard: {
      backgroundColor: colors.primary, borderRadius: radius.xl, padding: spacing.xl, marginBottom: spacing.xl,
      shadowColor: colors.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8,
    },
    balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: typography.sizes.sm, fontFamily: typography.body.fontFamily },
    balanceValue: { color: colors.primaryForeground, fontSize: 42, fontWeight: '800', marginTop: spacing.sm, marginBottom: spacing.lg, fontFamily: typography.display.fontFamily },
    actionRow: { flexDirection: 'row', gap: spacing.md },
    actionButton: { flex: 1 },
    sectionTitle: { fontSize: typography.sizes.lg, fontWeight: '700', color: colors.foreground, marginBottom: spacing.md, fontFamily: typography.display.fontFamily },
    txRow: {
      flexDirection: 'row', alignItems: 'center', gap: spacing.md,
      backgroundColor: transactionCardBackgroundColor, padding: spacing.md, borderRadius: radius.lg, marginBottom: spacing.md,
      borderWidth: 1, borderColor: transactionCardBorderColor,
    },
    txIcon: { width: 40, height: 40, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
    txLabel: { flex: 1, fontSize: typography.sizes.sm, color: colors.foreground, fontFamily: typography.body.fontFamily },
    txAmount: { fontSize: typography.sizes.sm, fontWeight: '700', fontFamily: typography.body.fontFamily },
  });

  const transactions = [
    { label: 'Wallet funding', amount: '+₦20,000', type: 'credit' as const },
    { label: 'Event ticket — Afrobeats Night', amount: '-₦7,500', type: 'debit' as const },
    { label: 'Withdrawal to bank', amount: '-₦15,000', type: 'debit' as const },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <GlassHeader title="Wallet" subtitle="Manage your funds" leftIcon="menu" />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceValue}>₦{balance.toLocaleString()}</Text>

          <View style={styles.actionRow}>
            <View style={styles.actionButton}>
              <GlassButton label="Fund" onPress={() => {}} variant="solid" />
            </View>
            <View style={styles.actionButton}>
              <GlassButton label="Withdraw" onPress={() => {}} variant="outline" color="primary" />
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {transactions.map((tx, i) => (
          <View key={i} style={styles.txRow}>
            <View
              style={[
                styles.txIcon,
                {
                  backgroundColor:
                    tx.type === 'credit'
                      ? `rgba(${parseInt(colors.success.slice(1, 3), 16)},${parseInt(colors.success.slice(3, 5), 16)},${parseInt(colors.success.slice(5, 7), 16)},0.2)`
                      : `rgba(${parseInt(colors.destructive.slice(1, 3), 16)},${parseInt(colors.destructive.slice(3, 5), 16)},${parseInt(colors.destructive.slice(5, 7), 16)},0.2)`,
                },
              ]}
            >
              <Feather
                name={tx.type === 'credit' ? 'arrow-down' : 'arrow-up'}
                size={18}
                color={tx.type === 'credit' ? colors.success : colors.destructive}
              />
            </View>
            <Text style={styles.txLabel}>{tx.label}</Text>
            <Text style={[styles.txAmount, { color: tx.type === 'credit' ? colors.success : colors.destructive }]}>
              {tx.amount}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
