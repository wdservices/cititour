import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, Bell } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';

interface GlassHeaderProps {
  title: string;
  subtitle?: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  showBack?: boolean;
  showProfile?: boolean;
}

export const GlassHeader: React.FC<GlassHeaderProps> = ({
  title,
  subtitle,
  onLeftPress,
  onRightPress,
  showBack = false,
}) => {
  const insets = useSafeAreaInsets();
  const { colors, isDark } = useTheme();

  return (
    <View
      style={[
        s.header,
        {
          paddingTop: insets.top + 8,
          backgroundColor: colors.background,
          borderBottomColor: isDark ? colors.border : colors.border,
        },
      ]}
    >
      <View style={s.side}>
        {showBack && onLeftPress ? (
          <TouchableOpacity style={s.iconBtn} onPress={onLeftPress} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <ChevronLeft size={22} color={colors.foreground} strokeWidth={2} />
          </TouchableOpacity>
        ) : (
          <View style={s.iconPlaceholder} />
        )}
      </View>

      <View style={s.center}>
        <Text style={[s.title, { color: colors.foreground }]}>{title}</Text>
        {subtitle ? (
          <Text style={[s.subtitle, { color: colors.mutedForeground }]}>{subtitle}</Text>
        ) : null}
      </View>

      <View style={s.side}>
        <TouchableOpacity
          style={s.iconBtn}
          onPress={onRightPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Bell size={20} color={colors.foreground} strokeWidth={1.75} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const s = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  side: { width: 40, alignItems: 'center' },
  iconPlaceholder: { width: 40 },
  iconBtn: { padding: 4 },
  center: { flex: 1, alignItems: 'center' },
  title: { fontSize: 17, fontWeight: '700', letterSpacing: -0.3 },
  subtitle: { fontSize: 12, fontWeight: '500', marginTop: 2 },
});

export default GlassHeader;
