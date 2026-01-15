// Import Firebase core
import { initializeApp } from "firebase/app";

// Firebase services
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyCu10zr3U6kXNIaxMYQtHjMFzi-kkTQrVA",
  authDomain: "snippix-d86db.firebaseapp.com",
  projectId: "snippix-d86db",
  storageBucket: "snippix-d86db.appspot.com",
  messagingSenderId: "187852135764",
  appId: "1:187852135764:web:0e0ee5fc60cbe88cac3cc1",
};

// Init Firebase
const app = initializeApp(firebaseConfig);

// Exports
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// ----------------------------
// AUTH HELPERS
// ----------------------------

// ✅ Signup with REAL email
export const registerUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// ✅ Login with REAL email
export const loginUser = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};
