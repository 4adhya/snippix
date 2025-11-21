import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AuthCard from "./components/AuthCard.jsx";
import Home from "./pages/home.jsx";
import ProfileScroll from "./pages/profilescroll.jsx";
import SplashScreen from "./pages/splashscreen.jsx";
import "./App.css";

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
      <div className="relative min-h-screen bg-black overflow-hidden">

        {/* Splash Screen */}
        {loading && <SplashScreen />}

        {/* Transition animation */}
        <AnimatePresence>
          {reveal && (
            <motion.div
              className="motion-div"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              exit={{ scaleY: 0 }}
              transition={{ duration: 1, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>

        {/* Main Content */}
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



