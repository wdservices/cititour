import { Platform } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
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

const app = initializeApp(firebaseConfig);

let auth;

if (Platform.OS === 'web') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { initializeAuth, browserLocalPersistence } = require('firebase/auth');
    auth = initializeAuth(app, { persistence: browserLocalPersistence });
  } catch {
    auth = getAuth(app);
  }
} else {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { initializeAuth, getReactNativePersistence } = require('firebase/auth');
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(AsyncStorage),
    });
  } catch {
    auth = getAuth(app);
  }
}

export { auth };
export const db = getFirestore(app);
