import WebGLOcean from "../components/WebGLOcean";
import Navbar from "../components/navbar";

export default function Home({ onSearchOpen }) {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-black">

      {/* 🌊 Background Ocean */}
      <div className="absolute inset-0 z-0">
        <WebGLOcean />
      </div>

      {/* 🌟 Foreground Content */}
      <div className="relative z-10 flex flex-col min-h-screen">

        {/* Navbar */}
        <Navbar onSearchClick={onSearchOpen} />

        {/* Hero Section */}
        <section className="flex-1 flex items-center justify-center text-white px-6 text-center">
          <div className="max-w-3xl">
            
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              Extraordinary Design
            </h1>

            <p className="text-lg md:text-xl text-white/70 mb-8">
              Crafting immersive digital experiences with creativity,
              motion, and modern aesthetics.
            </p>

            <button className="px-6 py-3 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition-all duration-300">
              Get Started
            </button>

          </div>
        </section>

      </div>
    </div>
  );
}