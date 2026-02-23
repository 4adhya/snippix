import { useState, useEffect } from "react";
import logo1 from "../assets/logo1.png"; // ✅ updated import

export default function App() {
  const [loading, setLoading] = useState(true);
  const [animateOut, setAnimateOut] = useState(false);

  useEffect(() => {
    // Trigger fade/zoom animation at 2 seconds
    const animateTimer = setTimeout(() => setAnimateOut(true), 2000);
    // Remove splash screen at 3 seconds
    const loadingTimer = setTimeout(() => setLoading(false), 3000);

    return () => {
      clearTimeout(animateTimer);
      clearTimeout(loadingTimer);
    };
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center overflow-hidden">
        <div className="flex flex-col items-center gap-6">
          {/* Logo Animation */}
          <div
            className={`transition-all duration-1000 ease-in-out ${
              animateOut ? "scale-[3] opacity-0" : "scale-100 opacity-100"
            }`}
          >
            <img
              src={logo1}
              alt="Snippix Logo"
              className="w-48 h-48 object-contain"
            />
          </div>

          {/* App Name */}
          <h1
            className={`text-white text-4xl font-bold tracking-wider transition-opacity duration-700 ${
              animateOut ? "opacity-0" : "opacity-100"
            }`}
            style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
          >
            SNIPPIX
          </h1>
        </div>
      </div>
    );
  }

  // 🏠 Main Homepage
  return (
    <div className="min-h-screen bg-white animate-fade-in">
      <div className="container mx-auto px-4 py-8">
        <header className="border-b pb-4 mb-8">
          <h2 className="text-3xl font-bold">Snippix</h2>
          <p className="text-gray-600 mt-2">Your Social Platform</p>
        </header>

        <section className="grid gap-4">
          <div className="bg-gray-100 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">Welcome to Snippix</h3>
            <p className="text-gray-700">Homepage content will go here...</p>
          </div>
        </section>
      </div>
    </div>
  );
}

