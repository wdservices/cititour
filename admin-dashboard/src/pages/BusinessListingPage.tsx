import { useEffect, useMemo, useState, FormEvent } from 'react'
import { Search, Building2, ShoppingBag, X, Trash2 } from 'lucide-react'
import {
  listenAllBusinesses, splitBusinessesAndEvents, createBusinessListing, deleteBusinessListing,
  listenMarketplaceItems, createMarketplaceProduct,
  AdminBusiness, AdminMarketplaceItem,
} from '../lib/adminData'
import { useAuth } from '../contexts/AuthContext'

const BUSINESS_CATEGORIES = ['Hotel', 'Restaurant', 'Business Services', 'Fun Places', 'Other']
const PRODUCT_CATEGORIES = ['Electronics', 'Fashion', 'Home', 'Vehicles', 'Property', 'Other']

export default function BusinessListingPage() {
  const { user } = useAuth()
  const uid = user?.uid || ''
  const [tab, setTab] = useState<'businesses' | 'products'>('businesses')
  const [allItems, setAllItems] = useState<AdminBusiness[]>([])
  const [products, setProducts] = useState<AdminMarketplaceItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showBusinessForm, setShowBusinessForm] = useState(false)
  const [showProductForm, setShowProductForm] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    const unsubBiz = listenAllBusinesses(setAllItems)
    const unsubProducts = listenMarketplaceItems(setProducts)
    return () => { unsubBiz(); unsubProducts() }
  }, [])

  const { businesses } = useMemo(() => splitBusinessesAndEvents(allItems), [allItems])

  const filteredBusinesses = useMemo(
    () => businesses.filter((b) => b.title?.toLowerCase().includes(searchTerm.toLowerCase())),
    [businesses, searchTerm]
  )
  const filteredProducts = useMemo(
    () => products.filter((p) => p.title?.toLowerCase().includes(searchTerm.toLowerCase())),
    [products, searchTerm]
  )

  const handleCreateBusiness = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setIsSaving(true)
    try {
      await createBusinessListing({
        title: form.get('title'),
        category: form.get('category'),
        description: form.get('description'),
        location: form.get('location'),
        state: form.get('state'),
        city: form.get('city'),
        phone: form.get('phone'),
        image: form.get('image') || '',
      }, uid)
      setShowBusinessForm(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCreateProduct = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = new FormData(e.currentTarget)
    setIsSaving(true)
    try {
      await createMarketplaceProduct({
        title: form.get('title'),
        category: form.get('category'),
        price: form.get('price') ? `\u20a6${form.get('price')}` : '',
        state: form.get('state'),
        city: form.get('city'),
        image: form.get('image') || '',
        sellerType: 'business',
      }, uid)
      setShowProductForm(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteBusiness = async (id: string) => {
    if (!confirm('Delete this listing? This cannot be undone.')) return
    await deleteBusinessListing(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-extrabold text-ink">Business Listings</h1>
          <p className="text-sm text-ink/60 mt-1">
            {businesses.length} businesses · {products.length} marketplace products
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowBusinessForm(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-marigold text-ink font-semibold text-sm">
            <Building2 className="h-4 w-4" /> Add Business
          </button>
          <button onClick={() => setShowProductForm(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-ink text-ivory font-semibold text-sm">
            <ShoppingBag className="h-4 w-4" /> Add Product
          </button>
        </div>
      </div>

      <div className="flex gap-2 border-b border-sand-200">
        <button onClick={() => setTab('businesses')} className={`px-4 py-2 text-sm font-semibold ${tab === 'businesses' ? 'border-b-2 border-marigold text-ink' : 'text-ink/50'}`}>
          Businesses ({businesses.length})
        </button>
        <button onClick={() => setTab('products')} className={`px-4 py-2 text-sm font-semibold ${tab === 'products' ? 'border-b-2 border-marigold text-ink' : 'text-ink/50'}`}>
          Products ({products.length})
        </button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-ink/40" />
        <input
          type="text"
          placeholder={`Search ${tab}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-xl border border-sand-200 bg-white text-sm"
        />
      </div>

      {tab === 'businesses' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBusinesses.map((b) => (
            <div key={b.id} className="card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-display font-bold text-ink">{b.title}</p>
                  <p className="text-xs text-ink/50">{b.category}</p>
                  <p className="text-xs text-ink/50 mt-1">{[b.city, b.state].filter(Boolean).join(', ') || b.location}</p>
                </div>
                <button onClick={() => handleDeleteBusiness(b.id)} className="text-coral">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
          {filteredBusinesses.length === 0 && <p className="text-sm text-ink/50 col-span-full py-8 text-center">No businesses found.</p>}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((p) => (
            <div key={p.id} className="card">
              <p className="font-display font-bold text-ink">{p.title}</p>
              <p className="text-xs text-ink/50">{p.category}</p>
              <p className="text-sm font-semibold text-marigold mt-1">{p.price}</p>
              <p className="text-xs text-ink/50">{[p.city, p.state].filter(Boolean).join(', ')}</p>
            </div>
          ))}
          {filteredProducts.length === 0 && <p className="text-sm text-ink/50 col-span-full py-8 text-center">No products found.</p>}
        </div>
      )}

      {/* Create Business modal */}
      {showBusinessForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-bold text-ink">Add Business Listing</h3>
              <button onClick={() => setShowBusinessForm(false)}><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleCreateBusiness} className="space-y-3">
              <input name="title" required placeholder="Business name" className="w-full px-3 py-2 rounded-xl border border-sand-200" />
              <select name="category" required className="w-full px-3 py-2 rounded-xl border border-sand-200">
                {BUSINESS_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <textarea name="description" placeholder="Description" className="w-full px-3 py-2 rounded-xl border border-sand-200" rows={3} />
              <input name="location" placeholder="Full address" className="w-full px-3 py-2 rounded-xl border border-sand-200" />
              <div className="grid grid-cols-2 gap-2">
                <input name="state" placeholder="State" className="w-full px-3 py-2 rounded-xl border border-sand-200" />
                <input name="city" placeholder="City" className="w-full px-3 py-2 rounded-xl border border-sand-200" />
              </div>
              <input name="phone" placeholder="Phone number" className="w-full px-3 py-2 rounded-xl border border-sand-200" />
              <input name="image" placeholder="Image URL" className="w-full px-3 py-2 rounded-xl border border-sand-200" />
              <button type="submit" disabled={isSaving} className="w-full py-2.5 rounded-xl bg-marigold text-ink font-semibold">
                {isSaving ? 'Saving...' : 'Create Listing'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Create Product modal */}
      {showProductForm && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-xl font-bold text-ink">Add Marketplace Product</h3>
              <button onClick={() => setShowProductForm(false)}><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleCreateProduct} className="space-y-3">
              <input name="title" required placeholder="Product name" className="w-full px-3 py-2 rounded-xl border border-sand-200" />
              <select name="category" required className="w-full px-3 py-2 rounded-xl border border-sand-200">
                {PRODUCT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <input name="price" type="number" placeholder="Price (\u20a6)" className="w-full px-3 py-2 rounded-xl border border-sand-200" />
              <div className="grid grid-cols-2 gap-2">
                <input name="state" placeholder="State" className="w-full px-3 py-2 rounded-xl border border-sand-200" />
                <input name="city" placeholder="City" className="w-full px-3 py-2 rounded-xl border border-sand-200" />
              </div>
              <input name="image" placeholder="Image URL" className="w-full px-3 py-2 rounded-xl border border-sand-200" />
              <button type="submit" disabled={isSaving} className="w-full py-2.5 rounded-xl bg-ink text-ivory font-semibold">
                {isSaving ? 'Saving...' : 'Create Product'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
