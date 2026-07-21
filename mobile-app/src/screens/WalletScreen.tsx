import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowDown, ArrowUp } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { spacing, radius, typography } from '../theme/theme';
import GlassHeader from '../components/GlassHeader';
import GlassButton from '../components/GlassButton';

export default function WalletScreen() {
  const { colors } = useTheme();
  const balance = 45000;

  const transactions = [
    { label: 'Wallet funding', amount: '+₦20,000', type: 'credit' as const },
    { label: 'Event ticket — Afrobeats Night', amount: '-₦7,500', type: 'debit' as const },
    { label: 'Withdrawal to bank', amount: '-₦15,000', type: 'debit' as const },
  ];

  const s = styles(colors);

  return (
    <SafeAreaView style={s.container} edges={['top']}>
      <GlassHeader title="Wallet" subtitle="Manage your funds" />

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.balanceCard}>
          <Text style={s.balanceLabel}>Available Balance</Text>
          <Text style={s.balanceValue}>₦{balance.toLocaleString()}</Text>
          <View style={s.actionRow}>
            <View style={s.actionButton}>
              <GlassButton label="Fund" onPress={() => {}} variant="solid" />
            </View>
            <View style={s.actionButton}>
              <GlassButton label="Withdraw" onPress={() => {}} variant="outline" color="primary" />
            </View>
          </View>
        </View>

        <Text style={s.sectionTitle}>Recent Transactions</Text>
        {transactions.map((tx, i) => (
          <View key={i} style={s.txRow}>
            <View style={[s.txIcon, { backgroundColor: tx.type === 'credit' ? 'rgba(16,185,129,0.15)' : 'rgba(239,68,68,0.15)' }]}>
              {tx.type === 'credit'
                ? <ArrowDown size={18} color="#10B981" strokeWidth={2} />
                : <ArrowUp size={18} color="#EF4444" strokeWidth={2} />}
            </View>
            <Text style={s.txLabel}>{tx.label}</Text>
            <Text style={[s.txAmount, { color: tx.type === 'credit' ? '#10B981' : '#EF4444' }]}>
              {tx.amount}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function styles(colors: any) {
  return StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F5F7FA' },
    content: { paddingHorizontal: spacing.lg, paddingVertical: spacing.lg },
    balanceCard: {
      backgroundColor: '#1E88E5', borderRadius: radius.xl, padding: spacing.xl, marginBottom: spacing.xl,
      shadowColor: '#1E88E5', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8,
    },
    balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: typography.sizes.sm },
    balanceValue: { color: '#fff', fontSize: 42, fontWeight: '800', marginTop: spacing.sm, marginBottom: spacing.lg },
    actionRow: { flexDirection: 'row', gap: spacing.md },
    actionButton: { flex: 1 },
    sectionTitle: { fontSize: typography.sizes.lg, fontWeight: '700', color: '#0F172A', marginBottom: spacing.md },
    txRow: {
      flexDirection: 'row', alignItems: 'center', gap: spacing.md,
      backgroundColor: '#fff', padding: spacing.md, borderRadius: radius.lg, marginBottom: spacing.md,
      shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1,
    },
    txIcon: { width: 40, height: 40, borderRadius: radius.full, alignItems: 'center', justifyContent: 'center' },
    txLabel: { flex: 1, fontSize: typography.sizes.sm, color: '#0F172A' },
    txAmount: { fontSize: typography.sizes.sm, fontWeight: '700' },
  });
}
