import { motion } from "framer-motion";

export default function PageTransition({ children }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#2b1f1a]">

      {/* PAGE CONTENT */}
      <motion.div
        initial={{
          opacity: 0,
          scale: 1.12,
          y: 80,
          filter: "blur(20px)",
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          filter: "blur(0px)",
        }}
        exit={{
          opacity: 0,
          scale: 0.88,
          y: -80,
          filter: "blur(20px)",
        }}
        transition={{
          duration: 1.1,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="min-h-screen w-full"
      >
        {children}
      </motion.div>

      {/* CINEMATIC LEFT CURTAIN */}
      <motion.div
        initial={{ x: "0%" }}
        animate={{ x: "-100%" }}
        exit={{ x: "0%" }}
        transition={{
          duration: 0.9,
          ease: [0.76, 0, 0.24, 1],
        }}
        className="fixed inset-0 z-[9998] bg-[#1a100d] pointer-events-none"
      />

      {/* SECOND CURTAIN */}
      <motion.div
        initial={{ x: "0%" }}
        animate={{ x: "100%" }}
        exit={{ x: "0%" }}
        transition={{
          duration: 1.1,
          delay: 0.08,
          ease: [0.76, 0, 0.24, 1],
        }}
        className="fixed inset-0 z-[9997] bg-[#3a2720] pointer-events-none"
      />

      {/* CENTER FLASH */}
      <motion.div
        initial={{
          opacity: 0.5,
          scale: 0.5,
        }}
        animate={{
          opacity: 0,
          scale: 2,
        }}
        transition={{
          duration: 1,
          ease: "easeOut",
        }}
        className="fixed inset-0 z-[9999] bg-[#f1e3d3] pointer-events-none"
      />

    </div>
  );
}