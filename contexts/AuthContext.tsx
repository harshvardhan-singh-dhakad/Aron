import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfile } from '@/types';

// Mock user for demo mode (no Firebase required)
interface MockUser {
    uid: string;
    phoneNumber: string;
}

interface AuthContextType {
    user: MockUser | null;
    userProfile: UserProfile | null;
    loading: boolean;
    signOut: () => Promise<void>;
    refreshUserProfile: () => Promise<void>;
    mockLogin: (phoneNumber: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<MockUser | null>(null);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(false);

    const mockLogin = (phoneNumber: string) => {
        const mockUser: MockUser = {
            uid: 'mock-user-123',
            phoneNumber: `+91${phoneNumber}`,
        };
        setUser(mockUser);

        // Create mock profile
        const mockProfile: UserProfile = {
            id: mockUser.uid,
            phoneNumber: mockUser.phoneNumber,
            name: 'Demo User',
            location: 'Jaipur, Rajasthan',
            profileCompleted: true,
            verificationStatus: 'approved', // Set to approved for demo
            isAdmin: true, // Enable admin for demo
            createdAt: new Date(),
            updatedAt: new Date(),
        };
        setUserProfile(mockProfile);
    };

    const refreshUserProfile = async () => {
        // In demo mode, profile is already set
    };

    const signOut = async () => {
        setUser(null);
        setUserProfile(null);
    };

    return (
        <AuthContext.Provider value={{ user, userProfile, loading, signOut, refreshUserProfile, mockLogin }}>
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
