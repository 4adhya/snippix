import React from "react";

export default function OceanWaves() {
  return (
    <div className="relative h-[200vh] w-full bg-[#e8d8c3] overflow-hidden">

      {/* BACK WAVE */}
      <div className="absolute bottom-0 w-[200%] animate-waveSlow">
        <svg viewBox="0 0 1440 320" className="w-full">
          <path
            fill="#0284c7"
            fillOpacity="0.8"
            d="M0,192L48,186.7C96,181,192,171,288,149.3C384,128,480,96,576,106.7C672,117,768,171,864,197.3C960,224,1056,224,1152,202.7C1248,181,1344,139,1392,117.3L1440,96V320H0Z"
          />
        </svg>
      </div>

      {/* FRONT WAVE */}
      <div className="absolute bottom-0 w-[200%] animate-waveFast">
        <svg viewBox="0 0 1440 320" className="w-full">
          <path
            fill="#0ea5e9"
            fillOpacity="1"
            d="M0,160L48,176C96,192,192,224,288,208C384,192,480,128,576,117.3C672,107,768,149,864,170.7C960,192,1056,192,1152,181.3C1248,171,1344,149,1392,138.7L1440,128V320H0Z"
          />
        </svg>
      </div>

    </div>
  );
}