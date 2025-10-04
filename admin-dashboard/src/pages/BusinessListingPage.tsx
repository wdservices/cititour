import React, { useState, useMemo } from 'react'
import { 
  Search, 
  Filter, 
  Eye, 
  Edit, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  TrendingUp,
  Users,
  DollarSign,
  Building,
  Image,
  Shield
} from 'lucide-react'
import { BusinessListing } from '../types'
import { formatCurrency, formatDate, formatRelativeTime } from '../utils'

// Mock data for business listings
const mockBusinessListings: BusinessListing[] = [
  {
    id: '1',
    name: 'Paradise Beach Resort',
    category: 'hotel',
    owner: 'Maria Santos',
    email: 'maria@paradiseresort.com',
    phone: '+63 917 123 4567',
    address: 'Boracay Island, Aklan',
    description: 'Luxury beachfront resort with world-class amenities and stunning ocean views.',
    status: 'approved',
    rating: 4.8,
    reviews: 245,
    images: ['resort1.jpg', 'resort2.jpg', 'resort3.jpg'],
    amenities: ['Pool', 'Spa', 'Restaurant', 'Beach Access', 'WiFi'],
    priceRange: '₱8,000 - ₱15,000',
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-20T10:30:00Z',
    isVerified: true,
    totalBookings: 156,
    revenue: 2340000
  },
  {
    id: '2',
    name: 'Authentic Filipino Cuisine',
    category: 'restaurant',
    owner: 'Juan Dela Cruz',
    email: 'juan@filipinocuisine.com',
    phone: '+63 918 234 5678',
    address: 'Makati City, Metro Manila',
    description: 'Traditional Filipino dishes with a modern twist in the heart of the city.',
    status: 'pending',
    rating: 4.5,
    reviews: 89,
    images: ['restaurant1.jpg', 'restaurant2.jpg'],
    amenities: ['Air Conditioning', 'WiFi', 'Parking', 'Delivery'],
    priceRange: '₱500 - ₱1,500',
    createdAt: '2024-01-18T14:20:00Z',
    updatedAt: '2024-01-18T14:20:00Z',
    isVerified: false,
    totalBookings: 45,
    revenue: 67500
  },
  {
    id: '3',
    name: 'Chocolate Hills Adventure',
    category: 'attraction',
    owner: 'Carmen Rodriguez',
    email: 'carmen@chocolatehills.com',
    phone: '+63 919 345 6789',
    address: 'Bohol Province',
    description: 'Guided tours to the famous Chocolate Hills with adventure activities.',
    status: 'approved',
    rating: 4.7,
    reviews: 178,
    images: ['hills1.jpg', 'hills2.jpg', 'hills3.jpg', 'hills4.jpg'],
    amenities: ['Tour Guide', 'Transportation', 'Safety Equipment', 'Refreshments'],
    priceRange: '₱1,200 - ₱3,500',
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-22T16:45:00Z',
    isVerified: true,
    totalBookings: 89,
    revenue: 267000
  },
  {
    id: '4',
    name: 'Cozy Mountain Cabin',
    category: 'airbnb',
    owner: 'Roberto Kim',
    email: 'roberto@mountaincabin.com',
    phone: '+63 920 456 7890',
    address: 'Baguio City, Benguet',
    description: 'Peaceful mountain retreat perfect for couples and small families.',
    status: 'rejected',
    rating: 4.2,
    reviews: 34,
    images: ['cabin1.jpg', 'cabin2.jpg'],
    amenities: ['Fireplace', 'Kitchen', 'WiFi', 'Mountain View'],
    priceRange: '₱3,000 - ₱5,000',
    createdAt: '2024-01-20T11:30:00Z',
    updatedAt: '2024-01-21T09:15:00Z',
    isVerified: false,
    totalBookings: 12,
    revenue: 36000
  },
  {
    id: '5',
    name: 'SM Mall of Asia',
    category: 'shopping',
    owner: 'SM Investments',
    email: 'admin@smmoa.com',
    phone: '+63 921 567 8901',
    address: 'Pasay City, Metro Manila',
    description: 'One of the largest shopping malls in the Philippines with entertainment and dining.',
    status: 'suspended',
    rating: 4.6,
    reviews: 892,
    images: ['mall1.jpg', 'mall2.jpg', 'mall3.jpg'],
    amenities: ['Parking', 'Cinema', 'Food Court', 'ATM', 'WiFi'],
    priceRange: 'Varies',
    createdAt: '2024-01-05T07:00:00Z',
    updatedAt: '2024-01-23T13:20:00Z',
    isVerified: true,
    totalBookings: 234,
    revenue: 468000
  }
]

const BusinessListingPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [selectedListing, setSelectedListing] = useState<BusinessListing | null>(null)
  const [showModal, setShowModal] = useState(false)

  // Filter listings based on search and filters
  const filteredListings = useMemo(() => {
    return mockBusinessListings.filter(listing => {
      const matchesSearch = listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           listing.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           listing.address.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesCategory = categoryFilter === 'all' || listing.category === categoryFilter
      const matchesStatus = statusFilter === 'all' || listing.status === statusFilter
      
      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [searchTerm, categoryFilter, statusFilter])

  // Calculate statistics
  const stats = useMemo(() => {
    const total = mockBusinessListings.length
    const approved = mockBusinessListings.filter(l => l.status === 'approved').length
    const pending = mockBusinessListings.filter(l => l.status === 'pending').length
    const totalRevenue = mockBusinessListings.reduce((sum, l) => sum + l.revenue, 0)
    
    return { total, approved, pending, totalRevenue }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100'
      case 'pending': return 'text-yellow-600 bg-yellow-100'
      case 'rejected': return 'text-red-600 bg-red-100'
      case 'suspended': return 'text-gray-600 bg-gray-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />
      case 'pending': return <Clock className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      case 'suspended': return <AlertTriangle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'hotel': return <Building className="w-4 h-4" />
      case 'restaurant': return <Users className="w-4 h-4" />
      case 'attraction': return <MapPin className="w-4 h-4" />
      case 'airbnb': return <Building className="w-4 h-4" />
      case 'shopping': return <Building className="w-4 h-4" />
      default: return <Building className="w-4 h-4" />
    }
  }

  const handleStatusChange = (listingId: string, newStatus: string) => {
    // In a real app, this would make an API call
    console.log(`Changing status of listing ${listingId} to ${newStatus}`)
  }

  const handleViewDetails = (listing: BusinessListing) => {
    setSelectedListing(listing)
    setShowModal(true)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Business Listings</h1>
          <p className="text-gray-600">Manage and review business listings on the platform</p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Listings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Building className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Review</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <DollarSign className="w-8 h-8 text-blue-600" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, owner, or location..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="flex gap-4">
            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="hotel">Hotels</option>
              <option value="restaurant">Restaurants</option>
              <option value="attraction">Attractions</option>
              <option value="airbnb">Airbnb</option>
              <option value="shopping">Shopping</option>
              <option value="lifestyle">Lifestyle</option>
              <option value="fun_place">Fun Places</option>
            </select>

            <select
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Owner
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Rating
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredListings.map((listing) => (
                <tr key={listing.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 w-10 h-10">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Image className="w-5 h-5 text-gray-500" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 flex items-center">
                          {listing.name}
                          {listing.isVerified && (
                            <Shield className="w-4 h-4 text-blue-500 ml-2" />
                          )}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {listing.address}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getCategoryIcon(listing.category)}
                      <span className="ml-2 text-sm text-gray-900 capitalize">
                        {listing.category.replace('_', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{listing.owner}</div>
                    <div className="text-sm text-gray-500">{listing.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(listing.status)}`}>
                      {getStatusIcon(listing.status)}
                      <span className="ml-1 capitalize">{listing.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="ml-1 text-sm text-gray-900">{listing.rating}</span>
                      <span className="ml-1 text-sm text-gray-500">({listing.reviews})</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatCurrency(listing.revenue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(listing.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleViewDetails(listing)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="text-green-600 hover:text-green-900">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && selectedListing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                    {selectedListing.name}
                    {selectedListing.isVerified && (
                      <Shield className="w-5 h-5 text-blue-500 ml-2" />
                    )}
                  </h2>
                  <p className="text-gray-600 capitalize">{selectedListing.category.replace('_', ' ')}</p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Business Information</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Users className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">Owner:</span>
                        <span className="ml-2 text-gray-900">{selectedListing.owner}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Mail className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">Email:</span>
                        <span className="ml-2 text-gray-900">{selectedListing.email}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <Phone className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">Phone:</span>
                        <span className="ml-2 text-gray-900">{selectedListing.phone}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                        <span className="text-gray-600">Address:</span>
                        <span className="ml-2 text-gray-900">{selectedListing.address}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance</h3>
                    <div className="space-y-2">
                      <div className="flex items-center text-sm">
                        <Star className="w-4 h-4 text-yellow-400 mr-2" />
                        <span className="text-gray-600">Rating:</span>
                        <span className="ml-2 text-gray-900">{selectedListing.rating}/5 ({selectedListing.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-2" />
                        <span className="text-gray-600">Total Bookings:</span>
                        <span className="ml-2 text-gray-900">{selectedListing.totalBookings}</span>
                      </div>
                      <div className="flex items-center text-sm">
                        <DollarSign className="w-4 h-4 text-blue-500 mr-2" />
                        <span className="text-gray-600">Revenue:</span>
                        <span className="ml-2 text-gray-900">{formatCurrency(selectedListing.revenue)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600 text-sm">{selectedListing.description}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedListing.amenities.map((amenity, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Price Range</h3>
                    <p className="text-gray-900 font-medium">{selectedListing.priceRange}</p>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Status</h3>
                    <div className="flex items-center space-x-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedListing.status)}`}>
                        {getStatusIcon(selectedListing.status)}
                        <span className="ml-1 capitalize">{selectedListing.status}</span>
                      </span>
                      
                      {selectedListing.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleStatusChange(selectedListing.id, 'approved')}
                            className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStatusChange(selectedListing.id, 'rejected')}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Created: {formatDate(selectedListing.createdAt)}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Updated: {formatRelativeTime(selectedListing.updatedAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BusinessListingPage