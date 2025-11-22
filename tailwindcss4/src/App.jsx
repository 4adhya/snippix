import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthCard from "./components/AuthCard.jsx";
import Home from "./pages/home.jsx";
import ProfileScroll from "./pages/profilescroll.jsx";
import SplashScreen from "./pages/splashscreen.jsx";
import Settings from "./pages/settings.jsx";
import BackgroundWave from "./components/BackgroundWave.jsx"; // LED-style animated background
import "./App.css";

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1600);
    return () => clearTimeout(timer);
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
      <div className="relative min-h-screen bg-black overflow-hidden">

        {/* Background always visible */}
        <BackgroundWave />

        {/* Splash Screen */}
        {loading && <SplashScreen />}

        {/* Transition animation */}
        <AnimatePresence>
          {reveal && (
            <motion.div
              className="absolute inset-0 bg-white origin-top"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              exit={{ scaleY: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="relative z-10 min-h-screen">
          {!loading && !authenticated && (
            <div className="flex items-center justify-center min-h-screen">
              <AuthCard onAuthSuccess={handleAuthSuccess} />
            </div>
          )}

          {!loading && authenticated && (
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/profiles" element={<ProfileScroll />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>
  );
}
