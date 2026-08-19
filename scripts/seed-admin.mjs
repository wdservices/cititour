#!/usr/bin/env node
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import 'dotenv/config';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const EMAIL = 'hello.bluewavestech@gmail.com';
const PASSWORD = 'Bwtng@26';

const seed = async () => {
  console.log(`Signing in as ${EMAIL}...`);
  const cred = await signInWithEmailAndPassword(auth, EMAIL, PASSWORD);
  const uid = cred.user.uid;
  console.log(`UID: ${uid}`);

  await setDoc(doc(db, 'admin_users', uid), {
    email: EMAIL,
    role: 'super_admin',
    status: 'active',
    name: 'Hello Bluewave Tech',
  });

  console.log(`admin_users document created for UID: ${uid}`);
  console.log('Now go to http://localhost:3001 and login.');
  process.exit(0);
};

seed().catch((err) => {
  console.error('Error:', err.message || err);
  process.exit(1);
});
