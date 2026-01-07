// Import Firebase core
import { initializeApp } from "firebase/app";

// Import Firebase services
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// 🔥 Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCu10zr3U6kXNIaxMYQtHjMFzi-kkTQrVA",
  authDomain: "snippix-d86db.firebaseapp.com",
  projectId: "snippix-d86db",

  // ✅ FIXED (VERY IMPORTANT)
  storageBucket: "snippix-d86db.appspot.com",

  messagingSenderId: "187852135764",
  appId: "1:187852135764:web:0e0ee5fc60cbe88cac3cc1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// ----------------------------
// AUTH HELPERS
// ----------------------------

// Create user (Signup) using username → internal email
export const registerUser = (username, password) => {
  const email = `${username}@snippix.app`; // Firebase requires email format
  return createUserWithEmailAndPassword(auth, email, password);
};

// Login user using username → internal email
export const loginUser = (username, password) => {
  const email = `${username}@snippix.app`;
  return signInWithEmailAndPassword(auth, email, password);
};
