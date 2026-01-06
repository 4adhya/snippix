import { motion } from "framer-motion";

export default function SearchReveal({ open, onComplete, children }) {
  if (!open) return null;

  return (
    <motion.div
      initial={{
        clipPath: "circle(0% at 50% 0%)",
      }}
      animate={{
        clipPath: "circle(150% at 50% 0%)",
      }}
      transition={{
        duration: 0.9,
        ease: "easeInOut",
      }}
      onAnimationComplete={onComplete}
      className="fixed inset-0 bg-white z-50"
    >
      {children}
    </motion.div>
  );
}
