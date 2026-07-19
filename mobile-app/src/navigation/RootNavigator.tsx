import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Compass, Calendar, ShoppingBag, Wallet, Settings as SettingsIcon } from 'lucide-react-native';
import { colors } from '../theme/theme';

import HomeScreen from '../screens/HomeScreen';
import BusinessDetailScreen from '../screens/BusinessDetailScreen';
import EventsScreen from '../screens/EventsScreen';
import MarketplaceScreen from '../screens/MarketplaceScreen';
import WalletScreen from '../screens/WalletScreen';
import SettingsScreen from '../screens/SettingsScreen';

// NOTE: deliberately no Login/Auth screen in this navigation tree, per
// instruction. This means every screen below currently assumes a user is
// already authenticated by the time the app reaches this navigator — that
// gap needs to be closed with whatever auth entry point is decided later
// (e.g. a silent/anonymous Firebase session, a deep-linked token from the
// web app, or a login screen added back in when ready). Screens like
// WalletScreen and the chat feature in BusinessDetailScreen will not
// function correctly without a real authenticated user.id in place.

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const EventsStack = createNativeStackNavigator();

function HomeStackScreen() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="BusinessDetail" component={BusinessDetailScreen} />
    </HomeStack.Navigator>
  );
}

function EventsStackScreen() {
  return (
    <EventsStack.Navigator screenOptions={{ headerShown: false }}>
      <EventsStack.Screen name="EventsMain" component={EventsScreen} />
    </EventsStack.Navigator>
  );
}

export default function RootNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.mutedForeground,
          tabBarStyle: { backgroundColor: colors.card, borderTopColor: colors.border },
        }}
      >
        <Tab.Screen
          name="Explore"
          component={HomeStackScreen}
          options={{ tabBarIcon: ({ color, size }) => <Compass color={color} size={size} /> }}
        />
        <Tab.Screen
          name="Events"
          component={EventsStackScreen}
          options={{ tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} /> }}
        />
        <Tab.Screen
          name="Marketplace"
          component={MarketplaceScreen}
          options={{ tabBarIcon: ({ color, size }) => <ShoppingBag color={color} size={size} /> }}
        />
        <Tab.Screen
          name="Wallet"
          component={WalletScreen}
          options={{ tabBarIcon: ({ color, size }) => <Wallet color={color} size={size} /> }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{ tabBarIcon: ({ color, size }) => <SettingsIcon color={color} size={size} /> }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
