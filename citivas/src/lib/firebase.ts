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
  apiKey: "AIzaSyDfHE4dRgE5SILVzTls_5UPPpncA1NBQaI",
  authDomain: "tourph-4d6b8.firebaseapp.com",
  projectId: "tourph-4d6b8",
  storageBucket: "tourph-4d6b8.appspot.com",
  messagingSenderId: "748964654953",
  appId: "1:748964654953:web:d69e5fe44e705c6b2657f8",
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
