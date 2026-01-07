import React from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, Settings, Search } from "lucide-react";

export default function Navbar({ onSearchClick }) {
  const navigate = useNavigate();

  return (
    <div className="flex items-center px-6 py-4 border-b border-white/10">
      
      {/* LEFT — Logo */}
      <h2
        className="text-2xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Snippix
      </h2>

      {/* SPACER — pushes right items */}
      <div className="flex-1" />

      {/* RIGHT — Search + icons */}
      <div className="flex items-center space-x-5">
        <Search
          size={22}
          className="cursor-pointer opacity-80 hover:opacity-100"
          onClick={onSearchClick}
        />

        <Bell size={22} className="cursor-pointer opacity-80 hover:opacity-100" />
        <User size={22} className="cursor-pointer opacity-80 hover:opacity-100" />
        <Settings
          size={22}
          className="cursor-pointer opacity-80 hover:opacity-100"
          onClick={() => navigate("/settings")}
        />
      </div>
    </div>
  );
}
