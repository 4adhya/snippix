import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

/* ---------------- CONFIG ---------------- */
const SCROLL_COOLDOWN = 800;
const ROW_GAP = 160;

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

  /* FETCH USERS */
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
            initials:
              data.initials ||
              (data.fullName
                ? data.fullName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "U"),
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

  /* GROUP ROWS (3,2,3,2...) */
  const rows = [];
  const tempProfiles = [...profiles];
  let rowIndexCounter = 0;

  while (tempProfiles.length > 0) {
    const size = rowIndexCounter % 2 === 0 ? 3 : 2;
    rows.push(tempProfiles.splice(0, size));
    rowIndexCounter++;
  }

  /* SCROLL LOGIC */
  useEffect(() => {
    const handleWheel = (e) => {
      if (scrollLock.current) return;

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

    window.addEventListener("wheel", handleWheel);
    return () => window.removeEventListener("wheel", handleWheel);
  }, [rows.length]);

  return (
    <div className="h-screen w-screen bg-black overflow-hidden relative flex items-center justify-center">
      {/* BACK BUTTON */}
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

            if (rowIndex > currentRow) return null;

            const stackOffset = distance;

            return (
              <motion.div
                key={rowIndex}
                className="absolute inset-0 w-full h-full flex items-center justify-center"
                initial={{ y: 1000, opacity: 0, scale: 0.8 }}
                animate={{
                  y: stackOffset * ROW_GAP,
                  scale: 1 + stackOffset * 0.05,
                  opacity: 1 + stackOffset * 0.3,
                }}
                exit={{ y: -1000, opacity: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 22 }}
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
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className="w-full max-w-[300px] aspect-[3/4] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] cursor-pointer"
                      whileHover={{ y: -10, scale: 1.02 }}
                      onClick={() => navigate(`/notebook/${profile.id}`)}
                    >
                      <div className={`w-full h-full ${profile.colorTheme.bg} flex flex-col`}>
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

                        <div className="h-[40%] p-6 flex flex-col justify-between relative">
                          <div className={`absolute -top-8 right-6 w-16 h-16 ${profile.colorTheme.accent} rounded-full opacity-80`} />

                          <div className="relative z-10">
                            <h3 className={`text-2xl font-black ${profile.colorTheme.text} uppercase`}>
                              {profile.name}
                            </h3>
                            <p className={`text-sm font-bold ${profile.colorTheme.text} opacity-70 uppercase`}>
                              {profile.role}
                            </p>
                          </div>

                          <div className={`text-xs font-bold ${profile.colorTheme.text} opacity-60 uppercase`}>
                            {profile.bio}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}