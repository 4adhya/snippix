import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

import {
  registerUser,
  loginUser,
  loginWithGoogle,
  db,
} from "../firebase";

import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { sendEmailVerification } from "firebase/auth";

import { useUser } from "../context/UserContext";

/* ============================================
   GOOGLE ICON
============================================ */

const GoogleIcon = () => {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 48 48"
      aria-hidden="true"
    >
      <path
        fill="#FFC107"
        d="M43.6 20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l6-6C34.4 5.7 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11.6 0 19.3-8.1 19.3-19.5 0-1.5-.1-2.7-.3-4.5z"
      />

      <path
        fill="#FF3D00"
        d="M6.3 14.7l6.6 4.8C14.7 15.1 18.9 12 24 12c3.1 0 5.9 1.2 8 3.1l6-6C34.4 5.7 29.5 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"
      />

      <path
        fill="#4CAF50"
        d="M24 44c5.3 0 10.1-1.8 13.7-4.9l-6.3-5.2C29.5 35.3 26.9 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.5 5C9.5 39.4 16.2 44 24 44z"
      />

      <path
        fill="#1976D2"
        d="M43.6 20H24v8h11.3c-.8 2.3-2.3 4.3-4.4 5.7l6.3 5.2C40.9 35.5 44 30.5 44 24.5c0-1.5-.1-2.7-.4-4.5z"
      />
    </svg>
  );
};

/* ============================================
   AUTH CARD
============================================ */

export default function AuthCard({ onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);

  const [fullName, setFullName] = useState("");

  const [username, setUsername] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [usernameStatus, setUsernameStatus] =
    useState("idle");

  const [isGoogleLoading, setIsGoogleLoading] =
    useState(false);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const { setUser } = useUser();

  /* ============================================
     USERNAME AVAILABILITY CHECK
  ============================================ */

  useEffect(() => {
    if (!isSignUp) {
      setUsernameStatus("idle");

      return;
    }

    const cleanUsername = username
      .trim()
      .toLowerCase();

    if (!cleanUsername) {
      setUsernameStatus("idle");

      return;
    }

    setUsernameStatus("checking");

    const timeout = setTimeout(async () => {
      try {
        const usernameRef = doc(
          db,
          "usernames",
          cleanUsername
        );

        const usernameSnap = await getDoc(
          usernameRef
        );

        setUsernameStatus(
          usernameSnap.exists()
            ? "taken"
            : "available"
        );
      } catch (error) {
        console.error(
          "Username check error:",
          error
        );

        setUsernameStatus("idle");
      }
    }, 400);

    return () => clearTimeout(timeout);
  }, [username, isSignUp]);

  /* ============================================
     EMAIL AUTH
  ============================================ */

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    try {
      setIsSubmitting(true);

      /* ========================================
         SIGN UP
      ======================================== */

      if (isSignUp) {
        const cleanFullName = fullName.trim();

        const cleanUsername = username
          .trim()
          .toLowerCase();

        const cleanEmail = email
          .trim()
          .toLowerCase();

        if (!cleanFullName) {
          alert("Please enter your full name.");

          return;
        }

        if (!cleanUsername) {
          alert("Please choose a username.");

          return;
        }

        if (usernameStatus === "checking") {
          alert(
            "Please wait while we check your username."
          );

          return;
        }

        if (usernameStatus === "taken") {
          alert(
            "This username is already taken."
          );

          return;
        }

        if (!cleanEmail) {
          alert("Please enter your email.");

          return;
        }

        if (password.length < 6) {
          alert(
            "Password must be at least 6 characters."
          );

          return;
        }

        /* Firebase user */

        const user = await registerUser(
          cleanEmail,
          password
        );

        const uid = user.uid;

        /* Save username + user */

        await runTransaction(db, async (tx) => {
          const usernameRef = doc(
            db,
            "usernames",
            cleanUsername
          );

          const userRef = doc(
            db,
            "users",
            uid
          );

          const usernameSnap = await tx.get(
            usernameRef
          );

          if (usernameSnap.exists()) {
            throw new Error("USERNAME_TAKEN");
          }

          tx.set(usernameRef, {
            uid,
            createdAt: serverTimestamp(),
          });

          tx.set(userRef, {
            uid,

            fullName: cleanFullName,

            displayName: cleanFullName,

            username: cleanUsername,

            email: cleanEmail,

            photoURL: "",

            bio: "",

            country: "",

            emailVerified: false,

            profileCompleted: true,

            authProvider: "password",

            createdAt: serverTimestamp(),
          });
        });

        /* Send email verification */

        await sendEmailVerification(user);

        alert(
          "Verification email sent. Please verify your email before signing in."
        );

        /* Switch back to sign in */

        setIsSignUp(false);

        setFullName("");

        setUsername("");

        setPassword("");

        setUsernameStatus("idle");

        return;
      }

      /* ========================================
         SIGN IN
      ======================================== */

      const cleanUsername = email
        .trim()
        .toLowerCase();

      if (!cleanUsername) {
        alert("Please enter your username.");

        return;
      }

      if (!password) {
        alert("Please enter your password.");

        return;
      }

      /* Find username */

      const usernameRef = doc(
        db,
        "usernames",
        cleanUsername
      );

      const usernameSnap = await getDoc(
        usernameRef
      );

      if (!usernameSnap.exists()) {
        alert("Invalid username.");

        return;
      }

      const uid = usernameSnap.data().uid;

      /* Get user */

      const userRef = doc(
        db,
        "users",
        uid
      );

      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        alert("User account not found.");

        return;
      }

      const userData = userDoc.data();

      const realEmail = userData.email;

      /* Firebase login */

      const user = await loginUser(
        realEmail,
        password
      );

      await user.reload();

      /* Check email verification */

      if (!user.emailVerified) {
        alert(
          "Please verify your email before signing in."
        );

        return;
      }

      /* Update verification status */

      await updateDoc(userRef, {
        emailVerified: true,
      });

      /* Save user in context */

      setUser({
        uid,

        username: userData.username,

        fullName: userData.fullName,

        email: userData.email,

        photoURL: userData.photoURL || "",

        authProvider:
          userData.authProvider || "password",
      });

      /* Login success */

      onAuthSuccess();
    } catch (err) {
      console.error("Authentication Error:", err);

      if (err.message === "USERNAME_TAKEN") {
        alert(
          "This username is already taken."
        );

        return;
      }

      if (
        err.code === "auth/email-already-in-use"
      ) {
        alert(
          "An account with this email already exists."
        );

        return;
      }

      if (err.code === "auth/invalid-email") {
        alert("Please enter a valid email.");

        return;
      }

      if (err.code === "auth/weak-password") {
        alert(
          "Password must be at least 6 characters."
        );

        return;
      }

      if (
        err.code === "auth/invalid-credential"
      ) {
        alert(
          "Incorrect username or password."
        );

        return;
      }

      alert(
        err.message ||
          "Authentication failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ============================================
     GOOGLE AUTHENTICATION
  ============================================ */

  const handleGoogleLogin = async () => {
    if (isGoogleLoading) {
      return;
    }

    try {
      setIsGoogleLoading(true);

      const result = await loginWithGoogle();

      const firebaseUser = result.user;

      /* ========================================
         NEW GOOGLE USER
      ======================================== */

      if (
        result.isNewUser ||
        !result.profileCompleted
      ) {
        setUser({
          uid: firebaseUser.uid,

          username: "",

          fullName:
            firebaseUser.displayName || "",

          email: firebaseUser.email || "",

          photoURL:
            firebaseUser.photoURL || "",

          authProvider: "google",

          profileCompleted: false,
        });

        /*
          Let App.jsx move the authenticated
          user into the application.

          SetupProfile.jsx can detect
          profileCompleted === false.
        */

        onAuthSuccess();

        return;
      }

      /* ========================================
         EXISTING GOOGLE USER
      ======================================== */

      const userRef = doc(
        db,
        "users",
        firebaseUser.uid
      );

      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        alert(
          "Your Snippix profile could not be found."
        );

        return;
      }

      const userData = userSnap.data();

      setUser({
        uid: firebaseUser.uid,

        username: userData.username || "",

        fullName:
          userData.fullName ||
          userData.displayName ||
          firebaseUser.displayName ||
          "",

        email:
          userData.email ||
          firebaseUser.email ||
          "",

        photoURL:
          userData.photoURL ||
          firebaseUser.photoURL ||
          "",

        authProvider: "google",

        profileCompleted:
          userData.profileCompleted === true,
      });

      onAuthSuccess();
    } catch (err) {
      console.error(
        "Google Authentication Error:",
        err
      );

      if (
        err.code ===
        "auth/popup-closed-by-user"
      ) {
        return;
      }

      if (
        err.code ===
        "auth/cancelled-popup-request"
      ) {
        return;
      }

      if (
        err.code ===
        "auth/popup-blocked"
      ) {
        alert(
          "Google sign-in popup was blocked. Please allow popups and try again."
        );

        return;
      }

      if (
        err.code ===
        "auth/unauthorized-domain"
      ) {
        alert(
          "This domain is not authorized in Firebase Authentication."
        );

        return;
      }

      alert(
        "Google sign-in failed. Please try again."
      );
    } finally {
      setIsGoogleLoading(false);
    }
  };

  /* ============================================
     UI
  ============================================ */

  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent">
      <div className="relative w-[800px] h-[520px] overflow-hidden rounded-2xl shadow-2xl bg-[#f8f3ed]">
        <motion.div
          animate={{
            x: isSignUp ? "-800px" : "0px",
          }}
          transition={{
            duration: 0.6,
            ease: "easeInOut",
          }}
          className="flex w-[1600px] h-full"
        >
          {/* ====================================
              SIGN IN SECTION
          ==================================== */}

          <div className="w-[800px] flex">
            {/* LEFT PANEL */}

            <div className="w-1/2 bg-gradient-to-br from-[#2b1f1a] to-[#3e2c24] text-white flex flex-col items-center justify-center px-8 text-center">
              <h3 className="text-3xl font-bold mb-4">
                New Here?
              </h3>

              <p className="mb-6 text-white/80">
                Create your account and start
                sharing your Snippix moments!
              </p>

              <button
                type="button"
                onClick={() => {
                  setIsSignUp(true);

                  setEmail("");

                  setPassword("");
                }}
                className="border-2 border-[#f1e3d3] px-6 py-2 rounded-full font-semibold hover:bg-[#f1e3d3] hover:text-[#2b1f1a] transition"
              >
                Sign Up
              </button>
            </div>

            {/* RIGHT FORM */}

            <div className="w-1/2 flex items-center justify-center p-8">
              <div className="w-full">
                <h2 className="text-3xl font-bold mb-6 text-center text-[#2b1f1a]">
                  Welcome Back
                </h2>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <input
                    type="text"
                    placeholder="Username"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    className="w-full p-3 border border-[#d6c5b5] rounded-xl bg-white text-[#2b1f1a] placeholder-[#9b8b7a] outline-none focus:ring-2 focus:ring-[#d6c5b5]"
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    className="w-full p-3 border border-[#d6c5b5] rounded-xl bg-white text-[#2b1f1a] placeholder-[#9b8b7a] outline-none focus:ring-2 focus:ring-[#d6c5b5]"
                  />

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-full bg-[#f1e3d3] text-[#2b1f1a] font-medium shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting
                      ? "Signing In..."
                      : "Sign In"}
                  </button>
                </form>

                {/* DIVIDER */}

                <div className="flex items-center gap-3 my-4">
                  <div className="flex-1 h-px bg-[#d6c5b5]" />

                  <span className="text-xs text-[#9b8b7a]">
                    or continue with
                  </span>

                  <div className="flex-1 h-px bg-[#d6c5b5]" />
                </div>

                {/* GOOGLE BUTTON */}

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading}
                  className="w-full py-3 rounded-xl border border-[#d6c5b5] bg-white text-[#2b1f1a] font-medium flex items-center justify-center gap-3 transition duration-300 hover:bg-[#fffaf6] hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <GoogleIcon />

                  <span>
                    {isGoogleLoading
                      ? "Connecting..."
                      : "Continue with Google"}
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* ====================================
              SIGN UP SECTION
          ==================================== */}

          <div className="w-[800px] flex">
            {/* LEFT FORM */}

            <div className="w-1/2 flex items-center justify-center p-8">
              <div className="w-full">
                <h2 className="text-3xl font-bold mb-5 text-center text-[#2b1f1a]">
                  Create Account
                </h2>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-3"
                >
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) =>
                      setFullName(e.target.value)
                    }
                    className="w-full p-3 border border-[#d6c5b5] rounded-xl bg-white text-[#2b1f1a] placeholder-[#9b8b7a] outline-none focus:ring-2 focus:ring-[#d6c5b5]"
                  />

                  <div>
                    <input
                      type="text"
                      placeholder="Username"
                      value={username}
                      onChange={(e) =>
                        setUsername(e.target.value)
                      }
                      className="w-full p-3 border border-[#d6c5b5] rounded-xl bg-white text-[#2b1f1a] placeholder-[#9b8b7a] outline-none focus:ring-2 focus:ring-[#d6c5b5]"
                    />

                    {usernameStatus ===
                      "checking" && (
                      <p className="text-xs mt-1 ml-1 text-[#9b8b7a]">
                        Checking username...
                      </p>
                    )}

                    {usernameStatus ===
                      "available" && (
                      <p className="text-xs mt-1 ml-1 text-[#556b5d]">
                        Username available ✓
                      </p>
                    )}

                    {usernameStatus ===
                      "taken" && (
                      <p className="text-xs mt-1 ml-1 text-red-500">
                        Username already taken
                      </p>
                    )}
                  </div>

                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                      setEmail(e.target.value)
                    }
                    className="w-full p-3 border border-[#d6c5b5] rounded-xl bg-white text-[#2b1f1a] placeholder-[#9b8b7a] outline-none focus:ring-2 focus:ring-[#d6c5b5]"
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    className="w-full p-3 border border-[#d6c5b5] rounded-xl bg-white text-[#2b1f1a] placeholder-[#9b8b7a] outline-none focus:ring-2 focus:ring-[#d6c5b5]"
                  />

                  <button
                    type="submit"
                    disabled={
                      isSubmitting ||
                      usernameStatus === "taken" ||
                      usernameStatus === "checking"
                    }
                    className="w-full py-3 rounded-full bg-[#556b5d] text-white font-medium shadow-lg transition hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting
                      ? "Creating Account..."
                      : "Sign Up"}
                  </button>
                </form>

                {/* GOOGLE SIGNUP */}

                <div className="flex items-center gap-3 my-3">
                  <div className="flex-1 h-px bg-[#d6c5b5]" />

                  <span className="text-xs text-[#9b8b7a]">
                    or
                  </span>

                  <div className="flex-1 h-px bg-[#d6c5b5]" />
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={isGoogleLoading}
                  className="w-full py-3 rounded-xl border border-[#d6c5b5] bg-white text-[#2b1f1a] font-medium flex items-center justify-center gap-3 transition duration-300 hover:bg-[#fffaf6] hover:-translate-y-0.5 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <GoogleIcon />

                  <span>
                    {isGoogleLoading
                      ? "Connecting..."
                      : "Sign up with Google"}
                  </span>
                </button>
              </div>
            </div>

            {/* RIGHT PANEL */}

            <div className="w-1/2 bg-gradient-to-br from-[#2b1f1a] to-[#3e2c24] text-white flex flex-col items-center justify-center px-8 text-center">
              <h3 className="text-3xl font-bold mb-4">
                Welcome Back
              </h3>

              <p className="mb-6 text-white/80">
                Already have an account? Sign in
                and continue your journey!
              </p>

              <button
                type="button"
                onClick={() => {
                  setIsSignUp(false);

                  setEmail("");

                  setPassword("");
                }}
                className="border-2 border-[#f1e3d3] px-6 py-2 rounded-full font-semibold hover:bg-[#f1e3d3] hover:text-[#2b1f1a] transition"
              >
                Sign In
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}