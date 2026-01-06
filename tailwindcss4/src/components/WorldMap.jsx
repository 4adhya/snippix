import { geoPath, geoNaturalEarth1 } from "d3-geo";
import worldData from "../data/world.geo.json";

export default function WorldMap({ onHover, onSelect, dimmed }) {
  const projection = geoNaturalEarth1()
    .scale(165) // Slightly increased for better visibility
    .translate([500, 260]);

  const pathGenerator = geoPath().projection(projection);

  return (
    <svg 
      viewBox="0 0 1000 520" 
      className="w-[95%] max-w-6xl transition-all duration-700"
      style={{ filter: dimmed ? "grayscale(100%) opacity(0.3)" : "none" }}
    >
      {worldData.features.map((feature, index) => {
        const name = feature.properties.ADMIN || feature.properties.name;
        const code = feature.properties.ISO_A2 || feature.properties.iso_a3;

        // SAFE UNIQUE KEY
        const key = code && code !== "-1" ? code : `${name}-${index}`;

        return (
          <path
            key={key}
            d={pathGenerator(feature)}
            fill="#e5e5e5"
            stroke="#ffffff"
            strokeWidth={0.6}
            className="transition-colors duration-200 ease-in-out hover:fill-neutral-300"
            onMouseEnter={() => onHover(name)}
            onMouseLeave={() => onHover(null)}
            onClick={() =>
              onSelect({
                code,
                name,
              })
            }
            style={{ 
              cursor: "pointer", 
              outline: "none" 
            }}
          />
        );
      })}
    </svg>
  );
}