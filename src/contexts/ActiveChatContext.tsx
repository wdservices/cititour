import { createContext, useContext, useState, ReactNode } from 'react';

interface ActiveChatContextType {
  activeChatId: string | null;
  setActiveChatId: (id: string | null) => void;
}

const ActiveChatContext = createContext<ActiveChatContextType>({
  activeChatId: null,
  setActiveChatId: () => {},
});

export function ActiveChatProvider({ children }: { children: ReactNode }) {
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  return (
    <ActiveChatContext.Provider value={{ activeChatId, setActiveChatId }}>
      {children}
    </ActiveChatContext.Provider>
  );
}

export function useActiveChat() {
  return useContext(ActiveChatContext);
}
