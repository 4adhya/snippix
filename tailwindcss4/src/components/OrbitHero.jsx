import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import globe from "../assets/jade-globe.png";

export default function OrbitHero() {
  const navigate = useNavigate();

  return (
    <div className="absolute inset-0 overflow-hidden">
      
      {/* BACKGROUND GLOBE */}
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url(${globe})` }}
      />

      {/* DARK + JADE OVERLAY */}
      <div className="hero-overlay" />

      {/* ORBIT SVG */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1000 1000"
        fill="none"
      >
        <ellipse
          cx="500"
          cy="560"
          rx="340"
          ry="170"
          stroke="rgba(183,229,186,0.5)"
          strokeWidth="1"
        />
        <ellipse
          cx="500"
          cy="560"
          rx="410"
          ry="210"
          stroke="rgba(92,171,124,0.35)"
          strokeWidth="1"
        />
      </svg>

      {/* CENTER CTA */}
      <motion.button
        onClick={() => navigate("/collage")}
        className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2
                   px-12 py-6 rounded-full glass glow-jade-strong
                   text-xl font-semibold z-20"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        Create your first Snippix!
      </motion.button>

      {/* ORBIT SYSTEM */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
        style={{ transformOrigin: "50% 56%" }} // <-- IMPORTANT
      >
        {/* EXPLORE */}
        <button
          onClick={() => navigate("/")}
          className="absolute left-1/2 top-[56%]
                     -translate-x-[340px] -translate-y-1/2
                     glass glow-jade px-6 py-3 rounded-full"
        >
          Explore
        </button>

        {/* CHAT */}
        <button
          onClick={() => navigate("/chat")}
          className="absolute left-1/2 top-[56%]
                     translate-x-[340px] -translate-y-1/2
                     glass glow-jade px-6 py-3 rounded-full"
        >
          Chat
        </button>
      </motion.div>
    </div>
  );
}
