import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

/* ================= PAGES ================= */

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

/* ================= PAGE TRANSITION ================= */

const pageVariants = {
  initial: {
    opacity: 0,
    y: 14,
    filter: "blur(6px)",
  },
  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.35,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -14,
    filter: "blur(6px)",
    transition: {
      duration: 0.25,
      ease: "easeIn",
    },
  },
};

const PageWrapper = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    className="h-full"
  >
    {children}
  </motion.div>
);

/* ================= ROUTES WITH ANIMATION ================= */

function AnimatedRoutes({ authenticated, onAuthSuccess }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* PUBLIC */}
        <Route
          path="/terms"
          element={
            <PageWrapper>
              <Terms />
            </PageWrapper>
          }
        />
        <Route
          path="/privacy"
          element={
            <PageWrapper>
              <Privacy />
            </PageWrapper>
          }
        />

        {/* AUTH */}
        {!authenticated && (
          <Route
            path="*"
            element={
              <PageWrapper>
                <AuthCard onAuthSuccess={onAuthSuccess} />
              </PageWrapper>
            }
          />
        )}

        {/* PROTECTED */}
        {authenticated && (
          <>
            <Route
              path="/"
              element={
                <PageWrapper>
                  <ProfileScroll />
                </PageWrapper>
              }
            />
            <Route
              path="/setup-profile"
              element={
                <PageWrapper>
                  <SetupProfile />
                </PageWrapper>
              }
            />
            <Route
              path="/home"
              element={
                <PageWrapper>
                  <Home />
                </PageWrapper>
              }
            />
            <Route
              path="/settings"
              element={
                <PageWrapper>
                  <Settings />
                </PageWrapper>
              }
            />
            <Route
              path="/edit-profile"
              element={
                <PageWrapper>
                  <EditProfile />
                </PageWrapper>
              }
            />
            <Route
              path="/change-password"
              element={
                <PageWrapper>
                  <ChangePassword />
                </PageWrapper>
              }
            />
            <Route
              path="/help"
              element={
                <PageWrapper>
                  <Help />
                </PageWrapper>
              }
            />
            <Route
              path="/collage"
              element={
                <PageWrapper>
                  <CollageMaker />
                </PageWrapper>
              }
            />
            <Route
              path="/chat"
              element={
                <PageWrapper>
                  <Chat />
                </PageWrapper>
              }
            />
            <Route
              path="/chat/:uid"
              element={
                <PageWrapper>
                  <DMChat />
                </PageWrapper>
              }
            />
            <Route
              path="/notebook/:uid"
              element={
                <PageWrapper>
                  <ViewNotebook />
                </PageWrapper>
              }
            />
          </>
        )}
      </Routes>
    </AnimatePresence>
  );
}

/* ================= MAIN APP ================= */

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
      <div className="min-h-screen bg-black relative overflow-hidden">

        {/* LOGIN REVEAL ANIMATION */}
        <AnimatePresence>
          {reveal && (
            <motion.div
              className="fixed inset-0 bg-white z-50 origin-top"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              exit={{ scaleY: 0 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
          )}
        </AnimatePresence>

        {/* ROUTES */}
        <AnimatedRoutes
          authenticated={authenticated}
          onAuthSuccess={handleAuthSuccess}
        />
      </div>
    </BrowserRouter>
  );
}
