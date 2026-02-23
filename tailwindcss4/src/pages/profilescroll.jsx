import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

/* ---------------- CONFIG ---------------- */
const SCROLL_COOLDOWN = 800; // ms between scroll triggers
const ROW_GAP = 160;        // Vertical distance between stacked rows

/* ---------------- COLOR PALETTE ---------------- */
const COLOR_PALETTE = [
  { bg: "bg-cyan-400", text: "text-black", accent: "bg-black" },
  { bg: "bg-orange-500", text: "text-black", accent: "bg-white" },
  { bg: "bg-green-500", text: "text-black", accent: "bg-pink-400" },
  { bg: "bg-yellow-400", text: "text-black", accent: "bg-blue-500" },
  { bg: "bg-red-500", text: "text-white", accent: "bg-yellow-300" },
  { bg: "bg-purple-500", text: "text-white", accent: "bg-green-400" },
  { bg: "bg-pink-400", text: "text-black", accent: "bg-yellow-400" },
  { bg: "bg-blue-600", text: "text-white", accent: "bg-orange-400" },
];

export default function ProfileScroll() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [currentRow, setCurrentRow] = useState(0);
  const scrollLock = useRef(false);

  /* 1. FIREBASE DATA FETCHING */
  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const snapshot = await getDocs(collection(db, "users"));
        const users = snapshot.docs.map((doc, index) => {
          const data = doc.data();
          const colorTheme = COLOR_PALETTE[index % COLOR_PALETTE.length];
          
          return {
            id: doc.id,
            name: data.fullName || "User",
            role: data.role || "Creator",
            bio: data.bio || "Creative professional",
            photoURL: data.photoURL || null,
            initials: data.initials || 
              (data.fullName ? data.fullName.split(" ").map(n => n[0]).join("").toUpperCase() : "U"),
            colorTheme,
          };
        });
        setProfiles(users);
      } catch (error) {
        console.error("Error fetching profiles:", error);
      }
    };
    fetchProfiles();
  }, []);

  /* 2. GROUPING LOGIC (3 cards, then 2 cards, etc.) */
  const rows = [];
  const tempProfiles = [...profiles];
  let rowIndexCounter = 0;
  
  while (tempProfiles.length > 0) {
    const size = rowIndexCounter % 2 === 0 ? 3 : 2;
    rows.push(tempProfiles.splice(0, size));
    rowIndexCounter++;
  }

  /* 3. SCROLL HANDLING */
  useEffect(() => {
    const handleWheel = (e) => {
      if (scrollLock.current) return;
      
      scrollLock.current = true;
      if (e.deltaY > 0) {
        // Scroll Down -> Show Next Row
        setCurrentRow((prev) => Math.min(prev + 1, rows.length - 1));
      } else {
        // Scroll Up -> Show Previous Row
        setCurrentRow((prev) => Math.max(prev - 1, 0));
      }

      setTimeout(() => {
        scrollLock.current = false;
      }, SCROLL_COOLDOWN);
    };

    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, [rows.length]);

  return (
    <div className="h-screen w-screen bg-black overflow-hidden relative flex items-center justify-center">
      {/* HEADER */}
      <div className="fixed top-6 left-6 z-[200]">
        <button
          onClick={() => navigate("/home")}
          className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
        >
          <ArrowLeft size={28} className="text-white" />
        </button>
      </div>

      {/* STACK CONTAINER */}
      <div className="relative w-full max-w-6xl h-[700px]">
        <AnimatePresence>
          {rows.map((row, rowIndex) => {
            const distance = rowIndex - currentRow;

            // Only render rows that have been "discovered" by scrolling
            if (rowIndex > currentRow) return null;

            // distance is 0 for the top row, -1 for the one below it, etc.
            const stackOffset = distance;

            return (
              <motion.div
                key={rowIndex}
                layout
                className="absolute inset-0 w-full h-full flex items-center justify-center"
                initial={{ y: 1000, opacity: 0, scale: 0.8 }}
                animate={{
                  y: stackOffset * ROW_GAP,
                  scale: 1 + stackOffset * 0.05,
                  opacity: 1 + stackOffset * 0.3,
                }}
                exit={{ y: -1000, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  damping: 22,
                }}
                style={{
                  zIndex: rowIndex,
                  pointerEvents: rowIndex === currentRow ? "auto" : "none",
                }}
              >
                <div
                  className={`flex justify-center items-center gap-6 w-full ${
                    rowIndex % 2 === 1 ? "px-40" : "px-10"
                  }`}
                >
                  {row.map((profile, i) => (
                    <motion.div
                      key={profile.id}
                      layout
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="w-full max-w-[300px] aspect-[3/4] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-pointer"
                      whileHover={{ y: -10, scale: 1.02 }}
                      onClick={() => navigate(`/notebook/${profile.id}`)}
                    >
                      {/* CARD BACKGROUND */}
                      <div className={`w-full h-full ${profile.colorTheme.bg} flex flex-col`}>
                        
                        {/* IMAGE SECTION */}
                        <div className="h-[60%] w-full relative overflow-hidden">
                          {profile.photoURL ? (
                            <img 
                              src={profile.photoURL} 
                              alt={profile.name}
                              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-black/10">
                              <span className={`text-6xl font-black ${profile.colorTheme.text} opacity-50`}>
                                {profile.initials}
                              </span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                        </div>

                        {/* CONTENT SECTION */}
                        <div className="h-[40%] p-6 flex flex-col justify-between relative">
                          {/* Decorative shapes like in video */}
                          <div className={`absolute -top-8 right-6 w-16 h-16 ${profile.colorTheme.accent} rounded-full opacity-80`} />
                          <div className={`absolute top-4 right-20 w-8 h-8 ${profile.colorTheme.text === 'text-black' ? 'bg-white' : 'bg-black'} rounded-full opacity-60`} />
                          
                          {/* Text Content */}
                          <div className="relative z-10">
                            <h3 className={`text-2xl font-black ${profile.colorTheme.text} leading-tight mb-1 uppercase tracking-tight`}>
                              {profile.name}
                            </h3>
                            <p className={`text-sm font-bold ${profile.colorTheme.text} opacity-70 uppercase tracking-[0.2em]`}>
                              {profile.role}
                            </p>
                          </div>

                          {/* Bottom Info */}
                          <div className="relative z-10 flex justify-between items-end">
                            <div className={`text-xs font-bold ${profile.colorTheme.text} opacity-60 uppercase tracking-wider max-w-[70%]`}>
                              {profile.bio}
                            </div>
                            
                            {/* Small logo/icon like video */}
                            <div className={`w-8 h-8 ${profile.colorTheme.text === 'text-black' ? 'bg-black' : 'bg-white'} rounded-full flex items-center justify-center`}>
                              <div className={`w-3 h-3 ${profile.colorTheme.text === 'text-black' ? 'bg-white' : 'bg-black'} transform rotate-45`} />
                            </div>
                          </div>
                        </div>

                        {/* Hover Border Effect */}
                        <div className="absolute inset-0 rounded-[2rem] border-2 border-white/0 hover:border-white/30 transition-all duration-300 pointer-events-none" />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* SCROLL INDICATOR */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none">
        <div className="text-white/40 text-xs uppercase tracking-[0.3em] font-bold">
          Scroll to explore
        </div>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/40 to-transparent" />
      </div>

      {/* VIGNETTE & BACKGROUND DEPTH */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_90%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-80" />
    </div>
  );
}
export default function Home({ onSearchOpen }) {
  return (
    <>
      <Navbar onSearchClick={onSearchOpen} />
      {/* rest */}
    </>
  );
}