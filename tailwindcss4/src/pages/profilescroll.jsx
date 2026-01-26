import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

/* ---------------- CONFIG ---------------- */
// Adjust these to match the "feel" of your video
const COLUMN_SPEEDS = [40, 60, 50]; // Seconds per full loop (Lower = Faster)

function ScrollingColumn({ profiles, speed, reverse = false }) {
  // We double the profiles array to create the infinite loop "bridge"
  const duplicatedProfiles = [...profiles, ...profiles];

  return (
    <div className="relative flex flex-col gap-6 overflow-hidden h-full w-full">
      <motion.div
        className="flex flex-col gap-6"
        animate={{
          y: reverse ? ["-50%", "0%"] : ["0%", "-50%"],
        }}
        transition={{
          duration: speed,
          ease: "linear",
          repeat: Infinity,
        }}
      >
        {duplicatedProfiles.map((profile, idx) => (
          <div
            key={`${profile.id}-${idx}`}
            className={`relative w-full aspect-[3/4] rounded-xl overflow-hidden shadow-xl bg-gradient-to-br ${profile.gradient} flex flex-col items-center justify-center p-6 border border-white/10`}
          >
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-4">
              <span className="text-2xl font-bold">{profile.initials}</span>
            </div>
            <h3 className="text-xl font-black text-center leading-tight">{profile.name}</h3>
            <p className="text-xs uppercase tracking-tighter opacity-70 mt-2">{profile.role}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function ProfileScroll() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const fetchProfiles = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const users = snapshot.docs.map((doc, index) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.fullName || "User",
          role: data.role || "Creator",
          initials: data.initials || (data.fullName ? data.fullName.split(" ").map(n => n[0]).join("").toUpperCase() : "U"),
          gradient: [
            "from-blue-600 to-violet-600",
            "from-emerald-500 to-teal-700",
            "from-rose-500 to-orange-500",
            "from-fuchsia-600 to-purple-800",
            "from-cyan-400 to-blue-500",
          ][index % 5],
        };
      });
      setProfiles(users);
    };
    fetchProfiles();
  }, []);

  // Split profiles into 3 groups for the columns
  const col1 = profiles.filter((_, i) => i % 3 === 0);
  const col2 = profiles.filter((_, i) => i % 3 === 1);
  const col3 = profiles.filter((_, i) => i % 3 === 2);

  return (
    <div className="h-screen w-screen bg-black overflow-hidden relative">
      {/* HEADER overlay */}
      <div className="fixed top-6 left-6 z-[200]">
        <button onClick={() => navigate(-1)} className="p-3 rounded-full bg-black/50 backdrop-blur-md hover:bg-white/10 transition-colors">
          <ArrowLeft size={28} className="text-white" />
        </button>
      </div>

      {/* THREE COLUMN GRID */}
      <div className="grid grid-cols-3 gap-6 h-full w-full max-w-7xl mx-auto px-6 py-10">
        {profiles.length > 0 && (
          <>
            <ScrollingColumn profiles={col1} speed={COLUMN_SPEEDS[0]} />
            <ScrollingColumn profiles={col2} speed={COLUMN_SPEEDS[1]} reverse={true} />
            <ScrollingColumn profiles={col3} speed={COLUMN_SPEEDS[2]} />
          </>
        )}
      </div>

      {/* VIGNETTE EFFECT (Makes it look like the video) */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black via-transparent to-black z-50 opacity-80" />
    </div>
  );
}