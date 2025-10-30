import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuthCard from "./components/AuthCard.jsx";
import Home from "./pages/Home.jsx";

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [reveal, setReveal] = useState(false);

  const handleAuthSuccess = () => {
    setReveal(true);
    setTimeout(() => {
      setReveal(false);
      setAuthenticated(true);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen bg-sunflower-light">
      <img src="/logo.png" alt="Logo" className="logo-top-right" />

      <AnimatePresence>
        {reveal && (
          <motion.div
            className="reveal-mask"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            exit={{ scaleY: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>

      {!authenticated ? (
        <div className="full-screen-center">
          <AuthCard onAuthSuccess={handleAuthSuccess} />
        </div>
      ) : (
        <Home />
      )}
    </div>
  );
}
