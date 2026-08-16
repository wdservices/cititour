import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, StyleSheet, Dimensions, Image, Animated, Text } from 'react-native';
import { Video, ResizeMode } from 'expo-av';

const { width: W, height: H } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const logoScale = useRef(new Animated.Value(0.3)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const [videoHasError, setVideoHasError] = useState(false);
  const finishedRef = useRef(false);

  const finishOnce = useCallback(() => {
    if (!finishedRef.current) {
      finishedRef.current = true;
      onFinish();
    }
  }, [onFinish]);

  useEffect(() => {
    Animated.sequence([
      Animated.delay(400),
      Animated.parallel([
        Animated.spring(logoScale, { toValue: 1, friction: 4, tension: 50, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
      ]),
      Animated.timing(textOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
    ]).start();

    const timer = setTimeout(() => finishOnce(), 3500);
    return () => clearTimeout(timer);
  }, [finishOnce, logoScale, logoOpacity, textOpacity]);

  const handlePlaybackStatusUpdate = useCallback((status: any) => {
    if (status && status.didJustFinish) finishOnce();
  }, [finishOnce]);

  const handleVideoError = useCallback(() => {
    setVideoHasError(true);
  }, []);

  return (
    <View style={styles.container}>
      {videoHasError ? (
        <View style={styles.staticBackground} />
      ) : (
        <Video
          source={require('../../assets/citivas-splashscreen.mp4')}
          style={StyleSheet.absoluteFillObject}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping={false}
          useNativeControls={false}
          isMuted
          onError={handleVideoError}
          onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
        />
      )}

      <View style={styles.logoOverlay}>
        <Animated.View style={{ alignItems: 'center', opacity: logoOpacity, transform: [{ scale: logoScale }] }}>
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
