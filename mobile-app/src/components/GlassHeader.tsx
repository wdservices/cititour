import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet,
} from 'react-native';
import { Menu, ArrowLeft, User } from 'lucide-react-native';

const BLUE = '#1E88E5';

interface GlassHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
  showMenu?: boolean;
  onMenu?: () => void;
  showProfile?: boolean;
  onProfile?: () => void;
}

export const GlassHeader: React.FC<GlassHeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  onBack,
  showMenu = false,
  onMenu,
  showProfile = true,
  onProfile,
}) => {
  return (
    <View style={s.header}>
      {showBack ? (
        <TouchableOpacity style={s.iconBtn} onPress={onBack} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <ArrowLeft size={22} color="#fff" strokeWidth={2} />
        </TouchableOpacity>
      ) : showMenu ? (
        <TouchableOpacity style={s.iconBtn} onPress={onMenu} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Menu size={22} color="#fff" strokeWidth={2} />
        </TouchableOpacity>
      ) : (
        <View style={s.iconBtn} />
      )}

      <View style={s.center}>
        <Text style={s.title}>{title}</Text>
        {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
      </View>

      <TouchableOpacity style={s.profileBtn} onPress={onProfile} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
        <View style={s.profileAvatar}>
          <User size={18} color="#fff" strokeWidth={2} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

const s = StyleSheet.create({
  header: {
    backgroundColor: BLUE,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconBtn: { padding: 8, width: 38 },
  center: { flex: 1, alignItems: 'center' },
  title: { color: '#fff', fontSize: 17, fontWeight: '800' },
  subtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: '500', marginTop: 1 },
  profileBtn: { padding: 4 },
  profileAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center',
  },
});

export default GlassHeader;
