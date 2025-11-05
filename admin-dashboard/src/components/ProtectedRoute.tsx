import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: Array<'admin' | 'super_admin'>
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isAuthenticated, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div> // Or a more sophisticated loading spinner
  }

  if (!isAuthenticated) {
    // User is not authenticated, redirect to login page
    return <Navigate to="/login" replace />
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    // User is authenticated but does not have an allowed role
    // Redirect to a /unauthorized page or dashboard with an error message
    return <Navigate to="/dashboard" replace /> // Or a dedicated unauthorized page
  }

  return <>{children}</>
}