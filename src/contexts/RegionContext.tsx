import React, { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { REGION_COORDINATES, reverseGeocode } from '@/lib/geocode'

type RegionCode = 'LAG' | 'RIV' | 'ABJ' | 'KAN' | 'OWR' | 'KAD'

interface UserCoords {
  lat: number
  lon: number
}

interface RegionContextType {
  region: RegionCode
  brandName: string
  locationName: string
  state: string
  userCoords: UserCoords | null
  userAddress: string | null
  isLocating: boolean
  setRegion: (code: RegionCode) => void
  detectRegion: () => Promise<UserCoords | null>
}

const RegionContext = createContext<RegionContextType | undefined>(undefined)

const DEFAULT_REGION: RegionCode = 'RIV'

export function RegionProvider({ children }: { children: React.ReactNode }) {
  const [region, setRegion] = useState<RegionCode>(DEFAULT_REGION)
  const [userCoords, setUserCoords] = useState<UserCoords | null>(() => {
    try {
      const saved = localStorage.getItem('app_user_coords')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })
  const [userAddress, setUserAddress] = useState<string | null>(() => {
    return localStorage.getItem('app_user_address') || null
  })
  const [isLocating, setIsLocating] = useState<boolean>(false)

  const brandName = useMemo(() => {
    switch (region) {
      case 'LAG':
        return 'TourLAG'
      case 'ABJ':
        return 'TourABJ'
      case 'KAN':
        return 'TourKAN'
      case 'OWR':
        return 'TourOWR'
      case 'KAD':
        return 'TourKAD'
      case 'RIV':
      default:
        return 'TourRIV'
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
      case 'OWR':
        return 'Owerri'
      case 'KAD':
        return 'Kaduna'
      case 'RIV':
      default:
        return 'Port Harcourt'
    }
  }, [region])

  const state = useMemo(() => {
    switch (region) {
      case 'LAG': return 'Lagos'
      case 'ABJ': return 'FCT'
      case 'KAN': return 'Kano'
      case 'OWR': return 'Imo'
      case 'KAD': return 'Kaduna'
      case 'RIV':
      default: return 'Rivers'
    }
  }, [region])

  // Geolocation detection; records coordinates, detects region & performs reverse geocoding
  const detectRegion = async (): Promise<UserCoords | null> => {
    if (!('geolocation' in navigator)) return null
    setIsLocating(true)

    return new Promise<UserCoords | null>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          const { latitude, longitude } = pos.coords
          const coords: UserCoords = { lat: latitude, lon: longitude }
          setUserCoords(coords)
          try {
            localStorage.setItem('app_user_coords', JSON.stringify(coords))
          } catch {
            // Ignore
          }

          // Heuristic region mapping
          let detectedReg: RegionCode = 'RIV'
          if (latitude > 11.5 && longitude > 7.5 && longitude < 9.5) {
            detectedReg = 'KAN'
          } else if (latitude > 10.0 && longitude > 6.5 && longitude < 8.5) {
            detectedReg = 'KAD'
          } else if (latitude > 8.0 && longitude > 6.5) {
            detectedReg = 'ABJ'
          } else if (latitude > 5.0 && latitude <= 6.0 && longitude > 6.5 && longitude < 7.5) {
            detectedReg = 'OWR'
          } else if (latitude > 6.0 && longitude > 3.0 && longitude < 4.5) {
            detectedReg = 'LAG'
          } else {
            detectedReg = 'RIV'
          }

          setRegion(detectedReg)

          // Reverse geocode to get a clean address string
          try {
            const addr = await reverseGeocode(latitude, longitude)
            if (addr) {
              setUserAddress(addr)
              localStorage.setItem('app_user_address', addr)
            }
          } catch (e) {
            console.warn('Reverse geocode error:', e)
          }

          setIsLocating(false)
          resolve(coords)
        },
        (err) => {
          console.warn('Geolocation denied or failed:', err.message)
          setIsLocating(false)
          resolve(null)
        },
        { enableHighAccuracy: true, timeout: 8000 }
      )
    })
  }

  useEffect(() => {
    // Initialize from localStorage
    const stored = localStorage.getItem('app_region') as RegionCode | null
    if (stored) {
      setRegion(stored)
    }
    // Automatically trigger detectRegion if user hasn't stored coordinates or to refresh
    detectRegion()
  }, [])

  useEffect(() => {
    localStorage.setItem('app_region', region)
  }, [region])

  const value: RegionContextType = {
    region,
    brandName,
    locationName,
    state,
    userCoords: userCoords || (REGION_COORDINATES[region] ? { lat: REGION_COORDINATES[region][0], lon: REGION_COORDINATES[region][1] } : null),
    userAddress,
    isLocating,
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
