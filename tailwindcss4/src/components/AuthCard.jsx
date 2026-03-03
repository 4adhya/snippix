import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { registerUser, loginUser, db } from "../firebase";
import {
  doc,
  getDoc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { sendEmailVerification } from "firebase/auth";
import { useUser } from "../context/UserContext";

export default function AuthCard({ onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usernameStatus, setUsernameStatus] = useState("idle");
  const { setUser } = useUser();

  useEffect(() => {
    if (!isSignUp) return;

    const cleanUsername = username.trim().toLowerCase();
    if (!cleanUsername) {
      setUsernameStatus("idle");
      return;
    }

    const timeout = setTimeout(async () => {
      const ref = doc(db, "usernames", cleanUsername);
      const snap = await getDoc(ref);
      setUsernameStatus(snap.exists() ? "taken" : "available");
    }, 400);

    return () => clearTimeout(timeout);
  }, [username, isSignUp]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isSignUp) {
        const cleanUsername = username.trim().toLowerCase();
        const userCred = await registerUser(email, password);
        const user = userCred.user;
        const uid = user.uid;

        await runTransaction(db, async (tx) => {
          const usernameRef = doc(db, "usernames", cleanUsername);
          const userRef = doc(db, "users", uid);
          const snap = await tx.get(usernameRef);
          if (snap.exists()) throw new Error("USERNAME_TAKEN");

          tx.set(usernameRef, { uid, createdAt: serverTimestamp() });
          tx.set(userRef, {
            fullName,
            username: cleanUsername,
            email,
            emailVerified: false,
            createdAt: serverTimestamp(),
          });
        });

        await sendEmailVerification(user);
        alert("Verification email sent.");
        return;
      } else {
        const cleanUsername = email.trim().toLowerCase();
        const usernameSnap = await getDoc(doc(db, "usernames", cleanUsername));
        if (!usernameSnap.exists()) {
          alert("Invalid username");
          return;
        }

        const uid = usernameSnap.data().uid;
        const userDoc = await getDoc(doc(db, "users", uid));
        const realEmail = userDoc.data().email;

        const userCred = await loginUser(realEmail, password);
        const user = userCred.user;
        await user.reload();

        if (!user.emailVerified) {
          alert("Verify your email first.");
          return;
        }

        setUser({
          uid,
          username: userDoc.data().username,
          fullName: userDoc.data().fullName,
          email: userDoc.data().email,
        });
      }

      onAuthSuccess();
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-transparent">
      <div className="relative w-[800px] h-[480px] overflow-hidden rounded-2xl shadow-2xl bg-[#f8f3ed]">

        <motion.div
          animate={{ x: isSignUp ? "-800px" : "0px" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="flex w-[1600px] h-full"
        >

          {/* SIGN IN SECTION */}
          <div className="w-[800px] flex">

            {/* LEFT PANEL */}
            <div className="w-1/2 bg-gradient-to-br from-[#2b1f1a] to-[#3e2c24] text-white flex flex-col items-center justify-center px-8 text-center">
              <h3 className="text-3xl font-bold mb-4">New Here?</h3>
              <p className="mb-6 text-white/80">
                Create your account and start sharing your Snippix moments!
              </p>
              <button
                onClick={() => setIsSignUp(true)}
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

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-[#d6c5b5] rounded-xl bg-white text-[#2b1f1a] placeholder-[#9b8b7a]"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-[#d6c5b5] rounded-xl bg-white text-[#2b1f1a] placeholder-[#9b8b7a]"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-[#f1e3d3] text-[#2b1f1a] font-medium shadow-lg"
                  >
                    Sign In
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* SIGN UP SECTION */}
          <div className="w-[800px] flex">

            {/* LEFT FORM */}
            <div className="w-1/2 flex items-center justify-center p-8">
              <div className="w-full">
                <h2 className="text-3xl font-bold mb-6 text-center text-[#2b1f1a]">
                  Create Account
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-3 border border-[#d6c5b5] rounded-xl bg-white text-[#2b1f1a] placeholder-[#9b8b7a]"
                  />
                  <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-3 border border-[#d6c5b5] rounded-xl bg-white text-[#2b1f1a] placeholder-[#9b8b7a]"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border border-[#d6c5b5] rounded-xl bg-white text-[#2b1f1a] placeholder-[#9b8b7a]"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 border border-[#d6c5b5] rounded-xl bg-white text-[#2b1f1a] placeholder-[#9b8b7a]"
                  />
                  <button
                    type="submit"
                    className="w-full py-3 rounded-full bg-[#556b5d] text-white font-medium shadow-lg"
                  >
                    Sign Up
                  </button>
                </form>
              </div>
            </div>

            {/* RIGHT PANEL */}
            <div className="w-1/2 bg-gradient-to-br from-[#2b1f1a] to-[#3e2c24] text-white flex flex-col items-center justify-center px-8 text-center">
              <h3 className="text-3xl font-bold mb-4">Welcome Back</h3>
              <p className="mb-6 text-white/80">
                Already have an account? Sign in and continue your journey!
              </p>
              <button
                onClick={() => setIsSignUp(false)}
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