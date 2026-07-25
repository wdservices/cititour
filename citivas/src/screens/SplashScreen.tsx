import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Image, Animated, Platform, Text } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

const { width: W, height: H } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.delay(400),
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, friction: 4, tension: 50, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
      Animated.timing(textOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => onFinish(), 8000);
    return () => clearTimeout(timer);
  }, []);

  const handlePlaybackStatusUpdate = (status: any) => {
    if (status.didJustFinish) onFinish();
  };

  return (
    <View style={styles.container}>
      <Video
        source={require('../../assets/citivas-splashscreen.mp4')}
        style={StyleSheet.absoluteFillObject}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping={false}
        useNativeControls={false}
        isMuted={Platform.OS === 'web'}
        onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />

      <View style={styles.logoOverlay}>
        <Animated.View style={{ alignItems: 'center', opacity: logoOpacity, transform: [{ scale: logoScale }] }}>
          <Image
            source={require('../../assets/logo.png')}
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
