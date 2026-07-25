import {
  doc, getDoc, setDoc, collection, addDoc, query, orderBy,
  onSnapshot, serverTimestamp, updateDoc, increment,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface ChatMessage {
  id: string;
  senderId: string;
  senderRole: 'customer' | 'business';
  senderName?: string;
  senderPhoto?: string;
  text: string;
  createdAt: any;
  read: boolean;
}

export function getChatId(businessId: string, customerId: string) {
  return `${businessId}_${customerId}`;
}

export async function ensureChatExists(
  businessId: string,
  customerId: string,
  businessName: string,
  customerName: string
): Promise<string> {
  const chatId = getChatId(businessId, customerId);
  const chatRef = doc(db, 'chats', chatId);
  const existing = await getDoc(chatRef);

  if (!existing.exists()) {
    await setDoc(chatRef, {
      businessId,
      customerId,
      businessName,
      customerName,
      lastMessage: '',
      lastMessageAt: serverTimestamp(),
      lastMessageSenderId: '',
      unreadByBusiness: 0,
      unreadByCustomer: 0,
      createdAt: serverTimestamp(),
    });
  }
  return chatId;
}

export async function sendMessage(
  chatId: string,
  senderId: string,
  senderRole: 'customer' | 'business',
  text: string,
  senderName?: string,
  senderPhoto?: string,
) {
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  await addDoc(messagesRef, {
    senderId, senderRole, senderName: senderName || '', senderPhoto: senderPhoto || '',
    text, createdAt: serverTimestamp(), read: false,
  });

  const chatRef = doc(db, 'chats', chatId);
  const unreadField = senderRole === 'customer' ? 'unreadByBusiness' : 'unreadByCustomer';
  await updateDoc(chatRef, {
    lastMessage: text,
    lastMessageAt: serverTimestamp(),
    lastMessageSenderId: senderId,
    [unreadField]: increment(1),
  });
}

export async function markThreadRead(chatId: string, viewerRole: 'customer' | 'business') {
  const chatRef = doc(db, 'chats', chatId);
  const unreadField = viewerRole === 'customer' ? 'unreadByCustomer' : 'unreadByBusiness';
  await updateDoc(chatRef, { [unreadField]: 0 });
}

export function listenToMessages(chatId: string, callback: (messages: ChatMessage[]) => void) {
  const messagesRef = collection(db, 'chats', chatId, 'messages');
  const q = query(messagesRef, orderBy('createdAt', 'asc'));
  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map((d) => ({ id: d.id, ...d.data() } as ChatMessage)));
  });
}
