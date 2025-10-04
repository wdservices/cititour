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
import BusinessListingPage from './pages/BusinessListingPage'
import { useAuth } from './contexts/AuthContext'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />
}

function AppRoutes() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    )
  }

  return (
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
        <Route path="/login" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Layout>
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