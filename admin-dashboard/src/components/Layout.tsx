import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Users, Megaphone, FileText, MessageSquare, Wallet, Building,
  Menu, X, LogOut, Calendar, Home, ClipboardList, Star, Settings, UserCog, BarChart2, QrCode
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

interface LayoutProps { children: React.ReactNode }

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Users', path: '/users' },
  { icon: Megaphone, label: 'Ads', path: '/ads' },
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
    <div className="flex h-screen bg-ivory">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-ink text-ivory transform ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/10">
          <h1 className="font-display text-xl font-extrabold text-marigold">CitiTour<span className="text-ivory/60 font-normal ml-1 text-sm">Admin</span></h1>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-ivory/60 hover:text-ivory">
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="mt-4 px-3 space-y-1 overflow-y-auto flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <Link key={item.path} to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-colors ${
                  isActive
                    ? 'bg-marigold text-ink font-semibold shadow-soft'
                    : 'text-ivory/70 hover:bg-white/5 hover:text-ivory'
                }`}
                onClick={() => setSidebarOpen(false)}>
                <Icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-marigold rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-base font-bold text-ink">{user?.name?.charAt(0) || 'A'}</span>
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.name || 'Admin User'}</p>
              <p className="text-xs text-ivory/50 truncate">{user?.email || 'admin@example.com'}</p>
            </div>
            <button onClick={logout}
              className="text-ivory/60 hover:text-ivory p-2 rounded-full hover:bg-white/10 transition-colors"
              title="Logout">
              <LogOut className="h-4 w-4" />
            </button>
          </div>
          <p className="text-[10px] text-ivory/40 text-center mt-3">© {new Date().getFullYear()} CitiTour</p>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-sand-200 h-16 flex items-center justify-between px-6">
          <button onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-ink/60 hover:text-ink p-2 rounded-md hover:bg-sand-100">
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center gap-4 ml-auto">
            <span className="text-sm text-ink/70">Welcome, <strong className="text-ink">{user?.name || 'Admin'}</strong></span>
          </div>
        </header>

        <main className="flex-1 overflow-auto p-6 bg-ivory">{children}</main>
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-ink/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}
