// src/firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBc4_TiX99vS2DGqK65wZCDPG7w6ePPO1E",
  authDomain: "diseaseprediction-e3464.firebaseapp.com",
  projectId: "diseaseprediction-e3464",
  storageBucket: "diseaseprediction-e3464.firebasestorage.app",
  messagingSenderId: "427226273867",
  appId: "1:427226273867:web:a894a81be17cf6788955ce",
  measurementId: "G-7HQDF7H631"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
