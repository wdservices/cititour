const LOCATIONIQ_API_KEY = import.meta.env.VITE_LOCATIONIQ_API_KEY;

export interface GeocodeResult {
  lat: number;
  lon: number;
  displayName: string;
}

export async function geocodeAddress(address: string): Promise<GeocodeResult | null> {
  if (!LOCATIONIQ_API_KEY) {
    console.warn('VITE_LOCATIONIQ_API_KEY not set — geocoding disabled');
    return null;
  }
  const url = `https://us1.locationiq.com/v1/search?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(
    address
  )}&format=json&countrycodes=ng&limit=1`;

  const response = await fetch(url);
  if (!response.ok) return null;

  const data = await response.json();
  if (!data.length) return null;

  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
    displayName: data[0].display_name,
  };
}
