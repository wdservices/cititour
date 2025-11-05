import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
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

interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
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

  // Convert Firebase user to our User interface
  const convertFirebaseUser = (firebaseUser: FirebaseUser): User => {
    return {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
      email: firebaseUser.email || '',
      photoURL: firebaseUser.photoURL || undefined,
    };
  };

  // Listen for authentication state changes
  useEffect(() => {
    // Handle redirect result first
    handleRedirectResult().then((result) => {
      if (result) {
        // User signed in via redirect
        setUser(convertFirebaseUser(result.user));
        setIsLoading(false);
      }
    }).catch((error) => {
      console.error('Redirect result error:', error);
      setIsLoading(false);
    });

    const unsubscribe = onAuthStateChange((firebaseUser) => {
      if (firebaseUser) {
        setUser(convertFirebaseUser(firebaseUser));
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithEmail = async (email: string, password: string): Promise<void> => {
    try {
      await signInWithEmail(email, password);
    } catch (error: any) {
      console.error('Email login error:', error);
      throw new Error(error.message || 'Login failed. Please try again.');
    }
  };

  const signUpWithEmailPassword = async (email: string, password: string): Promise<void> => {
    try {
      await signUpWithEmail(email, password);
    } catch (error: any) {
      console.error('Email signup error:', error);
      throw new Error(error.message || 'Sign up failed. Please try again.');
    }
  };

  const loginWithGoogle = async (): Promise<void> => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      console.error('Google login error:', error);
      throw new Error(error.message || 'Google sign-in failed. Please try again.');
    }
  };

  const loginWithFacebook = async (): Promise<void> => {
    try {
      await signInWithFacebook();
    } catch (error: any) {
      console.error('Facebook login error:', error);
      throw new Error(error.message || 'Facebook sign-in failed. Please try again.');
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    try {
      await firebaseResetPassword(email);
    } catch (error: any) {
      console.error('Reset password error:', error);
      throw new Error(error.message || 'Failed to send reset email.');
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await logOut();
    } catch (error: any) {
      console.error('Logout error:', error);
      throw new Error('Logout failed. Please try again.');
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
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