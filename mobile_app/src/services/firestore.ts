// Firestore API services for mobile app
import { db } from './firebase';
import {
  collection,
  getDocs,
  getDoc,
  query,
  where,
  limit as fsLimit,
  orderBy,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  documentId,
} from 'firebase/firestore';

// Types
export interface Business {
  id: string;
  title: string;
  description: string;
  category: string;
  image?: string;
  location?: string;
  state?: string;
  city?: string;
  streetAddress?: string;
  phone?: string;
  website?: string;
  rating?: number;
  reviews?: number;
  isOpen?: boolean;
  isFeatured?: boolean;
  ownerId: string;
  createdAt: any;
  tags?: string[];
}

export interface Event {
  id: string;
  title: string;
  description: string;
  image?: string;
  location?: string;
  state?: string;
  city?: string;
  venue?: string;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  ticketTypes: TicketTier[];
  isActive: boolean;
  ownerId: string;
  tags?: string[];
  createdAt: any;
}

export interface TicketTier {
  name: string;
  price: number;
  quantity: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  image?: string;
  price: number;
  promoPrice?: number;
  location?: string;
  state?: string;
  city?: string;
  rating?: number;
  reviews?: number;
  ownerId: string;
  createdAt: any;
}

export interface Property {
  id: string;
  title: string;
  description: string;
  type: string;
  image?: string;
  images?: string[];
  price: number;
  location?: string;
  state?: string;
  city?: string;
  streetAddress?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  ownerId: string;
  createdAt: any;
}

export interface TicketOrder {
  id: string;
  eventId: string;
  eventTitle: string;
  ownerId: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone?: string;
  ticketTier: string;
  quantity: number;
  amount: number;
  totalAmount: number;
  paymentMethod: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'refunded';
  createdAt: any;
}

// Safe field formatter
export const fmt = (val: any): string => {
  if (val === null || val === undefined) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'number') return String(val);
  if (val._lat !== undefined && val._long !== undefined) {
    return `${val._lat.toFixed(4)}, ${val._long.toFixed(4)}`;
  }
  return String(val);
};

// Cache config per collection
const CACHE = {
  businesses: { staleTime: 5 * 60 * 1000, gcTime: 30 * 60 * 1000 },
  marketplace: { staleTime: 3 * 60 * 1000, gcTime: 15 * 60 * 1000 },
  house_listings: { staleTime: 5 * 60 * 1000, gcTime: 30 * 60 * 1000 },
  events: { staleTime: 5 * 60 * 1000, gcTime: 30 * 60 * 1000 },
  reviews: { staleTime: 2 * 60 * 1000, gcTime: 10 * 60 * 1000 },
  users: { staleTime: 10 * 60 * 1000, gcTime: 60 * 60 * 1000 },
};

// Generic collection fetch
export async function fetchCollection<T = any>(
  collectionName: string,
  filters?: { field: string; operator: any; value: any }[],
  maxLimit?: number
) {
  let q: any = collection(db, collectionName);
  if (filters?.length) {
    const constraints = filters.map(f => where(f.field, f.operator, f.value));
    q = query(q, ...constraints);
  }
  if (maxLimit) q = query(q, fsLimit(maxLimit));
  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() || {}) })) as T[];
}

export async function fetchBusinesses(state?: string) {
  const filters = state ? [{ field: 'state', operator: '==', value: state }] : undefined;
  return fetchCollection('businesses', filters);
}

export async function fetchEvents() {
  return fetchCollection('events');
}

export async function fetchMarketplaceItems() {
  return fetchCollection('marketplace');
}

export async function fetchHouseListings() {
  return fetchCollection('house_listings');
}

export async function fetchMyListings(userId: string) {
  const [bizSnap, prodSnap, propSnap, eventSnap] = await Promise.all([
    getDocs(query(collection(db, 'businesses'), where('ownerId', '==', userId))),
    getDocs(query(collection(db, 'marketplace'), where('ownerId', '==', userId))),
    getDocs(query(collection(db, 'house_listings'), where('ownerId', '==', userId))),
    getDocs(query(collection(db, 'events'), where('ownerId', '==', userId))),
  ]);

  return {
    businesses: bizSnap.docs.map(d => ({ id: d.id, ...d.data() })),
    products: prodSnap.docs.map(d => ({ id: d.id, ...d.data() })),
    properties: propSnap.docs.map(d => ({ id: d.id, ...d.data() })),
    events: eventSnap.docs.map(d => ({ id: d.id, ...d.data() })),
  };
}

export async function fetchMyEventOrders(userId: string, eventIds: string[]) {
  if (!userId || eventIds.length === 0) return [];
  const snap = await getDocs(
    query(collection(db, 'ticket_orders'), where('eventId', 'in', eventIds))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function fetchMyTicketOrders(userId: string) {
  if (!userId) return [];
  const snap = await getDocs(
    query(collection(db, 'ticket_orders'), where('buyerId', '==', userId))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function fetchAttendedEvents(userId: string, eventIds: string[]) {
  if (!userId || eventIds.length === 0) return [];
  const snap = await getDocs(query(collection(db, 'events'), where(documentId(), 'in', eventIds)));
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function fetchReviews(targetId: string) {
  const snap = await getDocs(
    query(collection(db, 'reviews'), where('targetId', '==', targetId), orderBy('createdAt', 'desc'))
  );
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function createDoc(collectionName: string, data: any) {
  return addDoc(collection(db, collectionName), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function updateDocById(collectionName: string, id: string, data: any) {
  return updateDoc(doc(db, collectionName, id), data);
}

export async function deleteDocById(collectionName: string, id: string) {
  return deleteDoc(doc(db, collectionName, id));
}

export async function createReview(data: any) {
  return addDoc(collection(db, 'reviews'), {
    ...data,
    createdAt: serverTimestamp(),
  });
}

export async function createTicketOrder(data: any) {
  return addDoc(collection(db, 'ticket_orders'), {
    ...data,
    createdAt: serverTimestamp(),
  });
}