import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./CustomCursor.css";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hover, setHover] = useState(false);

  useEffect(() => {
    const move = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", move);

    const hoverable = document.querySelectorAll("button, a, .hover-target");
    hoverable.forEach((el) => {
      el.addEventListener("mouseenter", () => setHover(true));
      el.addEventListener("mouseleave", () => setHover(false));
    });

    return () => {
      window.removeEventListener("mousemove", move);
      hoverable.forEach((el) => {
        el.removeEventListener("mouseenter", () => setHover(true));
        el.removeEventListener("mouseleave", () => setHover(false));
      });
    };
  }, []);

  return (
    <motion.div
      className={`custom-cursor ${hover ? "cursor-hover" : ""}`}
      animate={{
        x: position.x - 20,
        y: position.y - 20,
      }}
      transition={{
        type: "spring",
        stiffness: 150,
        damping: 10,
        mass: 0.3,
      }}
    />
  );
}

