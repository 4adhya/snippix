import { motion, useTime, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import globe from "../assets/jade-globe.png";

export default function OrbitHero() {
  const navigate = useNavigate();
  const time = useTime();

  // Ellipse radii
  const a = 360; // x radius
  const b = 170; // y radius

  // Angle over time
  const angle = useTransform(time, t => t / 4000);

  // EXPLORE position
  const exploreX = useTransform(angle, t => a * Math.cos(t));
  const exploreY = useTransform(angle, t => b * Math.sin(t));

  // CHAT position (opposite side of orbit)
  const chatX = useTransform(angle, t => a * Math.cos(t + Math.PI));
  const chatY = useTransform(angle, t => b * Math.sin(t + Math.PI));

  return (
    <div className="absolute inset-0 overflow-hidden">

      {/* BACKGROUND GLOBE */}
      <div
        className="absolute inset-0 bg-center bg-cover"
        style={{ backgroundImage: `url(${globe})` }}
      />

      {/* VIGNETTE */}
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
          rx={a}
          ry={b}
          stroke="rgba(183,229,186,0.5)"
          strokeWidth="1"
        />
        <ellipse
          cx="500"
          cy="560"
          rx={a + 70}
          ry={b + 40}
          stroke="rgba(92,171,124,0.35)"
          strokeWidth="1"
        />
      </svg>

      {/* CENTER CTA */}
      <button
        onClick={() => navigate("/collage")}
        className="absolute left-1/2 top-[56%] -translate-x-1/2 -translate-y-1/2
                   px-12 py-6 rounded-full glass glow-jade-strong
                   text-xl font-semibold z-20"
      >
        Create your first Snippix!
      </button>

      {/* EXPLORE (PERFECT ORBIT) */}
      <motion.button
        style={{
          x: exploreX,
          y: exploreY,
        }}
        className="absolute left-1/2 top-[56%]
                   -translate-x-1/2 -translate-y-1/2
                   glass glow-jade px-6 py-3 rounded-full z-20"
        onClick={() => navigate("/")}
      >
        Explore
      </motion.button>

      {/* CHAT (PERFECT ORBIT) */}
      <motion.button
        style={{
          x: chatX,
          y: chatY,
        }}
        className="absolute left-1/2 top-[56%]
                   -translate-x-1/2 -translate-y-1/2
                   glass glow-jade px-6 py-3 rounded-full z-20"
        onClick={() => navigate("/chat")}
      >
        Chat
      </motion.button>
    </div>
  );
}

