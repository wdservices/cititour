import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useEvents } from '@/hooks/useFirestore';
import { useNavigation } from '@react-navigation/native';

export default function EventsScreen() {
  const navigation = useNavigation<any>();
  const { data: events = [], isLoading } = useEvents();

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#D4A017" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Events</Text>
        <Text style={styles.subtitle}>{events.length} upcoming events</Text>
      </View>
      <FlatList
        data={events}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate('EventDetail', { id: item.id })}
            activeOpacity={0.7}
          >
            <Image
              source={{ uri: item.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=300&fit=crop' }}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle} numberOfLines={1}>{item.title}</Text>
              {item.startDate && (
                <View style={styles.dateRow}>
                  <Ionicons name="calendar-outline" size={12} color="#888" />
                  <Text style={styles.cardDate}>{new Date(item.startDate).toLocaleDateString()}</Text>
                </View>
              )}
              {item.location && (
                <View style={styles.dateRow}>
                  <Ionicons name="location-outline" size={12} color="#888" />
                  <Text style={styles.cardDate} numberOfLines={1}>{item.location}</Text>
                </View>
              )}
              {item.ticketTypes?.length > 0 && (
                <Text style={styles.cardPrice}>
                  From ₦{Math.min(...item.ticketTypes.map((t: any) => Number(t.price || 0))).toLocaleString()}
                </Text>
              )}
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={48} color="#ccc" />
            <Text style={styles.emptyText}>No events yet</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  header: { paddingTop: 60, paddingHorizontal: 16, paddingBottom: 16 },
  title: { fontSize: 28, fontWeight: '800', color: '#1A1A1A' },
  subtitle: { fontSize: 14, color: '#888', marginTop: 4 },
  list: { paddingHorizontal: 16, paddingBottom: 40, gap: 12 },
  card: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#F0F0F0' },
  cardImage: { width: '100%', height: 180 },
  cardInfo: { padding: 14 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1A1A1A', marginBottom: 6 },
  dateRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  cardDate: { fontSize: 12, color: '#888' },
  cardPrice: { fontSize: 14, fontWeight: '800', color: '#D4A017', marginTop: 6 },
  empty: { alignItems: 'center', paddingTop: 80, gap: 8 },
  emptyText: { fontSize: 14, color: '#999' },
});
