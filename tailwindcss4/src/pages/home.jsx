import React from "react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <motion.div
      className="min-h-screen bg-ocean-light flex flex-col items-center justify-center text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <h1 className="text-4xl font-bold text-ocean-dark mb-2">
        Welcome to Snippix 🌻
      </h1>
      <p className="text-gray-700 max-w-lg">
        Your creative space to share ideas, code, and inspiration.  
        Customize your vibe, connect with others, and make something beautiful.
      </p>

      <div className="mt-10 grid grid-cols-2 gap-6">
        <div className="p-6 bg-white/70 rounded-2xl shadow-xl">✨ Explore</div>
        <div className="p-6 bg-white/70 rounded-2xl shadow-xl">💬 Chat</div>
        <div className="p-6 bg-white/70 rounded-2xl shadow-xl">🖼️ Gallery</div>
        <div className="p-6 bg-white/70 rounded-2xl shadow-xl">⚙️ Settings</div>
      </div>
    </motion.div>
  );
}
