import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import {
  Calendar, Building2, UtensilsCrossed, MapPin, ShoppingBag, Home, Camera, Heart, MoreHorizontal,
} from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useMainNavigation } from '../contexts/MainNavigationContext';

const CATEGORIES = [
  { id: 'events', title: 'Events', icon: Calendar, tab: 'events' as const },
  { id: 'hotels', title: 'Hotels', icon: Building2, tab: 'explore' as const },
  { id: 'restaurants', title: 'Dining', icon: UtensilsCrossed, tab: 'explore' as const },
  { id: 'fun', title: 'Fun', icon: MapPin, tab: 'explore' as const },
  { id: 'market', title: 'Market', icon: ShoppingBag, tab: 'marketplace' as const },
  { id: 'stays', title: 'Stays', icon: Home, tab: 'explore' as const },
  { id: 'sights', title: 'Sights', icon: Camera, tab: 'explore' as const },
  { id: 'wellness', title: 'Wellness', icon: Heart, tab: 'explore' as const },
  { id: 'more', title: 'More', icon: MoreHorizontal, tab: 'explore' as const },
];

export default function ExploreCategoryShortcuts() {
  const { colors } = useTheme();
  const { setActiveTab, openMenu } = useMainNavigation();

  return (
    <View style={styles.section}>
      <Text style={[styles.eyebrow, { color: colors.accent }]}>EXPLORE</Text>
      <Text style={[styles.heading, { color: colors.foreground }]}>Categories</Text>
      <Text style={[styles.sub, { color: colors.mutedForeground }]}>
        Jump into what matters — same paths as the web app.
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <TouchableOpacity
              key={cat.id}
              style={[styles.chip, { backgroundColor: colors.card, borderColor: colors.border }]}
              activeOpacity={0.75}
              onPress={() => {
                if (cat.id === 'more') openMenu();
                else setActiveTab(cat.tab);
              }}
            >
              <View style={[styles.iconWrap, { backgroundColor: `${colors.primary}14` }]}>
                <Icon size={20} color={colors.primary} strokeWidth={1.75} />
              </View>
              <Text style={[styles.chipLabel, { color: colors.foreground }]}>{cat.title}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  section: { paddingHorizontal: 16, marginTop: 20 },
  eyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 1.5 },
  heading: { fontSize: 22, fontWeight: '800', marginTop: 6, letterSpacing: -0.3 },
  sub: { fontSize: 13, marginTop: 4, marginBottom: 14, lineHeight: 18 },
  row: { gap: 10, paddingRight: 8 },
  chip: {
    width: 88,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 14,
    borderWidth: 1,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  chipLabel: { fontSize: 12, fontWeight: '600' },
});
