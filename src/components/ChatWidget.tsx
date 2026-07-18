import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Minus } from 'lucide-react';
import { ensureChatExists, sendMessage, listenToMessages } from '@/lib/chat';
import { useAuth } from '@/contexts/AuthContext';

interface ChatWidgetProps {
  businessId: string;
  businessName: string;
  businessAvatar?: string;
  /** Controlled open state — pass to open/close from parent */
  isOpen?: boolean;
  /** Called when widget wants to change open state */
  onOpenChange?: (open: boolean) => void;
}

type WidgetState = 'closed' | 'open' | 'minimized';

export function ChatWidget({ businessId, businessName, businessAvatar, isOpen, onOpenChange }: ChatWidgetProps) {
  const { user } = useAuth();
  const [internalState, setInternalState] = useState<WidgetState>('closed');
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [draft, setDraft] = useState('');
  const [isTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Use controlled state if provided, otherwise fall back to internal
  const widgetState: WidgetState = isOpen !== undefined ? (isOpen ? 'open' : 'closed') : internalState;

  const setState = (s: WidgetState) => {
    if (onOpenChange) {
      onOpenChange(s === 'open');
    } else {
      setInternalState(s);
    }
  };

  useEffect(() => {
    if (widgetState !== 'open' || !user || chatId) return;
    ensureChatExists(businessId, user.uid, businessName, user.displayName || 'Customer')
      .then(setChatId)
      .catch((err) => console.error('Failed to create chat:', err));
  }, [widgetState, businessId, businessName, user, chatId]);

  useEffect(() => {
    if (!chatId) return;
    return listenToMessages(chatId, setMessages);
  }, [chatId]);

  useEffect(() => {
    if (widgetState === 'open') {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, widgetState]);

  useEffect(() => {
    if (widgetState === 'open') {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [widgetState]);

  const unreadCount = messages.filter((m) => m.senderRole === 'business' && !m.read).length;

  const handleSend = async () => {
    if (!draft.trim() || !chatId || !user) return;
    const text = draft.trim();
    setDraft('');
    await sendMessage(chatId, user.uid, 'customer', text);
  };

  if (!user) return null;

  return (
    <>
      {/* Floating launcher bubble */}
      {widgetState === 'closed' && (
        <button
          onClick={() => setState('open')}
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

      {/* Minimized pill */}
      {widgetState === 'minimized' && (
        <button
          onClick={() => setState('open')}
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

      {/* Expanded chat panel */}
      {widgetState === 'open' && (
        <div className="fixed bottom-6 right-6 z-50 w-[350px] h-[500px] rounded-2xl bg-card border border-border shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200">
          {/* Header */}
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
              <button onClick={() => setState('minimized')} className="p-1.5 hover:bg-primary-foreground/10 rounded-md transition-colors" aria-label="Minimize chat">
                <Minus className="w-4 h-4" />
              </button>
              <button onClick={() => setState('closed')} className="p-1.5 hover:bg-primary-foreground/10 rounded-md transition-colors" aria-label="Close chat">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
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

            {isTyping && (
              <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 w-fit">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
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
