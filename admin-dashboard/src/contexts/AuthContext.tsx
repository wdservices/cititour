import React, { createContext, useContext, useState, useEffect } from 'react'
import { auth, db } from '../lib/firebase'
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  User as FirebaseUser 
} from 'firebase/auth'
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore'

interface User {
  uid: string
  email: string | null
  displayName: string | null
  role: 'admin' | 'super_admin'
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  loading: boolean
}

const VALID_ROLES: ReadonlyArray<User['role']> = ['admin', 'super_admin'] as const

function isValidRole(role: unknown): role is User['role'] {
  return typeof role === 'string' && (VALID_ROLES as readonly string[]).includes(role)
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

async function mapAdminDoc(firebaseUser: FirebaseUser, adminDocSnap: FirebaseFirestoreTypes.DocumentSnapshot<FirebaseFirestoreTypes.DocumentData>): Promise<User | null> {
  if (!adminDocSnap.exists()) return null

  const adminData = adminDocSnap.data() || {}
  const role = adminData.role

  if (!isValidRole(role)) {
    console.warn('[admin-auth] user', firebaseUser.uid, 'has invalid role:', role)
    return null
  }

  if (adminData.disabled === true || adminData.status === 'suspended') {
    console.warn('[admin-auth] user', firebaseUser.uid, 'is suspended')
    return null
  }

  try {
    await setDoc(doc(db, 'admin_users', firebaseUser.uid), {
      lastLoginAt: serverTimestamp(),
    }, { merge: true })
  } catch (_) {}

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email,
    displayName: firebaseUser.displayName || adminData.displayName || adminData.name || null,
    role,
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser && firebaseUser.emailVerified !== false) {
          const adminDocRef = doc(db, 'admin_users', firebaseUser.uid)
          const adminDocSnap = await getDoc(adminDocRef)
          const mapped = await mapAdminDoc(firebaseUser, adminDocSnap)
          if (mapped) {
            setUser(mapped)
          } else {
            await signOut(auth)
            setUser(null)
          }
        } else {
          setUser(null)
        }
      } catch (err) {
        console.error('[admin-auth] onAuthStateChanged error:', err)
        try { await signOut(auth) } catch (_) {}
        setUser(null)
      } finally {
        setLoading(false)
      }
    })
    return () => unsubscribe()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user
      if (!firebaseUser) return false

      const adminDocRef = doc(db, 'admin_users', firebaseUser.uid)
      const adminDocSnap = await getDoc(adminDocRef)
      const mapped = await mapAdminDoc(firebaseUser, adminDocSnap)

      if (!mapped) {
        await signOut(auth)
        setUser(null)
        return false
      }

      setUser(mapped)
      return true
    } catch (error) {
      console.error('[admin-auth] Login error:', error)
      setUser(null)
      return false
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await signOut(auth)
    } catch (_) {}
    setUser(null)
  }

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
