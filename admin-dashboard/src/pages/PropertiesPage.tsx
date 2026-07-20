import { useEffect, useMemo, useState } from 'react'
import { Home, MapPin, Star, Search } from 'lucide-react'
import { listenHouseListings } from '../lib/adminData'

interface HouseListing {
  id: string
  title: string
  type: string
  location: string
  price: string
  status: string
  rating?: number
  reviews?: number
  image?: string
}

export default function PropertiesPage() {
  const [listings, setListings] = useState<HouseListing[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = listenHouseListings((data) => {
      setListings(data as HouseListing[])
      setLoading(false)
    })
    return unsub
  }, [])

  const filtered = useMemo(
    () => listings.filter((l) => l.title?.toLowerCase().includes(searchTerm.toLowerCase())),
    [listings, searchTerm]
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-ink">Properties</h1>
        <p className="text-sm text-ink/60 mt-1">{listings.length.toLocaleString()} short-let / Airbnb-style listings</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
        <input
          type="text"
          placeholder="Search properties..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-sand-200 bg-white text-sm"
        />
      </div>

      {loading ? (
        <p className="text-sm text-ink/50 py-8 text-center">Loading properties...</p>
      ) : filtered.length === 0 ? (
        <div className="card py-12 text-center">
          <Home className="h-10 w-10 text-ink/20 mx-auto mb-3" />
          <p className="text-sm text-ink/50">
            {listings.length === 0 ? 'No properties listed yet.' : 'No properties match your search.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((listing) => (
            <div key={listing.id} className="card">
              <div
                className="h-32 rounded-xl bg-sand-100 mb-3"
                style={listing.image ? { backgroundImage: `url(${listing.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
              />
              <p className="font-display font-bold text-ink truncate">{listing.title}</p>
              <p className="text-xs text-ink/50">{listing.type}</p>
              <div className="flex items-center gap-1.5 text-xs text-ink/60 mt-1">
                <MapPin className="h-3.5 w-3.5" /> {listing.location}
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-semibold text-marigold">{listing.price}</span>
                <span className="flex items-center gap-1 text-xs text-ink/60">
                  <Star className="h-3.5 w-3.5 fill-marigold text-marigold" /> {listing.rating || 0} ({listing.reviews || 0})
                </span>
              </div>
              <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-semibold ${
                listing.status === 'Approved' ? 'bg-palm/10 text-palm' : 'bg-marigold/10 text-marigold'
              }`}>
                {listing.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
