import { geoNaturalEarth1, geoPath } from "d3-geo";
import worldData from "../data/world.geo.json";
import cities from "../data/cities.json";

export default function CountrySideFocus({
  country,
  side = "right",
  onClose,
}) {
  // ✅ MATCH EXACT SAME FEATURE AS WorldMap
  const countryFeature = worldData.features.find(
    (f) =>
      f.properties?.ADMIN === country.name ||
      f.properties?.name === country.name
  );

  if (!countryFeature) return null;

  // ✅ FIT COUNTRY PERFECTLY INSIDE RING
  const projection = geoNaturalEarth1();
  projection.fitExtent(
    [
      [10, 10],
      [250, 250],
    ],
    countryFeature
  );

  const pathGenerator = geoPath().projection(projection);

  const cityList = cities[country.code] || [];

  return (
    <div
      className={`fixed top-1/2 -translate-y-1/2 z-50 ${
        side === "left" ? "left-8" : "right-8"
      }`}
    >
      <div className="relative w-[360px] h-[360px] rounded-full bg-white shadow-2xl overflow-hidden">

        {/* HEADER */}
        <div className="absolute top-8 w-full text-center z-30 text-[10px] tracking-[0.25em] uppercase font-semibold text-neutral-400">
          Focus / {country.name}
        </div>

        {/* ZOOM RING */}
        <svg
          width={360}
          height={360}
          className="absolute inset-0 z-20 pointer-events-none"
        >
          <circle
            cx="180"
            cy="180"
            r="170"
            fill="none"
            stroke="black"
            strokeOpacity="0.7"
            strokeWidth="2"
          />
          <circle
            cx="180"
            cy="180"
            r="155"
            fill="none"
            stroke="black"
            strokeOpacity="0.15"
            strokeWidth="1"
          />
        </svg>

        {/* COUNTRY MAP */}
        <svg
          width={260}
          height={260}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        >
          <path
            d={pathGenerator(countryFeature)}
            fill="#f3f3f3"
            stroke="#bbb"
            strokeWidth={1}
          />
        </svg>

        {/* CITY TAGS */}
        <div className="absolute bottom-10 w-full z-30 flex justify-center gap-1 px-8 flex-wrap">
          {cityList.slice(0, 5).map((city) => (
            <span
              key={typeof city === "string" ? city : city.name}
              className="px-2 py-0.5 rounded-full bg-neutral-100 border text-[9px]"
            >
              {typeof city === "string" ? city : city.name}
            </span>
          ))}
        </div>
      </div>

      <button
        onClick={onClose}
        className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-1 rounded-full text-[10px] uppercase"
      >
        Close
      </button>
    </div>
  );
}
