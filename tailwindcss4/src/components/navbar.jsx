import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, User, Settings } from "lucide-react";

export default function Navbar() {
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-md border-t border-gray-800 flex justify-around py-3 z-50">
      
      {/* HOME */}
      <button
        onClick={() => navigate("/")}
        className="text-white flex flex-col items-center"
      >
        <Home size={24} />
        <span className="text-xs mt-1">Home</span>
      </button>

      {/* PROFILES */}
      <button
        onClick={() => navigate("/profiles")}
        className="text-white flex flex-col items-center"
      >
        <User size={24} />
        <span className="text-xs mt-1">Profiles</span>
      </button>

      {/* SETTINGS */}
      <button
        onClick={() => navigate("/settings")}
        className="text-white flex flex-col items-center"
      >
        <Settings size={24} />
        <span className="text-xs mt-1">Settings</span>
      </button>

    </div>
  );
}
