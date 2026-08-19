import {
  collection, collectionGroup, onSnapshot, query, orderBy,
  addDoc, serverTimestamp, doc, updateDoc, deleteDoc, Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  createdAt?: any;
  lastSeenAt?: any;
}

export interface AdminBusiness {
  id: string;
  title: string;
  category: string;
  state?: string;
  city?: string;
  location?: string;
  ownerId?: string;
  organizerId?: string;
  image?: string;
  imageUrl?: string;
  isActive?: boolean;
  isOpen?: boolean;
  createdAt?: any;
  [key: string]: any;
}

export interface AdminMarketplaceItem {
  id: string;
  title: string;
  category: string;
  state?: string;
  city?: string;
  price?: string;
  ownerId?: string;
  createdAt?: any;
}

// ── Users ──────────────────────────────────────────────────────────────

export function listenUsers(callback: (users: AdminUser[]) => void): Unsubscribe {
  const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as AdminUser)));
  });
}

// ── Businesses (hotels, restaurants, business services, AND events) ────

export function listenAllBusinesses(callback: (items: AdminBusiness[]) => void): Unsubscribe {
  const q = query(collection(db, 'businesses'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as AdminBusiness)));
  });
}

export function splitBusinessesAndEvents(items: AdminBusiness[]) {
  const events = items.filter((i) => i.category === 'Event');
  const businesses = items.filter((i) => i.category !== 'Event');
  return { events, businesses };
}

export function groupByState(items: AdminBusiness[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const item of items) {
    const key = item.state || 'Unspecified';
    counts[key] = (counts[key] || 0) + 1;
  }
  return counts;
}

export async function createBusinessListing(data: Record<string, any>, adminUserId: string) {
  return addDoc(collection(db, 'businesses'), {
    ...data,
    ownerId: data.ownerId || adminUserId,
    rating: data.rating ?? 0,
    isOpen: data.isOpen ?? true,
    createdAt: serverTimestamp(),
    createdByAdmin: true,
  });
}

export async function updateBusinessListing(id: string, data: Record<string, any>) {
  return updateDoc(doc(db, 'businesses', id), data);
}

export async function deleteBusinessListing(id: string) {
  return deleteDoc(doc(db, 'businesses', id));
}

// ── Marketplace ──────────────────────────────────────────────────────────

export function listenMarketplaceItems(callback: (items: AdminMarketplaceItem[]) => void): Unsubscribe {
  const q = query(collection(db, 'marketplace'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as AdminMarketplaceItem)));
  });
}

export async function createMarketplaceProduct(data: Record<string, any>, adminUserId: string) {
  return addDoc(collection(db, 'marketplace'), {
    ...data,
    ownerId: data.ownerId || adminUserId,
    sellerType: data.sellerType || 'business',
    rating: data.rating ?? 0,
    condition: data.condition || 'new',
    createdAt: serverTimestamp(),
    createdByAdmin: true,
  });
}

// ── House / Airbnb listings ──────────────────────────────────────────────

export function listenHouseListings(callback: (items: any[]) => void): Unsubscribe {
  return onSnapshot(collection(db, 'house_listings'), (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
}

export async function createHouseListing(data: Record<string, any>, adminUserId: string) {
  return addDoc(collection(db, 'house_listings'), {
    ...data,
    ownerId: data.ownerId || adminUserId,
    rating: data.rating ?? 0,
    status: data.status ?? 'Active',
    bedrooms: data.bedrooms ?? 0,
    bathrooms: data.bathrooms ?? 0,
    createdAt: serverTimestamp(),
    createdByAdmin: true,
  });
}

export async function updateHouseListing(id: string, data: Record<string, any>) {
  return updateDoc(doc(db, 'house_listings', id), data);
}

export async function deleteHouseListing(id: string) {
  return deleteDoc(doc(db, 'house_listings', id));
}

// ── Revenue ────────────────────────────────────────────────────────────

export interface TicketRecord {
  id: string;
  eventId: string;
  price: number;
  sold: number;
  commission: number;
  ticketType?: string;
}

export function listenAllTickets(callback: (tickets: TicketRecord[]) => void): Unsubscribe {
  const q = collectionGroup(db, 'tickets');
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as TicketRecord)));
  });
}

export function computeTicketRevenue(tickets: TicketRecord[]) {
  let grossFromSales = 0;
  let platformCommission = 0;
  for (const t of tickets) {
    const sold = t.sold || 0;
    grossFromSales += sold * (t.price || 0);
    platformCommission += sold * (t.commission || 0);
  }
  return { grossFromSales, platformCommission };
}

// ── Wallet activity ────────────────────────────────────────────────────

export interface WalletTransaction {
  id: string;
  userId: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  method?: string;
  status?: string;
  referenceNumber?: string;
  createdAt?: any;
}

export function listenAllWalletTransactions(callback: (transactions: WalletTransaction[]) => void): Unsubscribe {
  const q = query(collectionGroup(db, 'transactions'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as WalletTransaction)));
  });
}

export function computeWalletStats(transactions: WalletTransaction[]) {
  let totalFunded = 0;
  let totalSpentOrWithdrawn = 0;
  let totalWithdrawn = 0;
  for (const t of transactions) {
    if (t.type === 'credit') {
      totalFunded += t.amount || 0;
    } else if (t.type === 'debit') {
      totalSpentOrWithdrawn += t.amount || 0;
      if (t.description === 'Wallet Withdrawal') totalWithdrawn += t.amount || 0;
    }
  }
  return { totalFunded, totalSpentOrWithdrawn, totalWithdrawn };
}
