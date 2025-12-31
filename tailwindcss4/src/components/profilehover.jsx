import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, X } from "lucide-react";



/* -------------------- DATA & HELPERS -------------------- */
const profiles = [
  { id: 1, name: "Alex Carter", role: "Designer", gradient: "from-purple-500 to-pink-500", image: "AC", collages: ["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=400", "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=400", "https://images.unsplash.com/photo-1618556450994-a6a128ef0d9d?w=400", "https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=400"] },
  { id: 2, name: "Jamie Rivera", role: "Developer", gradient: "from-blue-500 to-teal-500", image: "JR", collages: ["https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=400", "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=400", "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=400"] },
  { id: 3, name: "Taylor Brooks", role: "Photographer", gradient: "from-orange-500 to-yellow-500", image: "TB", collages: ["https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400", "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400", "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400", "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400"] },
  { id: 4, name: "Morgan Lee", role: "Animator", gradient: "from-green-500 to-emerald-500", image: "ML", collages: ["https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=400", "https://images.unsplash.com/photo-1574158622682-e40e69881006?w=400", "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400"] },
];

const getSpreadPosition = (index) => {
  const positions = [
    { x: -220, y: -160, rotate: -15 },
    { x: -120, y: 180, rotate: 10 },
    { x: 180, y: -120, rotate: -10 },
    { x: 220, y: 160, rotate: 15 },
    { x: 0, y: -240, rotate: -5 },
  ];
  return positions[index % positions.length];
};

/* -------------------- COMPONENTS -------------------- */
function ProfileCard({ profile, isExpanded, onToggle, isHidden }) {
  if (isHidden) return null;

  return (
    <motion.div
      layout
      className={`h-[450px] rounded-2xl relative cursor-pointer ${isExpanded ? 'z-50' : 'z-10'}`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      onClick={!isExpanded ? onToggle : undefined}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${profile.gradient} rounded-2xl shadow-2xl`} />
      
      <div className="relative h-full flex flex-col items-center justify-center p-8 text-white">
        <motion.div layout className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-6 border border-white/30">
          <span className="text-5xl font-black">{profile.image}</span>
        </motion.div>
        <motion.h2 layout className="text-3xl font-black mb-2">{profile.name}</motion.h2>
        <motion.p layout className="uppercase tracking-widest text-sm text-white/80">{profile.role}</motion.p>
      </div>

      <AnimatePresence>
        {isExpanded && profile.collages.map((img, i) => {
          const pos = getSpreadPosition(i);
          return (
            <motion.div
              key={i}
              className="absolute w-52 h-52 rounded-xl overflow-hidden shadow-2xl border-4 border-white"
              initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
              animate={{ x: pos.x, y: pos.y, rotate: pos.rotate, scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", stiffness: 120, delay: i * 0.05 }}
              style={{ left: "50%", top: "50%", marginLeft: "-104px", marginTop: "-104px" }}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </motion.div>
          );
        })}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ProfileScroll() {
  const [expandedId, setExpandedId] = useState(null);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500">
      
      {/* Navigation Controls */}
      <AnimatePresence>
        {expandedId && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-8 left-0 right-0 px-8 flex justify-between z-[100]"
          >
            <button onClick={() => setExpandedId(null)} className="p-3 rounded-full bg-white/10 backdrop-blur hover:bg-white/20 border border-white/20 transition-colors">
              <ArrowLeft size={24} />
            </button>
            <button onClick={() => setExpandedId(null)} className="p-3 rounded-full bg-red-500/80 backdrop-blur hover:bg-red-600 border border-white/20 transition-colors">
              <X size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-6xl mx-auto py-32 px-6">
        {!expandedId && (
          <motion.h1 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-6xl font-black text-center mb-20 tracking-tighter"
          >
            CREATIVE <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">PROFILES</span>
          </motion.h1>
        )}

        <div className={`grid gap-8 ${expandedId ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"}`}>
          <AnimatePresence mode="wait">
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