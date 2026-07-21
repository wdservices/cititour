import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import FloatingTabBar, { TabItem } from '../components/FloatingTabBar';
import SideMenu from '../components/SideMenu';
import { MainNavigationProvider, MainTabId } from '../contexts/MainNavigationContext';

interface MainTabsContentProps {
  HomeStack: React.ComponentType<any>;
  EventsStack: React.ComponentType<any>;
  FavouritesStack: React.ComponentType<any>;
  MarketplaceStack: React.ComponentType<any>;
  ConversationsStack: React.ComponentType<any>;
  WalletStack: React.ComponentType<any>;
  SettingsScreen: React.ComponentType<any>;
}

export default function MainTabsContent({
  HomeStack,
  EventsStack,
  FavouritesStack,
  MarketplaceStack,
  ConversationsStack,
  WalletStack,
  SettingsScreen,
}: MainTabsContentProps) {
  const { colors } = useTheme();
  const { user, logout } = useAuth();
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState('explore');
  const [menuVisible, setMenuVisible] = useState(false);

  const tabs: TabItem[] = [
    { name: 'explore', icon: 'compass', label: 'Explore' },
    { name: 'events', icon: 'calendar', label: 'Events' },
    { name: 'saved', icon: 'bookmark', label: 'Saved' },
    { name: 'messages', icon: 'message-circle', label: 'Messages' },
    { name: 'profile', icon: 'user', label: 'Profile' },
  ];

  const menuSections = useMemo(
    () => [
      {
        title: 'Discover',
        items: [
          { label: 'Explore', onPress: () => { setActiveTab('explore'); setMenuVisible(false); } },
          { label: 'Businesses', onPress: () => { setMenuVisible(false); navigation.navigate('BusinessesList'); } },
          { label: 'Events', onPress: () => { setActiveTab('events'); setMenuVisible(false); } },
          { label: 'Marketplace', onPress: () => { setActiveTab('marketplace'); setMenuVisible(false); } },
        ],
      },
      {
        title: 'Dashboard',
        items: [
          { label: 'My Dashboard', onPress: () => { setMenuVisible(false); navigation.navigate('MyDashboard'); } },
          { label: 'Saved', onPress: () => { setActiveTab('saved'); setMenuVisible(false); } },
          { label: 'Wallet', onPress: () => { setActiveTab('wallet'); setMenuVisible(false); } },
          { label: 'Messages', onPress: () => { setActiveTab('messages'); setMenuVisible(false); } },
        ],
      },
      {
        title: 'Support',
        items: [
          { label: 'Share CitiTour', onPress: () => setMenuVisible(false) },
          { label: 'Feedback', onPress: () => setMenuVisible(false) },
          { label: 'Settings', onPress: () => { setActiveTab('settings'); setMenuVisible(false); } },
          { label: 'Contact Support', onPress: () => setMenuVisible(false) },
        ],
      },
    ],
    [navigation]
  );

  const navigateToTab = (tab: MainTabId) => {
    if (tab === 'settings') setActiveTab('profile');
    else setActiveTab(tab);
  };

  const renderScreen = () => {
    switch (activeTab) {
      case 'explore': return <HomeStack />;
      case 'events': return <EventsStack />;
      case 'saved': return <FavouritesStack />;
      case 'messages': return <ConversationsStack />;
      case 'profile':
      case 'settings': return <SettingsScreen />;
      case 'marketplace': return <MarketplaceStack />;
      case 'wallet': return <WalletStack />;
      default: return <HomeStack />;
    }
  };

  return (
    <MainNavigationProvider value={{ openMenu: () => setMenuVisible(true), setActiveTab: navigateToTab }}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.content}>{renderScreen()}</View>

        <FloatingTabBar tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

        <SideMenu
          visible={menuVisible}
          onClose={() => setMenuVisible(false)}
          userName={user?.name || 'User'}
          userEmail={user?.email || 'user@example.com'}
          sections={menuSections}
          onLogout={() => { setMenuVisible(false); logout(); }}
        />
      </View>
    </MainNavigationProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingBottom: 72 },
});
