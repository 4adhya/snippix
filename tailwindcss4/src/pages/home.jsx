import React from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, Settings } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate("/profiles");
  };

  const handleSettings = () => {
    navigate("/settings");
  };
    const handleCreateSnippix = () => {
    navigate("/collage");
  };


  return (
    <div className="min-h-screen bg-transparent text-white">


      {/* TOP NAVBAR */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
        
        {/* Left Section */}
        <h2 className="text-2xl font-bold">Snippix</h2>

        {/* Right Icons */}
        <div className="flex items-center space-x-4">
          <Bell size={24} className="cursor-pointer" />
          <User size={24} className="cursor-pointer" />

          {/* SETTINGS ICON (NOW CONNECTED) */}
          <Settings
            size={24}
            className="cursor-pointer"
            onClick={handleSettings}
          />
        </div>
      </div>

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
            { label: "Create your first Snippix!", onClick: handleCreateSnippix },
            { label: "Setup your Profile" },
            { label: "Settings", onClick: handleSettings },
          ].map((card, index) => (
            <div
              key={index}
              onClick={card.onClick}
              className="p-8 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all cursor-pointer active:scale-95"
            >
              <span className="font-medium">{card.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
