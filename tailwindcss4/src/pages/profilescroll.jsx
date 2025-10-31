import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const profiles = [
  { id: 1, name: "Alex Carter", role: "Designer" },
  { id: 2, name: "Jamie Rivera", role: "Developer" },
  { id: 3, name: "Taylor Brooks", role: "Photographer" },
  { id: 4, name: "Morgan Lee", role: "Animator" },
  { id: 5, name: "Jordan Smith", role: "Writer" },
];

export default function ProfileScroll() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Back button */}
      <button
        onClick={() => navigate("/")}
        className="absolute top-6 left-6 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
      >
        <ArrowLeft className="w-6 h-6 text-white" />
      </button>

      <div className="flex gap-10 px-10 overflow-x-auto snap-x snap-mandatory scroll-smooth hide-scrollbar py-32">
        {profiles.map((profile, index) => (
          <motion.div
            key={profile.id}
            className={`snap-center min-w-[320px] h-[420px] flex-shrink-0 rounded-3xl shadow-2xl flex flex-col justify-end p-8 transition-all duration-500 ${
              index % 2 === 0 ? "bg-white text-black" : "bg-neutral-900 text-white"
            }`}
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: false, amount: 0.3 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-3xl font-bold mb-2">{profile.name}</h2>
            <p className="text-gray-400 text-lg">{profile.role}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
