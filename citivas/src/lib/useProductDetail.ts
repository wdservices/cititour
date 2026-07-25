import { useCallback, useEffect, useState, useRef } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { dataCache, cacheKey } from './cache';
import { fmt } from './fmt';

export interface ParentBusiness {
  id: string;
  title: string;
  image: string;
  location: string;
}

export interface ProductDetailData {
  parentBusiness: ParentBusiness | null;
  avgRating: number | null;
  reviewCount: number;
}

export function useProductDetail(productId: string | undefined, businessId: string | undefined) {
  const key = productId ? cacheKey('product', productId) : '';
  const cached = key ? dataCache.get<ProductDetailData>(key) : null;

  const [loading, setLoading] = useState(!cached);
  const [data, setData] = useState<ProductDetailData>(cached || { parentBusiness: null, avgRating: null, reviewCount: 0 });
  const fetched = useRef(!!cached);

  const load = useCallback(async () => {
    if (!productId) return;
    if (dataCache.has(key)) {
      setData(dataCache.get<ProductDetailData>(key)!);
      setLoading(false);
      fetched.current = true;
      return;
    }

    setLoading(true);
    try {
      // Fetch parent business
      let parentBiz: ParentBusiness | null = null;
      if (businessId) {
        try {
          const bizSnap = await getDoc(doc(db, 'businesses', businessId));
          if (bizSnap.exists()) {
            const bd = bizSnap.data() as any;
            parentBiz = {
              id: bizSnap.id,
              title: bd.title || bd.name || 'Business',
              image: bd.image || (Array.isArray(bd.images) ? bd.images[0] : '') || '',
              location: bd.location || bd.city || '',
            };
          }
        } catch {}
      }

      // Fetch reviews
      let avgRat: number | null = null;
      let revCount = 0;
      try {
        const revQuery = query(collection(db, 'reviews'), where('targetId', '==', productId));
        const revSnap = await getDocs(revQuery);
        const revs = revSnap.docs.map((rd) => rd.data());
        revCount = revs.length;
        if (revs.length > 0) {
          avgRat = revs.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / revs.length;
        }
      } catch {}

      const result: ProductDetailData = { parentBusiness: parentBiz, avgRating: avgRat, reviewCount: revCount };
      dataCache.set(key, result, 10 * 60 * 1000);
      setData(result);
      fetched.current = true;
    } catch {
      setData({ parentBusiness: null, avgRating: null, reviewCount: 0 });
    } finally {
      setLoading(false);
    }
  }, [productId, businessId, key]);

  useEffect(() => {
    if (!fetched.current && productId) load();
  }, [productId, load]);

  const refresh = useCallback(() => {
    dataCache.invalidate(key);
    fetched.current = false;
    load();
  }, [key, load]);

  return { loading, ...data, refresh };
}
