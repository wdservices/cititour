import { initializeApp } from 'firebase/app';
import { initializeAuth, getAuth, inMemoryPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyDzI8Hz3fCdJQdHcNlOdiJh-bKwxqE3294",
  authDomain: "citivas-5489a.firebaseapp.com",
  projectId: "citivas-5489a",
  storageBucket: "citivas-5489a.firebasestorage.app",
  messagingSenderId: "802907376648",
  appId: "1:802907376648:web:49c266c1a6db01655a95bd",
};

const app = initializeApp(firebaseConfig);

let auth;
try {
  if (Platform.OS === 'web') {
    auth = initializeAuth(app, { persistence: inMemoryPersistence });
  } else {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { getReactNativePersistence } = require('firebase/auth');
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
  }
} catch {
  auth = getAuth(app);
}

export { auth };
export const db = getFirestore(app);
