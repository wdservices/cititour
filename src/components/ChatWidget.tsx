import { useEffect, useRef, useState } from 'react';
import { MessageCircle, X, Send, Minus } from 'lucide-react';
import { ensureChatExists, sendMessage, listenToMessages } from '@/lib/chat';
import { useAuth } from '@/contexts/AuthContext';
import { useActiveChat } from '@/contexts/ActiveChatContext';

interface ChatWidgetProps {
  businessId: string;
  businessName: string;
  businessAvatar?: string;
  sellerId?: string;
  sellerName?: string;
  sellerPhoto?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

type WidgetState = 'closed' | 'open' | 'minimized';

export function ChatWidget({
  businessId,
  businessName,
  businessAvatar,
  sellerId,
  sellerName,
  sellerPhoto,
  isOpen,
  onOpenChange,
}: ChatWidgetProps) {
  const { user } = useAuth();
  const { setActiveChatId } = useActiveChat();
  const [internalState, setInternalState] = useState<WidgetState>('closed');
  const [chatId, setChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [draft, setDraft] = useState('');
  const [isTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const widgetState: WidgetState = isOpen !== undefined ? (isOpen ? 'open' : 'closed') : internalState;

  const setState = (s: WidgetState) => {
    if (onOpenChange) {
      onOpenChange(s === 'open');
    } else {
      setInternalState(s);
    }
  };

  const counterpartyName = businessName || sellerName || 'Seller';
  const counterpartyAvatar = businessAvatar || sellerPhoto || '';

  useEffect(() => {
    if (widgetState === 'open' && chatId) {
      setActiveChatId(chatId);
    } else {
      setActiveChatId(null);
    }
  }, [widgetState, chatId, setActiveChatId]);

  useEffect(() => {
    if (widgetState !== 'open' || !user || chatId) return;
    ensureChatExists(
      businessId,
      user.id,
      businessName,
      user.name,
      sellerId,
      sellerName,
    )
      .then(setChatId)
      .catch((err) => console.error('Failed to create chat:', err));
  }, [widgetState, businessId, businessName, user, chatId, sellerId, sellerName]);

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
    await sendMessage(chatId, user.id, 'customer', text, user.name, user.photoURL);
  };

  if (!user) return null;

  return (
    <>
      {widgetState === 'closed' && (
        <button
          onClick={() => setState('open')}
          className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:scale-105 transition-transform"
          aria-label={`Chat with ${counterpartyName}`}
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
          onClick={() => setState('open')}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-card border border-border shadow-lg px-4 py-3 hover:shadow-xl transition-shadow"
        >
          {counterpartyAvatar ? (
            <img src={counterpartyAvatar} alt="" className="w-6 h-6 rounded-full object-cover" />
          ) : (
            <MessageCircle className="w-5 h-5 text-primary" />
          )}
          <span className="text-sm font-medium text-foreground">{counterpartyName}</span>
        </button>
      )}

      {widgetState === 'open' && (
        <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:right-6 z-50 sm:w-[400px] sm:h-[580px] sm:rounded-2xl bg-card sm:border border-border shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-primary text-primary-foreground shrink-0">
            <div className="flex items-center gap-2.5">
              {counterpartyAvatar ? (
                <img src={counterpartyAvatar} alt="" className="w-10 h-10 rounded-full object-cover border-2 border-primary-foreground/30" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center font-bold text-base">
                  {counterpartyName.charAt(0)}
                </div>
              )}
              <div>
                <p className="font-semibold text-sm leading-tight">{counterpartyName}</p>
                <p className="text-xs text-primary-foreground/70 leading-tight flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  Usually replies within a few hours
                </p>
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
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 bg-muted/20">
            {messages.length === 0 && (
              <div className="text-center text-sm text-muted-foreground mt-8 px-4">
                <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-primary/10 flex items-center justify-center">
                  {counterpartyAvatar ? (
                    <img src={counterpartyAvatar} alt="" className="w-12 h-12 rounded-xl object-cover" />
                  ) : (
                    <MessageCircle className="w-8 h-8 text-primary" />
                  )}
                </div>
                <p className="font-semibold text-foreground">Start a conversation</p>
                <p className="text-xs mt-1">Say hello to {counterpartyName}. Ask about availability, pricing, or anything else.</p>
              </div>
            )}

            {messages.map((m, idx) => {
              const prev = messages[idx - 1];
              const isMe = m.senderRole === 'customer';
              const sameSenderAsPrev = prev && prev.senderRole === m.senderRole;
              const displayTime = m.createdAt?.toDate?.()
                ? m.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : '';

              const myPhoto = user?.photoURL;
              const myName = user?.name || 'You';
              const theirPhoto = m.senderPhoto || counterpartyAvatar;
              const theirName = m.senderName || counterpartyName;

              return (
                <div
                  key={m.id}
                  className={`flex items-end gap-2 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}
                  style={{ marginTop: sameSenderAsPrev ? '2px' : '12px' }}
                >
                  {/* Avatar */}
                  <div className="flex-shrink-0" style={{ visibility: sameSenderAsPrev ? 'hidden' : 'visible' }}>
                    {isMe ? (
                      myPhoto ? (
                        <img src={myPhoto} alt={myName} className="w-7 h-7 rounded-full object-cover border-2 border-primary/20" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold border-2 border-primary/20">
                          {myName.charAt(0).toUpperCase()}
                        </div>
                      )
                    ) : (
                      theirPhoto ? (
                        <img src={theirPhoto} alt={theirName} className="w-7 h-7 rounded-full object-cover border-2 border-accent/20" />
                      ) : (
                        <div className="w-7 h-7 rounded-full bg-accent/20 text-accent-foreground flex items-center justify-center text-[10px] font-bold border-2 border-accent/20">
                          {theirName.charAt(0).toUpperCase()}
                        </div>
                      )
                    )}
                  </div>

                  {/* Bubble + meta */}
                  <div className={`flex flex-col max-w-[72%] ${isMe ? 'items-end' : 'items-start'}`}>
                    {!sameSenderAsPrev && (
                      <span className={`text-[10px] font-semibold mb-0.5 px-1 ${isMe ? 'text-primary' : 'text-accent-foreground/70'}`}>
                        {isMe ? myName : theirName}
                      </span>
                    )}
                    <div
                      className={`px-3.5 py-2 text-[13px] leading-snug shadow-sm ${
                        isMe
                          ? sameSenderAsPrev
                            ? 'bg-primary text-primary-foreground rounded-2xl rounded-br-md'
                            : 'bg-primary text-primary-foreground rounded-2xl rounded-br-sm'
                          : sameSenderAsPrev
                          ? 'bg-card text-foreground border border-border rounded-2xl rounded-bl-md'
                          : 'bg-card text-foreground border border-border rounded-2xl rounded-bl-sm'
                      }`}
                    >
                      {m.text}
                    </div>
                    {displayTime && (
                      <span className="text-[9px] text-muted-foreground mt-0.5 px-1 font-medium">
                        {displayTime}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}

            {isTyping && (
              <div className="flex items-end gap-2">
                {counterpartyAvatar ? (
                  <img src={counterpartyAvatar} alt="" className="w-7 h-7 rounded-full object-cover" />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-accent/20 flex items-center justify-center text-[10px] font-bold text-accent-foreground">
                    {counterpartyName.charAt(0)}
                  </div>
                )}
                <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground animate-bounce" />
                  </div>
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
              placeholder={`Message ${counterpartyName}...`}
              className="flex-1 rounded-full border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button
              onClick={handleSend}
              disabled={!draft.trim()}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground disabled:opacity-40 hover:opacity-90 transition-opacity shrink-0 shadow-md"
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
