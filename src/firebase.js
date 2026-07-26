// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAsQi6P00b9DAAxnIF9uHAPIM_EHwWZls8",
  authDomain: "aurexia-2026.firebaseapp.com",
  projectId: "aurexia-2026",
  storageBucket: "aurexia-2026.firebasestorage.app",
  messagingSenderId: "979854837387",
  appId: "1:979854837387:web:7aed8d1f4aee483e65768e",
  measurementId: "G-JRBY6JC5DK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const auth = getAuth(app);
const db = getFirestore(app);

export { app, analytics, auth, db };
