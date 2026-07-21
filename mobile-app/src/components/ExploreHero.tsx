import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View, Text, StyleSheet, ImageBackground, TouchableOpacity, Dimensions, Animated,
} from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../contexts/ThemeContext';

const { width: W } = Dimensions.get('window');
const HERO_H = Math.round(W * 0.62);

const SLIDES = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&q=80',
    title: 'Discover Nigeria',
    subtitle: 'Urban lifestyle from Lagos to Port Harcourt — curated for you.',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&q=80',
    title: 'Fine Dining',
    subtitle: 'Top restaurants and hidden gems across your city.',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1200&q=80',
    title: 'Vibrant Nightlife',
    subtitle: 'Live music, lounges, and nights worth remembering.',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80',
    title: 'Luxury Stays',
    subtitle: 'Hotels, resorts, and unique Airbnb properties.',
  },
];

interface ExploreHeroProps {
  cityLabel: string;
}

export default function ExploreHero({ cityLabel }: ExploreHeroProps) {
  const { colors } = useTheme();
  const [index, setIndex] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;

  const go = useCallback((next: number) => {
    Animated.timing(fade, { toValue: 0, duration: 220, useNativeDriver: true }).start(() => {
      setIndex(next);
      Animated.timing(fade, { toValue: 1, duration: 320, useNativeDriver: true }).start();
    });
  }, [fade]);

  const goNext = useCallback(() => go((index + 1) % SLIDES.length), [go, index]);
  const goPrev = useCallback(() => go(index === 0 ? SLIDES.length - 1 : index - 1), [go, index]);

  useEffect(() => {
    const t = setInterval(goNext, 6000);
    return () => clearInterval(t);
  }, [goNext]);

  const slide = SLIDES[index];

  return (
    <View style={styles.wrap}>
      <Animated.View style={[styles.hero, { opacity: fade }]}>
        <ImageBackground source={{ uri: slide.image }} style={styles.image} imageStyle={styles.imageRadius} resizeMode="cover">
          <View style={styles.overlayTop} />
          <View style={styles.overlayBottom} />
          <View style={styles.content}>
            <Text style={styles.eyebrow}>Explore · {cityLabel}</Text>
            <Text style={styles.title}>{slide.title}</Text>
            <Text style={styles.subtitle}>{slide.subtitle}</Text>
          </View>
          <View style={styles.dots}>
            {SLIDES.map((s, i) => (
              <TouchableOpacity
                key={s.id}
                onPress={() => go(i)}
                style={[styles.dot, i === index && { backgroundColor: colors.primary, width: 22 }]}
                accessibilityLabel={`Slide ${i + 1}`}
              />
            ))}
          </View>
          <TouchableOpacity style={styles.navLeft} onPress={goPrev} accessibilityLabel="Previous">
            <ChevronLeft size={20} color="#fff" strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.navRight} onPress={goNext} accessibilityLabel="Next">
            <ChevronRight size={20} color="#fff" strokeWidth={2} />
          </TouchableOpacity>
        </ImageBackground>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { paddingHorizontal: 16, marginBottom: 8 },
  hero: { height: HERO_H, borderRadius: 20, overflow: 'hidden', backgroundColor: '#1a1a1a' },
  image: { flex: 1, justifyContent: 'flex-end' },
  imageRadius: { borderRadius: 20 },
  overlayTop: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.15)' },
  overlayBottom: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.55)', top: '40%' },
  content: { padding: 20, zIndex: 2 },
  eyebrow: {
    color: 'rgba(255,255,255,0.85)', fontSize: 11, fontWeight: '700',
    letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 6,
  },
  title: { color: '#fff', fontSize: 26, fontWeight: '800', letterSpacing: -0.5, lineHeight: 30 },
  subtitle: { color: 'rgba(255,255,255,0.82)', fontSize: 14, lineHeight: 20, marginTop: 8, maxWidth: '92%' },
  dots: { position: 'absolute', bottom: 16, right: 16, flexDirection: 'row', gap: 6, zIndex: 3 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.35)' },
  navLeft: {
    position: 'absolute', left: 12, top: '45%', width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', zIndex: 3,
  },
  navRight: {
    position: 'absolute', right: 12, top: '45%', width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center', zIndex: 3,
  },
});
