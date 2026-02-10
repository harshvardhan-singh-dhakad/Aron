import {
    signInWithPhoneNumber,
    RecaptchaVerifier,
    ConfirmationResult,
    signOut as firebaseSignOut,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Platform } from 'react-native';
import { auth, db } from '../firebase';
import { UserProfile } from '@/types';

// Store confirmation result for OTP verification
let confirmationResult: ConfirmationResult | null = null;

// Store test credentials for development
const TEST_PHONE = '9999999999';
const TEST_OTP = '123456';

// Flag to track if we're using test mode
let isTestMode = false;
let pendingPhoneNumber = '';

// Initialize RecaptchaVerifier for web only
let recaptchaVerifier: RecaptchaVerifier | null = null;

export const initRecaptcha = (containerId: string) => {
    // Only initialize on web
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
        try {
            if (!recaptchaVerifier) {
                recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
                    size: 'invisible',
                    callback: () => {
                        console.log('reCAPTCHA solved');
                    },
                });
            }
        } catch (error) {
            console.error('RecaptchaVerifier error:', error);
        }
    }
    return recaptchaVerifier;
};

// Send OTP to phone number
export const sendOTP = async (phoneNumber: string): Promise<boolean> => {
    const formattedPhone = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`;
    pendingPhoneNumber = phoneNumber.replace(/^\+91/, '');

    // Check if it's a test phone number (for development)
    if (pendingPhoneNumber === TEST_PHONE) {
        console.log('Using test mode for phone:', pendingPhoneNumber);
        isTestMode = true;
        return true;
    }

    // For native platforms, inform user about test mode
    if (Platform.OS !== 'web') {
        console.log('Native platform detected - Using test mode');
        // For now, we'll use test mode on native
        // Real phone auth requires EAS Build + Firebase setup
        isTestMode = true;
        return true;
    }

    // Web platform - use real Firebase auth
    try {
        if (!recaptchaVerifier) {
            recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
                size: 'invisible',
            });
        }
        confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, recaptchaVerifier);
        isTestMode = false;
        return true;
    } catch (error: any) {
        console.error('Error sending OTP:', error);
        throw new Error(error.message || 'Failed to send OTP');
    }
};

// Verify OTP and sign in
export const verifyOTP = async (otp: string): Promise<UserProfile | null> => {
    // Test mode verification - optimized for speed
    if (isTestMode) {
        if (otp === TEST_OTP) {
            const testUserId = `test_user_${pendingPhoneNumber}`;

            // Return mock profile INSTANTLY - don't wait for Firestore
            const mockProfile: UserProfile = {
                id: testUserId,
                phoneNumber: `+91${pendingPhoneNumber}`,
                profileCompleted: false,
                verificationStatus: 'none',
                isAdmin: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            // Try to get existing profile from Firestore (with timeout)
            // If it exists, use that data; otherwise use mock
            try {
                const userProfileRef = doc(db, 'users', testUserId);
                const profilePromise = getDoc(userProfileRef);
                const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 3000));

                const result = await Promise.race([profilePromise, timeoutPromise]);

                if (result && 'exists' in result && result.exists()) {
                    const profileData = result.data();
                    return {
                        id: testUserId,
                        phoneNumber: `+91${pendingPhoneNumber}`,
                        name: profileData.name,
                        location: profileData.location,
                        profileCompleted: profileData.profileCompleted || false,
                        verificationStatus: profileData.verificationStatus || 'none',
                        isAdmin: profileData.isAdmin || false,
                        createdAt: profileData.createdAt?.toDate() || new Date(),
                        updatedAt: profileData.updatedAt?.toDate() || new Date(),
                    } as UserProfile;
                }
            } catch (error) {
                console.log('Firestore slow/unavailable, using local profile');
            }

            // Save to Firestore in background (fire-and-forget)
            const userProfileRef = doc(db, 'users', testUserId);
            setDoc(userProfileRef, {
                phoneNumber: `+91${pendingPhoneNumber}`,
                profileCompleted: false,
                verificationStatus: 'none',
                isAdmin: false,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            }, { merge: true }).catch((err) => console.log('Background save error:', err));

            return mockProfile;
        } else {
            throw new Error('Invalid OTP. Please enter the correct code.');
        }
    }

    // Real Firebase verification
    try {
        if (!confirmationResult) {
            throw new Error('No OTP request found. Please request OTP again.');
        }

        const userCredential = await confirmationResult.confirm(otp);
        const user = userCredential.user;

        // Check if user profile exists
        const userProfileRef = doc(db, 'users', user.uid);
        const userProfileSnap = await getDoc(userProfileRef);

        if (userProfileSnap.exists()) {
            const profileData = userProfileSnap.data();
            return {
                id: user.uid,
                phoneNumber: user.phoneNumber || '',
                name: profileData.name,
                location: profileData.location,
                profileCompleted: profileData.profileCompleted || false,
                verificationStatus: profileData.verificationStatus || 'none',
                isAdmin: profileData.isAdmin || false,
                createdAt: profileData.createdAt?.toDate() || new Date(),
                updatedAt: profileData.updatedAt?.toDate() || new Date(),
            } as UserProfile;
        } else {
            // Create new user profile
            const newProfile: Omit<UserProfile, 'id'> = {
                phoneNumber: user.phoneNumber || '',
                profileCompleted: false,
                verificationStatus: 'none',
                isAdmin: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            await setDoc(userProfileRef, {
                ...newProfile,
                createdAt: serverTimestamp(),
                updatedAt: serverTimestamp(),
            });

            return {
                id: user.uid,
                ...newProfile,
            } as UserProfile;
        }
    } catch (error: any) {
        console.error('Error verifying OTP:', error);
        throw new Error(error.message || 'Invalid OTP');
    }
};

// Get user profile from Firestore
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    try {
        const userProfileRef = doc(db, 'users', uid);
        const userProfileSnap = await getDoc(userProfileRef);

        if (userProfileSnap.exists()) {
            const data = userProfileSnap.data();
            return {
                id: uid,
                phoneNumber: data.phoneNumber,
                name: data.name,
                location: data.location,
                profileCompleted: data.profileCompleted || false,
                verificationStatus: data.verificationStatus || 'none',
                isAdmin: data.isAdmin || false,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            } as UserProfile;
        }
        return null;
    } catch (error) {
        console.error('Error getting user profile:', error);
        return null;
    }
};

// Update user profile
export const updateUserProfile = async (
    uid: string,
    updates: Partial<UserProfile>
): Promise<boolean> => {
    try {
        const userProfileRef = doc(db, 'users', uid);
        await updateDoc(userProfileRef, {
            ...updates,
            updatedAt: serverTimestamp(),
        });
        return true;
    } catch (error) {
        console.error('Error updating user profile:', error);
        return false;
    }
};

// Sign out
export const signOut = async (): Promise<void> => {
    try {
        if (!isTestMode) {
            await firebaseSignOut(auth);
        }
        confirmationResult = null;
        isTestMode = false;
        pendingPhoneNumber = '';
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
};
