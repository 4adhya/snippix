import { geoNaturalEarth1, geoPath } from "d3-geo";
import worldData from "../data/world.geo.json";
// Ensure your cities.json has coordinates if you want them placed accurately, 
// otherwise this code will list them as tags at the bottom.
import cities from "../data/cities.json"; 
console.log("Selected Country Code:", country.code);

export default function CountrySideFocus({ country, side = "right", onClose }) {
  const countryFeature = worldData.features.find(
    (f) => f.properties.ISO_A2 === country.code
  );

  if (!countryFeature) return null;

  // 1. Setup projection to fit the country perfectly inside the circle
  const projection = geoNaturalEarth1().fitSize([280, 280], countryFeature);
  const pathGenerator = geoPath().projection(projection);
  
  // 2. Get city data for this country
  const cityList = cities[country.code] || [];
  const countryfeature = worldData.features.find(
    (f) => 
      f.properties.ISO_A2 === country.code || 
      f.properties.iso_a2 === country.code ||
      f.id === country.code
  );
  if (!countryfeature) {
    return (
      <div className="fixed top-1/2 right-8 -translate-y-1/2 z-50">
        <div className="w-[360px] h-[360px] rounded-full bg-white flex items-center justify-center border">
          <p className="text-xs text-red-400">Geometry not found for {country.code}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed top-1/2 -translate-y-1/2 z-50 animate-in fade-in zoom-in duration-300 ${
        side === "left" ? "left-8" : "right-8"
      }`}
    >
      {/* THE CIRCLE CONTAINER */}
      <div className="w-[360px] h-[360px] rounded-full bg-white shadow-2xl border-4 border-white flex flex-col items-center justify-center relative overflow-hidden">
        
        {/* COUNTRY NAME HEADER */}
        <div className="absolute top-10 z-10 text-[10px] tracking-[0.2em] uppercase font-bold text-neutral-400">
          Focus / {country.name}
        </div>

        {/* MAP SVG */}
        <svg width={300} height={300} className="mt-4">
          <g>
            {/* The Country Shape */}
            <path
              d={pathGenerator(countryFeature)}
              fill="#f5f5f5"
              stroke="#ccc"
              strokeWidth={1}
            />
            
            {/* OPTIONAL: If your cities.json has [lat, lng], you can plot them here */}
            {cityList.map((city, i) => {
              if (city.coordinates) {
                const [x, y] = projection(city.coordinates);
                return (
                  <circle key={i} cx={x} cy={y} r={3} fill="#ff4500" />
                );
              }
              return null;
            })}
          </g>
        </svg>

        {/* CITY NAMES OVERLAY (Inside the circle) */}
        <div className="absolute bottom-12 flex flex-wrap gap-1 justify-center px-10">
          {cityList.slice(0, 5).map((city) => (
            <span
              key={typeof city === 'string' ? city : city.name}
              className="px-2 py-0.5 rounded-full bg-neutral-100 border border-neutral-200 text-[9px] font-medium text-neutral-600"
            >
              {typeof city === 'string' ? city : city.name}
            </span>
          ))}
        </div>

        {/* MASK/GLARE EFFECT to make it look like a lens */}
        <div className="absolute inset-0 pointer-events-none rounded-full shadow-[inset_0_0_40px_rgba(0,0,0,0.05)]"></div>
      </div>

      {/* CLOSE BUTTON (Outside the circle for better UX) */}
      <button
        onClick={onClose}
        className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full text-[10px] uppercase tracking-widest hover:bg-neutral-800 transition-colors"
      >
        Close
      </button>
    </div>
  );
}