import React, { createContext, useContext } from 'react';

export type MainTabId = 'explore' | 'events' | 'saved' | 'messages' | 'profile' | 'marketplace' | 'wallet' | 'settings';

type MainNavigationContextValue = {
  openMenu: () => void;
  setActiveTab: (tab: MainTabId) => void;
};

const MainNavigationContext = createContext<MainNavigationContextValue>({
  openMenu: () => {},
  setActiveTab: () => {},
});

export const MainNavigationProvider = MainNavigationContext.Provider;

export function useMainNavigation(): MainNavigationContextValue {
  return useContext(MainNavigationContext);
}

/** @deprecated use useMainNavigation */
export function useMenuActions() {
  const { openMenu } = useMainNavigation();
  return { openMenu };
}
