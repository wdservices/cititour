import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowDownToLine, ArrowUpFromLine, Plus } from 'lucide-react-native';
import { colors, spacing, radius, typography } from '../theme/theme';

export default function WalletScreen() {
  // NOTE: assumes a real authenticated user + a live wallet balance read
  // from Firestore (wallets/{userId}) once auth is wired up — placeholder
  // value shown here for layout purposes only.
  const balance = 45000;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: spacing.md }}>
        <Text style={styles.title}>Wallet</Text>

        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Available Balance</Text>
          <Text style={styles.balanceValue}>₦{balance.toLocaleString()}</Text>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionButton}>
              <Plus size={18} color={colors.primaryForeground} />
              <Text style={styles.actionButtonText}>Fund</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.actionButtonSecondary]}>
              <ArrowUpFromLine size={18} color={colors.primary} />
              <Text style={styles.actionButtonSecondaryText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recent Transactions</Text>
        {[
          { label: 'Wallet funding', amount: '+₦20,000', type: 'credit' },
          { label: 'Event ticket — Afrobeats Night', amount: '-₦7,500', type: 'debit' },
          { label: 'Withdrawal to bank', amount: '-₦15,000', type: 'debit' },
        ].map((tx, i) => (
          <View key={i} style={styles.txRow}>
            <View style={[styles.txIcon, { backgroundColor: tx.type === 'credit' ? colors.success + '15' : colors.destructive + '15' }]}>
              {tx.type === 'credit' ? (
                <ArrowDownToLine size={16} color={colors.success} />
              ) : (
                <ArrowUpFromLine size={16} color={colors.destructive} />
              )}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  title: { fontSize: typography.sizes.xxl, fontWeight: '800', color: colors.foreground, marginBottom: spacing.md },
  balanceCard: { backgroundColor: colors.primary, borderRadius: radius.lg, padding: spacing.lg, marginBottom: spacing.xl },
  balanceLabel: { color: colors.primaryForeground + 'CC', fontSize: typography.sizes.sm },
  balanceValue: { color: colors.primaryForeground, fontSize: 32, fontWeight: '800', marginTop: 4, marginBottom: spacing.md },
  actionRow: { flexDirection: 'row', gap: spacing.sm },
  actionButton: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: colors.primaryDark, paddingVertical: 12, borderRadius: radius.full,
  },
  actionButtonText: { color: colors.primaryForeground, fontWeight: '700', fontSize: typography.sizes.sm },
  actionButtonSecondary: { backgroundColor: colors.primaryForeground },
  actionButtonSecondaryText: { color: colors.primary, fontWeight: '700', fontSize: typography.sizes.sm },
  sectionTitle: { fontSize: typography.sizes.lg, fontWeight: '700', color: colors.foreground, marginBottom: spacing.sm },
  txRow: {
    flexDirection: 'row', alignItems: 'center', gap: spacing.sm,
    backgroundColor: colors.card, padding: spacing.sm, borderRadius: radius.md, marginBottom: spacing.sm,
    borderWidth: 1, borderColor: colors.border,
  },
  txIcon: { width: 36, height: 36, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
  txLabel: { flex: 1, fontSize: typography.sizes.sm, color: colors.foreground },
  txAmount: { fontSize: typography.sizes.sm, fontWeight: '700' },
});
