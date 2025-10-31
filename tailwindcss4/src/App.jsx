import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthCard from "./components/AuthCard.jsx";
import Home from "./pages/home.jsx";
import ProfileScroll from "./pages/profilescroll.jsx";
import SplashScreen from "./pages/splashscreen.jsx";

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Splash screen effect
  useEffect(() => {
    const splashTimer = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(splashTimer);
  }, []);

  const handleAuthSuccess = () => {
    setReveal(true);
    setTimeout(() => {
      setReveal(false);
      setAuthenticated(true);
    }, 1500);
  };

  return (
    <BrowserRouter>
      <div className="relative min-h-screen bg-black">
        {/* Splash Screen */}
        {loading && <SplashScreen />}

        {/* Animated transition overlay */}
        <AnimatePresence>
          {reveal && (
            <motion.div
              className="fixed inset-0 bg-white z-50 origin-bottom"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              exit={{ scaleY: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>

        {/* After splash */}
        {!loading && (
          <>
            {!authenticated ? (
              <div className="flex items-center justify-center min-h-screen">
                <AuthCard onAuthSuccess={handleAuthSuccess} />
              </div>
            ) : (
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/profiles" element={<ProfileScroll />} />
              </Routes>
            )}
          </>
        )}
      </div>
    </BrowserRouter>
  );
}
