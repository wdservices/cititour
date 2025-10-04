export interface User {
  id: string
  name: string
  email: string
  phone: string
  location: string
  status: 'active' | 'inactive' | 'suspended'
  joinDate: string
  lastActive: string
  totalBookings: number
  avatar?: string
}

export interface Ad {
  id: string
  title: string
  business: string
  category: string
  status: 'pending' | 'approved' | 'rejected'
  type: 'banner' | 'featured' | 'sponsored'
  startDate: string
  endDate: string
  budget: number
  clicks: number
  impressions: number
  image: string
}

export interface Content {
  id: string
  title: string
  type: 'article' | 'guide' | 'announcement' | 'promotion'
  category: string
  status: 'draft' | 'published' | 'archived'
  author: string
  createdAt: string
  updatedAt: string
  views: number
}

export interface Complaint {
  id: string
  user: string
  email: string
  type: 'complaint' | 'suggestion' | 'bug_report' | 'feature_request'
  subject: string
  description: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  createdAt: string
  updatedAt: string
  assignedTo?: string
}

export interface BusinessListing {
  id: string
  name: string
  category: 'hotel' | 'restaurant' | 'attraction' | 'event' | 'airbnb' | 'shopping' | 'lifestyle' | 'fun_place'
  owner: string
  email: string
  phone: string
  address: string
  description: string
  status: 'pending' | 'approved' | 'rejected' | 'suspended'
  rating: number
  reviews: number
  images: string[]
  amenities: string[]
  priceRange: string
  createdAt: string
  updatedAt: string
  isVerified: boolean
  totalBookings: number
  revenue: number
}

export interface Transaction {
  id: string
  type: 'commission' | 'ad_revenue' | 'subscription' | 'refund'
  business: string
  amount: number
  commission: number
  date: string
  status: 'completed' | 'pending' | 'failed'
  description: string
}

export interface DashboardStats {
  totalUsers: number
  activeUsers: number
  totalRevenue: number
  monthlyRevenue: number
  totalAds: number
  pendingAds: number
  totalComplaints: number
  openComplaints: number
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'super_admin'
  avatar?: string
}

export interface AuthContextType {
  user: AuthUser | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}