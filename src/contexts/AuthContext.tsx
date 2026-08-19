import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { 
  onAuthStateChange, 
  signInWithGoogle, 
  signInWithFacebook, 
  signInWithEmail, 
  signUpWithEmail, 
  logOut,
  handleRedirectResult,
  resetPassword as firebaseResetPassword
} from '@/lib/firebase';

import { logActivity } from "@/lib/activityLog";

interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  isAdmin?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  isAdminLoading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmailPassword: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(true);
  const logoutTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const INACTIVITY_TIMEOUT = 5 * 60 * 1000; // 5 minutes

  const resetInactivityTimer = React.useCallback(() => {
    if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    logoutTimerRef.current = setTimeout(() => {
      logActivity({ userId: user?.id || "", userEmail: user?.email || "", userName: user?.name || "", action: "sign_out", targetType: "auth", details: "Auto-logout: 5 min inactivity" });
      logOut().catch(() => {});
      setUser(null);
    }, INACTIVITY_TIMEOUT);
  }, []);

  // Mirrors a Firebase Auth session into a `users/{uid}` Firestore document.
  // Firebase Auth itself cannot be listed/counted by a client-side SDK — the
  // admin dashboard needs a real Firestore collection to read "Total Users"
  // and a user list from. This upserts on every sign-in, so it also keeps
  // `lastSeenAt` fresh without needing a separate heartbeat mechanism.
  const mirrorUserToFirestore = async (firebaseUser: FirebaseUser) => {
    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const existing = await getDoc(userRef);

      await setDoc(
        userRef,
        {
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email || '',
          photoURL: firebaseUser.photoURL || null,
          lastSeenAt: serverTimestamp(),
          ...(!existing.exists() && { createdAt: serverTimestamp() }),
        },
        { merge: true }
      );
    } catch (error) {
      // Don't block sign-in if this mirror write fails (e.g. transient
      // network issue) — the user should still get into the app.
      console.error('Failed to mirror user to Firestore:', error);
    }
  };

  // Convert Firebase user to our User interface
  const convertFirebaseUser = (firebaseUser: FirebaseUser): User => {
    return {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
      email: firebaseUser.email || '',
      photoURL: firebaseUser.photoURL || undefined,
    };
  };

  const checkAdminStatus = async (uid: string): Promise<boolean> => {
    try {
      const adminDocRef = doc(db, 'admin_users', uid);
      const adminDocSnap = await getDoc(adminDocRef);
      return adminDocSnap.exists();
    } catch {
      return false;
    }
  };

  // Listen for authentication state changes
  useEffect(() => {
    // Handle redirect result first
    handleRedirectResult().then(async (result) => {
      if (result) {
        const fbUser = result.user;
        const adminStatus = await checkAdminStatus(fbUser.uid);
        setUser({ ...convertFirebaseUser(fbUser), isAdmin: adminStatus });
        setIsAdmin(adminStatus);
        setIsAdminLoading(false);
        mirrorUserToFirestore(fbUser);
        setIsLoading(false);
      }
    }).catch((error) => {
      console.error('Redirect result error:', error);
      setIsAdminLoading(false);
      setIsLoading(false);
    });

    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      if (firebaseUser) {
        const adminStatus = await checkAdminStatus(firebaseUser.uid);
        setUser({ ...convertFirebaseUser(firebaseUser), isAdmin: adminStatus });
        setIsAdmin(adminStatus);
        setIsAdminLoading(false);
        mirrorUserToFirestore(firebaseUser);
        resetInactivityTimer();
      } else {
        setUser(null);
        setIsAdmin(false);
        setIsAdminLoading(false);
        if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
      }
      setIsLoading(false);
    });

    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart'];
    const handleActivity = () => { if (user) resetInactivityTimer(); };
    activityEvents.forEach((e) => document.addEventListener(e, handleActivity));

    return () => {
      unsubscribe();
      activityEvents.forEach((e) => document.removeEventListener(e, handleActivity));
      if (logoutTimerRef.current) clearTimeout(logoutTimerRef.current);
    };
  }, []);

  const loginWithEmail = async (email: string, password: string): Promise<void> => {
    try {
      await signInWithEmail(email, password);
      logActivity({ userId: "", userEmail: email, userName: "", action: "sign_in", targetType: "auth", details: "Signed in with email: " + email });
    } catch (error: any) {
      console.error('Email login error:', error);
      // Re-throw the original Firebase error so callers can inspect error.code
      throw error;
    }
  };

  const signUpWithEmailPassword = async (email: string, password: string): Promise<void> => {
    try {
      await signUpWithEmail(email, password);
      logActivity({ userId: "", userEmail: email, userName: "", action: "sign_up", targetType: "auth", details: "Signed up with email: " + email });
    } catch (error: any) {
      console.error('Email signup error:', error);
      throw error;
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      console.error('Google login error:', error);
      throw error;
    }
  };

  const loginWithFacebook = async (): Promise<void> => {
    try {
      await signInWithFacebook();
    } catch (error: any) {
      console.error('Facebook login error:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      await firebaseResetPassword(email);
    } catch (error: any) {
      console.error('Reset password error:', error);
      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await logOut();
      logActivity({ userId: "", userEmail: user?.email || "", userName: user?.name || "", action: "sign_out", targetType: "auth", details: "Signed out" });
    } catch (error: any) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    isAdmin,
    isAdminLoading,
    loginWithEmail,
    signUpWithEmailPassword,
    loginWithGoogle,
    loginWithFacebook,
    resetPassword,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};