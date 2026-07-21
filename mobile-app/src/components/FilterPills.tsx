import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';

interface FilterPillsProps {
  options: string[];
  active: string;
  onChange: (value: string) => void;
  style?: ViewStyle;
}

export function FilterPills({ options, active, onChange, style }: FilterPillsProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.row, style]}
      >
        {options.map((option) => {
          const isActive = option === active;
          return (
            <TouchableOpacity
              key={option}
              onPress={() => onChange(option)}
              activeOpacity={0.6}
              style={[
                styles.pill,
                isActive
                  ? { backgroundColor: colors.primary, borderColor: colors.primary }
                  : { backgroundColor: 'transparent', borderColor: colors.border },
              ]}
            >
              <Text
                style={[
                  styles.label,
                  { color: isActive ? colors.primaryForeground : colors.mutedForeground },
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { height: 48 },
  row: { paddingHorizontal: 16, gap: 8, alignItems: 'center', height: 48 },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
  },
  label: { fontSize: 13, fontWeight: '600' },
});

export default FilterPills;
