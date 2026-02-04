import React, { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

/* ---------------- CONFIG ---------------- */
const SCROLL_COOLDOWN = 900; // ms between scroll triggers

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
            initials: (data.fullName || "U").split(" ").map(n => n[0]).join("").toUpperCase(),
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

  /* 2. GROUPING LOGIC (Memoized to prevent recalculation) */
  const rows = useMemo(() => {
    const result = [];
    const tempProfiles = [...profiles];
    let rowIndex = 0;
    while (tempProfiles.length > 0) {
      const size = rowIndex % 2 === 0 ? 3 : 2;
      result.push(tempProfiles.splice(0, size));
      rowIndex++;
    }
    return result;
  }, [profiles]);

  /* 3. SCROLL HANDLING */
  useEffect(() => {
    const handleWheel = (e) => {
      if (scrollLock.current || rows.length === 0) return;

      if (Math.abs(e.deltaY) < 10) return; // Ignore micro-scrolls

      scrollLock.current = true;
      if (e.deltaY > 0) {
        setCurrentRow((prev) => Math.min(prev + 1, rows.length - 1));
      } else {
        setCurrentRow((prev) => Math.max(prev - 1, 0));
      }

      setTimeout(() => {
        scrollLock.current = false;
      }, SCROLL_COOLDOWN);
    };

    window.addEventListener("wheel", handleWheel, { passive: true });
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
      <div className="relative w-full max-w-7xl h-[600px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {rows.length > 0 && (
            <motion.div
              key={currentRow} // Keying by currentRow ensures old row exits while new enters
              initial={{ y: 400, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -400, opacity: 0, scale: 0.9 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
              }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div
                className={`flex justify-center items-center gap-8 w-full ${
                  currentRow % 2 === 1 ? "px-32" : "px-10"
                }`}
              >
                {rows[currentRow].map((profile, i) => (
                  <motion.div
                    key={profile.id}
                    className="w-full max-w-[320px] aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-2xl cursor-pointer relative group"
                    whileHover={{ y: -15, transition: { duration: 0.3 } }}
                    onClick={() => navigate(`/profile/${profile.id}`)}
                  >
                    {/* CARD BODY */}
                    <div className={`w-full h-full ${profile.colorTheme.bg} flex flex-col`}>
                      {/* IMAGE */}
                      <div className="h-[55%] w-full relative overflow-hidden bg-black/5">
                        {profile.photoURL ? (
                          <img 
                            src={profile.photoURL} 
                            alt={profile.name}
                            className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className={`text-7xl font-black ${profile.colorTheme.text} opacity-20`}>
                              {profile.initials}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* CONTENT */}
                      <div className="h-[45%] p-8 flex flex-col justify-between relative">
                        {/* Abstract Decor */}
                        <div className={`absolute -top-10 right-8 w-20 h-20 ${profile.colorTheme.accent} rounded-full blur-2xl opacity-40 group-hover:opacity-100 transition-opacity`} />
                        
                        <div className="relative z-10">
                          <h3 className={`text-3xl font-black ${profile.colorTheme.text} uppercase tracking-tighter leading-none`}>
                            {profile.name}
                          </h3>
                          <p className={`text-xs font-bold mt-2 ${profile.colorTheme.text} opacity-60 uppercase tracking-[0.25em]`}>
                            {profile.role}
                          </p>
                        </div>

                        <div className="relative z-10 flex justify-between items-end">
                          <p className={`text-[10px] leading-relaxed font-medium ${profile.colorTheme.text} opacity-50 uppercase max-w-[180px]`}>
                            {profile.bio}
                          </p>
                          <div className={`w-10 h-10 ${profile.colorTheme.text === 'text-black' ? 'bg-black' : 'bg-white'} rounded-full flex items-center justify-center`}>
                             <div className={`w-3 h-3 ${profile.colorTheme.text === 'text-black' ? 'bg-white' : 'bg-black'} rotate-45`} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER INDICATOR */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4">
        <div className="flex gap-2">
          {rows.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1 transition-all duration-500 ${idx === currentRow ? "w-8 bg-white" : "w-2 bg-white/20"}`} 
            />
          ))}
        </div>
        <span className="text-white/30 text-[10px] font-bold uppercase tracking-[0.4em]">
          Row {currentRow + 1} of {rows.length}
        </span>
      </div>

      {/* BACKGROUND EFFECTS */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_90%)]" />
    </div>
  );
}