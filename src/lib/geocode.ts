const LOCATIONIQ_API_KEY = import.meta.env.VITE_LOCATIONIQ_API_KEY;

export interface GeocodeResult {
  lat: number;
  lon: number;
  displayName: string;
}

export const REGION_COORDINATES: Record<string, [number, number]> = {
  RIV: [4.8156, 7.0498], // Port Harcourt, Rivers
  LAG: [6.5244, 3.3792], // Lagos
  ABJ: [9.0765, 7.3986], // Abuja FCT
  KAN: [12.0022, 8.5920], // Kano
  OWR: [5.4836, 7.0333], // Owerri, Imo
  KAD: [10.5105, 7.4165], // Kaduna
};

export const STATE_TO_COORDINATES: Record<string, [number, number]> = {
  Rivers: [4.8156, 7.0498],
  Lagos: [6.5244, 3.3792],
  FCT: [9.0765, 7.3986],
  Abuja: [9.0765, 7.3986],
  Kano: [12.0022, 8.5920],
  Imo: [5.4836, 7.0333],
  Kaduna: [10.5105, 7.4165],
  Oyo: [7.3775, 3.9470],
  Delta: [5.5442, 5.7603],
  Edo: [6.3350, 5.6037],
  Enugu: [6.4584, 7.5464],
  Anambra: [6.2209, 7.0679],
  AkwaIbom: [5.0377, 7.9128],
  CrossRiver: [4.9757, 8.3417],
  Ogun: [7.1475, 3.3619],
};

export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  if (!address || !address.trim()) return null;
  const cleanAddress = address.trim();

  // 1. Try LocationIQ if API key is provided
  if (LOCATIONIQ_API_KEY) {
    try {
      const url = `https://us1.locationiq.com/v1/search?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(
        cleanAddress
      )}&format=json&countrycodes=ng&limit=1`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          return {
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon),
            displayName: data[0].display_name,
          };
        }
      }
    } catch {
      // Fall through to OpenStreetMap
    }
  }

  // 2. Fallback to OpenStreetMap Nominatim
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      cleanAddress
    )}&format=json&countrycodes=ng&limit=1`;
    const response = await fetch(url, {
      headers: {
        'Accept-Language': 'en',
      },
    });
    if (response.ok) {
      const data = await response.json();
      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lon: parseFloat(data[0].lon),
          displayName: data[0].display_name,
        };
      }
    }
  } catch (err) {
    console.warn('Geocoding error:', err);
  }

  return null;
}

export async function reverseGeocode(lat: number, lon: number): Promise<string | null> {
  if (typeof lat !== 'number' || typeof lon !== 'number') return null;

  // 1. Try LocationIQ if key is present
  if (LOCATIONIQ_API_KEY) {
    try {
      const url = `https://us1.locationiq.com/v1/reverse?key=${LOCATIONIQ_API_KEY}&lat=${lat}&lon=${lon}&format=json`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data && data.display_name) {
          return cleanDisplayName(data.display_name, data.address);
        }
      }
    } catch {
      // Fall through
    }
  }

  // 2. OpenStreetMap Nominatim reverse geocoding
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=18&addressdetails=1`;
    const response = await fetch(url, {
      headers: {
        'Accept-Language': 'en',
      },
    });
    if (response.ok) {
      const data = await response.json();
      if (data && (data.display_name || data.address)) {
        return cleanDisplayName(data.display_name, data.address);
      }
    }
  } catch (err) {
    console.warn('Reverse geocoding error:', err);
  }

  return null;
}

function cleanDisplayName(rawName: string, addrObj?: Record<string, string>): string {
  if (addrObj) {
    const parts = [
      addrObj.amenity || addrObj.building || addrObj.house_number ? `${addrObj.house_number || ''} ${addrObj.road || ''}`.trim() : addrObj.road,
      addrObj.neighbourhood || addrObj.suburb || addrObj.residential,
      addrObj.city || addrObj.town || addrObj.county || addrObj.state_district,
      addrObj.state,
      'Nigeria',
    ].filter(Boolean);
    const uniqueParts = Array.from(new Set(parts.map(p => p?.trim()).filter(Boolean)));
    if (uniqueParts.length >= 2) {
      return uniqueParts.join(', ');
    }
  }
  return rawName || '';
}

