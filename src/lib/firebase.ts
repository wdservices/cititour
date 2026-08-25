import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import {
  getAuth,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  User
} from 'firebase/auth';
import firebaseAppletConfig from '../../firebase-applet-config.json';

// Firebase configuration from provisioned environment or .env fallback
const firebaseConfig = {
  apiKey: firebaseAppletConfig?.apiKey || import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: firebaseAppletConfig?.authDomain || import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: firebaseAppletConfig?.projectId || import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: firebaseAppletConfig?.storageBucket || import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: firebaseAppletConfig?.messagingSenderId || import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: firebaseAppletConfig?.appId || import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Use local persistence — auth survives page reload, but times out after 5 min inactivity
// Fall back to session persistence if localStorage is blocked (e.g. Tracking Prevention, private mode)
setPersistence(auth, browserLocalPersistence)
  .catch((e) => {
    console.warn("[firebase] localPersistence failed, falling back to sessionPersistence:", e?.code || e?.message || e);
    return setPersistence(auth, browserSessionPersistence);
  })
  .catch((e) => {
    console.error("[firebase] sessionPersistence also failed:", e?.code || e?.message || e);
  });

export const db = firebaseAppletConfig?.firestoreDatabaseId
  ? getFirestore(app, firebaseAppletConfig.firestoreDatabaseId)
  : getFirestore(app);

export const storage = getStorage(app);

// Initialize providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

// Configure Google provider
googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Configure Facebook provider
facebookProvider.addScope('email');
facebookProvider.addScope('public_profile');

// Authentication functions
export const signInWithGoogle = async () => {
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (error: any) {
    const msg = String(error?.message || '');
    const shouldRedirect = (
      error?.code === 'auth/popup-blocked' ||
      error?.code === 'auth/cancelled-popup-request' ||
      error?.code === 'auth/network-request-failed' ||
      /Failed to fetch/i.test(msg)
    );
    if (shouldRedirect) {
      return signInWithRedirect(auth, googleProvider);
    }
    throw error;
  }
};

export const signInWithFacebook = async () => {
  try {
    return await signInWithPopup(auth, facebookProvider);
  } catch (error: any) {
    // If popup is blocked or CORS issues, fallback to redirect
    const msg = String(error?.message || '');
    const shouldRedirect = (
      error.code === 'auth/popup-blocked' ||
      error.code === 'auth/cancelled-popup-request' ||
      error.code === 'auth/network-request-failed' ||
      /Failed to fetch/i.test(msg)
    );
    if (shouldRedirect) {
      return signInWithRedirect(auth, facebookProvider);
    }
    throw error;
  }
};

// Handle redirect result
export const handleRedirectResult = () => {
  return getRedirectResult(auth);
};

export const signInWithEmail = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signUpWithEmail = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const logOut = () => {
  return signOut(auth);
};

export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

export const resetPassword = (email: string) => {
  return sendPasswordResetEmail(auth, email);
};

// User profile helpers (Firestore)
export const getUserProfile = async (uid: string) => {
  const ref = doc(db, 'users', uid);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};

export const updateUserProfile = async (
  uid: string,
  data: Record<string, any>
) => {
  const ref = doc(db, 'users', uid);
  const payload = { ...data, uid, updatedAt: serverTimestamp() };
  await setDoc(ref, payload, { merge: true });
};

export default app;