import { useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import { useActiveChat } from '@/contexts/ActiveChatContext';
import { fireBrowserNotification } from '@/lib/webNotifications';

/**
 * Silent component — mounts once globally for business owners.
 * Listens to all chats where the current user is a participant.
 * When a chat doc is modified by someone else and the user doesn't have
 * that chat open, fires a native browser Notification banner.
 */
export default function WebNotificationListener() {
  const { user } = useAuth();
  const { activeChatId } = useActiveChat();

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', user.id),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type !== 'modified') return;

        const chatData = change.doc.data();
        const chatId = change.doc.id;

        // Only notify when someone else sent the last message
        if (chatData.lastSenderId === user.id) return;

        // Don't notify for the chat the user is actively viewing
        if (chatId === activeChatId) return;

        // Determine sender display name
        const senderName =
          (user.id === chatData.businessOwnerId
            ? chatData.customerName
            : chatData.businessName) || 'New message';

        fireBrowserNotification(senderName, chatData.lastMessage, chatId);
      });
    });

    return () => unsubscribe();
  }, [user, activeChatId]);

  return null;
}
