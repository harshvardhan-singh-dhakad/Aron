import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCv6Xd7XnZNgKIcQEvjZAmPY9gLpzjD2Xw",
  authDomain: "studio-5286972787-462c3.firebaseapp.com",
  databaseURL: "https://studio-5286972787-462c3-default-rtdb.firebaseio.com",
  projectId: "studio-5286972787-462c3",
  storageBucket: "studio-5286972787-462c3.firebasestorage.app",
  messagingSenderId: "619017115616",
  appId: "1:619017115616:web:1b6872a857d9da542f7d85"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);