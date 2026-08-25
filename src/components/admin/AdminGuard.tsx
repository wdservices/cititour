import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { isAuthenticated, isLoading, isAdmin } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen bg-ivory"><p className="text-ink/50">Loading...</p></div>
  }

  if (!isAuthenticated) {
    const redirectUrl = encodeURIComponent(location.pathname + location.search)
    return <Navigate to={`/auth?redirect=${redirectUrl}`} replace />
  }

  if (!isAdmin) {
    return <Navigate to="/explore" replace />
  }

  return <>{children}</>
}
