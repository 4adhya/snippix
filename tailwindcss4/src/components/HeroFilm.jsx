import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

// 🔥 Import your images
import boat from "../assets/boat.jpg";
import bird from "../assets/bird.jpg";
import street from "../assets/street.jpg";

export default function HeroFilm() {
  const navigate = useNavigate();

  const images = [boat, bird, street];

  // Duplicate images for seamless infinite loop
  const loopingImages = [...images, ...images];

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#2b1f1a] text-white">

      {/* Radial glow overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.06)_0%,_transparent_70%)] pointer-events-none" />

      {/* ================= FILM STRIP ================= */}
      <div className="relative w-full overflow-hidden mb-20">

        {/* TOP FILM HOLES */}
        <div className="absolute top-0 left-0 w-full h-5 bg-black flex justify-between px-6 z-20">
          {Array.from({ length: 28 }).map((_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-[#2b1f1a] rounded-[2px]"
            />
          ))}
        </div>

        {/* AUTO-SCROLLING FILM BODY */}
        <motion.div
          className="flex gap-8 px-10 py-12 bg-black border-y border-white/10"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            repeatType: "loop",
            duration: 35,
            ease: "linear",
          }}
        >
          {loopingImages.map((img, index) => (
            <div
              key={index}
              className="p-2 bg-black border border-white/10 flex-shrink-0"
            >
              <img
                src={img}
                alt="film"
                className="w-80 h-56 object-cover rounded-sm shadow-2xl hover:scale-105 transition duration-500"
              />
            </div>
          ))}
        </motion.div>

        {/* BOTTOM FILM HOLES */}
        <div className="absolute bottom-0 left-0 w-full h-5 bg-black flex justify-between px-6 z-20">
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
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl md:text-6xl font-semibold text-center font-[Playfair_Display] tracking-wide"
      >
        Built for the main feed.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.85 }}
        transition={{ delay: 0.4 }}
        className="mt-6 text-lg text-gray-300 text-center max-w-xl"
      >
        Because your moments deserve the spotlight.
      </motion.p>

      {/* ================= BUTTONS ================= */}

      <div className="flex gap-6 mt-12">
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