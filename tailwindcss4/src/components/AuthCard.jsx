import React, { useState } from "react";
import { motion } from "framer-motion";

export default function AuthCard({ onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onAuthSuccess();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="auth-blur w-[360px]"
    >
      <h2 className="text-2xl font-semibold text-ocean-dark mb-4 text-center">
        {isSignUp ? "Create Account" : "Welcome Back"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean-main"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean-main"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-ocean-main"
        />
        <button
          type="submit"
          className="w-full bg-ocean-main hover:bg-ocean-dark text-white font-semibold py-2 rounded-xl transition"
        >
          {isSignUp ? "Sign Up" : "Sign In"}
        </button>
      </form>
      <p className="text-sm text-center mt-4">
        {isSignUp ? "Already have an account?" : "New here?"}{" "}
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-ocean-dark font-semibold hover:underline"
        >
          {isSignUp ? "Sign In" : "Create one"}
        </button>
      </p>
    </motion.div>
  );
}
