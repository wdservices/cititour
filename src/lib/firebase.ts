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
  inMemoryPersistence,
  User
} from 'firebase/auth';
import firebaseAppletConfig from '../../firebase-applet-config.json';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzI8Hz3fCdJQdHcNlOdiJh-bKwxqE3294",
  authDomain: "citivas-5489a.firebaseapp.com",
  projectId: "citivas-5489a",
  storageBucket: "citivas-5489a.firebasestorage.app",
  messagingSenderId: "802907376648",
  appId: "1:802907376648:web:49c266c1a6db01655a95bd"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Use local persistence — auth survives page reload, but times out after 5 min inactivity
// Fall back to session or in-memory persistence if storage is blocked (e.g. Edge Tracking Prevention, private mode)
setPersistence(auth, browserLocalPersistence)
  .catch((e) => {
    console.warn("[firebase] localPersistence failed, falling back to sessionPersistence:", e?.code || e?.message || e);
    return setPersistence(auth, browserSessionPersistence);
  })
  .catch((e) => {
    console.warn("[firebase] sessionPersistence also failed, falling back to inMemoryPersistence:", e?.code || e?.message || e);
    return setPersistence(auth, inMemoryPersistence);
  })
  .catch((e) => {
    console.error("[firebase] all persistence modes failed:", e?.code || e?.message || e);
  });

// Select database ID: if using a named custom database ID, pass it; otherwise use default database
const customDbId = import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID;
const activeProjectId = firebaseConfig.projectId;
const appletDbId = activeProjectId === firebaseAppletConfig?.projectId ? firebaseAppletConfig?.firestoreDatabaseId : undefined;
const resolvedDbId = customDbId || appletDbId;

export const db = (resolvedDbId && resolvedDbId !== "(default)") ? getFirestore(app, resolvedDbId) : getFirestore(app);

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
    // Popup is unreliable with Edge strict Tracking Prevention / storage blocked / popup closed.
    // Fall back to redirect which works even when localStorage is blocked.
    if (
      error?.code === 'auth/popup-blocked' ||
      error?.code === 'auth/popup-closed-by-user' ||
      error?.code === 'auth/cancelled-popup-request' ||
      error?.code === 'auth/internal-error'
    ) {
      console.warn('[firebase] popup failed (' + error?.code + '), falling back to redirect');
      return signInWithRedirect(auth, googleProvider);
    }
    throw error;
  }
};

export const signInWithFacebook = async () => {
  try {
    return await signInWithPopup(auth, facebookProvider);
  } catch (error: any) {
    if (
      error?.code === 'auth/popup-blocked' ||
      error?.code === 'auth/popup-closed-by-user' ||
      error?.code === 'auth/cancelled-popup-request' ||
      error?.code === 'auth/internal-error'
    ) {
      console.warn('[firebase] popup failed (' + error?.code + '), falling back to redirect');
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