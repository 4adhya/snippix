import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

/* ---------------- CONFIG ---------------- */
const SCROLL_COOLDOWN = 800; // ms between scroll triggers
const ROW_GAP = 160;        // Vertical distance between stacked rows

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
          return {
            id: doc.id,
            name: data.fullName || "User",
            role: data.role || "Creator",
            initials: data.initials || 
              (data.fullName ? data.fullName.split(" ").map(n => n[0]).join("").toUpperCase() : "U"),
            gradient: [
              "from-purple-500 to-pink-500",
              "from-blue-500 to-cyan-500",
              "from-green-500 to-emerald-500",
              "from-orange-500 to-yellow-500",
              "from-indigo-500 to-purple-500",
            ][index % 5],
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
        {rows.map((row, rowIndex) => {
          const distance = rowIndex - currentRow;

          // Only render rows that have been "discovered" by scrolling
          if (rowIndex > currentRow) return null;

          // distance is 0 for the top row, -1 for the one below it, etc.
          const stackOffset = distance;

          return (
            <motion.div
              key={rowIndex}
              className="absolute inset-0 w-full h-full flex items-center justify-center"
              initial={{ y: 1000, opacity: 0 }}
              animate={{
                // Newest row is at y: 0. Older rows move UP.
                y: stackOffset * ROW_GAP,
                scale: 1 + stackOffset * 0.05,
                opacity: 1 + stackOffset * 0.3,
              }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 22,
              }}
              style={{
                // Newer rows (higher index) are physically on top
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
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="w-full max-w-[300px] aspect-[3/4] rounded-[2rem] bg-gradient-to-br from-white/15 to-white/5 border border-white/20 backdrop-blur-2xl flex flex-col items-center justify-center p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-pointer"
                    whileHover={{ y: -10, scale: 1.02 }}
                    onClick={() => navigate(`/profile/${profile.id}`)}
                  >
                    <div className={`w-24 h-24 rounded-full bg-gradient-to-tr ${profile.gradient} mb-6 flex items-center justify-center text-3xl font-black text-white shadow-inner`}>
                      {profile.initials}
                    </div>
                    
                    <h3 className="text-2xl font-black text-white text-center leading-tight mb-2">
                      {profile.name}
                    </h3>
                    
                    <p className="text-white/50 text-xs uppercase tracking-[0.2em] font-bold">
                      {profile.role}
                    </p>

                    <div className="mt-6 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-[10px] uppercase tracking-widest text-white/80">
                      View Profile
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* VIGNETTE & BACKGROUND DEPTH */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_black_90%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-80" />
    </div>
  );
}