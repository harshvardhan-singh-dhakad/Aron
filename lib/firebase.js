import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCOMs85y6MOLN7tWhyME_CzSiq623pWVWo",
  authDomain: "aron-one.firebaseapp.com",
  projectId: "aron-one",
  storageBucket: "aron-one.firebasestorage.app",
  messagingSenderId: "618750765784",
  appId: "1:618750765784:web:346498128a842ace4a85ad"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);