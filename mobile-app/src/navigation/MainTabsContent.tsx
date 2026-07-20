import React, { useState, useMemo } from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import FloatingTabBar, { TabItem } from '../components/FloatingTabBar';
import SideMenu from '../components/SideMenu';
import { spacing } from '../theme/theme';

interface MainTabsContentProps {
  HomeStack: React.ComponentType<any>;
  EventsStack: React.ComponentType<any>;
  MarketplaceStack: React.ComponentType<any>;
  ConversationsStack: React.ComponentType<any>;
  WalletStack: React.ComponentType<any>;
  SettingsScreen: React.ComponentType<any>;
}

export default function MainTabsContent({
  HomeStack,
  EventsStack,
  MarketplaceStack,
  ConversationsStack,
  WalletStack,
  SettingsScreen,
}: MainTabsContentProps) {
  const { colors, isDark } = useTheme();
  const { user, logout } = useAuth();
  const navigation = useNavigation<any>();
  const [activeTab, setActiveTab] = useState('explore');
  const [menuVisible, setMenuVisible] = useState(false);

  const tabs: TabItem[] = [
    { name: 'explore', icon: 'compass', label: 'Explore' },
    { name: 'events', icon: 'calendar', label: 'Events' },
    { name: 'marketplace', icon: 'shopping-bag', label: 'Marketplace' },
    { name: 'messages', icon: 'message-circle', label: 'Messages' },
    { name: 'wallet', icon: 'wallet', label: 'Wallet' },
    { name: 'menu', icon: 'menu', label: 'Menu' },
  ];

  const menuSections = useMemo(
    () => [
      {
        title: 'Discover',
        items: [
          {
            icon: 'compass',
            label: 'Explore',
            description: 'Discover places',
            onPress: () => {
              setActiveTab('explore');
              setMenuVisible(false);
            },
          },
          {
            icon: 'calendar',
            label: 'Events',
            description: 'Find events',
            onPress: () => {
              setActiveTab('events');
              setMenuVisible(false);
            },
          },
          {
            icon: 'shopping-bag',
            label: 'Marketplace',
            description: 'Buy & sell',
            onPress: () => {
              setActiveTab('marketplace');
              setMenuVisible(false);
            },
          },
        ],
      },
      {
        title: 'Dashboard',
        items: [
          {
            icon: 'layout-dashboard',
            label: 'My Dashboard',
            description: 'Manage your listings',
            onPress: () => {
              setMenuVisible(false);
              navigation.navigate('MyDashboard');
            },
          },
          {
            icon: 'heart',
            label: 'Favourites',
            description: 'Your saved places',
            onPress: () => {
              setMenuVisible(false);
              navigation.navigate('Favourites');
            },
          },
          {
            icon: 'wallet',
            label: 'Wallet',
            description: 'Manage funds',
            onPress: () => {
              setActiveTab('wallet');
              setMenuVisible(false);
            },
          },
          {
            icon: 'message-circle',
            label: 'Messages',
            description: 'Your conversations',
            onPress: () => {
              setActiveTab('messages');
              setMenuVisible(false);
            },
          },
        ],
      },
      {
        title: 'Support',
        items: [
          {
            icon: 'share-2',
            label: 'Share CitiTour',
            description: 'Invite friends',
            onPress: () => {
              setMenuVisible(false);
              // Share functionality
            },
          },
          {
            icon: 'message-square',
            label: 'Feedback',
            description: 'Help us improve',
            onPress: () => {
              setMenuVisible(false);
              // Feedback functionality
            },
          },
          {
            icon: 'settings',
            label: 'Settings & Privacy',
            description: 'Account settings',
            onPress: () => {
              setActiveTab('settings');
              setMenuVisible(false);
            },
          },
          {
            icon: 'help-circle',
            label: 'Contact Support',
            description: 'Get help',
            onPress: () => {
              setMenuVisible(false);
              // Support functionality
            },
          },
        ],
      },
    ],
    [navigation]
  );

  const handleTabChange = (tabName: string) => {
    if (tabName === 'menu') {
      setMenuVisible(true);
    } else {
      setActiveTab(tabName);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      flex: 1,
      paddingBottom: 80, // Space for floating tab bar
    },
  });

  const renderScreen = () => {
    switch (activeTab) {
      case 'explore':
        return <HomeStack />;
      case 'events':
        return <EventsStack />;
      case 'marketplace':
        return <MarketplaceStack />;
      case 'messages':
        return <ConversationsStack />;
      case 'wallet':
        return <WalletStack />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <HomeStack />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderScreen()}</View>

      <FloatingTabBar
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      <SideMenu
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        userName={user?.displayName || 'User'}
        userEmail={user?.email || 'user@example.com'}
        sections={menuSections}
        onLogout={() => {
          setMenuVisible(false);
          logout();
        }}
      />
    </View>
  );
}
