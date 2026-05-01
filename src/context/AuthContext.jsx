import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { auth, db, isFirebaseConfigured } from '../firebase/firebaseConfig';
import {
  loginWithEmail,
  logoutUser,
  registerWithEmail,
  sendReset,
  updateAuthDisplayName,
} from '../firebase/auth';
import { createUserProfile } from '../firebase/firestore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isFirebaseConfigured || !auth || !db) {
      setLoading(false);
      return undefined;
    }

    let unsubscribeProfile = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setUserProfile(null);

      if (unsubscribeProfile) {
        unsubscribeProfile();
        unsubscribeProfile = null;
      }

      if (!user) {
        setLoading(false);
        return;
      }

      try {
        await createUserProfile(user, user.displayName);
        unsubscribeProfile = onSnapshot(doc(db, 'users', user.uid), (snapshot) => {
          setUserProfile(snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } : null);
          setLoading(false);
        });
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, []);

  const value = useMemo(
    () => ({
      currentUser,
      userProfile,
      loading,
      firebaseReady: isFirebaseConfigured,
      register: registerWithEmail,
      login: loginWithEmail,
      logout: logoutUser,
      resetPassword: sendReset,
      updateDisplayName: (displayName) => updateAuthDisplayName(currentUser, displayName),
    }),
    [currentUser, loading, userProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
