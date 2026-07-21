import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import BusinessDetailScreen from '../screens/BusinessDetailScreen';
import EventsScreen from '../screens/EventsScreen';
import MarketplaceScreen from '../screens/MarketplaceScreen';
import WalletScreen from '../screens/WalletScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ConversationsScreen from '../screens/ConversationsScreen';
import ChatDetailScreen from '../screens/ChatDetailScreen';
import MyDashboardScreen from '../screens/MyDashboardScreen';
import FavouritesScreen from '../screens/FavouritesScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import BusinessesScreen from '../screens/BusinessesScreen';

import MainTabsContent from './MainTabsContent';

const RootStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const EventsStack = createNativeStackNavigator();
const MarketplaceStack = createNativeStackNavigator();
const WalletStack = createNativeStackNavigator();
const FavouritesStack = createNativeStackNavigator();
const ConversationsStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="BusinessesList" component={BusinessesScreen} options={{ animationEnabled: true }} />
      <HomeStack.Screen name="BusinessDetail" component={BusinessDetailScreen} options={{ animationEnabled: true }} />
    </HomeStack.Navigator>
  );
}

function FavouritesStackScreen() {
  return (
    <FavouritesStack.Navigator screenOptions={{ headerShown: false }}>
      <FavouritesStack.Screen name="FavouritesMain" component={FavouritesScreen} />
    </FavouritesStack.Navigator>
  );
}

function ConversationsStackScreen() {
  return (
    <ConversationsStack.Navigator screenOptions={{ headerShown: false }}>
      <ConversationsStack.Screen name="ConversationsMain" component={ConversationsScreen} />
      <ConversationsStack.Screen name="ChatDetail" component={ChatDetailScreen} options={{ animationEnabled: true }} />
    </ConversationsStack.Navigator>
  );
}

function EventsStackScreen() {
  return (
    <EventsStack.Navigator screenOptions={{ headerShown: false }}>
      <EventsStack.Screen name="EventsMain" component={EventsScreen} />
      <EventsStack.Screen name="BusinessDetail" component={BusinessDetailScreen} options={{ animationEnabled: true }} />
    </EventsStack.Navigator>
  );
}

function MarketplaceStackScreen() {
  return (
    <MarketplaceStack.Navigator screenOptions={{ headerShown: false }}>
      <MarketplaceStack.Screen name="MarketplaceMain" component={MarketplaceScreen} />
      <MarketplaceStack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ animationEnabled: true }} />
    </MarketplaceStack.Navigator>
  );
}

function WalletStackScreen() {
  return (
    <WalletStack.Navigator screenOptions={{ headerShown: false }}>
      <WalletStack.Screen name="WalletMain" component={WalletScreen} />
    </WalletStack.Navigator>
  );
}

function MainTabs() {
  return (
    <MainTabsContent
      HomeStack={HomeStackScreen}
      EventsStack={EventsStackScreen}
      FavouritesStack={FavouritesStackScreen}
      MarketplaceStack={MarketplaceStackScreen}
      ConversationsStack={ConversationsStackScreen}
      WalletStack={WalletStackScreen}
      SettingsScreen={SettingsScreen}
    />
  );
}

export default function RootNavigator() {
  const { isAuthenticated, isLoading } = useAuth();
  const { colors } = useTheme();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <RootStack.Screen name="MainTabs" component={MainTabs} />
            <RootStack.Screen name="BusinessesList" component={BusinessesScreen} options={{ animationEnabled: true }} />
            <RootStack.Screen name="ChatDetail" component={ChatDetailScreen} options={{ animationEnabled: true }} />
            <RootStack.Screen name="MyDashboard" component={MyDashboardScreen} options={{ animationEnabled: true }} />
            <RootStack.Screen name="Favourites" component={FavouritesScreen} options={{ animationEnabled: true }} />
          </>
        ) : (
          <RootStack.Screen name="Login" component={LoginScreen} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
