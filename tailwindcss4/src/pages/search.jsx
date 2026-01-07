import { useState } from "react";
import { X } from "lucide-react"; // Make sure lucide-react is installed
import SearchBar from "../components/SearchBar";
import WorldMap from "../components/WorldMap";
import CountrySideFocus from "../components/CountrySideFocus";

export default function Search({ onClose }) {
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [activeCountry, setActiveCountry] = useState(null);

  return (
    <div className="relative min-h-screen bg-[#fafafa] text-[#222] overflow-hidden">
      
      {/* CLOSE BUTTON - This allows you to go back to Home */}
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 z-[60] p-2 hover:bg-black/5 rounded-full transition-colors"
      >
        <X size={28} className="text-neutral-400" />
      </button>

      {/* Search Bar - Higher Z-Index */}
      <div className="pt-10 flex justify-center relative z-30">
        <SearchBar />
      </div>

      {/* Country name on hover */}
      {hoveredCountry && !activeCountry && (
        <div 
          className="absolute top-32 left-1/2 -translate-x-1/2 z-40 pointer-events-none transition-opacity duration-300"
        >
          <div className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-neutral-100">
            {hoveredCountry}
          </div>
        </div>
      )}

      {/* Map Container */}
      <div className="mt-12 flex justify-center relative z-10">
        <WorldMap
          onHover={setHoveredCountry}
          onSelect={setActiveCountry}
          dimmed={!!activeCountry}
        />
      </div>

      {/* Side circular focus */}
      {activeCountry && (
        <div className="z-50 relative">
          <CountrySideFocus
            country={activeCountry}
            side={activeCountry.code < "M" ? "left" : "right"}
            onClose={() => setActiveCountry(null)}
          />
        </div>
      )}
    </div>
  );
}