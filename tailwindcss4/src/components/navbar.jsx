import React from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, Settings, Search } from "lucide-react";

export default function Navbar({ onSearchClick }) {
  const navigate = useNavigate();

  const handleSettings = () => {
    navigate("/settings");
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 border-b border-white/10">
      {/* Left */}
      <h2
        className="text-2xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Snippix
      </h2>

      {/* Center — Search Icon */}
      <Search
        size={22}
        className="cursor-pointer opacity-80 hover:opacity-100"
        onClick={onSearchClick}
      />

      {/* Right */}
      <div className="flex items-center space-x-4">
        <Bell size={24} className="cursor-pointer" />
        <User size={24} className="cursor-pointer" />
        <Settings
          size={24}
          className="cursor-pointer"
          onClick={handleSettings}
        />
      </div>
    </div>
  );
}
