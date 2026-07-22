import { useCallback, useEffect, useState, useRef } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { dataCache, cacheKey } from './cache';
import { fmt } from './fmt';

export interface BusinessDetailData {
  id: string;
  name: string;
  category: string;
  description: string;
  city: string;
  state: string;
  phone: string;
  rating: number;
  reviewCount: number;
  avgRating: number | null;
  images: string[];
  amenities: string[];
  priceFrom?: number;
  ownerId?: string;
}

export function useBusinessDetail(businessId: string | undefined) {
  const key = businessId ? cacheKey('business', businessId) : '';
  const cached = key ? dataCache.get<BusinessDetailData>(key) : null;

  const [loading, setLoading] = useState(!cached);
  const [business, setBusiness] = useState<BusinessDetailData | null>(cached || null);
  const fetched = useRef(!!cached);

  const load = useCallback(async () => {
    if (!businessId) return;
    if (dataCache.has(key)) {
      setBusiness(dataCache.get<BusinessDetailData>(key)!);
      setLoading(false);
      fetched.current = true;
      return;
    }

    setLoading(true);
    try {
      let snap = await getDoc(doc(db, 'businesses', businessId));
      if (!snap.exists()) {
        snap = await getDoc(doc(db, 'events', businessId));
      }

      if (!snap.exists()) {
        setBusiness(null);
        setLoading(false);
        return;
      }

      const d = snap.data();
      const name = d.name || d.title || '';
      const category = d.category || 'Business';
      const description = d.description || '';
      const city = d.city || '';
      const state = d.state || '';
      const phone = d.phone || '';
      const rating = d.rating || 0;
      const reviewCount = d.reviewCount || 0;
      const images = d.images || [];
      const amenities = d.amenities || [];
      const priceFrom = d.priceFrom;
      const ownerId = d.ownerId || d.userId || d.uid || '';

      // Fetch reviews
      let avgRat: number | null = null;
      let revCount = 0;
      try {
        const revQuery = query(collection(db, 'reviews'), where('targetId', '==', businessId));
        const revSnap = await getDocs(revQuery);
        const revs = revSnap.docs.map((rd) => rd.data());
        revCount = revs.length;
        if (revs.length > 0) {
          avgRat = revs.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / revs.length;
        }
      } catch {}

      const result: BusinessDetailData = {
        id: snap.id,
        name,
        category,
        description,
        city,
        state,
        phone,
        rating,
        reviewCount,
        avgRating: avgRat,
        images,
        amenities,
        priceFrom,
        ownerId,
      };

      dataCache.set(key, result, 10 * 60 * 1000); // 10 min cache
      setBusiness(result);
      fetched.current = true;
    } catch {
      setBusiness(null);
    } finally {
      setLoading(false);
    }
  }, [businessId, key]);

  useEffect(() => {
    if (!fetched.current && businessId) load();
  }, [businessId, load]);

  const refresh = useCallback(() => {
    dataCache.invalidate(key);
    fetched.current = false;
    load();
  }, [key, load]);

  return { loading, business, refresh };
}
