import { useEffect, useRef, useState } from 'react';
import { MessageCircle, Send, X, ArrowLeft } from 'lucide-react';
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
}

export function BusinessChatInbox({ businessId }: BusinessChatInboxProps) {
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
    <div className="fixed inset-0 sm:inset-auto sm:bottom-6 sm:left-6 z-50 sm:w-[700px] sm:h-[520px] sm:rounded-2xl bg-white sm:border border-border shadow-2xl flex overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-200">
      {/* Sidebar */}
      <div className={`w-full md:w-[280px] border-r border-border flex flex-col bg-white ${selectedThread ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 pb-3 flex items-center justify-between border-b border-border">
          <h1 className="text-lg font-bold text-foreground tracking-tight">Messages</h1>
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
              <MessageCircle className="w-8 h-8 mb-2 opacity-30" />
              <p className="text-sm font-medium">No messages yet</p>
              <p className="text-xs text-center mt-1">When customers message your business, conversations will appear here.</p>
            </div>
          ) : (
            threads.map((thread) => {
              const isSelected = thread.id === selectedThread?.id;
              return (
                <div
                  key={thread.id}
                  onClick={() => { setSelectedThread(thread); setActiveChatId(thread.id); }}
                  className={`flex items-center p-3 mx-2 my-1 rounded-xl cursor-pointer transition-all ${isSelected ? 'bg-primary/5' : 'hover:bg-muted/50'}`}
                >
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex-shrink-0 flex items-center justify-center text-primary font-bold text-sm">
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
                <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-sm flex-shrink-0">
                  {selectedThread.customerName?.charAt(0) || '?'}
                </div>
                <div className="ml-3 min-w-0">
                  <h3 className="font-semibold text-sm text-foreground truncate">{selectedThread.customerName}</h3>
                  <span className="text-xs text-green-500 font-medium">Active</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-muted/20 space-y-1">
              {messages.length === 0 && (
                <div className="text-center text-sm text-muted-foreground mt-8">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              )}
              {messages.map((m) => {
                const isMe = m.senderRole === 'business';
                const displayTime = m.createdAt?.toDate?.()
                  ? m.createdAt.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : '';
                return (
                  <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    {!isMe && (
                      <div className="flex items-center gap-1.5 mb-0.5 ml-1">
                        {m.senderPhoto ? (
                          <img src={m.senderPhoto} alt="" className="w-4 h-4 rounded-full object-cover" />
                        ) : (
                          <div className="w-4 h-4 bg-primary/10 rounded-full flex items-center justify-center text-primary text-[8px] font-bold">
                            {(m.senderName || selectedThread.customerName || '?').charAt(0)}
                          </div>
                        )}
                        <span className="text-[10px] text-muted-foreground font-medium">{m.senderName || selectedThread.customerName}</span>
                      </div>
                    )}
                    <div className={`max-w-[75%] px-3 py-2 text-[13px] leading-snug ${
                      isMe
                        ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm'
                        : 'bg-white text-foreground border border-border rounded-2xl rounded-tl-sm'
                    }`}>
                      {m.text}
                    </div>
                    {displayTime && (
                      <span className="text-[10px] text-muted-foreground mt-0.5 px-1">{displayTime}</span>
                    )}
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
                placeholder="Type a message..."
                className="flex-1 bg-muted/50 border-none outline-none focus:ring-2 focus:ring-primary/20 rounded-xl px-4 py-2.5 text-sm"
              />
              <button
                type="submit"
                disabled={!draft.trim()}
                className="p-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition disabled:opacity-40 flex-shrink-0"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center bg-muted/10 text-muted-foreground">
            <MessageCircle className="w-10 h-10 mb-2 opacity-20" />
            <p className="text-sm font-medium">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}
