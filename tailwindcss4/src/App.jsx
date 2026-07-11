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

/* ================= FILM REEL TRANSITION ================= */

function FilmTransition() {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-black overflow-hidden"
      initial={{
        x: "100%",
      }}
      animate={{
        x: "-100%",
      }}
      exit={{
        opacity: 0,
      }}
      transition={{
        x: {
          duration: 5,
          ease: [0.76, 0, 0.24, 1],
        },
        opacity: {
          duration: 0.4,
        },
      }}
    >
      {/* TOP FILM HOLES */}

      <div className="absolute top-4 left-0 w-full flex justify-around">
        {Array.from({ length: 18 }).map((_, index) => (
          <div
            key={index}
            className="w-8 h-5 rounded-sm bg-[#2b1f1a]"
          />
        ))}
      </div>

      {/* TOP FILM LINE */}

      <div className="absolute top-16 left-0 w-full h-px bg-white/20" />

      {/* CENTER SNIPPIX */}

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.7,
        }}
        animate={{
          opacity: [0, 1, 1, 1, 0],
          scale: [0.7, 1, 1, 1.03, 1.1],
        }}
        transition={{
          duration: 4.5,
          times: [0, 0.2, 0.5, 0.8, 1],
          ease: "easeInOut",
        }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <h1 className="text-white text-6xl md:text-8xl font-semibold tracking-[0.25em]">
          SNIPPIX
        </h1>
      </motion.div>

      {/* FILM FLICKER */}

      <motion.div
        className="absolute inset-0 bg-white pointer-events-none"
        animate={{
          opacity: [
            0,
            0.08,
            0,
            0.04,
            0,
            0.07,
            0,
            0.03,
            0,
          ],
        }}
        transition={{
          duration: 1,
          repeat: 4,
          ease: "linear",
        }}
      />

      {/* FILM SCRATCHES */}

      <motion.div
        className="absolute top-0 left-[20%] w-px h-full bg-white/20"
        animate={{
          opacity: [0, 0.7, 0, 0.4, 0],
          x: [0, 10, -5, 5, 0],
        }}
        transition={{
          duration: 0.8,
          repeat: 5,
        }}
      />

      <motion.div
        className="absolute top-0 right-[30%] w-px h-full bg-white/10"
        animate={{
          opacity: [0, 0.5, 0],
        }}
        transition={{
          duration: 0.5,
          repeat: 8,
        }}
      />

      {/* BOTTOM FILM LINE */}

      <div className="absolute bottom-16 left-0 w-full h-px bg-white/20" />

      {/* BOTTOM FILM HOLES */}

      <div className="absolute bottom-4 left-0 w-full flex justify-around">
        {Array.from({ length: 18 }).map((_, index) => (
          <div
            key={index}
            className="w-8 h-5 rounded-sm bg-[#2b1f1a]"
          />
        ))}
      </div>
    </motion.div>
  );
}

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
  const [filmTransition, setFilmTransition] = useState(false);

  const [authenticated, setAuthenticated] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  /* ================= SPLASH → FILM → LOGIN ================= */

  useEffect(() => {
    const filmTimer = setTimeout(() => {
      setFilmTransition(true);
    }, 1400);

    const loginTimer = setTimeout(() => {
      setLoading(false);
    }, 3900);

    const transitionTimer = setTimeout(() => {
      setFilmTransition(false);
    }, 6400);

    return () => {
      clearTimeout(filmTimer);
      clearTimeout(loginTimer);
      clearTimeout(transitionTimer);
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

        {loading && <SplashScreen />}

        {/* MAIN APP */}

        {!loading && (
          <AnimatedRoutes
            authenticated={authenticated}
            onAuthSuccess={handleAuthSuccess}
            onSearchOpen={() => setSearchOpen(true)}
          />
        )}

        {/* FILM REEL TRANSITION */}

        <AnimatePresence>
          {filmTransition && <FilmTransition />}
        </AnimatePresence>

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
              className="fixed inset-0 bg-white z-50 origin-top"
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