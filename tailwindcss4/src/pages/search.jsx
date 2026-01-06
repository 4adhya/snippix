import { useState } from "react";
import SearchBar from "../components/SearchBar";
import WorldMap from "../components/WorldMap";
import CountrySideFocus from "../components/CountrySideFocus";

export default function Search() {
  const [hoveredCountry, setHoveredCountry] = useState(null);
  const [activeCountry, setActiveCountry] = useState(null);

  return (
    <div className="relative min-h-screen bg-[#fafafa] text-[#222] overflow-hidden">
      {/* Search Bar - Higher Z-Index */}
      <div className="pt-10 flex justify-center relative z-30">
        <SearchBar />
      </div>

      {/* Country name on hover - Absolute Positioned with High Z-Index */}
      {hoveredCountry && !activeCountry && (
        <div 
          className="absolute top-32 left-1/2 -translate-x-1/2 z-40 pointer-events-none transition-opacity duration-300"
        >
          <div className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-neutral-100">
            {hoveredCountry}
          </div>
        </div>
      )}

      {/* Map Container - Relative Z-Index */}
      <div className="mt-12 flex justify-center relative z-10">
        <WorldMap
          onHover={setHoveredCountry}
          onSelect={setActiveCountry}
          dimmed={!!activeCountry}
        />
      </div>

      {/* Side circular focus - Top Layer */}
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