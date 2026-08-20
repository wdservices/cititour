import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, X, ArrowLeft, Store } from 'lucide-react';
import {
  listenToUserChats,
  listenToMessages,
  sendMessage,
  markMessagesRead,
  ChatThread,
  ChatMessage,
} from '@/lib/chat';
import { useAuth } from '@/contexts/AuthContext';
import { useActiveChat } from '@/contexts/ActiveChatContext';
import { doc, getDoc, updateDoc, query, collection, where, getDocs, arrayUnion } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface BusinessChatInboxProps {
  businessId: string;
  businessAvatar?: string;
  businessName?: string;
}

export function BusinessChatInbox({ businessId, businessAvatar, businessName }: BusinessChatInboxProps) {
  const { user } = useAuth();
  const { setActiveChatId } = useActiveChat();
  const [open, setOpen] = useState(false);
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [selectedThread, setSelectedThread] = useState<ChatThread | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open || !user || !businessId) return;
    const backfill = async () => {
      try {
        const bizSnap = await getDoc(doc(db, 'businesses', businessId));
        if (!bizSnap.exists()) return;
        const bizData = bizSnap.data();
        const existing = bizData.ownerId || bizData.userId || bizData.uid;
        if (!existing) {
          await updateDoc(doc(db, 'businesses', businessId), { ownerId: user.id });
        }
        const chatsSnap = await getDocs(
          query(collection(db, 'chats'), where('businessId', '==', businessId))
        );
        for (const chatDoc of chatsSnap.docs) {
          const chatData = chatDoc.data();
          if (!chatData.participants?.includes(user.id)) {
            await updateDoc(chatDoc.ref, { participants: arrayUnion(user.id) });
          }
        }
      } catch { /* ignore */ }
    };
    backfill();
  }, [open, user, businessId]);

  useEffect(() => {
    if (!open || !user) return;
    return listenToUserChats(user.id, (allThreads) => {
      const bizThreads = allThreads.filter((t) => t.businessId === businessId);
      setThreads(bizThreads);
    });
  }, [open, user, businessId]);

  useEffect(() => {
    if (!selectedThread) return;
    return listenToMessages(selectedThread.id, (msgs) => {
      setMessages(msgs);
      markMessagesRead(selectedThread.id, 'business').catch(() => {});
    });
  }, [selectedThread]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (selectedThread) {
      setTimeout(() => inputRef.current?.focus(), 150);
    }
  }, [selectedThread]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || !selectedThread || !user) return;
    const text = draft.trim();
    setDraft('');
    await sendMessage(selectedThread.id, user.id, 'business', text, user.name, user.photoURL);
  };

  if (!user) return null;

  const totalUnread = threads.reduce((sum, t) => sum + (t.unreadBusiness || 0), 0);
  const myPhoto = user?.photoURL;
  const myName = user?.name || 'You';
  const displayBusinessName = businessName || selectedThread?.businessName || 'Business';

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#1A1A1A] text-white shadow-lg hover:scale-105 transition-transform"
        aria-label="Open messages inbox"
      >
        <MessageCircle className="w-6 h-6" />
        {totalUnread > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-accent text-white text-xs font-bold">
            {totalUnread}
          </span>
        )}
      </button>
    );
  }

  return (
    <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:left-6 z-50 sm:w-[780px] sm:h-[580px] sm:rounded-2xl bg-white sm:border border-border shadow-2xl flex overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200">
      {/* Sidebar */}
      <div className={`w-full md:w-[300px] border-r border-border flex flex-col bg-white ${selectedThread ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 pb-3 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-2.5">
            {businessAvatar ? (
              <img src={businessAvatar} alt="" className="w-9 h-9 rounded-xl object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-[#1A1A1A] text-white flex items-center justify-center">
                <Store className="w-5 h-5" />
              </div>
            )}
            <div>
              <h1 className="text-[15px] font-bold text-foreground tracking-tight leading-tight">Messages</h1>
              <p className="text-[11px] text-muted-foreground leading-tight">{displayBusinessName}</p>
            </div>
          </div>
          <button
            onClick={() => { setOpen(false); setSelectedThread(null); setMessages([]); setActiveChatId(null); }}
            className="p-1.5 hover:bg-muted rounded-md transition-colors"
            aria-label="Close inbox"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {threads.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground p-6">
              <MessageCircle className="w-10 h-10 mb-3 opacity-30" />
              <p className="text-sm font-semibold">No messages yet</p>
              <p className="text-xs text-center mt-1 leading-relaxed">When customers message your business, conversations will appear here.</p>
            </div>
          ) : (
            threads.map((thread) => {
              const isSelected = thread.id === selectedThread?.id;
              return (
                <div
                  key={thread.id}
                  onClick={() => { setSelectedThread(thread); setActiveChatId(thread.id); }}
                  className={`flex items-center p-3 mx-2 my-1 rounded-xl cursor-pointer transition-all ${isSelected ? 'bg-primary/8 border-l-4 border-primary' : 'hover:bg-muted/50 border-l-4 border-transparent'}`}
                >
                  <div className="w-11 h-11 bg-primary/10 rounded-xl flex-shrink-0 flex items-center justify-center text-primary font-bold text-sm">
                    {thread.customerName?.charAt(0) || '?'}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h2 className="font-semibold text-sm text-foreground truncate">{thread.customerName}</h2>
                      {thread.unreadBusiness > 0 && (
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold shrink-0 ml-2">
                          {thread.unreadBusiness}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{thread.lastMessage || 'No messages yet'}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Chat Interface */}
      <div className={`flex-1 flex flex-col bg-white ${!selectedThread ? 'hidden md:flex' : 'flex'}`}>
        {selectedThread ? (
          <>
            {/* Chat Header */}
            <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-white">
              <div className="flex items-center min-w-0">
                <button
                  onClick={() => { setSelectedThread(null); setMessages([]); setActiveChatId(null); }}
                  className="p-1 hover:bg-muted rounded-md transition-colors md:hidden mr-2"
                  aria-label="Back to inbox"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm flex-shrink-0 border-2 border-primary/20">
                  {selectedThread.customerName?.charAt(0) || '?'}
                </div>
                <div className="ml-3 min-w-0">
                  <h3 className="font-semibold text-sm text-foreground truncate">{selectedThread.customerName}</h3>
                  <span className="text-[11px] text-green-600 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                    Customer
                  </span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-3 py-4 bg-muted/20 space-y-3">
              {messages.length === 0 && (
                <div className="text-center text-sm text-muted-foreground mt-10 px-6">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <MessageCircle className="w-8 h-8 text-primary" />
                  </div>
                  <p className="font-semibold text-foreground">No messages yet</p>
                  <p className="text-xs mt-1">Welcome {selectedThread.customerName}. Start the conversation below.</p>
                </div>
              )}
              {messages.map((m, idx) => {
                const prev = messages[idx - 1];
                const isMe = m.senderRole === 'business';
                const sameSenderAsPrev = prev && prev.senderRole === m.senderRole;
                const displayTime = m.createdAt?.toDate?.()
                  ? m.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : '';

                const theirName = m.senderName || selectedThread.customerName || 'Customer';
                const theirPhoto = m.senderPhoto;

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
                          <img src={myPhoto} alt={myName} className="w-8 h-8 rounded-full object-cover border-2 border-[#1A1A1A]/20" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-[#1A1A1A] text-white flex items-center justify-center text-[10px] font-bold border-2 border-[#1A1A1A]/20">
                            {myName.charAt(0).toUpperCase()}
                          </div>
                        )
                      ) : (
                        theirPhoto ? (
                          <img src={theirPhoto} alt={theirName} className="w-8 h-8 rounded-full object-cover border-2 border-accent/20" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-accent/20 text-accent-foreground flex items-center justify-center text-[10px] font-bold border-2 border-accent/20">
                            {theirName.charAt(0).toUpperCase()}
                          </div>
                        )
                      )}
                    </div>

                    {/* Bubble + meta */}
                    <div className={`flex flex-col max-w-[72%] ${isMe ? 'items-end' : 'items-start'}`}>
                      {!sameSenderAsPrev && (
                        <span className={`text-[10px] font-semibold mb-0.5 px-1 ${isMe ? 'text-[#1A1A1A]' : 'text-accent-foreground/70'}`}>
                          {isMe ? `${myName} (You)` : theirName}
                        </span>
                      )}
                      <div
                        className={`px-3.5 py-2.5 text-[13px] leading-snug shadow-sm ${
                          isMe
                            ? sameSenderAsPrev
                              ? 'bg-[#1A1A1A] text-white rounded-2xl rounded-tr-md'
                              : 'bg-[#1A1A1A] text-white rounded-2xl rounded-tr-sm'
                            : sameSenderAsPrev
                            ? 'bg-white text-foreground border border-border rounded-2xl rounded-tl-md'
                            : 'bg-white text-foreground border border-border rounded-2xl rounded-tl-sm'
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
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-3 border-t border-border bg-white flex items-center gap-2">
              <input
                ref={inputRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder={`Reply to ${selectedThread.customerName}...`}
                className="flex-1 bg-muted/50 border-none outline-none focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-2.5 text-sm"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                className="p-2.5 bg-[#1A1A1A] text-white rounded-xl hover:bg-black transition disabled:opacity-40 flex-shrink-0 shadow-md"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-muted/10 text-muted-foreground px-8">
            <MessageCircle className="w-12 h-12 mb-3 opacity-20" />
            <p className="text-sm font-semibold">Select a conversation</p>
            <p className="text-xs text-center mt-1">Choose a customer from the sidebar to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
}
