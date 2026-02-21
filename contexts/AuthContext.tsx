import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Alert, Platform } from 'react-native';

// UserProfile type matching Firestore users collection
export interface UserProfile {
  id: string;
  phoneNumber: string;
  name?: string;
  location?: string;
  locationData?: { lat: number; lng: number };
  profileCompleted?: boolean;
  onboardingCompleted?: boolean;
  verificationStatus?: 'none' | 'pending' | 'approved' | 'rejected';
  isAdmin?: boolean;
  isBlocked?: boolean;
  accountType?: 'customer' | 'partner' | 'business';
  businessProfile?: any;
  partnerProfile?: any;
  rating?: number;
  reviewCount?: number;
  createdAt?: any;
  updatedAt?: any;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  logout: () => Promise<void>;
  guestMode: boolean;
  setGuestMode: (mode: boolean) => void;
  refreshUserProfile: () => Promise<void>;
  setUserProfile: (profile: UserProfile | null) => void;
}

interface AuthState {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  logout: async () => { },
  guestMode: false,
  setGuestMode: () => { },
  refreshUserProfile: async () => { },
  setUserProfile: () => { },
});

export const useAuth = () => useContext(AuthContext);

async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      const data = snap.data();
      return { id: uid, ...data } as UserProfile;
    }
    console.log('fetchUserProfile: No profile found in Firestore for UID:', uid);
    return null;
  } catch (e) {
    console.error('fetchUserProfile error:', e);
    return null;
  }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // Combined atomic state — prevents race condition where loading=false but userProfile=null
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    userProfile: null,
    loading: true,
  });
  const [guestMode, setGuestMode] = useState(false);

  const setUserProfile = (profile: UserProfile | null) => {
    setAuthState(prev => ({ ...prev, userProfile: profile }));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Check admin token claim - Force refresh to check for new admin privileges
          const tokenResult = await firebaseUser.getIdTokenResult(true);
          const isAdminClaim = !!tokenResult.claims.admin;

          const profile = await fetchUserProfile(firebaseUser.uid);

          if (profile) {
            // Merge token admin claim with Firestore isAdmin
            profile.isAdmin = profile.isAdmin || isAdminClaim;

            console.log('AuthContext: User profile loaded', {
              uid: firebaseUser.uid,
              isAdminFromProfile: profile.isAdmin,
              isAdminFromClaim: isAdminClaim,
              mergedIsAdmin: profile.isAdmin
            });

            if (profile.isBlocked) {
              if (Platform.OS === 'web') {
                window.alert('Access Denied: Your account has been blocked.');
              } else {
                Alert.alert('Access Denied', 'Your account has been blocked.');
              }
              await firebaseSignOut(auth);
              setAuthState({ user: null, userProfile: null, loading: false });
              return;
            }
            // Set all three together — atomic, no race condition
            setAuthState({ user: firebaseUser, userProfile: profile, loading: false });
          } else {
            setAuthState({ user: firebaseUser, userProfile: null, loading: false });
          }
        } catch (e) {
          console.error('Auth state error:', e);
          setAuthState({ user: firebaseUser, userProfile: null, loading: false });
        }
      } else {
        setAuthState({ user: null, userProfile: null, loading: false });
      }
    });
    return unsubscribe;
  }, []);

  const { user, userProfile, loading } = authState;

  const logout = async () => {
    await firebaseSignOut(auth);
    setGuestMode(false);
    setAuthState({ user: null, userProfile: null, loading: false });
  };

  const refreshUserProfile = async () => {
    if (user) {
      const profile = await fetchUserProfile(user.uid);
      setUserProfile(profile);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      userProfile,
      loading,
      logout,
      guestMode,
      setGuestMode,
      refreshUserProfile,
      setUserProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};