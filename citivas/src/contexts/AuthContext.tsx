import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Platform } from 'react-native';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  User as FirebaseUser,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup,
  browserPopupRedirectResolver,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

try {
  WebBrowser.maybeCompleteAuthSession();
} catch (e) {
  console.warn('[auth] WebBrowser.maybeCompleteAuthSession error:', e);
}

const GOOGLE_WEB_CLIENT_ID = '748964654953-k0sofgba1q6fop33epabb0a7loo10nd2.apps.googleusercontent.com';

const discovery = {
  authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
  tokenEndpoint: 'https://oauth2.googleapis.com/token',
  revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
};

interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmailPassword: (email: string, password: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapFirebaseUser(firebaseUser: FirebaseUser): User {
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
    email: firebaseUser.email || '',
    photoURL: firebaseUser.photoURL,
  };
}

async function mirrorUserToFirestore(firebaseUser: FirebaseUser) {
  try {
    const userRef = doc(db, 'users', firebaseUser.uid);
    const existing = await getDoc(userRef);
    await setDoc(
      userRef,
      {
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
        email: firebaseUser.email || '',
        lastSeenAt: serverTimestamp(),
        ...(!existing.exists() && { createdAt: serverTimestamp() }),
      },
      { merge: true }
    );
  } catch (error) {
    console.error('Failed to mirror user to Firestore:', error);
  }
}

async function nativeGoogleSignIn(): Promise<string | null> {
  try {
    const redirectUri = AuthSession.makeRedirectUri({ scheme: 'citivas' });

    const request = new AuthSession.AuthRequest({
      clientId: GOOGLE_WEB_CLIENT_ID,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      extraParams: {
        prompt: 'select_account',
      },
    });

    const result = await request.promptAsync(discovery);

    if (result.type === 'success' && result.params.code) {
      const tokenResult = await AuthSession.exchangeCodeAsync(
        {
          clientId: GOOGLE_WEB_CLIENT_ID,
          code: result.params.code,
          redirectUri,
          extraParams: {
            code_verifier: request.codeVerifier || '',
          },
        },
        discovery
      );
      return tokenResult.idToken || null;
    }

    if (result.type === 'cancel' || result.type === 'dismiss') {
      return null;
    }

    console.warn('[nativeGoogleSignIn] non-success result type:', result.type, (result as any)?.errorCode, (result as any)?.error?.message);
    return null;
  } catch (e: any) {
    console.error('[nativeGoogleSignIn] failed:', e?.message || e);
    throw e;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;
    try {
      unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        if (cancelled) return;
        setUser(firebaseUser ? mapFirebaseUser(firebaseUser) : null);
        setIsLoading(false);
        if (firebaseUser) {
          mirrorUserToFirestore(firebaseUser).catch((e) =>
            console.warn('[auth] mirrorUserToFirestore warning:', e?.message || e)
          );
        }
      });
    } catch (e: any) {
      console.error('[auth] onAuthStateChanged setup failed:', e?.message || e);
      if (!cancelled) setIsLoading(false);
    }
    return () => {
      cancelled = true;
      try {
        if (unsubscribe) unsubscribe();
      } catch (_) {}
    };
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (e) {
      throw e;
    }
  };

  const signUpWithEmailPassword = async (email: string, password: string) => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (e) {
      throw e;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (e) {
      throw e;
    }
  };

  const loginWithGoogle = async () => {
    if (Platform.OS === 'web') {
      try {
        const provider = new GoogleAuthProvider();
        provider.addScope('profile');
        provider.addScope('email');
        await signInWithPopup(auth, provider, browserPopupRedirectResolver);
      } catch (e) {
        throw e;
      }
    } else {
      const idToken = await nativeGoogleSignIn();
      if (!idToken) {
        const err: any = new Error('Google sign-in was cancelled');
        err.code = 'auth/cancelled';
        throw err;
      }
      try {
        const credential = GoogleAuthProvider.credential(idToken);
        await signInWithCredential(auth, credential);
      } catch (e) {
        throw e;
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('[auth] logout error:', e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        loginWithEmail,
        signUpWithEmailPassword,
        resetPassword,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
