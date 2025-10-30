import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AuthCard from "./components/AuthCard.jsx"; // Assuming path
import Home from "./pages/home.jsx"; // Assuming path
import SplashScreen from "./pages/splashscreen.jsx"; // **Import the Splash Screen**

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [reveal, setReveal] = useState(false);
  // **NEW STATE: Control for the initial Splash Screen duration**
  const [loading, setLoading] = useState(true);

  // Effect to hide the Splash Screen after 1.6 seconds
  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setLoading(false);
    }, 1600); // **Matches the 1.6 second total duration from SplashScreen.jsx**

    return () => clearTimeout(splashTimer);
  }, []);

  const handleAuthSuccess = () => {
    setReveal(true);
    setTimeout(() => {
      setReveal(false);
      setAuthenticated(true);
    }, 1500);
  };

  // --- Conditional Rendering ---
  
  if (loading) {
    // 1. Show Splash Screen while loading is true
    return <SplashScreen />;
  }

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

      {/* 2. After Splash, show AuthCard until authenticated */}
      {!authenticated ? (
        <div className="full-screen-center">
          <AuthCard onAuthSuccess={handleAuthSuccess} />
        </div>
      ) : (
        // 3. After authentication, show Home
        <Home />
      )}
    </div>
  );
}
