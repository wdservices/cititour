import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type RegionCode = 'LAG' | 'RIV' | 'ABJ' | 'KAN' | 'OWR' | 'KAD';

interface RegionContextType {
  region: RegionCode;
  brandName: string;
  locationName: string;
  state: string;
  setRegion: (code: RegionCode) => void;
  detectRegion: () => Promise<void>;
}

const RegionContext = createContext<RegionContextType | undefined>(undefined);

const DEFAULT_REGION: RegionCode = 'RIV';

interface RegionProviderProps {
  children: ReactNode;
}

export function RegionProvider({ children }: RegionProviderProps) {
  const [region, setRegionState] = useState<RegionCode>(DEFAULT_REGION);

  const brandName = useMemo(() => {
    switch (region) {
      case 'LAG': return 'TourLAG';
      case 'ABJ': return 'TourABJ';
      case 'KAN': return 'TourKAN';
      case 'OWR': return 'TourOWR';
      case 'KAD': return 'TourKAD';
      case 'RIV':
      default: return 'TourRIV';
    }
  }, [region]);

  const locationName = useMemo(() => {
    switch (region) {
      case 'LAG': return 'Lagos';
      case 'ABJ': return 'Abuja';
      case 'KAN': return 'Kano';
      case 'OWR': return 'Owerri';
      case 'KAD': return 'Kaduna';
      case 'RIV':
      default: return 'Port Harcourt';
    }
  }, [region]);

  const state = useMemo(() => {
    switch (region) {
      case 'LAG': return 'Lagos';
      case 'ABJ': return 'FCT';
      case 'KAN': return 'Kano';
      case 'OWR': return 'Imo';
      case 'KAD': return 'Kaduna';
      case 'RIV':
      default: return 'Rivers';
    }
  }, [region]);

  const detectRegion = async () => {
    try {
      if (!('geolocation' in navigator)) return;
      await new Promise<void>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords;
            if (latitude > 11.5 && longitude > 7.5 && longitude < 9.5) setRegionState('KAN');
            else if (latitude > 10.0 && longitude > 6.5 && longitude < 8.5) setRegionState('KAD');
            else if (latitude > 8.0 && longitude > 6.5) setRegionState('ABJ');
            else if (latitude > 5.0 && latitude <= 6.0 && longitude > 6.5 && longitude < 7.5) setRegionState('OWR');
            else if (latitude > 6.0 && longitude > 3.0 && longitude < 4.5) setRegionState('LAG');
            else setRegionState('RIV');
            resolve();
          },
          () => resolve(),
          { enableHighAccuracy: false, timeout: 3000 }
        );
      });
    } catch {
      // Ignore detection errors
    }
  };

  const setRegion = (code: RegionCode) => {
    setRegionState(code);
    AsyncStorage.setItem('app_region', code);
  };

  useEffect(() => {
    const loadRegion = async () => {
      try {
        const stored = await AsyncStorage.getItem('app_region') as RegionCode | null;
        if (stored) {
          setRegionState(stored);
        } else {
          detectRegion();
        }
      } catch {
        detectRegion();
      }
    };
    loadRegion();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('app_region', region);
  }, [region]);

  return (
    <RegionContext.Provider value={{ region, brandName, locationName, state, setRegion, detectRegion }}>
      {children}
    </RegionContext.Provider>
  );
}

export function useRegion() {
  const context = useContext(RegionContext);
  if (!context) {
    throw new Error('useRegion must be used within a RegionProvider');
  }
  return context;
}