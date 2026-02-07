import React from "react";
import { useNavigate } from "react-router-dom";
import { User, Settings, Search } from "lucide-react";

export default function Navbar({ onSearchClick }) {
  const navigate = useNavigate();

  return (
    <div
      className="
        fixed top-0 left-0 w-full z-50
        flex items-center px-6 py-4
        bg-black/40 backdrop-blur-md
        border-b border-white/10
      "
    >
      {/* LEFT — LOGO */}
      <h2
        className="text-2xl font-bold cursor-pointer tracking-wide"
        onClick={() => navigate("/")}
      >
        Snippix
      </h2>

      {/* SPACER */}
      <div className="flex-1" />

      {/* RIGHT — ICONS */}
      <div className="flex items-center space-x-6">
        {/* SEARCH */}
        <Search
          size={22}
          className="cursor-pointer text-white/80 hover:text-white transition"
          onClick={onSearchClick}
        />

        {/* PROFILE */}
        <User
          size={22}
          className="cursor-pointer text-white/80 hover:text-white transition"
          onClick={() => navigate("/profile")}
        />

        {/* SETTINGS */}
        <Settings
          size={22}
          className="cursor-pointer text-white/80 hover:text-white transition"
          onClick={() => navigate("/settings")}
        />
      </div>
    </div>
  );
}
