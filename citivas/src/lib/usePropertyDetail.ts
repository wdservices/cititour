import { useCallback, useEffect, useState, useRef } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebase';
import { dataCache, cacheKey } from './cache';

export interface RoomCategory {
  name: string;
  bedType: string;
  bathrooms: number;
  maxOccupancy: number;
  quantity: number;
  pricePerNight: number;
  minNights: number;
  deposit: number;
  images: string[];
}

export interface PropertyDetailData {
  id: string;
  title: string;
  description: string;
  address: string;
  propertyType: string;
  propertySubType: string;
  location: string;
  state: string;
  city: string;
  image: string;
  images: string[];
  rating: number;
  reviewCount: number;
  checkin: string;
  checkout: string;
  rooms: RoomCategory[];
  amenities: string[];
  phone: string;
  whatsapp: string;
  contactEmail: string;
  priceNum: number;
  ownerId: string;
  miniSiteActive: boolean;
  vatEnabled: boolean;
  vatRate: number;
}

export function usePropertyDetail(propertyId: string | undefined) {
  const key = propertyId ? cacheKey('property', propertyId) : '';
  const cached = key ? dataCache.get<PropertyDetailData>(key) : null;

  const [loading, setLoading] = useState(!cached);
  const [property, setProperty] = useState<PropertyDetailData | null>(cached || null);
  const fetched = useRef(!!cached);

  const load = useCallback(async () => {
    if (!propertyId) return;
    if (dataCache.has(key)) {
      setProperty(dataCache.get<PropertyDetailData>(key)!);
      setLoading(false);
      fetched.current = true;
      return;
    }

    setLoading(true);
    try {
      const snap = await getDoc(doc(db, 'house_listings', propertyId));
      if (!snap.exists()) {
        setProperty(null);
        setLoading(false);
        return;
      }

      const d = snap.data();
      const result: PropertyDetailData = {
        id: snap.id,
        title: d.title || d.name || '',
        description: d.description || '',
        address: d.address || '',
        propertyType: d.propertyType || '',
        propertySubType: d.propertySubType || '',
        location: d.location || d.city || '',
        state: d.state || '',
        city: d.city || '',
        image: d.image || (Array.isArray(d.images) && d.images[0]) || '',
        images: Array.isArray(d.images) ? d.images : [],
        rating: typeof d.rating === 'number' ? d.rating : Number(d.rating) || 0,
        reviewCount: d.reviewCount || 0,
        checkin: d.checkin || '',
        checkout: d.checkout || '',
        rooms: Array.isArray(d.rooms) ? d.rooms : [],
        amenities: Array.isArray(d.amenities) ? d.amenities : [],
        phone: d.phone || '',
        whatsapp: d.whatsapp || '',
        contactEmail: d.contactEmail || '',
        priceNum: typeof d.priceNum === 'number' ? d.priceNum : Number(d.price) || 0,
        ownerId: d.ownerId || d.userId || '',
        miniSiteActive: d.miniSiteActive === true,
        vatEnabled: d.vatEnabled === true,
        vatRate: typeof d.vatRate === 'number' ? d.vatRate : 7.5,
      };

      dataCache.set(key, result, 10 * 60 * 1000);
      setProperty(result);
      fetched.current = true;
    } catch {
      setProperty(null);
    } finally {
      setLoading(false);
    }
  }, [propertyId, key]);

  useEffect(() => {
    if (!fetched.current && propertyId) load();
  }, [propertyId, load]);

  return { loading, property };
}
