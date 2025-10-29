// src/firebase.jsx

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore"; // Optional: if you're using Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJXloTazGQwBqlDYOpUR5aPm_dbqLtbCw",
  authDomain: "nairobiteaaa.firebaseapp.com",
  projectId: "nairobiteaaa",
  storageBucket: "nairobiteaaa.appspot.com", // ✅ FIXED: correct domain
  messagingSenderId: "433894955815",
  appId: "1:433894955815:web:a469fddc91595ed80b2702",
  measurementId: "G-318QKYYFE9",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Export initialized services
export const analytics = getAnalytics(app);
export const storage = getStorage(app); // ✅ Use later if you re-enable Firebase Storage
export const db = getFirestore(app);    // ✅ Optional: for storing your news data
