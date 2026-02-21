import React from "react";
import Navbar from "../components/navbar";
import OrbitHero from "../components/OrbitHero";

export default function Home() {
  return (
    <div className="relative w-screen h-screen overflow-hidden text-white">
      <Navbar />

      {/* TEXT OVERLAY */}
      <div className="absolute top-28 w-full z-20 flex flex-col items-center text-center px-6">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Welcome to Snippix
        </h1>

        <p className="text-gray-300 max-w-xl text-lg">
          Your creative space to share ideas, code, and inspiration.
          Customize your vibe, connect with others, and make something beautiful.
        </p>
      </div>

      {/* FULLSCREEN ORBIT HERO */}
      <OrbitHero />
    </div>
  );
}
