// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD2r7HlLK3ZKKcG_kcw-XXJl1x7qr2YAak",
  authDomain: "aurexia-2ec0a.firebaseapp.com",
  projectId: "aurexia-2ec0a",
  storageBucket: "aurexia-2ec0a.firebasestorage.app",
  messagingSenderId: "897622683258",
  appId: "1:897622683258:web:c441a3b620181480cad5c3",
  measurementId: "G-M58L7GW620"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
