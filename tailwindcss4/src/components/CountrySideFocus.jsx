import { useMemo } from "react";
import { geoNaturalEarth1, geoPath } from "d3-geo";
import worldData from "../data/world.geo.json";
import cities from "../data/cities.json";

export default function CountrySideFocus({
  country,
  side = "right",
  onClose,
}) {
  // 1. Find the exact feature for the country
  const countryFeature = useMemo(() => {
    return worldData.features.find(
      (f) =>
        f.properties?.ADMIN === country.name ||
        f.properties?.name === country.name ||
        f.id === country.code
    );
  }, [country]);

  // 2. Configure Projection and Path
  const { projection, pathGenerator } = useMemo(() => {
    if (!countryFeature) return { projection: null, pathGenerator: null };

    // Set projection to fit the 260x260 inner SVG
    const proj = geoNaturalEarth1()
      .fitExtent(
        [
          [30, 30], // Increased padding for labels
          [230, 230],
        ],
        countryFeature
      )
      .clipAngle(null); // Disable clipping so all points within the frame render

    return {
      projection: proj,
      pathGenerator: geoPath().projection(proj),
    };
  }, [countryFeature]);

  if (!countryFeature || !projection) return null;

  // 3. Get city list from your JSON
  const cityList = cities[country.code] || [];

  return (
    <div
      className={`fixed top-1/2 -translate-y-1/2 z-50 ${
        side === "left" ? "left-8" : "right-8"
      }`}
    >
      <div className="relative w-[360px] h-[360px] rounded-full bg-white shadow-2xl overflow-hidden border border-neutral-100">
        
        {/* HEADER */}
        <div className="absolute top-8 w-full text-center z-30 text-[10px] tracking-[0.25em] uppercase font-bold text-neutral-400">
          Focus / {country.name}
        </div>

        {/* ZOOM RING UI */}
        <svg width={360} height={360} className="absolute inset-0 z-20 pointer-events-none">
          <circle cx="180" cy="180" r="170" fill="none" stroke="black" strokeOpacity="0.6" strokeWidth="1.5" />
          <circle cx="180" cy="180" r="155" fill="none" stroke="black" strokeOpacity="0.1" strokeWidth="1" />
        </svg>

        {/* MAP CONTENT - Inner 260x260 container */}
        <svg
          width={260}
          height={260}
          viewBox="0 0 260 260"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        >
          {/* COUNTRY SHAPE */}
          <path
            d={pathGenerator(countryFeature)}
            fill="#f8f8f8"
            stroke="#d1d1d1"
            strokeWidth={1.2}
          />

          {/* CITY PINS */}
          {cityList.map((city) => {
            // CRITICAL: D3 Projection uses [Longitude, Latitude]
            const point = projection([city.lng, city.lat]);
            
            // If the point is valid, render it
            if (!point) return null;
            const [x, y] = point;

            return (
              <g key={city.name} transform={`translate(${x}, ${y})`}>
                {/* Glow for visibility */}
                <circle r={5} fill="white" fillOpacity={0.6} />
                {/* Pin Head */}
                <circle
                  r={3.5}
                  fill="#111"
                  stroke="white"
                  strokeWidth={1.5}
                />
                {/* City Name Label */}
                <text
                  y={-10}
                  textAnchor="middle"
                  fontSize="10"
                  fill="#111"
                  fontWeight="600"
                  style={{ 
                    paintOrder: "stroke", 
                    stroke: "#fff", 
                    strokeWidth: "3px",
                    letterSpacing: "0.02em"
                  }}
                >
                  {city.name}
                </text>
              </g>
            );
          })}
        </svg>

        {/* CITY TAGS (BOTTOM UI) */}
        <div className="absolute bottom-12 w-full z-30 flex justify-center gap-2 px-8 flex-wrap">
          {cityList.slice(0, 3).map((city) => (
            <span 
              key={city.name} 
              className="px-2.5 py-0.5 rounded-full bg-neutral-100 border border-neutral-200 text-[9px] font-semibold text-neutral-500 uppercase tracking-tighter"
            >
              {city.name}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={onClose}
        className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-black text-white px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:scale-105 transition-transform"
      >
        Close
      </button>
    </div>
  );
}