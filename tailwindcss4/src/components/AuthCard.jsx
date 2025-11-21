import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthCard({ onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAuthSuccess();
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black">
      {/* Main Box */}
      <div className="relative w-[900px] h-[520px] rounded-2xl shadow-2xl overflow-hidden flex bg-white">

        {/* Sliding Dark Panel */}
        <motion.div
          animate={{ x: isSignUp ? "100%" : "0%" }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          className="absolute top-0 left-0 w-1/2 h-full z-20 
                     bg-gradient-to-br from-gray-900 to-black text-white
                     flex flex-col items-center justify-center px-10 text-center"
        >
          <h3 className="text-3xl font-bold mb-4">
            {isSignUp ? "Welcome Back!" : "New Here?"}
          </h3>

          <p className="mb-6 text-white/80">
            {isSignUp
              ? "Sign in and continue your Snippix journey!"
              : "Create your account and start sharing your Snippix moments!"}
          </p>

          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="border-2 border-white px-6 py-2 rounded-full font-semibold 
                       hover:bg-white hover:text-gray-900 transition"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </motion.div>

        {/* Forms Container */}
        <div className="relative w-full flex">

          {/* SIGN IN FORM */}
          {!isSignUp && (
            <motion.div
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.5 }}
              className="w-1/2 ml-[50%] flex items-center justify-center p-10"
            >
              <div className="w-full">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                  Welcome Back
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Username"
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-xl"
                  >
                    Sign In
                  </button>
                </form>

                <div className="text-sm text-center mt-4">
                  <button className="text-gray-600 hover:underline">
                    Forgot password?
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* SIGN UP FORM */}
          {isSignUp && (
            <motion.div
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -80 }}
              transition={{ duration: 0.5 }}
              className="w-1/2 ml-[50%] flex items-center justify-center p-10"
            >
              <div className="w-full">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                  Create Account
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Username"
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    className="w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-xl"
                  >
                    Sign Up
                  </button>
                </form>
              </div>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}




