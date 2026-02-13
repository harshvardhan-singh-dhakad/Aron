import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth, Auth, initializeRecaptchaConfig } from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { Platform } from 'react-native';

// Firebase configuration for Aron project
const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || 'AIzaSyCOMs85y6MOLN7tWhyME_CzSiq623pWVWo',
    authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || 'aron-one.firebaseapp.com',
    projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || 'aron-one',
    storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || 'aron-one.firebasestorage.app',
    messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '618750765784',
    appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '1:618750765784:web:346498128a842ace4a85ad',
};

// Initialize Firebase
let app: FirebaseApp;
let auth: Auth;
let db: Firestore;
let storage: FirebaseStorage;

if (!getApps().length) {
    app = initializeApp(firebaseConfig);
} else {
    app = getApp();
}

auth = getAuth(app);
db = getFirestore(app);
storage = getStorage(app);

// Initialize reCAPTCHA Enterprise config for phone auth on web
if (Platform.OS === 'web') {
    initializeRecaptchaConfig(auth)
        .then(() => {
            console.log('reCAPTCHA Enterprise config initialized successfully');
        })
        .catch((error) => {
            console.error('reCAPTCHA Enterprise config initialization error:', error);
        });
}

export { app, auth, db, storage };
