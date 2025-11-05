import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import UsersPage from './pages/UsersPage'
import AdsPage from './pages/AdsPage'
import ContentPage from './pages/ContentPage'
import ComplaintsPage from './pages/ComplaintsPage'
import WalletPage from './pages/WalletPage'
import EventsPage from './pages/EventsPage'
import PropertiesPage from './pages/PropertiesPage'
import BookingsPage from './pages/BookingsPage'
import ReviewsPage from './pages/ReviewsPage'
import FeedbackPage from './pages/FeedbackPage'
import AppSettingsPage from './pages/AppSettingsPage'
import AdminUsersPage from './pages/AdminUsersPage'
import AnalyticsPage from './pages/AnalyticsPage'
import BusinessListingPage from './pages/BusinessListingPage'
import QRValidatePage from './pages/QRValidatePage'
import { ProtectedRoute } from './components/ProtectedRoute'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Navigate to="/dashboard" />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/ads" element={<AdsPage />} />
                <Route path="/content" element={<ContentPage />} />
                <Route path="/complaints" element={<ComplaintsPage />} />
                <Route path="/business-listings" element={<BusinessListingPage />} />
                <Route path="/wallet" element={<WalletPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/properties" element={<PropertiesPage />} />
                <Route path="/bookings" element={<BookingsPage />} />
                <Route path="/reviews" element={<ReviewsPage />} />
                <Route path="/feedback" element={<FeedbackPage />} />
                <Route path="/app-settings" element={<AppSettingsPage />} />
                <Route path="/admin-users" element={<AdminUsersPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/qr-validate" element={<QRValidatePage />} />
                <Route path="/login" element={<Navigate to="/dashboard" />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App