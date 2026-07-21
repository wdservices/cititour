import { useCallback, useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { fmt } from './fmt';

export type ExploreListing = {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  rating?: number;
  location?: string;
  price?: string;
  kind: 'business' | 'event' | 'marketplace' | 'property';
};

function mapBusiness(b: Record<string, unknown> & { id: string }): ExploreListing {
  return {
    id: b.id,
    title: fmt(b.title) || fmt(b.name),
    description: fmt(b.description),
    image: fmt(b.image) || (Array.isArray(b.images) && b.images[0] ? fmt(b.images[0]) : ''),
    category: fmt(b.category),
    rating: typeof b.rating === 'number' ? b.rating : Number(b.rating) || 0,
    location: fmt(b.location) || fmt(b.city),
    price: fmt(b.price),
    kind: 'business',
  };
}

export function useExploreData() {
  const [loading, setLoading] = useState(true);
  const [businesses, setBusinesses] = useState<ExploreListing[]>([]);
  const [events, setEvents] = useState<ExploreListing[]>([]);
  const [marketplace, setMarketplace] = useState<ExploreListing[]>([]);
  const [properties, setProperties] = useState<ExploreListing[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [bizSnap, mktSnap, propSnap] = await Promise.all([
        getDocs(collection(db, 'businesses')),
        getDocs(collection(db, 'marketplace')),
        getDocs(collection(db, 'house_listings')),
      ]);

      const allBiz = bizSnap.docs.map((d) => mapBusiness({ id: d.id, ...d.data() }));
      setBusinesses(
        allBiz.filter((b) => b.category !== 'Event' && b.category !== 'Events'),
      );
      setEvents(
        allBiz
          .filter((b) => b.category === 'Event' || b.category === 'Events')
          .map((b) => ({ ...b, kind: 'event' as const })),
      );
      setMarketplace(
        mktSnap.docs.map((d) => ({
          ...mapBusiness({ id: d.id, ...d.data() }),
          kind: 'marketplace' as const,
        })),
      );
      setProperties(
        propSnap.docs.map((d) => ({
          ...mapBusiness({ id: d.id, ...d.data() }),
          kind: 'property' as const,
          category: fmt(d.data().category) || 'Property',
        })),
      );
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load listings');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { loading, error, businesses, events, marketplace, properties, refresh: load };
}

/** Rotate a window of items so hidden listings surface over time */
export function rotateListingWindow<T>(items: T[], count: number, tick: number, offset = 0): T[] {
  if (items.length === 0) return [];
  if (items.length <= count) return items;
  const start = (tick + offset) % items.length;
  const out: T[] = [];
  for (let i = 0; i < count; i += 1) {
    out.push(items[(start + i) % items.length]);
  }
  return out;
}

export function filterListings(items: ExploreListing[], query: string): ExploreListing[] {
  const q = query.trim().toLowerCase();
  if (!q) return items;
  return items.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      (item.location?.toLowerCase().includes(q) ?? false),
  );
}
