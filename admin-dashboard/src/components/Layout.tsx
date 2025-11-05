import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Users, 
  Megaphone, 
  FileText, 
  MessageSquare, 
  Wallet,
  Building,
  Menu,
  X,
  LogOut,
  Calendar,
  Home,
  ClipboardList,
  Star,
  Settings,
  UserCog,
  BarChart2
  , QrCode
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface LayoutProps {
  children: React.ReactNode
}

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Users', path: '/users' },
  { icon: Megaphone, label: 'Ads Management', path: '/ads' },
  { icon: FileText, label: 'Content', path: '/content' },
  { icon: MessageSquare, label: 'Complaints', path: '/complaints' },
  { icon: Building, label: 'Business Listings', path: '/business-listings' },
  { icon: Calendar, label: 'Events', path: '/events' },
  { icon: Home, label: 'Properties', path: '/properties' },
  { icon: ClipboardList, label: 'Bookings', path: '/bookings' },
  { icon: Star, label: 'Reviews', path: '/reviews' },
  { icon: MessageSquare, label: 'Feedback', path: '/feedback' },
  { icon: Settings, label: 'App Settings', path: '/app-settings' },
  { icon: UserCog, label: 'Admin Users', path: '/admin-users' },
  { icon: BarChart2, label: 'Analytics', path: '/analytics' },
  { icon: Wallet, label: 'Wallet & Revenue', path: '/wallet' },
  { icon: QrCode, label: 'QR Validate', path: '/qr-validate' },
]

export default function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { user, logout } = useAuth()

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 text-white transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-16 px-6 bg-gray-900 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white">TourPH Admin</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        
        <nav className="mt-8 px-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
        
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700">
          <div className="flex items-center gap-3 px-4 py-3 text-gray-200">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-lg font-semibold text-white">
                {user?.name?.charAt(0) || 'A'}
              </span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email || 'admin@example.com'}</p>
            </div>
            <button
              onClick={logout}
              className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors duration-200"
              title="Logout"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
          
          {/* Company Branding */}
          <div className="px-4 py-2 text-center mt-2">
            <p className="text-xs text-gray-500">
              © 2023 TourPH. By Bluewaves Technologies
            </p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-100 lg:ml-0">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500 hover:text-gray-700 p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
          >
            <Menu className="h-6 w-6" />
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
            <span className="text-sm text-gray-600 font-medium">
              Welcome back, {user?.name || 'Admin'}
            </span>
            {/* Additional top bar elements can go here */}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto p-6 bg-gray-100">
          {children}
        </main>
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}