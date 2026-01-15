import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { registerUser, loginUser, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import { sendEmailVerification } from "firebase/auth";

export default function AuthCard({ onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState(""); // ✅ NEW
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isSignUp) {
        // =====================
        // SIGN UP FLOW
        // =====================
        const userCred = await registerUser(email, password);
        const user = userCred.user;

        // 🔥 SEND VERIFICATION EMAIL
        await sendEmailVerification(user);

        // Store profile
        await setDoc(doc(db, "users", user.uid), {
          fullName,
          username,
          email,
          createdAt: Date.now(),
        });

        alert("Verification email sent. Please verify before logging in.");
        return; // ⛔ block access until verified
      } else {
        // =====================
        // LOGIN FLOW
        // =====================
        const userCred = await loginUser(email, password);
        const user = userCred.user;

        await user.reload();

        if (!user.emailVerified) {
          alert("Please verify your email before continuing.");
          return;
        }
      }

      onAuthSuccess();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-transparent">
      <div className="relative w-[800px] h-[480px] rounded-2xl shadow-2xl overflow-hidden flex bg-white">

        {/* Sliding Black Panel */}
        <motion.div
          animate={{ x: isSignUp ? "100%" : "0%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-1/2 h-full z-20 bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-center px-8 text-center"
        >
          <h3 className="text-3xl font-bold mb-4">
            {isSignUp ? "Hello, Friend!" : "New Here?"}
          </h3>
          <p className="mb-6 text-white/80">
            {isSignUp
              ? "Already have an account? Sign in and continue your journey!"
              : "Create your account and start sharing your Snippix moments!"}
          </p>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="border-2 border-white px-6 py-2 rounded-full font-semibold hover:bg-white hover:text-gray-900 transition"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </motion.div>

        {/* Forms */}
        <div className="relative z-10 w-full flex">

          {/* SIGN IN */}
          <motion.div
            animate={{ x: isSignUp ? "-100%" : "0%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="w-1/2 flex items-center justify-center p-8"
          >
            {!isSignUp && (
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 400 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
                  Welcome Back
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded-xl"
                  >
                    Sign In
                  </button>
                </form>
              </motion.div>
            )}
          </motion.div>

          {/* SIGN UP */}
          <motion.div
            animate={{ x: isSignUp ? "-100%" : "0%" }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="w-1/2 flex items-center justify-center p-8"
          >
            {isSignUp && (
              <motion.div
                initial={{ opacity: 0, x: -100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full"
              >
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">
                  Create Account
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-3 border rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3 border rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <button
                    type="submit"
                    className="w-full bg-sky-500 text-white py-2 rounded-xl"
                  >
                    Sign Up
                  </button>
                </form>
              </motion.div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
