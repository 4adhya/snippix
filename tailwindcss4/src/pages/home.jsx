import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import SearchReveal from "../components/SearchReveal";
import SearchPage from "./search";

export default function Home() {
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [showSearchPage, setShowSearchPage] = useState(false);

  const handleExplore = () => {
    navigate("/");
  };

  const handleCreateSnippix = () => {
    navigate("/collage");
  };

  // This function resets the states to hide the search overlay
  const handleCloseSearch = () => {
    setShowSearchPage(false);
    setSearchOpen(false);
  };

  return (
    <div className="min-h-screen bg-transparent text-white relative">
      {/* NAVBAR */}
      <Navbar onSearchClick={() => setSearchOpen(true)} />

      {/* HERO */}
      <div className="pt-32 flex flex-col items-center justify-center text-center px-6">
        <h1 className="text-5xl font-bold mb-4">Welcome to Snippix</h1>

        <p className="text-gray-400 max-w-lg mb-12">
          Your creative space to share ideas, code, and inspiration.
          Customize your vibe, connect with others, and make something beautiful.
        </p>

        <div className="grid grid-cols-2 gap-6 max-w-2xl w-full">
          {[
            { label: "Explore", onClick: handleExplore },
            { label: "Create your first Snippix!", onClick: handleCreateSnippix },
            { label: "Set up your profile", onClick: () => navigate("/setup-profile") },
            { label: "Chat", onClick: () => navigate("/chat") },
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

      {/* SEARCH REVEAL OVERLAY */}
      <SearchReveal
        open={searchOpen}
        onComplete={() => setShowSearchPage(true)}
      >
        {/* Pass the close function here */}
        {showSearchPage && <SearchPage onClose={handleCloseSearch} />}
      </SearchReveal>
    </div>
  );
}