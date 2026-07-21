import React, { useState, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowDown, ArrowUp, Plus, Minus } from 'lucide-react-native';
import { useFocusEffect } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface Transaction {
  id: string;
  label: string;
  amount: string;
  type: 'credit' | 'debit';
}

export default function WalletScreen() {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const loadWallet = useCallback(async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const walletRef = doc(db, 'wallets', user.id);
      const walletSnap = await getDoc(walletRef);
      if (walletSnap.exists()) {
        setBalance(walletSnap.data().balance || 0);
      }

      const txRef = collection(db, 'wallets', user.id, 'transactions');
      const txSnap = await getDocs(query(txRef, orderBy('createdAt', 'desc')));
      const txs = txSnap.docs.map((d) => {
        const data = d.data();
        const amount = data.amount || 0;
        return {
          id: d.id,
          label: data.description || data.label || 'Transaction',
          amount: `${amount < 0 ? '-' : '+'}₦${Math.abs(amount).toLocaleString()}`,
          type: amount >= 0 ? ('credit' as const) : ('debit' as const),
        };
      });
      setTransactions(txs);
    } catch {
      setBalance(0);
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useFocusEffect(useCallback(() => { loadWallet(); }, [loadWallet]));

  return (
    <View style={[s.container, { backgroundColor: colors.background }]}>
      <View style={[s.header, { paddingTop: insets.top + 6, borderBottomColor: colors.border }]}>
        <Text style={[s.headerTitle, { color: colors.foreground }]}>Wallet</Text>
        <Text style={[s.headerSub, { color: colors.mutedForeground }]}>Manage your funds</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadWallet} tintColor={colors.primary} />}
        contentContainerStyle={s.scrollContent}
      >
        {/* Balance card */}
        <View style={[s.balanceCard, { backgroundColor: colors.primary }]}>
          <Text style={s.balanceLabel}>Available Balance</Text>
          <Text style={s.balanceValue}>₦{balance.toLocaleString()}</Text>
          <View style={s.actionRow}>
            <TouchableOpacity style={s.fundBtn} activeOpacity={0.7}>
              <Plus size={18} color={colors.primary} strokeWidth={2.5} />
              <Text style={[s.fundBtnText, { color: colors.primary }]}>Fund</Text>
            </TouchableOpacity>
            <TouchableOpacity style={s.withdrawBtn} activeOpacity={0.7}>
              <Minus size={18} color="#fff" strokeWidth={2.5} />
              <Text style={s.withdrawBtnText}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Transactions */}
        <Text style={[s.sectionTitle, { color: colors.foreground }]}>Recent Transactions</Text>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 20 }} color={colors.primary} />
        ) : transactions.length === 0 ? (
          <View style={[s.emptyState, { borderColor: colors.border, backgroundColor: colors.muted }]}>
            <Text style={[s.emptyTitle, { color: colors.foreground }]}>No transactions yet</Text>
            <Text style={[s.emptyDesc, { color: colors.mutedForeground }]}>
              Fund your wallet to get started
            </Text>
          </View>
        ) : (
          <View style={s.txList}>
            {transactions.map((tx) => (
              <View key={tx.id} style={[s.txRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={[s.txIcon, { backgroundColor: tx.type === 'credit' ? `${colors.success}1A` : `${colors.destructive}1A` }]}>
                  {tx.type === 'credit'
                    ? <ArrowDown size={17} color={colors.success} strokeWidth={2} />
                    : <ArrowUp size={17} color={colors.destructive} strokeWidth={2} />}
                </View>
                <Text style={[s.txLabel, { color: colors.foreground }]} numberOfLines={1}>{tx.label}</Text>
                <Text style={[s.txAmount, { color: tx.type === 'credit' ? colors.success : colors.destructive }]}>
                  {tx.amount}
                </Text>
              </View>
            ))}
          </View>
        )}
        <View style={{ height: insets.bottom + 80 }} />
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 10, borderBottomWidth: 1 },
  headerTitle: { fontSize: 22, fontWeight: '800', letterSpacing: -0.3 },
  headerSub: { fontSize: 13, marginTop: 2 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 20 },

  balanceCard: { borderRadius: 20, padding: 24, marginBottom: 24 },
  balanceLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 14, fontWeight: '500' },
  balanceValue: { color: '#fff', fontSize: 40, fontWeight: '800', marginTop: 8, marginBottom: 20 },
  actionRow: { flexDirection: 'row', gap: 12 },
  fundBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#fff', borderRadius: 12, paddingVertical: 13 },
  fundBtnText: { fontSize: 15, fontWeight: '700' },
  withdrawBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.3)', borderRadius: 12, paddingVertical: 13 },
  withdrawBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },

  sectionTitle: { fontSize: 18, fontWeight: '700', letterSpacing: -0.2, marginBottom: 14 },
  txList: { gap: 10 },
  txRow: { flexDirection: 'row', alignItems: 'center', gap: 12, borderRadius: 14, borderWidth: 1, padding: 14 },
  txIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  txLabel: { flex: 1, fontSize: 14, fontWeight: '500' },
  txAmount: { fontSize: 14, fontWeight: '700' },

  emptyState: { borderRadius: 14, borderWidth: 1, borderStyle: 'dashed', padding: 28, alignItems: 'center', gap: 6 },
  emptyTitle: { fontSize: 15, fontWeight: '700' },
  emptyDesc: { fontSize: 13, textAlign: 'center' },
});
