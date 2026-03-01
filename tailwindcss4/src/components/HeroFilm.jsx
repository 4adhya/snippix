import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function HeroFilm() {
  const navigate = useNavigate();

  const images = [
    "/images/film1.jpg",
    "/images/film2.jpg",
    "/images/film3.jpg",
  ];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#2b1f1a] text-white">

      {/* Subtle radial glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.06)_0%,_transparent_70%)] pointer-events-none" />

      {/* ================= FILM STRIP ================= */}
      <div className="relative w-full overflow-hidden mb-16">

        {/* TOP FILM HOLES */}
        <div className="absolute top-0 left-0 w-full h-5 bg-black flex justify-between px-6 z-10">
          {Array.from({ length: 28 }).map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-[#2b1f1a] rounded-[2px]"
            />
          ))}
        </div>

        {/* FILM BODY */}
        <div className="flex justify-center gap-8 px-10 py-10 bg-black border-y border-white/10">

          {images.map((img, index) => (
            <motion.img
              key={index}
              src={img}
              alt="film"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.2, duration: 0.6 }}
              className="w-80 h-48 object-cover shadow-2xl"
            />
          ))}

        </div>

        {/* BOTTOM FILM HOLES */}
        <div className="absolute bottom-0 left-0 w-full h-5 bg-black flex justify-between px-6 z-10">
          {Array.from({ length: 28 }).map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-[#2b1f1a] rounded-[2px]"
            />
          ))}
        </div>

      </div>

      {/* ================= HERO TEXT ================= */}

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-6xl font-semibold text-center font-[Playfair_Display] tracking-wide"
      >
        Frame Your Story.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.8 }}
        transition={{ delay: 0.4 }}
        className="mt-5 text-lg text-gray-300 text-center max-w-xl"
      >
        Turn everyday moments into aesthetic visual narratives.
      </motion.p>

      {/* ================= BUTTONS ================= */}

      <div className="flex gap-6 mt-10">
        <button
          onClick={() => navigate("/collage")}
          className="px-7 py-3 rounded-full bg-[#f1e3d3] text-black font-medium shadow-lg hover:scale-105 transition duration-300"
        >
          Start Creating
        </button>

        <button
          onClick={() => navigate("/explore")}
          className="px-7 py-3 rounded-full bg-[#556b5d] text-white font-medium shadow-lg hover:scale-105 transition duration-300"
        >
          Explore Snippix
        </button>
      </div>
    </section>
  );
}