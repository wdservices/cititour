import React from 'react';
import { View, StyleSheet, Text, Linking } from 'react-native';
import { MapPin } from 'lucide-react-native';

interface ReadOnlyMapProps {
  lat: number;
  lon: number;
  label?: string;
}

export function ReadOnlyMap({ lat, lon, label }: ReadOnlyMapProps) {
  const openMaps = () => {
    Linking.openURL(`https://www.google.com/maps?q=${lat},${lon}`);
  };

  return (
    <View style={s.container}>
      <View style={s.inner}>
        <MapPin size={28} color="#1E88E5" strokeWidth={1.5} />
        <Text style={s.label}>{label || 'View on Maps'}</Text>
        <Text style={s.coords}>{lat.toFixed(4)}, {lon.toFixed(4)}</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: { borderRadius: 14, overflow: 'hidden', height: 180 },
  inner: { flex: 1, height: 180, borderRadius: 14, backgroundColor: '#e8f0fe', alignItems: 'center', justifyContent: 'center', gap: 6 },
  label: { fontSize: 14, fontWeight: '600', color: '#1E88E5' },
  coords: { fontSize: 12, color: '#666' },
});

export default ReadOnlyMap;
