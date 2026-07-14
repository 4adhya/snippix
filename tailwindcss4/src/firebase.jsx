// ============================================
// FIREBASE CORE
// ============================================

import { initializeApp } from "firebase/app";


// ============================================
// FIREBASE AUTHENTICATION
// ============================================

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";


// ============================================
// FIRESTORE
// ============================================

import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";


// ============================================
// FIREBASE STORAGE
// ============================================

import { getStorage } from "firebase/storage";


// ============================================
// FIREBASE CONFIG
// ============================================

const firebaseConfig = {
  apiKey: "AIzaSyCu10zr3U6kXNIaxMYQtHjMFzi-kkTQrVA",

  authDomain: "snippix-d86db.firebaseapp.com",

  projectId: "snippix-d86db",

  storageBucket: "snippix-d86db.appspot.com",

  messagingSenderId: "187852135764",

  appId: "1:187852135764:web:0e0ee5fc60cbe88cac3cc1",
};


// ============================================
// INITIALIZE FIREBASE
// ============================================

const app = initializeApp(firebaseConfig);


// ============================================
// FIREBASE SERVICES
// ============================================

export const auth = getAuth(app);

export const db = getFirestore(app);

export const storage = getStorage(app);


// ============================================
// GOOGLE AUTH PROVIDER
// ============================================

export const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: "select_account",
});


// ============================================
// EMAIL / PASSWORD SIGNUP
// ============================================

export const registerUser = async (email, password) => {
  try {
    const result = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    return result.user;
  } catch (error) {
    console.error("Signup Error:", error);

    throw error;
  }
};


// ============================================
// EMAIL / PASSWORD LOGIN
// ============================================

export const loginUser = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );

    return result.user;
  } catch (error) {
    console.error("Login Error:", error);

    throw error;
  }
};


// ============================================
// GOOGLE AUTHENTICATION
// ============================================

export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(
      auth,
      googleProvider
    );

    const user = result.user;

    console.log("Google User:", user);

    // Firestore user document reference
    const userRef = doc(
      db,
      "users",
      user.uid
    );

    // Check if user already exists
    const userSnapshot = await getDoc(userRef);


    // ========================================
    // NEW GOOGLE USER
    // ========================================

    if (!userSnapshot.exists()) {
      await setDoc(userRef, {
        uid: user.uid,

        email: user.email || "",

        displayName: user.displayName || "",

        photoURL: user.photoURL || "",

        username: "",

        bio: "",

        country: "",

        profileCompleted: false,

        authProvider: "google",

        createdAt: serverTimestamp(),
      });

      return {
        user: user,
        isNewUser: true,
        profileCompleted: false,
      };
    }


    // ========================================
    // EXISTING GOOGLE USER
    // ========================================

    const userData = userSnapshot.data();

    return {
      user: user,

      isNewUser: false,

      profileCompleted:
        userData.profileCompleted || false,
    };

  } catch (error) {
    console.error(
      "Google Authentication Error:",
      error
    );

    throw error;
  }
};


// ============================================
// LOGOUT USER
// ============================================

export const logoutUser = async () => {
  try {
    await signOut(auth);

    console.log("User logged out successfully");

  } catch (error) {
    console.error(
      "Logout Error:",
      error
    );

    throw error;
  }
};


// ============================================
// EXPORT FIREBASE APP
// ============================================

export default app;