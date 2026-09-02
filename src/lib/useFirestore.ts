import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  collection, getDocs, getDoc, query, where, doc,
  addDoc, updateDoc, deleteDoc, serverTimestamp,
  limit as fsLimit, orderBy, collectionGroup,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// ── Safe field formatter (handles GeoPoint, objects, etc.) ──
export const fmt = (val: any): string => {
  if (val === null || val === undefined) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  if (val._lat !== undefined && val._long !== undefined) {
    return `${val._lat.toFixed(4)}, ${val._long.toFixed(4)}`;
  }
  return String(val);
};

// ── Cache config per collection ──
const CACHE = {
  businesses: { staleTime: 5 * 60 * 1000, gcTime: 30 * 60 * 1000 },   // 5 min fresh, 30 min GC
  marketplace: { staleTime: 3 * 60 * 1000, gcTime: 15 * 60 * 1000 },  // 3 min fresh, 15 min GC
  house_listings: { staleTime: 5 * 60 * 1000, gcTime: 30 * 60 * 1000 },
  properties: { staleTime: 5 * 60 * 1000, gcTime: 30 * 60 * 1000 },
  reviews: { staleTime: 2 * 60 * 1000, gcTime: 10 * 60 * 1000 },
  users: { staleTime: 10 * 60 * 1000, gcTime: 60 * 60 * 1000 },
};

// ────────────────────────────────────────────
// GENERIC HOOKS
// ────────────────────────────────────────────

/** Fetch all docs from a collection (optionally filtered) */
export function useCollection<T = any>(
  collectionName: string,
  filters?: ReturnType<typeof where>[],
  maxLimit?: number,
) {
  const cfg = (CACHE as any)[collectionName] || { staleTime: 5 * 60_000, gcTime: 30 * 60_000 };
  return useQuery({
    queryKey: [collectionName, filters?.map(f => `${f.field}${f.op}${f.value}`).join("|"), maxLimit],
    queryFn: async () => {
      let q: any = collection(db, collectionName);
      if (filters?.length) {
        q = query(q, ...filters);
      }
      if (maxLimit) {
        q = query(q, fsLimit(maxLimit));
      }
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as T[];
    },
    staleTime: cfg.staleTime,
    gcTime: cfg.gcTime,
  });
}

/** Fetch a single doc by ID */
export function useDoc<T = any>(collectionName: string, docId: string | null) {
  const cfg = (CACHE as any)[collectionName] || { staleTime: 5 * 60_000, gcTime: 30 * 60_000 };
  return useQuery({
    queryKey: [collectionName, docId],
    queryFn: async () => {
      const snap = await getDoc(doc(db, collectionName, docId!));
      if (!snap.exists()) return null;
      return { id: snap.id, ...snap.data() } as T;
    },
    enabled: !!docId,
    staleTime: cfg.staleTime,
    gcTime: cfg.gcTime,
  });
}

// ────────────────────────────────────────────
// COLLECTION-SPECIFIC HOOKS
// ────────────────────────────────────────────

export function useMarketplaceItems() {
  return useQuery({
    queryKey: ["marketplace_all"],
    queryFn: async () => {
      try {
        const [topSnap, groupSnap] = await Promise.all([
          getDocs(collection(db, "marketplace")),
          getDocs(collectionGroup(db, "products")),
        ]);
        const map = new Map<string, any>();
        topSnap.docs.forEach((d) => map.set(d.id, { id: d.id, ...d.data() }));
        groupSnap.docs.forEach((d) => map.set(d.id, { id: d.id, ...d.data() }));
        return Array.from(map.values());
      } catch {
        const topSnap = await getDocs(collection(db, "marketplace"));
        return topSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      }
    },
    staleTime: 3 * 60 * 1000,
    gcTime: 15 * 60 * 1000,
  });
}

export function useBusinesses(state?: string) {
  const filters = state ? [where("state", "==", state)] : undefined;
  return useCollection("businesses", filters);
}

export function useEvents() {
  return useQuery({
    queryKey: ["events_all"],
    queryFn: async () => {
      try {
        const [topSnap, groupSnap] = await Promise.all([
          getDocs(collection(db, "events")),
          getDocs(collectionGroup(db, "events")),
        ]);
        const map = new Map<string, any>();
        topSnap.docs.forEach((d) => map.set(d.id, { id: d.id, ...d.data() }));
        groupSnap.docs.forEach((d) => map.set(d.id, { id: d.id, ...d.data() }));
        return Array.from(map.values());
      } catch {
        const topSnap = await getDocs(collection(db, "events"));
        return topSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export function useHouseListings() {
  return useQuery({
    queryKey: ["house_listings_and_properties"],
    queryFn: async () => {
      try {
        const [topSnap, groupSnap] = await Promise.all([
          getDocs(collection(db, "house_listings")),
          getDocs(collectionGroup(db, "properties")),
        ]);
        const map = new Map<string, any>();
        topSnap.docs.forEach((d) => map.set(d.id, { id: d.id, ...d.data() }));
        groupSnap.docs.forEach((d) => map.set(d.id, { id: d.id, ...d.data() }));
        return Array.from(map.values());
      } catch {
        const topSnap = await getDocs(collection(db, "house_listings"));
        return topSnap.docs.map((d) => ({ id: d.id, ...d.data() }));
      }
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

export const useProperties = useHouseListings;

export function usePropertyBookings(ownerId: string | null) {
  return useQuery({
    queryKey: ["property_bookings", ownerId],
    queryFn: async () => {
      if (!ownerId) return [];
      const q = query(collection(db, "property_bookings"), where("ownerId", "==", ownerId));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    },
    enabled: !!ownerId,
  });
}

/** Fetch bookings made by the current user (guest). */
export function useMyPropertyBookings(userId: string | null) {
  return useQuery({
    queryKey: ["my_property_bookings", userId],
    queryFn: async () => {
      if (!userId) return [];
      const q = query(collection(db, "property_bookings"), where("payerId", "==", userId));
      const snap = await getDocs(q);
      return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    },
    enabled: !!userId,
  });
}

/** Fetch products, properties, events and menu items belonging to a specific business */
export function useBusinessChildren(businessId: string | null) {
  return useQuery({
    queryKey: ["businessChildren", businessId],
    queryFn: async () => {
      if (!businessId) return { products: [], properties: [], menu: [], events: [] };
      try {
        const [prodSnap, propSnap, subPropSnap, subProdSnap, menuSnap, eventSnap] = await Promise.all([
          getDocs(query(collection(db, "marketplace"), where("businessId", "==", businessId))),
          getDocs(query(collection(db, "house_listings"), where("businessId", "==", businessId))),
          getDocs(collection(db, "businesses", businessId, "properties")),
          getDocs(collection(db, "businesses", businessId, "products")),
          getDocs(collection(db, "businesses", businessId, "menu")),
          getDocs(collection(db, "businesses", businessId, "events")),
        ]);

        const prodMap = new Map<string, any>();
        prodSnap.docs.forEach((d) => prodMap.set(d.id, { id: d.id, ...d.data() }));
        subProdSnap.docs.forEach((d) => prodMap.set(d.id, { id: d.id, ...d.data() }));

        const propMap = new Map<string, any>();
        propSnap.docs.forEach((d) => propMap.set(d.id, { id: d.id, ...d.data() }));
        subPropSnap.docs.forEach((d) => propMap.set(d.id, { id: d.id, ...d.data() }));

        return {
          products: Array.from(prodMap.values()),
          properties: Array.from(propMap.values()),
          menu: menuSnap.docs.map((d) => ({ id: d.id, ...d.data() } as any)),
          events: eventSnap.docs.map((d) => ({ id: d.id, ...d.data() } as any)),
        };
      } catch (error) {
        console.error("[useBusinessChildren] Error:", error);
        return { products: [], properties: [], menu: [], events: [] };
      }
    },
    enabled: !!businessId,
    staleTime: 2 * 60_000,
    gcTime: 10 * 60_000,
  });
}

/** Fetch all products and properties for multiple businesses (for DetailPage) */
export function useBusinessesProducts(businessIds: string[]) {
  return useQuery({
    queryKey: ["businessesProducts", businessIds.sort().join(",")],
    queryFn: async () => {
      if (businessIds.length === 0) return { products: [], properties: [] };
      try {
        const [prodSnap, propSnap] = await Promise.all([
          getDocs(query(collection(db, "marketplace"), where("businessId", "in", businessIds))),
          getDocs(query(collection(db, "house_listings"), where("businessId", "in", businessIds))),
        ]);
        return {
          products: prodSnap.docs.map((d) => ({ id: d.id, ...d.data() } as any)),
          properties: propSnap.docs.map((d) => ({ id: d.id, ...d.data() } as any)),
        };
      } catch (error) {
        console.error("[useBusinessesProducts] Error:", error);
        return { products: [], properties: [] };
      }
    },
    enabled: businessIds.length > 0,
    staleTime: 3 * 60_000,
    gcTime: 15 * 60_000,
  });
}

export function useMyListings(userId: string | null) {
  return useQuery({
    queryKey: ["myListings", userId],
    queryFn: async () => {
      if (!userId) return { businesses: [], products: [], properties: [], events: [] };
      
      try {
        const [bizSnap, prodTopSnap, propTopSnap, eventTopSnap, propGroupSnap, prodGroupSnap, eventGroupSnap] = await Promise.all([
          getDocs(query(collection(db, "businesses"), where("ownerId", "==", userId))),
          getDocs(query(collection(db, "marketplace"), where("ownerId", "==", userId))).catch(() => ({ docs: [] })),
          getDocs(query(collection(db, "house_listings"), where("ownerId", "==", userId))).catch(() => ({ docs: [] })),
          getDocs(query(collection(db, "events"), where("ownerId", "==", userId))).catch(() => ({ docs: [] })),
          getDocs(collectionGroup(db, "properties")).catch(() => ({ docs: [] })),
          getDocs(collectionGroup(db, "products")).catch(() => ({ docs: [] })),
          getDocs(collectionGroup(db, "events")).catch(() => ({ docs: [] })),
        ]);

        const userBizIds = new Set(bizSnap.docs.map((d) => d.id));

        // Deduplicate properties
        const propMap = new Map<string, any>();
        propTopSnap.docs.forEach((d: any) => propMap.set(d.id, { id: d.id, ...d.data() }));
        propGroupSnap.docs.forEach((d: any) => {
          const data = d.data();
          if (data.ownerId === userId || (data.businessId && userBizIds.has(data.businessId))) {
            propMap.set(d.id, { id: d.id, ...data });
          }
        });

        // Deduplicate products
        const prodMap = new Map<string, any>();
        prodTopSnap.docs.forEach((d: any) => prodMap.set(d.id, { id: d.id, ...d.data() }));
        prodGroupSnap.docs.forEach((d: any) => {
          const data = d.data();
          if (data.ownerId === userId || (data.businessId && userBizIds.has(data.businessId))) {
            prodMap.set(d.id, { id: d.id, ...data });
          }
        });

        // Deduplicate events
        const eventMap = new Map<string, any>();
        eventTopSnap.docs.forEach((d: any) => eventMap.set(d.id, { id: d.id, ...d.data() }));
        eventGroupSnap.docs.forEach((d: any) => {
          const data = d.data();
          if (data.ownerId === userId || (data.businessId && userBizIds.has(data.businessId))) {
            eventMap.set(d.id, { id: d.id, ...data });
          }
        });
        
        return {
          businesses: bizSnap.docs.map((d) => ({ id: d.id, ...d.data() } as any)).filter((b: any) => b.category !== "Event" && b.category !== "Events"),
          events: Array.from(eventMap.values()),
          products: Array.from(prodMap.values()),
          properties: Array.from(propMap.values()),
        };
      } catch (error) {
        console.error("[useMyListings] Error:", error);
        throw error;
      }
    },
    enabled: !!userId,
    staleTime: 2 * 60_000,
    gcTime: 10 * 60_000,
  });
}

export function useReviews(targetId: string | null) {
  return useCollection(
    "reviews",
    targetId ? [where("targetId", "==", targetId)] : undefined,
  );
}

/** Fetch all ticket orders for a specific event */
export function useTicketOrders(eventId: string | null) {
  return useCollection(
    "ticket_orders",
    eventId ? [where("eventId", "==", eventId)] : undefined,
  );
}

/** Fetch all ticket orders for a user's events (as organizer) */
export function useMyEventOrders(userId: string | null, eventIds: string[]) {
  return useQuery({
    queryKey: ["myEventOrders", userId, eventIds.sort().join(",")],
    queryFn: async () => {
      if (!userId || eventIds.length === 0) return [];
      const snap = await getDocs(
        query(collection(db, "ticket_orders"), where("eventId", "in", eventIds))
      );
      return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];
    },
    enabled: !!userId && eventIds.length > 0,
    staleTime: 0,
    gcTime: 5 * 60_000,
  });
}

/** Fetch all ticket orders for a user (as buyer) */
export function useMyTicketOrders(userId: string | null) {
  return useQuery({
    queryKey: ["myTicketOrders", userId],
    queryFn: async () => {
      if (!userId) return [];
      const snap = await getDocs(
        query(collection(db, "ticket_orders"), where("buyerId", "==", userId))
      );
      return snap.docs.map((d) => ({ id: d.id, ...d.data() })) as any[];
    },
    enabled: !!userId,
    staleTime: 1 * 60_000,
    gcTime: 5 * 60_000,
  });
}

/** Fetch events a user has tickets for */
export function useMyAttendedEvents(userId: string | null, eventIds: string[]) {
  return useQuery({
    queryKey: ["myAttendedEvents", userId, eventIds.sort().join(",")],
    queryFn: async () => {
      if (!userId || eventIds.length === 0) return [];
      const snap = await getDocs(
        query(collection(db, "businesses"), where("category", "==", "Event"))
      );
      // Filter in-memory since we need to match eventIds from orders
      return snap.docs
        .map((d) => ({ id: d.id, ...d.data() } as any))
        .filter((e) => eventIds.includes(e.id));
    },
    enabled: !!userId && eventIds.length > 0,
    staleTime: 2 * 60_000,
    gcTime: 10 * 60_000,
  });
}

// ────────────────────────────────────────────
// MUTATIONS (with cache invalidation)
// ────────────────────────────────────────────

export function useCreateDoc(collectionName: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      return addDoc(collection(db, collectionName), {
        ...data,
        createdAt: serverTimestamp(),
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [collectionName] });
      qc.invalidateQueries({ queryKey: ["myListings"] });
    },
  });
}

export function useUpdateDoc(collectionName: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return updateDoc(doc(db, collectionName, id), data);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [collectionName] });
      qc.invalidateQueries({ queryKey: ["myListings"] });
    },
  });
}

export function useDeleteDoc(collectionName: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      return deleteDoc(doc(db, collectionName, id));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: [collectionName] });
      qc.invalidateQueries({ queryKey: ["myListings"] });
    },
  });
}

export function useCreateReview() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: any) => {
      return addDoc(collection(db, "reviews"), {
        ...data,
        createdAt: serverTimestamp(),
      });
    },
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({ queryKey: ["reviews", variables.targetId] });
    },
  });
}
