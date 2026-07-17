import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Popup } from 'react-leaflet';
import { geocodeAddress } from '@/lib/geocode';
import { Check } from 'lucide-react';

interface AddressPickerProps {
  onLocationConfirmed?: (data: { address: string; lat: number; lon: number }) => void;
  initialLat?: number;
  initialLon?: number;
  initialAddress?: string;
  readOnly?: boolean;
}

const DEFAULT_CENTER: [number, number] = [6.5244, 3.3792];

function DraggableMarker({ position, onDrag }: { position: [number, number]; onDrag: (lat: number, lon: number) => void }) {
  useMapEvents({
    click(e) {
      onDrag(e.latlng.lat, e.latlng.lng);
    },
  });
  return (
    <Marker
      position={position}
      draggable
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const pos = marker.getLatLng();
          onDrag(pos.lat, pos.lng);
        },
      }}
    />
  );
}

export function AddressPicker({ onLocationConfirmed, initialLat, initialLon, initialAddress, readOnly }: AddressPickerProps) {
  const [address, setAddress] = useState(initialAddress || '');
  const [position, setPosition] = useState<[number, number]>(
    initialLat && initialLon ? [initialLat, initialLon] : DEFAULT_CENTER
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const handleGeocode = async () => {
    if (!address.trim()) return;
    setLoading(true);
    setError(null);
    const result = await geocodeAddress(address);
    setLoading(false);

    if (!result) {
      setError("Couldn't find that address — try adding more detail, or drop the pin manually on the map below.");
      return;
    }

    setPosition([result.lat, result.lon]);
    setConfirmed(true);
  };

  const handleManualMove = (lat: number, lon: number) => {
    setPosition([lat, lon]);
    setConfirmed(true);
  };

  const handleConfirm = () => {
    onLocationConfirmed?.({ address, lat: position[0], lon: position[1] });
  };

  if (readOnly) {
    return (
      <div className="rounded-xl overflow-hidden border border-sand-200" style={{ height: 250 }}>
        <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={position}>
            <Popup>{initialAddress || 'Location'}</Popup>
          </Marker>
        </MapContainer>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onBlur={handleGeocode}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleGeocode(); } }}
          placeholder="e.g. 14 Marina Road, Lagos Island, Lagos"
          className="flex-1 rounded-xl border border-sand-200 bg-background px-3 py-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
        <button
          type="button"
          onClick={handleGeocode}
          disabled={loading}
          className="rounded-xl bg-primary text-primary-foreground px-4 py-2.5 text-sm font-medium hover:opacity-90 disabled:opacity-60"
        >
          {loading ? 'Searching...' : 'Find'}
        </button>
      </div>

      {error && <p className="text-xs text-destructive">{error}</p>}

      <p className="text-xs text-muted-foreground">
        Not quite right? Click or drag the pin on the map to adjust the exact location.
      </p>

      <div className="rounded-xl overflow-hidden border border-sand-200" style={{ height: 300, position: 'relative', zIndex: 0 }}>
        <MapContainer center={position} zoom={15} style={{ height: '100%', width: '100%' }} scrollWheelZoom={false}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <DraggableMarker position={position} onDrag={handleManualMove} />
        </MapContainer>
      </div>

      {confirmed ? (
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full rounded-xl bg-success text-white py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <Check className="w-4 h-4" /> Location Confirmed
        </button>
      ) : (
        <button
          type="button"
          onClick={handleConfirm}
          className="w-full rounded-xl bg-primary text-primary-foreground py-2.5 text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          Confirm This Location
        </button>
      )}
    </div>
  );
}
