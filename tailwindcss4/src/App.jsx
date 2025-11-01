import React, { useEffect, useRef, useState } from "react";
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
  const canvasRef = useRef(null);
  const trail = useRef([]);

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

  // ✨ Compact glowing trail line
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    let mouse = { x: w / 2, y: h / 2 };

    window.addEventListener("mousemove", (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
      trail.current.push({ x: e.x, y: e.y });
      if (trail.current.length > 15) trail.current.shift(); // shorter trail
    });

    window.addEventListener("resize", () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    });

    function animate() {
      ctx.clearRect(0, 0, w, h);

      if (trail.current.length > 1) {
        ctx.beginPath();
        for (let i = 0; i < trail.current.length - 1; i++) {
          const p1 = trail.current[i];
          const p2 = trail.current[i + 1];
          const alpha = i / trail.current.length;
          ctx.strokeStyle = `rgba(255, 210, 120, ${alpha})`; // golden fade
          ctx.lineWidth = 2; // thinner line
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
        }
        ctx.shadowBlur = 8;
        ctx.shadowColor = "rgba(255, 220, 150, 0.8)";
        ctx.stroke();
      }

      const last = trail.current[trail.current.length - 1];
      if (last) {
        ctx.beginPath();
        ctx.arc(last.x, last.y, 3, 0, Math.PI * 2); // smaller glow circle
        ctx.fillStyle = "rgba(255, 240, 200, 0.9)";
        ctx.shadowBlur = 10;
        ctx.shadowColor = "rgba(255, 230, 150, 1)";
        ctx.fill();
      }

      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return (
    <BrowserRouter>
      <div className="relative min-h-screen bg-black overflow-hidden">
        {/* 🎨 Glowing cursor line canvas */}
        <canvas ref={canvasRef} className="cursor-line-canvas"></canvas>

        {/* Splash Screen */}
        {loading && <SplashScreen />}

        {/* Transition animation */}
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



