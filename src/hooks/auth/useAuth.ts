import { useEffect } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { auth } from '@/services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

// 開発用のモックユーザー
const MOCK_USER = {
  id: 'dev-user-123',
  email: 'dev@example.com',
  displayName: '開発ユーザー',
  photoURL: undefined,
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const useAuth = () => {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    // 開発環境では自動的にモックユーザーでログイン
    if (import.meta.env.DEV) {
      setUser(MOCK_USER);
      setLoading(false);
      return;
    }

    // 本番環境ではFirebase認証を使用
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || 'ユーザー',
          photoURL: firebaseUser.photoURL || undefined,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setUser, setLoading]);
};