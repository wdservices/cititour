import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRegion } from '@/context/RegionContext';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const { brandName, locationName } = useRegion();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome to</Text>
        <Text style={styles.brandName}>{brandName}</Text>
        <Text style={styles.subtitle}>Your guide to {locationName}</Text>
      </View>

      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Explore')}>
          <View style={[styles.actionIcon, { backgroundColor: '#FFF3D6' }]}>
            <Ionicons name="compass" size={24} color="#D4A017" />
          </View>
          <Text style={styles.actionLabel}>Explore</Text>
          <Text style={styles.actionDesc}>Discover places</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Events')}>
          <View style={[styles.actionIcon, { backgroundColor: '#E8F5E9' }]}>
            <Ionicons name="calendar" size={24} color="#4CAF50" />
          </View>
          <Text style={styles.actionLabel}>Events</Text>
          <Text style={styles.actionDesc}>Upcoming events</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Marketplace')}>
          <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
            <Ionicons name="cart" size={24} color="#2196F3" />
          </View>
          <Text style={styles.actionLabel}>Market</Text>
          <Text style={styles.actionDesc}>Buy & sell</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Profile')}>
          <View style={[styles.actionIcon, { backgroundColor: '#F3E5F5' }]}>
            <Ionicons name="person" size={24} color="#9C27B0" />
          </View>
          <Text style={styles.actionLabel}>Profile</Text>
          <Text style={styles.actionDesc}>Your dashboard</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  content: { paddingTop: 60, paddingHorizontal: 16 },
  header: { marginBottom: 32 },
  greeting: { fontSize: 14, color: '#888' },
  brandName: { fontSize: 32, fontWeight: '800', color: '#1A1A1A', letterSpacing: -0.5 },
  subtitle: { fontSize: 14, color: '#888', marginTop: 4 },
  quickActions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionCard: {
    width: '47%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  actionIcon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  actionLabel: { fontSize: 14, fontWeight: '700', color: '#1A1A1A' },
  actionDesc: { fontSize: 12, color: '#888', marginTop: 2 },
});
