import { Platform } from 'react-native';
import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  browserLocalPersistence,
  getReactNativePersistence,
  Auth,
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDzI8Hz3fCdJQdHcNlOdiJh-bKwxqE3294",
  authDomain: "citivas-5489a.firebaseapp.com",
  projectId: "citivas-5489a",
  storageBucket: "citivas-5489a.firebasestorage.app",
  messagingSenderId: "802907376648",
  appId: "1:802907376648:web:49c266c1a6db01655a95bd",
};

let app: FirebaseApp;
try {
  const existingApps = getApps();
  if (existingApps.length > 0) {
    app = existingApps[0];
  } else {
    app = initializeApp(firebaseConfig);
  }
} catch (err) {
  console.warn('[firebase] app init failed, falling back:', err);
  app = initializeApp(firebaseConfig);
}

let auth: Auth;
try {
  if (Platform.OS === 'web') {
    try {
      auth = initializeAuth(app, { persistence: browserLocalPersistence });
    } catch (_) {
      auth = getAuth(app);
    }
  } else {
    try {
      const persistence = getReactNativePersistence
        ? getReactNativePersistence(AsyncStorage)
        : undefined;
      if (persistence) {
        auth = initializeAuth(app, { persistence });
      } else {
        auth = getAuth(app);
      }
    } catch (_) {
      auth = getAuth(app);
    }
  }
} catch (e) {
  try {
    auth = getAuth(app);
  } catch (__) {
    auth = initializeAuth(app, {});
  }
}

export { auth };
export const db = getFirestore(app);
