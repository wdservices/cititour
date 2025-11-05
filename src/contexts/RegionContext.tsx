import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'

type RegionCode = 'PH' | 'LAG' | 'ABJ' | 'KAN'

interface RegionContextType {
  region: RegionCode
  brandName: string
  locationName: string
  setRegion: (code: RegionCode) => void
  detectRegion: () => Promise<void>
}

const RegionContext = createContext<RegionContextType | undefined>(undefined)

const DEFAULT_REGION: RegionCode = 'PH'

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [region, setRegion] = useState<RegionCode>(DEFAULT_REGION)

  const brandName = useMemo(() => {
    switch (region) {
      case 'LAG':
        return 'TourLAG'
      case 'ABJ':
        return 'TourABJ'
      case 'KAN':
        return 'TourKAN'
      case 'PH':
      default:
        return 'TourPH'
    }
  }, [region])

  const locationName = useMemo(() => {
    switch (region) {
      case 'LAG':
        return 'Lagos'
      case 'ABJ':
        return 'Abuja'
      case 'KAN':
        return 'Kano'
      case 'PH':
      default:
        return 'Port Harcourt'
    }
  }, [region])

  // Attempt lightweight geolocation detection; fallback to stored or default
  const detectRegion = async () => {
    try {
      if (!('geolocation' in navigator)) return
      await new Promise<void>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const { latitude, longitude } = pos.coords
            // Simple heuristic mapping; replace with reverse geocoding for production
            // Lagos approx: 6.5244, 3.3792 | Abuja approx: 9.0765, 7.3986 | Port Harcourt approx: 4.8156, 7.0498
            // Kano approx: 12.0022, 8.5920
            if (latitude > 11 && longitude > 7.5 && longitude < 9.5) {
              setRegion('KAN')
            } else if (latitude > 8.5 && longitude > 7.0) {
              setRegion('ABJ')
            } else if (latitude > 6.0 && longitude > 3.0 && longitude < 4.5) {
              setRegion('LAG')
            } else {
              setRegion('PH')
            }
            resolve()
          },
          () => resolve(),
          { enableHighAccuracy: false, timeout: 3000 }
        )
      })
    } catch {
      // Ignore detection errors
    }
  }

  useEffect(() => {
    // Initialize from localStorage
    const stored = localStorage.getItem('app_region') as RegionCode | null
    if (stored) {
      setRegion(stored)
    } else {
      detectRegion()
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('app_region', region)
  }, [region])

  const value: RegionContextType = {
    region,
    brandName,
    locationName,
    setRegion,
    detectRegion,
  }

  return <RegionContext.Provider value={value}>{children}</RegionContext.Provider>
}

export function useRegion() {
  const ctx = useContext(RegionContext)
  if (!ctx) throw new Error('useRegion must be used within a RegionProvider')
  return ctx
}