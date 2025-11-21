import React, { useState } from "react";
import { Search, Bell, Settings, User } from "lucide-react";
import logo from "../assets/logo.png";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          
          {/* Left side */}
          <div className="flex items-center gap-6">
            <img
              src={logo}
              alt="Snippix Logo"
              className="h-20 w-auto object-contain drop-shadow-[0_0_8px_rgba(255,255,255,0.15)]"
            />

            {/* Search */}
            <div
              className={`relative transition-all duration-300 ease-out ${
                isSearchFocused ? "w-80" : "w-56"
              }`}
              onMouseEnter={() => setIsSearchFocused(true)}
              onMouseLeave={() => setIsSearchFocused(false)}
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/80" />
              <input
                type="text"
                placeholder="Search..."
                className="w-full bg-neutral-900/70 border border-white/20 rounded-full py-2.5 pl-11 pr-4 text-white placeholder-white/50 focus:outline-none focus:border-white/40 transition-all"
              />
            </div>
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-white/10 transition-all duration-200 group">
              <Bell className="w-6 h-6 text-white/80 group-hover:text-white" />
            </button>
            <button className="p-2 rounded-full hover:bg-white/10 transition-all duration-200 group">
              <User className="w-6 h-6 text-white/80 group-hover:text-white" />
            </button>
            <button className="p-2 rounded-full hover:bg-white/10 transition-all duration-200 group">
              <Settings className="w-6 h-6 text-white/80 group-hover:text-white" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function Home() {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate("/profiles"); // navigates to your animated profile scroll page
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-32 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-5xl font-bold mb-4">Welcome to Snippix</h1>

        <p className="text-gray-400 max-w-lg mb-12">
          Your creative space to share ideas, code, and inspiration.
          Customize your vibe, connect with others, and make something beautiful.
        </p>

        {/* Grid Cards */}
        <div className="grid grid-cols-2 gap-6 max-w-2xl w-full">
          {[
            { label: "Explore", onClick: handleExplore },
            { label: "Chat" },
            { label: "Gallery" },
            { label: "Settings" },
          ].map((card, index) => (
            <div
              key={index}
              onClick={card.onClick}
              className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all cursor-pointer active:scale-95"
            >
              <span className="text-4xl mb-2 block"></span>
              <span className="font-medium">{card.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
