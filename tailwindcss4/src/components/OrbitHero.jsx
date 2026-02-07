import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import globe from "../assets/jade-globe.png";

export default function OrbitHero() {
  const navigate = useNavigate();

  return (
    <div className="absolute inset-0">
      
      {/* BACKGROUND GLOBE */}
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{
          backgroundImage: `url(${globe})`,
        }}
      />

      {/* DARK + JADE OVERLAY */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/70" />

      {/* ORBITS */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 1000 1000"
        fill="none"
      >
        <ellipse
          cx="500"
          cy="560"
          rx="360"
          ry="180"
          stroke="rgba(183,229,186,0.5)"
          strokeWidth="1"
        />
        <ellipse
          cx="500"
          cy="560"
          rx="430"
          ry="220"
          stroke="rgba(92,171,124,0.35)"
          strokeWidth="1"
        />
      </svg>

      {/* CENTER CTA */}
      <motion.button
        onClick={() => navigate("/collage")}
        className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2
                   px-12 py-6 rounded-full bg-[#1A5140]/80
                   border border-[#B7E5BA]/50 backdrop-blur-md
                   text-xl font-semibold shadow-[0_0_80px_#5CAB7C]"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        Create your first Snippix!
      </motion.button>

      {/* ORBITING BUTTONS */}
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      >
        {/* EXPLORE */}
        <button
          onClick={() => navigate("/")}
          className="absolute left-[14%] top-[58%]
                     px-6 py-3 rounded-full bg-[#1A5140]/70
                     border border-[#5CAB7C]/40 backdrop-blur-md
                     shadow-[0_0_40px_#288760]"
        >
          Explore
        </button>

        {/* CHAT */}
        <button
          onClick={() => navigate("/chat")}
          className="absolute right-[14%] top-[52%]
                     px-6 py-3 rounded-full bg-[#1A5140]/70
                     border border-[#5CAB7C]/40 backdrop-blur-md
                     shadow-[0_0_40px_#288760]"
        >
          Chat
        </button>
      </motion.div>
    </div>
  );
}
