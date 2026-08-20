import React, { useEffect, useRef, useCallback } from 'react';
import { View, StyleSheet, Image, Animated, Text } from 'react-native';

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const finishedRef = useRef(false);
  const mountedRef = useRef(true);

  const finishOnce = useCallback(() => {
    if (!finishedRef.current && mountedRef.current) {
      finishedRef.current = true;
      try {
        onFinish();
      } catch (e) {
        console.warn('[Splash] onFinish error:', e);
        onFinish();
      }
    }
  }, [onFinish]);

  useEffect(() => {
    mountedRef.current = true;
    try {
      Animated.sequence([
        Animated.delay(300),
        Animated.parallel([
          Animated.spring(logoScale, { toValue: 1, friction: 4, tension: 50, useNativeDriver: true }),
          Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        ]),
        Animated.timing(textOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      ]).start();
    } catch (e) {
      console.warn('[Splash] animation start error:', e);
    }

    const timer = setTimeout(() => finishOnce(), 2800);
    return () => {
      mountedRef.current = false;
      clearTimeout(timer);
    };
  }, [finishOnce, logoScale, logoOpacity, textOpacity]);

  return (
    <View style={styles.container}>
      <View style={styles.staticBackground} />
      <View style={styles.logoOverlay}>
        <Animated.View style={{ alignItems: 'center', opacity: logoOpacity, transform: [{ scale: logoScale }]}}>
          <Image
            source={require('../../assets/citivas-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
        <Animated.Text style={[styles.brandText, { opacity: textOpacity }]}>
          Citivas
        </Animated.Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  staticBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#0A2540',
  },
  logoOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 110,
    height: 110,
  },
  brandText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginTop: 14,
  },
});
