import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useMainNavigation } from '../contexts/MainNavigationContext';

const CATEGORIES = [
  { id: 'events', title: 'Events', tab: 'events' as const },
  { id: 'hotels', title: 'Hotels', tab: 'explore' as const },
  { id: 'dining', title: 'Dining', tab: 'explore' as const },
  { id: 'fun', title: 'Fun', tab: 'explore' as const },
  { id: 'market', title: 'Market', tab: 'marketplace' as const },
  { id: 'stays', title: 'Stays', tab: 'explore' as const },
  { id: 'sights', title: 'Sights', tab: 'explore' as const },
  { id: 'wellness', title: 'Wellness', tab: 'explore' as const },
  { id: 'more', title: 'More', tab: 'explore' as const },
];

export default function ExploreCategoryShortcuts() {
  const { colors } = useTheme();
  const { setActiveTab, openMenu } = useMainNavigation();

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.row}
    >
      {CATEGORIES.map((cat) => (
        <TouchableOpacity
          key={cat.id}
          style={[styles.chip, { backgroundColor: colors.muted }]}
          activeOpacity={0.6}
          onPress={() => (cat.id === 'more' ? openMenu() : setActiveTab(cat.tab))}
        >
          <Text style={[styles.chipLabel, { color: colors.foreground }]}>{cat.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: { paddingHorizontal: 16, gap: 8, paddingVertical: 4 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 999,
  },
  chipLabel: { fontSize: 13, fontWeight: '600' },
});
