import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";

/* ================= PAGES ================= */

import ViewNotebook from "./pages/ViewNotebook.jsx";
import AuthCard from "./components/AuthCard.jsx";
import Home from "./pages/home.jsx";
import Profile from "./pages/Profile.jsx";
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
import Search from "./pages/search.jsx";

import "./App.css";

/* ================= PAGE TRANSITION ================= */

const pageVariants = {
  initial: {
    opacity: 0,
    y: 18,
    filter: "blur(8px)",
  },

  animate: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },

  exit: {
    opacity: 0,
    y: -18,
    filter: "blur(8px)",
    transition: {
      duration: 0.3,
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
    className="min-h-screen"
  >
    {children}
  </motion.div>
);

/* ================= ROUTES ================= */

function AnimatedRoutes({
  authenticated,
  onAuthSuccess,
  onSearchOpen,
}) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* PUBLIC ROUTES */}

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

        {/* AUTH FLOW */}

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

        {/* PROTECTED ROUTES */}

        {authenticated && (
          <>
            <Route
              path="/"
              element={
                <PageWrapper>
                  <Home onSearchOpen={onSearchOpen} />
                </PageWrapper>
              }
            />

            <Route
              path="/profile"
              element={
                <PageWrapper>
                  <Profile />
                </PageWrapper>
              }
            />

            <Route
              path="/profile/:uid"
              element={
                <PageWrapper>
                  <Profile />
                </PageWrapper>
              }
            />

            <Route
              path="/explore"
              element={
                <PageWrapper>
                  <ProfileScroll />
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
              path="/setup-profile"
              element={
                <PageWrapper>
                  <SetupProfile />
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

            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </AnimatePresence>
  );
}

/* ================= MAIN APP ================= */

export default function App() {
  const [loading, setLoading] = useState(true);

  const [authenticated, setAuthenticated] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  /* ================= SPLASH → LOGIN ================= */

  useEffect(() => {
    const splashTimer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => {
      clearTimeout(splashTimer);
    };
  }, []);

  /* ================= AUTH SUCCESS ================= */

  const handleAuthSuccess = () => {
    setReveal(true);

    setTimeout(() => {
      setReveal(false);
      setAuthenticated(true);
    }, 1000);
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#2b1f1a] text-white relative overflow-hidden">
        {/* SPLASH */}

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="splash-screen"
              className="fixed inset-0 z-[9999] bg-[#2b1f1a]"
              initial={{
                opacity: 1,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.25,
                ease: "easeOut",
              }}
            >
              <SplashScreen />
            </motion.div>
          )}
        </AnimatePresence>

        {/* MAIN APP */}

        {!loading && (
          <AnimatedRoutes
            authenticated={authenticated}
            onAuthSuccess={handleAuthSuccess}
            onSearchOpen={() => setSearchOpen(true)}
          />
        )}

        {/* SEARCH OVERLAY */}

        <AnimatePresence>
          {searchOpen && (
            <motion.div
              className="fixed inset-0 z-[100]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Search onClose={() => setSearchOpen(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* AUTH REVEAL */}

        <AnimatePresence>
          {reveal && (
            <motion.div
              className="fixed inset-0 bg-[#2b1f1a] z-50 origin-top"
              initial={{
                scaleY: 0,
              }}
              animate={{
                scaleY: 1,
              }}
              exit={{
                scaleY: 0,
              }}
              transition={{
                duration: 0.8,
                ease: "easeInOut",
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </BrowserRouter>
  );
}