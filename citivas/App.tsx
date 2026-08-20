import React, { useState, useCallback, useEffect, Component, ReactNode } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { AuthProvider } from './src/contexts/AuthContext';
import { ThemeProvider, useTheme } from './src/contexts/ThemeContext';
import RootNavigator from './src/navigation/RootNavigator';
import SplashScreen from './src/screens/SplashScreen';
import * as SplashScreenNative from 'expo-splash-screen';
import { LogBox } from 'react-native';

LogBox.ignoreAllLogs(true);

try {
  if (Platform.OS !== 'web') {
    SplashScreenNative.preventAutoHideAsync().catch(() => {});
  }
} catch (_) {}

if (Platform.OS !== 'web') {
  const origHandler = ErrorUtils.getGlobalHandler
    ? ErrorUtils.getGlobalHandler()
    : undefined;
  if (origHandler) {
    ErrorUtils.setGlobalHandler((e, isFatal) => {
      try {
        console.error('[GLOBAL ERROR]', isFatal, e?.message, e?.stack);
      } catch (_) {}
      try { origHandler(e, isFatal); } catch (__) {}
    });
  }
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: any) {
    console.error('[ErrorBoundary]', error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <View style={ebStyles.fallback}>
          <Text style={ebStyles.title}>Something went wrong.</Text>
          <Text style={ebStyles.subtitle}>Please restart the app.</Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const ebStyles = StyleSheet.create({
  fallback: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0A2540', padding: 24 },
  title: { color: '#fff', fontSize: 22, fontWeight: '700', marginBottom: 8 },
  subtitle: { color: 'rgba(255,255,255,0.75)', fontSize: 15 },
});

function AppContent() {
  const { isDark } = useTheme();
  return (
    <>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <RootNavigator />
    </>
  );
}

function BootLayer() {
  const [showSplash, setShowSplash] = useState(true);
  const { colors } = useTheme();

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
    try {
      if (Platform.OS !== 'web') {
        SplashScreenNative.hideAsync().catch(() => {});
      }
    } catch (_) {}
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      try {
        if (Platform.OS !== 'web') {
          SplashScreenNative.hideAsync().catch(() => {});
        }
      } catch (_) {}
    }, 4500);
    return () => clearTimeout(t);
  }, []);

  if (showSplash) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <SplashScreen onFinish={handleSplashFinish} />
      </View>
    );
  }

  return <AppContent />;
}

export default function App() {
  return (
    <ErrorBoundary>
      <SafeAreaProvider>
        <ThemeProvider>
          <AuthProvider>
            <BootLayer />
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </ErrorBoundary>
  );
}
