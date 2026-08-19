import { useState } from 'react'
import { Plus, Search, Filter, Edit, Trash2, Eye, CheckCircle, XCircle, Upload } from 'lucide-react'

interface Ad {
  id: string
  title: string
  business: string
  category: string
  location: string
  status: 'pending' | 'approved' | 'rejected' | 'expired'
  createdDate: string
  expiryDate: string
  views: number
  clicks: number
  revenue: number
  imageUrl: string
}

const mockAds: Ad[] = [
  {
    id: '1',
    title: 'Eko Atlantic Beach Resort - Summer Special',
    business: 'Eko Atlantic Beach Resort',
    category: 'Hotels',
    location: 'Lagos, Nigeria',
    status: 'approved',
    createdDate: '2024-01-15',
    expiryDate: '2024-06-15',
    views: 15420,
    clicks: 892,
    revenue: 2500,
    imageUrl: '/api/placeholder/300/200'
  },
  {
    id: '2',
    title: 'Local Food Tour Experience',
    business: 'Lagos Food Tours',
    category: 'Tours',
    location: 'Lagos, Nigeria',
    status: 'pending',
    createdDate: '2024-03-20',
    expiryDate: '2024-09-20',
    views: 0,
    clicks: 0,
    revenue: 0,
    imageUrl: '/api/placeholder/300/200'
  },
  {
    id: '3',
    title: 'Mountain Adventure Package',
    business: 'Abuja Adventures',
    category: 'Tours',
    location: 'Abuja, Nigeria',
    status: 'approved',
    createdDate: '2024-02-10',
    expiryDate: '2024-08-10',
    views: 8930,
    clicks: 445,
    revenue: 1800,
    imageUrl: '/api/placeholder/300/200'
  },
  {
    id: '4',
    title: 'Luxury Car Rental Service',
    business: 'Elite Car Rentals',
    category: 'Transport',
    location: 'Port Harcourt, Nigeria',
    status: 'rejected',
    createdDate: '2024-03-01',
    expiryDate: '2024-09-01',
    views: 120,
    clicks: 5,
    revenue: 0,
    imageUrl: '/api/placeholder/300/200'
  }
]

export default function AdminAdsPage() {
  const [ads] = useState<Ad[]>(mockAds)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'expired'>('all')
  const [showUploadModal, setShowUploadModal] = useState(false)

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.business.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || ad.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'expired': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl md:text-4xl font-extrabold text-ink">Ads Management</h1>
        <button onClick={() => setShowUploadModal(true)} className="btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" /> Upload New Ad
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Ads</p>
              <p className="text-2xl font-bold text-gray-900">{ads.length}</p>
            </div>
            <Eye className="h-8 w-8 text-blue-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600">{ads.filter(a => a.status === 'pending').length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-yellow-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Ads</p>
              <p className="text-2xl font-bold text-green-600">{ads.filter(a => a.status === 'approved').length}</p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
        </div>
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-purple-600">₦{ads.reduce((sum, ad) => sum + ad.revenue, 0).toLocaleString()}</p>
            </div>
            <Eye className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input type="text" placeholder="Search ads..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="input pl-10 w-full" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="input">
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAds.map((ad) => (
          <div key={ad.id} className="card overflow-hidden">
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-gray-900">{ad.title}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ad.status)}`}>{ad.status}</span>
              </div>
              <p className="text-sm text-gray-600">{ad.business}</p>
              <p className="text-sm text-gray-500 mb-3">{ad.location}</p>
              <div className="grid grid-cols-3 gap-2 text-center text-xs text-gray-500">
                <div><p className="font-medium text-gray-900">{ad.views.toLocaleString()}</p><p>Views</p></div>
                <div><p className="font-medium text-gray-900">{ad.clicks.toLocaleString()}</p><p>Clicks</p></div>
                <div><p className="font-medium text-gray-900">₦{ad.revenue.toLocaleString()}</p><p>Revenue</p></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Upload New Ad</h3>
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Ad Title</label><input type="text" className="input w-full" placeholder="Enter ad title" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label><input type="text" className="input w-full" placeholder="Enter business name" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-2">Ad Image</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowUploadModal(false)} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
              <button className="flex-1 btn-primary">Upload Ad</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
