import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
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
  User,
  Auth
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let auth: Auth;
let db: ReturnType<typeof getFirestore>;
let storage: ReturnType<typeof getStorage>;
let persistenceReady: Promise<void> = Promise.resolve();
let initError: Error | null = null;

try {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    app = existingApps[0];
  } else {
    app = initializeApp(firebaseConfig);
  }

  try {
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);

    persistenceReady = (async () => {
      try {
        await setPersistence(auth, browserLocalPersistence);
      } catch (e1: any) {
        console.warn('[firebase] localPersistence failed, falling back to sessionPersistence:', e1?.code || e1?.message || e1);
        try {
          await setPersistence(auth, browserSessionPersistence);
        } catch (e2: any) {
          console.warn('[firebase] sessionPersistence also failed, falling back to inMemoryPersistence:', e2?.code || e2?.message || e2);
          try {
            await setPersistence(auth, inMemoryPersistence);
          } catch (e3: any) {
            console.error('[firebase] inMemoryPersistence also failed (continuing with default persistence):', e3?.code || e3?.message || e3);
          }
        }
      }
    })();
  } catch (innerError: any) {
    console.error('[firebase] Failed to initialize auth/firestore/storage:', innerError?.code || innerError?.message || innerError);
    initError = innerError;
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
  }
} catch (topLevelError: any) {
  console.error('[firebase] CRITICAL: Firebase initialization failed:', topLevelError?.code || topLevelError?.message || topLevelError);
  initError = topLevelError;
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
}

export { app, auth, db, storage, persistenceReady, initError };

const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

googleProvider.addScope('email');
googleProvider.addScope('profile');
googleProvider.setCustomParameters({ prompt: 'select_account' });

facebookProvider.addScope('email');
facebookProvider.addScope('public_profile');

export { googleProvider, facebookProvider };

export const signInWithGoogle = async () => {
  await persistenceReady;
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (error: any) {
    const msg = String(error?.message || '');
    const code = String(error?.code || '');
    const shouldRedirect = (
      code === 'auth/popup-blocked' ||
      code === 'auth/cancelled-popup-request' ||
      code === 'auth/network-request-failed' ||
      code === 'auth/popup-closed-by-user' ||
      /Failed to fetch/i.test(msg)
    );
    if (shouldRedirect) {
      console.log('[firebase] Google popup blocked or failed, falling back to redirect mode.');
      return signInWithRedirect(auth, googleProvider);
    }
    throw error;
  }
};

export const signInWithFacebook = async () => {
  await persistenceReady;
  try {
    return await signInWithPopup(auth, facebookProvider);
  } catch (error: any) {
    const msg = String(error?.message || '');
    const code = String(error?.code || '');
    const shouldRedirect = (
      code === 'auth/popup-blocked' ||
      code === 'auth/cancelled-popup-request' ||
      code === 'auth/network-request-failed' ||
      code === 'auth/popup-closed-by-user' ||
      /Failed to fetch/i.test(msg)
    );
    if (shouldRedirect) {
      console.log('[firebase] Facebook popup blocked or failed, falling back to redirect mode.');
      return signInWithRedirect(auth, facebookProvider);
    }
    throw error;
  }
};

export const handleRedirectResult = async () => {
  try {
    await persistenceReady;
    const result = await getRedirectResult(auth);
    return result;
  } catch (e: any) {
    console.error('[firebase] handleRedirectResult error:', e?.code || e?.message || e);
    throw e;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  await persistenceReady;
  return signInWithEmailAndPassword(auth, email, password);
};

export const signUpWithEmail = async (email: string, password: string) => {
  await persistenceReady;
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
