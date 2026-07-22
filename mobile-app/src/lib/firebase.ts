import { initializeApp } from 'firebase/app';
import { initializeAuth, getAuth, inMemoryPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { Platform } from 'react-native';

const firebaseConfig = {
  apiKey: "AIzaSyDfHE4dRgE5SILVzTls_5UPPpncA1NBQaI",
  authDomain: "tourph-4d6b8.web.app",
  projectId: "tourph-4d6b8",
  storageBucket: "tourph-4d6b8.appspot.com",
  messagingSenderId: "748964654953",
  appId: "1:748964654953:web:d69e5fe44e705c6b2657f8",
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
