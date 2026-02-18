import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';

export const AuthContext = createContext<{
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  guestMode: boolean;
  setGuestMode: (mode: boolean) => void;
}>({
  user: null,
  loading: true,
  logout: async () => { },
  guestMode: false,
  setGuestMode: () => { }
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [guestMode, setGuestMode] = useState(false);

  const logout = async () => {
    await signOut(auth);
    setGuestMode(false); // Reset guest mode on logout
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, logout, guestMode, setGuestMode }}>
      {children}
    </AuthContext.Provider>
  );
};