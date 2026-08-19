import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { isAuthenticated, isLoading, isAdmin } = useAuth()

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen bg-ivory"><p className="text-ink/50">Loading...</p></div>
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/explore" replace />
  }

  return <>{children}</>
}
