import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

/* ---------------- BACKGROUND COMPONENT ---------------- */
function BackgroundWave() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    function noise(x, y, t) {
      return (
        Math.sin(x * 0.13 + t * 0.006) * 0.5 +
        Math.cos(y * 0.15 + t * 0.007) * 0.35 +
        Math.sin((x + y) * 0.1 + t * 0.009) * 0.15
      );
    }

    let t = 0;
    let animationId;

    function draw() {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const cols = 80;
      const rows = 50;
      const spacingX = canvas.width / cols;
      const spacingY = canvas.height / rows;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacingX;
          const y = j * spacingY;

          let n = (noise(i * 0.5, j * 0.5, t) + 1) / 2;
          let shape = Math.pow(n, 3.3);

          const size = 1 + shape * 8;
          const blue = Math.floor(40 + shape * 215);

          ctx.fillStyle = `rgb(${blue * 0.3}, ${blue * 0.7}, ${blue})`;
          ctx.beginPath();
          ctx.arc(x, y, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      t += 0.8;
      animationId = requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
    />
  );
}

/* ---------------- COLLAGE POSITIONS ---------------- */
const getSpreadPosition = (index) => {
  const positions = [
    { x: -240, y: -180, rotate: -15 },
    { x: -140, y: 200, rotate: 10 },
    { x: 200, y: -140, rotate: -10 },
    { x: 240, y: 180, rotate: 15 },
    { x: 0, y: -260, rotate: -5 },
  ];
  return positions[index % positions.length];
};

/* ---------------- PROFILE CARD ---------------- */
function ProfileCard({ profile, isExpanded, isHidden, onToggle }) {
  if (isHidden) return null;

  return (
    <motion.div
      layout
      onClick={!isExpanded ? onToggle : undefined}
      className={`h-[450px] rounded-2xl relative ${
        isExpanded ? "z-50 cursor-default" : "z-10 cursor-pointer"
      }`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4 }}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${profile.gradient} rounded-2xl shadow-2xl`}
      />

      <div className="relative h-full flex flex-col items-center justify-center p-8 text-white">
        <motion.div
          layout
          className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center mb-6 shadow-lg"
        >
          <span className="text-5xl font-black">{profile.initials}</span>
        </motion.div>

        <motion.h2 layout className="text-3xl font-black mb-2">
          {profile.name}
        </motion.h2>

        <motion.p
          layout
          className="uppercase tracking-widest text-sm text-white/80 font-medium"
        >
          {profile.role}
        </motion.p>
      </div>

      {/* COLLAGE OVERLAY */}
      <AnimatePresence mode="popLayout">
        {isExpanded &&
          profile.collages.map((img, i) => {
            const pos = getSpreadPosition(i);
            return (
              <motion.img
                key={i}
                src={img}
                className="absolute w-52 h-52 rounded-xl object-cover border-4 border-white shadow-2xl z-[60]"
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: 1,
                  opacity: 1,
                  x: pos.x,
                  y: pos.y,
                  rotate: pos.rotate,
                }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 120,
                  damping: 15,
                  delay: i * 0.05,
                }}
                style={{
                  left: "50%",
                  top: "50%",
                  marginLeft: "-104px",
                  marginTop: "-104px",
                }}
              />
            );
          })}
      </AnimatePresence>
    </motion.div>
  );
}

/* ---------------- MAIN PAGE ---------------- */
export default function ProfileScroll() {
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const users = snapshot.docs.map((doc, index) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.fullName || "User",
          role: data.role || "Creator",
          initials:
            data.initials ||
            (data.fullName
              ? data.fullName
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
              : "U"),
          gradient: [
            "from-purple-500 via-pink-500 to-red-500",
            "from-blue-500 via-cyan-500 to-teal-500",
            "from-green-500 via-emerald-500 to-teal-500",
            "from-orange-500 via-amber-500 to-yellow-500",
            "from-indigo-500 via-purple-500 to-pink-500",
          ][index % 5],
          collages: data.collages || [],
        };
      });
      setProfiles(users);
    };

    fetchProfiles();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <BackgroundWave />

      {/* EXPANDED MODE CONTROLS */}
      <AnimatePresence>
        {expandedId && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-8 left-0 right-0 px-8 flex justify-between z-[100]"
          >
            <button
              onClick={() => setExpandedId(null)}
              className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20"
            >
              <ArrowLeft size={24} />
            </button>

            <button
              onClick={() => setExpandedId(null)}
              className="p-3 rounded-full bg-red-500/80 backdrop-blur-md border border-white/20 hover:bg-red-600"
            >
              <X size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto py-24 px-6">

        {/* HEADER WITH BACK (NON-EXPANDED) */}
        <AnimatePresence mode="wait">
          {!expandedId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative mb-20"
            >
              <button
                onClick={() => navigate(-1)}
                className="absolute left-0 top-1 p-4 rounded-full hover:bg-white/10"
              >
                <ArrowLeft size={30} />
              </button>

              <h1 className="text-6xl font-black text-center tracking-tighter">
                CREATIVE PROFILES
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        {/* GRID */}
        <div
          className={`grid gap-8 transition-all duration-500 ${
            expandedId
              ? "grid-cols-1 max-w-md mx-auto"
              : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          <AnimatePresence mode="popLayout">
            {profiles.map((profile) => {
              const isExpanded = expandedId === profile.id;
              const isHidden = expandedId !== null && !isExpanded;

              return (
                <ProfileCard
                  key={profile.id}
                  profile={profile}
                  isExpanded={isExpanded}
                  isHidden={isHidden}
                  onToggle={() => setExpandedId(profile.id)}
                />
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
