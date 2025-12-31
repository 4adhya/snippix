import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import AuthCard from "./components/AuthCard.jsx";
import Home from "./pages/home.jsx";
import ProfileScroll from "./pages/profilescroll.jsx";
import SplashScreen from "./pages/splashscreen.jsx";
import Settings from "./pages/settings.jsx";
import CollageMaker from "./pages/collage";
import SetupProfile from "./pages/SetupProfile";
import DMChat from "./pages/DMChat";
import Chat from "./pages/Chat";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

import "./App.css";

export default function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [reveal, setReveal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const handleAuthSuccess = () => {
    setReveal(true);
    setTimeout(() => {
      setReveal(false);
      setAuthenticated(true);
    }, 1200);
  };

  if (loading) return <SplashScreen />;

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-black">

        {/* Splash transition */}
        <AnimatePresence>
          {reveal && (
            <motion.div
              className="fixed inset-0 bg-white z-50"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              exit={{ scaleY: 0 }}
              transition={{ duration: 0.8 }}
            />
          )}
        </AnimatePresence>

        <Routes>

          {/* PUBLIC ROUTES */}
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />

          {/* AUTH ROUTE */}
          {!authenticated && (
            <Route
              path="*"
              element={<AuthCard onAuthSuccess={handleAuthSuccess} />}
            />
          )}

          {/* PROTECTED ROUTES */}
          {authenticated && (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/setup-profile" element={<SetupProfile />} />
              <Route path="/profiles" element={<ProfileScroll />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/collage" element={<CollageMaker />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/chat/:uid" element={<DMChat />} />
            </>
          )}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

