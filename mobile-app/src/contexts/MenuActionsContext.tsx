import React, { createContext, useContext } from 'react';

type MenuActions = {
  openMenu: () => void;
};

const MenuActionsContext = createContext<MenuActions>({ openMenu: () => {} });

export const MenuActionsProvider = MenuActionsContext.Provider;

export function useMenuActions(): MenuActions {
  return useContext(MenuActionsContext);
}
