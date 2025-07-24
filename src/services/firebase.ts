import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Firebaseの設定を検証
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'dummy-api-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'dummy.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'dummy-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'dummy.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:abcdef'
};

// 開発環境では警告を表示
if (import.meta.env.DEV && !import.meta.env.VITE_FIREBASE_API_KEY) {
  console.warn('Firebase設定が見つかりません。モックモードで動作します。');
}

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);