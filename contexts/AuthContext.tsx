import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { getUserProfile, signOut as firebaseSignOut } from '@/lib/services/auth';
import { UserProfile } from '@/types';
import { Alert, Platform } from 'react-native';

interface AuthContextType {
    user: User | null;
    userProfile: UserProfile | null;
    loading: boolean;
    signOut: () => Promise<void>;
    refreshUserProfile: () => Promise<void>;
    setUserProfile: (profile: UserProfile | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    // Listen to auth state changes
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                try {
                    // Check for admin claim
                    const tokenResult = await firebaseUser.getIdTokenResult();
                    const isAdminClaim = !!tokenResult.claims.admin;

                    const profile = await getUserProfile(firebaseUser.uid);

                    if (profile) {
                        // Merge admin claim source
                        profile.isAdmin = profile.isAdmin || isAdminClaim;

                        if (profile.isBlocked) {
                            if (Platform.OS === 'web') {
                                window.alert('Access Denied: Your account has been blocked by the admin.');
                            } else {
                                Alert.alert('Access Denied', 'Your account has been blocked by the admin.');
                            }
                            await firebaseSignOut();
                            setUser(null);
                            setUserProfile(null);
                            setLoading(false);
                            return;
                        }
                        setUserProfile(profile);
                    }
                } catch (error) {
                    console.error('Error fetching user profile:', error);
                }
            } else {
                setUser(null);
                setUserProfile(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const refreshUserProfile = async () => {
        if (user) {
            const profile = await getUserProfile(user.uid);
            setUserProfile(profile);
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut();
            setUser(null);
            setUserProfile(null);
        } catch (error) {
            console.error('Error signing out:', error);
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            userProfile,
            loading,
            signOut,
            refreshUserProfile,
            setUserProfile,
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
