import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBEGrbUvoOWEChV5hkGr1B4pHHjlvnbA8c",
  authDomain: "mis-finanzas-9bbc5.firebaseapp.com",
  projectId: "mis-finanzas-9bbc5",
  storageBucket: "mis-finanzas-9bbc5.firebasestorage.app",
  messagingSenderId: "952118782118",
  appId: "1:952118782118:web:a25aff0ab9db93b7c26c67"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();