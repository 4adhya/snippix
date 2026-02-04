import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ViewNotebook from "./pages/ViewNotebook.jsx";



import AuthCard from "./components/AuthCard.jsx";
import Home from "./pages/home.jsx";
import ProfileScroll from "./pages/profilescroll.jsx";
import SplashScreen from "./pages/splashscreen.jsx";
import Settings from "./pages/settings.jsx";
import CollageMaker from "./pages/CreateSnippix.jsx";
import SetupProfile from "./pages/SetupProfile.jsx";
import DMChat from "./pages/DMChat.jsx";
import Chat from "./pages/Chat.jsx";
import Terms from "./pages/Terms.jsx";
import Privacy from "./pages/Privacy.jsx";
import Help from "./pages/Help.jsx";
import EditProfile from "./pages/EditProfile.jsx";
import ChangePassword from "./pages/ChangePassword.jsx";

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
          {/* PUBLIC */}
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />

          {/* AUTH */}
          {!authenticated && (
            <Route
              path="*"
              element={<AuthCard onAuthSuccess={handleAuthSuccess} />}
            />
          )}

          {/* PROTECTED */}
          {authenticated && (
            <>
              <Route path="/" element={<ProfileScroll />} />
              <Route path="/setup-profile" element={<SetupProfile />} />
              <Route path="/home" element={<Home />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/edit-profile" element={<EditProfile />} />
              <Route path="/change-password" element={<ChangePassword />} />
              <Route path="/help" element={<Help />} />
              <Route path="/collage" element={<CollageMaker />} />
              <Route path="/chat" element={<Chat />} />
              <Route path="/chat/:uid" element={<DMChat />} />
              <Route path="/notebook/:uid" element={<ViewNotebook />} />
            </>
          )}
        </Routes>
      </div>
    </BrowserRouter>
  );
}
