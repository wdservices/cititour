import { Platform } from 'react-native';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  browserLocalPersistence,
  indexedDBLocalPersistence,
  Auth,
  inMemoryPersistence,
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
let auth: Auth;
let db: ReturnType<typeof getFirestore>;

try {
  try {
    const existingApps = getApps();
    if (existingApps.length > 0) {
      app = existingApps[0];
    } else {
      app = initializeApp(firebaseConfig);
    }
  } catch (e1: any) {
    console.warn('[firebase] level-1 init failed:', e1?.code || e1?.message || e1);
    try {
      app = getApp();
    } catch (e2: any) {
      console.warn('[firebase] level-2 getApp also failed, reinitializing:', e2?.code || e2?.message || e2);
      app = initializeApp(firebaseConfig, `fallback_${Date.now()}`);
    }
  }
} catch (fatal: any) {
  console.error('[firebase] CRITICAL: all app init levels failed:', fatal?.code || fatal?.message || fatal);
  app = initializeApp(firebaseConfig);
}

type RNPersistenceType = {
  type: 'LOCAL';
  _initialize: (auth: Auth) => Promise<void>;
  _set: (key: string, value: any) => Promise<void>;
  _get: (key: string) => Promise<any>;
  _remove: (key: string) => Promise<void>;
};

function buildReactNativePersistence(storage: any): RNPersistenceType {
  const PERSISTENCE_KEY = 'firebase:auth:persistence';
  return {
    type: 'LOCAL',
    async _initialize(_auth: Auth) {},
    async _set(key: string, value: any) {
      try {
        await storage.setItem(`${PERSISTENCE_KEY}:${key}`, JSON.stringify(value));
      } catch (e) {
        console.warn('[firebase] persistence _set failed:', e);
      }
    },
    async _get(key: string): Promise<any> {
      try {
        const raw = await storage.getItem(`${PERSISTENCE_KEY}:${key}`);
        return raw ? JSON.parse(raw) : null;
      } catch (e) {
        console.warn('[firebase] persistence _get failed:', e);
        return null;
      }
    },
    async _remove(key: string) {
      try {
        await storage.removeItem(`${PERSISTENCE_KEY}:${key}`);
      } catch (_) {}
    },
  };
}

function safeGetAuth(a: FirebaseApp): Auth {
  try {
    return getAuth(a);
  } catch (_) {
    return initializeAuth(a, {});
  }
}

function initAuthForPlatform(a: FirebaseApp): Auth {
  if (Platform.OS === 'web') {
    try {
      return initializeAuth(a, { persistence: [indexedDBLocalPersistence, browserLocalPersistence, inMemoryPersistence] });
    } catch (_e1: any) {
      try {
        return getAuth(a);
      } catch (_e2: any) {
        return initializeAuth(a, {});
      }
    }
  } else {
    try {
      const persistence = AsyncStorage ? buildReactNativePersistence(AsyncStorage) : undefined;
      if (persistence) {
        try {
          return initializeAuth(a, { persistence: persistence as any });
        } catch (_e1: any) {
          return safeGetAuth(a);
        }
      } else {
        return safeGetAuth(a);
      }
    } catch (_e3: any) {
      return safeGetAuth(a);
    }
  }
}

try {
  try {
    auth = initAuthForPlatform(app);
  } catch (innerFatal: any) {
    console.warn('[firebase] auth init inner failed, fallback to getAuth:', innerFatal?.code || innerFatal?.message || innerFatal);
    auth = safeGetAuth(app);
  }
} catch (topFatal: any) {
  console.error('[firebase] CRITICAL: all auth init levels failed:', topFatal?.code || topFatal?.message || topFatal);
  auth = initializeAuth(app, {});
}

try {
  db = getFirestore(app);
} catch (e: any) {
  console.error('[firebase] getFirestore failed:', e?.code || e?.message || e);
  try {
    db = getFirestore(app);
  } catch (_) {
    db = getFirestore(app);
  }
}

export { app, auth, db };
