import {
  collection, doc, getDocs, addDoc, updateDoc, query, where,
  onSnapshot, serverTimestamp, increment,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderRole: 'customer' | 'business';
  text: string;
  read: boolean;
  createdAt: any;
}

export interface ChatThread {
  id: string;
  businessId: string;
  customerId: string;
  businessName: string;
  customerName: string;
  lastMessage: string;
  lastMessageAt: any;
  unreadCustomer: number;
  unreadBusiness: number;
  createdAt: any;
}

/**
 * Finds or creates a chat thread between a customer and a business.
 * Returns the chat document ID.
 */
export async function ensureChatExists(
  businessId: string,
  customerId: string,
  businessName: string,
  customerName: string,
): Promise<string> {
  const safeBusinessId = businessId || '';
  const safeCustomerId = customerId || '';
  const safeBusinessName = businessName || 'Business';
  const safeCustomerName = customerName || 'Customer';

  const q = query(
    collection(db, 'chats'),
    where('businessId', '==', safeBusinessId),
    where('customerId', '==', safeCustomerId),
  );
  const snap = await getDocs(q);

  if (!snap.empty) {
    return snap.docs[0].id;
  }

  const docRef = await addDoc(collection(db, 'chats'), {
    businessId: safeBusinessId,
    customerId: safeCustomerId,
    businessName: safeBusinessName,
    customerName: safeCustomerName,
    lastMessage: '',
    lastMessageAt: serverTimestamp(),
    unreadCustomer: 0,
    unreadBusiness: 0,
    createdAt: serverTimestamp(),
  });

  return docRef.id;
}

/**
 * Sends a message in an existing chat thread.
 */
export async function sendMessage(
  chatId: string,
  senderId: string,
  senderRole: 'customer' | 'business',
  text: string,
): Promise<void> {
  await addDoc(collection(db, 'chats', chatId, 'messages'), {
    chatId,
    senderId,
    senderRole,
    text,
    read: false,
    createdAt: serverTimestamp(),
  });

  const chatRef = doc(db, 'chats', chatId);
  const unreadField = senderRole === 'customer' ? 'unreadBusiness' : 'unreadCustomer';
  await updateDoc(chatRef, {
    lastMessage: text,
    lastMessageAt: serverTimestamp(),
    [unreadField]: increment(1),
  });
}

/**
 * Marks messages from the other party as read.
 */
export async function markMessagesRead(
  chatId: string,
  readerRole: 'customer' | 'business',
): Promise<void> {
  const unreadField = readerRole === 'customer' ? 'unreadBusiness' : 'unreadCustomer';
  await updateDoc(doc(db, 'chats', chatId), {
    [unreadField]: 0,
  });
}

/**
 * Real-time listener for messages in a chat thread, ordered by creation time.
 * Returns the unsubscribe function.
 */
export function listenToMessages(
  chatId: string,
  callback: (messages: ChatMessage[]) => void,
): () => void {
  const q = query(
    collection(db, 'chats', chatId, 'messages'),
  );

  return onSnapshot(q, (snap) => {
    const msgs = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as ChatMessage[];
    msgs.sort((a, b) => {
      const tA = a.createdAt?.toMillis?.() ?? 0;
      const tB = b.createdAt?.toMillis?.() ?? 0;
      return tA - tB;
    });
    callback(msgs);
  });
}

/**
 * Fetches all chat threads for a given business (for the owner's inbox).
 */
export async function fetchBusinessChats(businessId: string): Promise<ChatThread[]> {
  const q = query(
    collection(db, 'chats'),
    where('businessId', '==', businessId),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as ChatThread[];
}

/**
 * Fetches all chat threads for a given customer (their conversations).
 */
export async function fetchCustomerChats(customerId: string): Promise<ChatThread[]> {
  const q = query(
    collection(db, 'chats'),
    where('customerId', '==', customerId),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as ChatThread[];
}
