import {
    signInWithPhoneNumber,
    RecaptchaVerifier,
    ConfirmationResult,
    signOut as firebaseSignOut,
} from 'firebase/auth';
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    collection,
    getDocs,
    query,
    orderBy,
    serverTimestamp
} from 'firebase/firestore';
import { Platform } from 'react-native';
import { auth, db } from '../firebase';
import { UserProfile } from '@/types';

// Store confirmation result for OTP verification
let confirmationResult: ConfirmationResult | null = null;

// reCAPTCHA verifier instance
let recaptchaVerifier: RecaptchaVerifier | null = null;

// Check if running on localhost (Phone auth doesn't work on localhost)
const isLocalhost = (): boolean => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return false;
    const hostname = window.location.hostname;
    return hostname === 'localhost' || hostname === '127.0.0.1';
};

// Initialize RecaptchaVerifier for web
export const initRecaptcha = (containerId: string): RecaptchaVerifier | null => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') {
        return null;
    }

    try {
        // Clean up existing verifier
        if (recaptchaVerifier) {
            try {
                recaptchaVerifier.clear();
            } catch (e) {
                // ignore cleanup errors
            }
            recaptchaVerifier = null;
        }

        // Ensure container exists and is clean
        let container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '';
        } else {
            container = document.createElement('div');
            container.id = containerId;
            document.body.appendChild(container);
        }

        recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
            size: 'invisible',
            callback: () => {
                console.log('reCAPTCHA verified successfully');
            },
            'expired-callback': () => {
                console.log('reCAPTCHA expired');
                recaptchaVerifier = null;
            },
        });

        return recaptchaVerifier;
    } catch (error) {
        console.error('RecaptchaVerifier initialization error:', error);
        return null;
    }
};

// Send OTP to phone number
export const sendOTP = async (phoneNumber: string): Promise<boolean> => {
    const formattedPhone = phoneNumber.startsWith('+91') ? phoneNumber : `+91${phoneNumber}`;

    if (Platform.OS !== 'web') {
        throw new Error('Phone auth is only supported on web platform currently.');
    }

    // Firebase Phone Auth does NOT work on localhost
    // Users must add test phone numbers in Firebase Console for local development
    // OR deploy to a real domain
    if (isLocalhost()) {
        console.warn(
            '⚠️ Firebase Phone Auth does NOT work on localhost!\n' +
            'Two options:\n' +
            '1. Add test phone numbers in Firebase Console > Authentication > Phone > Test phone numbers\n' +
            '2. Deploy to a real domain (Firebase Hosting)\n' +
            'Attempting anyway with test phone numbers...'
        );
    }

    try {
        // Always create a fresh RecaptchaVerifier for each attempt
        const verifier = initRecaptcha('recaptcha-container');

        if (!verifier) {
            throw new Error('Could not initialize reCAPTCHA. Please refresh the page and try again.');
        }

        console.log('Sending OTP to:', formattedPhone);
        confirmationResult = await signInWithPhoneNumber(auth, formattedPhone, verifier);
        console.log('OTP sent successfully!');
        return true;
    } catch (error: any) {
        console.error('Firebase Phone Auth error:', error.code, error.message);

        // Clean up reCAPTCHA on error
        if (recaptchaVerifier) {
            try {
                recaptchaVerifier.clear();
            } catch (e) { }
            recaptchaVerifier = null;
        }

        // Provide user-friendly error messages
        switch (error.code) {
            case 'auth/invalid-app-credential':
                if (isLocalhost()) {
                    throw new Error(
                        'Phone auth does not work on localhost. ' +
                        'Please add test phone numbers in Firebase Console → Authentication → Phone → Test phone numbers, ' +
                        'OR deploy to Firebase Hosting.'
                    );
                }
                throw new Error('Firebase phone auth configuration error. Please check reCAPTCHA setup.');
            case 'auth/captcha-check-failed':
                throw new Error('reCAPTCHA verification failed. Please refresh the page and try again.');
            case 'auth/missing-app-credential':
                throw new Error('Missing app credential. Please ensure reCAPTCHA is properly configured.');
            case 'auth/quota-exceeded':
                throw new Error('SMS quota exceeded. Please try again later.');
            case 'auth/too-many-requests':
                throw new Error('Too many OTP requests. Please wait a few minutes before trying again.');
            case 'auth/invalid-phone-number':
                throw new Error('Invalid phone number. Please enter a valid 10-digit number.');
            case 'auth/missing-phone-number':
                throw new Error('Please enter your phone number.');
            default:
                throw new Error(error.message || 'Failed to send OTP. Please try again.');
        }
    }
};

// Verify OTP and sign in
export const verifyOTP = async (otp: string): Promise<UserProfile | null> => {
    try {
        if (!confirmationResult) {
            throw new Error('No OTP request found. Please request OTP again.');
        }

        const userCredential = await confirmationResult.confirm(otp);
        const user = userCredential.user;

        // Check if user profile exists in Firestore
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

        if (error.code === 'auth/invalid-verification-code') {
            throw new Error('Invalid OTP. Please enter the correct code.');
        }
        if (error.code === 'auth/code-expired') {
            throw new Error('OTP has expired. Please request a new one.');
        }

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
                isBlocked: data.isBlocked || false,
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
        await firebaseSignOut(auth);
        confirmationResult = null;
    } catch (error) {
        console.error('Error signing out:', error);
        throw error;
    }
};

// Get all users (Admin only)
export const getAllUsers = async (): Promise<UserProfile[]> => {
    try {
        const usersRef = collection(db, 'users');
        const q = query(usersRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        return snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                phoneNumber: data.phoneNumber,
                name: data.name,
                location: data.location,
                profileCompleted: data.profileCompleted || false,
                verificationStatus: data.verificationStatus || 'none',
                isAdmin: data.isAdmin || false,
                isBlocked: data.isBlocked || false,
                createdAt: data.createdAt?.toDate() || new Date(),
                updatedAt: data.updatedAt?.toDate() || new Date(),
            } as UserProfile;
        });
    } catch (error) {
        console.error('Error getting all users:', error);
        return [];
    }
};

// Toggle user block status (Admin only)
export const toggleUserBlockStatus = async (uid: string, currentStatus: boolean): Promise<boolean> => {
    try {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
            isBlocked: !currentStatus,
            updatedAt: serverTimestamp(),
        });
        return true;
    } catch (error) {
        console.error('Error toggling user block status:', error);
        return false;
    }
};

// Delete user account data from Firestore (Admin only)
export const deleteUserAccount = async (uid: string): Promise<boolean> => {
    try {
        const userRef = doc(db, 'users', uid);
        await deleteDoc(userRef);
        return true;
    } catch (error) {
        console.error('Error deleting user account:', error);
        return false;
    }
};
