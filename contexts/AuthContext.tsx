import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { Platform } from 'react-native';
import { auth } from '@/lib/firebase';
import { getUserProfile, signOut as firebaseSignOut } from '@/lib/services/auth';
import { UserProfile } from '@/types';

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
        // Check for persisted test user (Web only)
        if (Platform.OS === 'web') {
            const savedProfile = localStorage.getItem('aron_test_profile');
            if (savedProfile) {
                try {
                    const parsedProfile = JSON.parse(savedProfile);
                    // Restore dates from strings
                    parsedProfile.createdAt = new Date(parsedProfile.createdAt);
                    parsedProfile.updatedAt = new Date(parsedProfile.updatedAt);
                    setUserProfile(parsedProfile);
                    // Also mock the user object if needed for logic checks
                    setUser({ uid: parsedProfile.id, phoneNumber: parsedProfile.phoneNumber } as User);
                } catch (e) {
                    console.error('Failed to restore profile', e);
                }
            }
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (Platform.OS === 'web') {
                // If real Firebase user exists, it overrides test user
                if (firebaseUser) {
                    setUser(firebaseUser);
                    const profile = await getUserProfile(firebaseUser.uid);
                    setUserProfile(profile);

                    // Clear test profile if real login happens
                    localStorage.removeItem('aron_test_profile');
                } else {
                    // If no firebase user, we might still have the test user from local storage
                    // So don't strictly set user to null if we have a test profile
                    const savedProfile = localStorage.getItem('aron_test_profile');
                    if (!savedProfile) {
                        setUser(null);
                        setUserProfile(null);
                    }
                }
            }
            setLoading(false);
        });

        // For native platforms, just set loading to false
        if (Platform.OS !== 'web') {
            setLoading(false);
        }

        return () => unsubscribe();
    }, []);

    const saveProfileLocally = (profile: UserProfile | null) => {
        setUserProfile(profile);
        if (Platform.OS === 'web') {
            if (profile) {
                localStorage.setItem('aron_test_profile', JSON.stringify(profile));
            } else {
                localStorage.removeItem('aron_test_profile');
            }
        }
    };

    const refreshUserProfile = async () => {
        if (userProfile?.id) {
            const profile = await getUserProfile(userProfile.id);
            if (profile) {
                setUserProfile(profile);
            }
        } else if (user) {
            const profile = await getUserProfile(user.uid);
            setUserProfile(profile);
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut();
            setUser(null);
            saveProfileLocally(null); // Clear local storage
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
            setUserProfile: saveProfileLocally // Use the wrapper
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
