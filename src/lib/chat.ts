import {
  collection, doc, getDocs, addDoc, updateDoc, query, where,
  onSnapshot, serverTimestamp, increment, getDoc, arrayUnion,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

export interface ChatMessage {
  id: string;
  chatId: string;
  senderId: string;
  senderRole: 'customer' | 'business';
  senderName?: string;
  senderPhoto?: string;
  text: string;
  read: boolean;
  createdAt: any;
}

export interface ChatThread {
  id: string;
  businessId: string;
  customerId: string;
  businessOwnerId: string;
  businessName: string;
  customerName: string;
  participants: string[];
  lastMessage: string;
  lastMessageAt: any;
  unreadCustomer: number;
  unreadBusiness: number;
  createdAt: any;
}

/**
 * Finds or creates a chat thread between a customer and a business owner.
 * Uses a `participants` array [customerId, businessOwnerId] for security rules.
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

  // Fetch the business owner's UID from the business document
  let businessOwnerId = '';
  try {
    const bizDoc = await getDoc(doc(db, 'businesses', safeBusinessId));
    if (bizDoc.exists()) {
      const bizData = bizDoc.data();
      businessOwnerId = bizData.ownerId || bizData.userId || bizData.uid || '';
    }
  } catch (err) {
    console.error('Failed to fetch business owner:', err);
  }

  // Build the participants array — both UIDs for security rule access
  const participants = [safeCustomerId, businessOwnerId].filter(Boolean);

  // Check if a chat already exists between this customer and this business
  const q = query(
    collection(db, 'chats'),
    where('participants', 'array-contains', safeCustomerId),
  );
  const snap = await getDocs(q);

  // Filter client-side for the specific business
  const existing = snap.docs.find((d) => d.data().businessId === safeBusinessId);
  if (existing) {
    return existing.id;
  }

  // Create new chat thread
  const docRef = await addDoc(collection(db, 'chats'), {
    businessId: safeBusinessId,
    customerId: safeCustomerId,
    businessOwnerId,
    businessName: safeBusinessName,
    customerName: safeCustomerName,
    participants,
    lastMessage: '',
    lastMessageAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
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
  senderName?: string,
  senderPhoto?: string,
): Promise<void> {
  await addDoc(collection(db, 'chats', chatId, 'messages'), {
    chatId,
    senderId,
    senderRole,
    senderName: senderName || '',
    senderPhoto: senderPhoto || '',
    text,
    read: false,
    createdAt: serverTimestamp(),
  });

  const chatRef = doc(db, 'chats', chatId);
  const unreadField = senderRole === 'customer' ? 'unreadBusiness' : 'unreadCustomer';
  await updateDoc(chatRef, {
    lastMessage: text,
    lastSenderId: senderId,
    lastMessageAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
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
 * Real-time listener for messages in a chat thread.
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
 * Real-time listener for all chat threads where the given UID is a participant.
 * Used for both business owner inbox and customer inbox.
 * Returns the unsubscribe function.
 */
export function listenToUserChats(
  userId: string,
  callback: (threads: ChatThread[]) => void,
): () => void {
  if (!userId) {
    callback([]);
    return () => {};
  }

  const q = query(
    collection(db, 'chats'),
    where('participants', 'array-contains', userId),
  );

  return onSnapshot(q, (snap) => {
    const threads = snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as ChatThread[];
    threads.sort((a, b) => {
      const tA = a.lastMessageAt?.toMillis?.() ?? 0;
      const tB = b.lastMessageAt?.toMillis?.() ?? 0;
      return tB - tA;
    });
    callback(threads);
  });
}
