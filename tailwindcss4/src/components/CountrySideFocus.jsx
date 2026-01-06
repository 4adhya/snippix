import { geoNaturalEarth1, geoPath } from "d3-geo";
import worldData from "../data/world.geo.json";
import cities from "../data/cities.json";

export default function CountrySideFocus({ country, side = "right", onClose }) {
  // ✅ Guard
  if (!country || !country.code) return null;

  console.log("Selected Country Code:", country.code);

  // ✅ Find geometry
  const countryFeature = worldData.features.find(
    (f) =>
      f.properties?.ISO_A2 === country.code ||
      f.properties?.iso_a2 === country.code ||
      f.id === country.code
  );

  if (!countryFeature) {
    return (
      <div className="fixed top-1/2 right-8 -translate-y-1/2 z-50">
        <div className="w-[360px] h-[360px] rounded-full bg-white flex items-center justify-center border shadow-lg">
          <p className="text-xs text-red-400">
            Geometry not found for {country.code}
          </p>
        </div>
      </div>
    );
  }

  // ✅ Projection
  const projection = geoNaturalEarth1().fitSize([280, 280], countryFeature);
  const pathGenerator = geoPath().projection(projection);

  const cityList = cities[country.code] || [];

  return (
    <div
      className={`fixed top-1/2 -translate-y-1/2 z-50 animate-in fade-in zoom-in duration-300 ${
        side === "left" ? "left-8" : "right-8"
      }`}
    >
      {/* ================= CIRCLE CONTAINER ================= */}
      <div className="relative w-[360px] h-[360px] rounded-full bg-white shadow-2xl border-4 border-white overflow-hidden flex items-center justify-center">

        {/* 🔍 ZOOM RING (VISIBLE + CORRECT) */}
        <div className="absolute inset-0 rounded-full pointer-events-none z-30">
          {/* Outer bold ring */}
          <div className="absolute inset-0 rounded-full border-2 border-black/70" />

          {/* Inner subtle ring */}
          <div className="absolute inset-3 rounded-full border border-black/10" />

          {/* Glow */}
          <div className="absolute inset-0 rounded-full shadow-[0_0_40px_rgba(0,0,0,0.18)]" />

          {/* Pulse */}
          <div className="absolute inset-0 rounded-full border-2 border-black/40 animate-pulse" />
        </div>

        {/* COUNTRY HEADER */}
        <div className="absolute top-10 z-40 text-[10px] tracking-[0.2em] uppercase font-bold text-neutral-400">
          Focus / {country.name}
        </div>

        {/* MAP */}
        <svg width={300} height={300} className="z-10 mt-6">
          <g>
            <path
              d={pathGenerator(countryFeature)}
              fill="#f5f5f5"
              stroke="#ccc"
              strokeWidth={1}
            />

            {/* CITY DOTS */}
            {cityList.map((city, i) => {
              if (city.coordinates) {
                const [x, y] = projection(city.coordinates);
                return (
                  <circle
                    key={i}
                    cx={x}
                    cy={y}
                    r={3}
                    fill="#ff4500"
                  />
                );
              }
              return null;
            })}
          </g>
        </svg>

        {/* CITY TAGS */}
        <div className="absolute bottom-12 z-40 flex flex-wrap gap-1 justify-center px-10">
          {cityList.slice(0, 5).map((city) => (
            <span
              key={typeof city === "string" ? city : city.name}
              className="px-2 py-0.5 rounded-full bg-neutral-100 border border-neutral-200 text-[9px] font-medium text-neutral-600"
            >
              {typeof city === "string" ? city : city.name}
            </span>
          ))}
        </div>

        {/* LENS SHADOW */}
        <div className="absolute inset-0 pointer-events-none rounded-full shadow-[inset_0_0_40px_rgba(0,0,0,0.06)] z-20" />
      </div>

      {/* CLOSE BUTTON */}
      <button
        onClick={onClose}
        className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full text-[10px] uppercase tracking-widest hover:bg-neutral-800 transition-colors"
      >
        Close
      </button>
    </div>
  );
}
