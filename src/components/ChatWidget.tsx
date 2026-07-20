import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Minus } from 'lucide-react';
import { ensureChatExists, sendMessage, listenToMessages, markThreadRead, ChatMessage } from '@/lib/chat';
import { useAuth } from '@/contexts/AuthContext';

interface ChatWidgetProps {
  businessId: string;
  businessName: string;
  businessAvatar?: string;
}

type WidgetState = 'closed' | 'open' | 'minimized';

export function ChatWidget({ businessId, businessName, businessAvatar }: ChatWidgetProps) {
  const { user, isAuthenticated } = useAuth();
  const [widgetState, setWidgetState] = useState<WidgetState>('closed');
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (widgetState !== 'open' || !user || chatId) return;
    ensureChatExists(businessId, user.id, businessName, user.name).then((id) => {
      setChatId(id);
      markThreadRead(id, 'customer');
    });
  }, [widgetState, businessId, businessName, user, chatId]);

  useEffect(() => {
    if (!chatId) return;
    const unsubscribe = listenToMessages(chatId, setMessages);
    return unsubscribe;
  }, [chatId]);

  useEffect(() => {
    if (widgetState === 'open') bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, widgetState]);

  useEffect(() => {
    if (widgetState === 'open') setTimeout(() => inputRef.current?.focus(), 150);
  }, [widgetState]);

  const unreadCount = messages.filter((m) => m.senderRole === 'business' && !m.read).length;

  const handleSend = async () => {
    if (!draft.trim() || !chatId || !user) return;
    const text = draft.trim();
    setDraft('');
    await sendMessage(chatId, user.id, 'customer', text);
  };

  // Don't render a chat launcher for logged-out visitors — ensureChatExists
  // requires a real user.id. Gate with a sign-in prompt instead if desired.
  if (!isAuthenticated || !user) return null;

  return (
    <>
      {widgetState === 'closed' && (
        <button
          onClick={() => setWidgetState('open')}
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 transition-transform"
          aria-label={`Chat with ${businessName}`}
        >
          <MessageCircle className="w-6 h-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-accent text-white text-xs font-bold">
              {unreadCount}
            </span>
          )}
        </button>
      )}

      {widgetState === 'minimized' && (
        <button
          onClick={() => setWidgetState('open')}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-card border border-border shadow-lg px-4 py-3 hover:shadow-xl transition-shadow"
        >
          {businessAvatar ? (
            <img src={businessAvatar} alt="" className="w-6 h-6 rounded-full object-cover" />
          ) : (
            <MessageCircle className="w-5 h-5 text-primary" />
          )}
          <span className="text-sm font-medium text-foreground">{businessName}</span>
        </button>
      )}

      {widgetState === 'open' && (
        <div className="fixed bottom-6 right-6 z-50 w-[350px] h-[500px] rounded-2xl bg-card border border-border shadow-2xl flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground shrink-0">
            <div className="flex items-center gap-2.5">
              {businessAvatar ? (
                <img src={businessAvatar} alt="" className="w-8 h-8 rounded-full object-cover border-2 border-primary-foreground/30" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center font-bold text-sm">
                  {businessName.charAt(0)}
                </div>
              )}
              <div>
                <p className="font-semibold text-sm leading-tight">{businessName}</p>
                <p className="text-xs text-primary-foreground/70 leading-tight">Usually replies within a few hours</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setWidgetState('minimized')} className="p-1.5 hover:bg-primary-foreground/10 rounded-md transition-colors" aria-label="Minimize chat">
                <Minus className="w-4 h-4" />
              </button>
              <button onClick={() => setWidgetState('closed')} className="p-1.5 hover:bg-primary-foreground/10 rounded-md transition-colors" aria-label="Close chat">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-muted/20">
            {messages.length === 0 && (
              <div className="text-center text-sm text-muted-foreground mt-8">
                <p>Say hello to {businessName}</p>
                <p className="text-xs mt-1">Ask about availability, pricing, or anything else.</p>
              </div>
            )}
            {messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[80%] rounded-2xl px-3.5 py-2 text-sm leading-snug ${
                  m.senderRole === 'customer'
                    ? 'ml-auto bg-primary text-primary-foreground rounded-br-sm'
                    : 'bg-card border border-border text-foreground rounded-bl-sm'
                }`}
              >
                {m.text}
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="flex items-center gap-2 p-3 border-t border-border bg-card shrink-0">
            <input
              ref={inputRef}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              onClick={handleSend}
              disabled={!draft.trim()}
              className="flex items-center justify-center w-9 h-9 rounded-full bg-primary text-primary-foreground disabled:opacity-40 hover:opacity-90 transition-opacity shrink-0"
              aria-label="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
