import cities from "../data/cities.json";

export default function CountrySideFocus({ country, side = "right", onClose }) {
  const cityList = cities[country.code] || [];

  return (
    <div
      className={`fixed top-1/2 -translate-y-1/2 z-50 ${
        side === "left" ? "left-8" : "right-8"
      }`}
    >
      <div className="w-[360px] h-[360px] rounded-full bg-white border border-neutral-200 shadow-xl flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-sm tracking-widest uppercase text-neutral-500 mb-4">
          {country.name}
        </h2>

        <div className="flex flex-wrap gap-2 justify-center">
          {cityList.map((city) => (
            <span
              key={city}
              className="px-3 py-1 rounded-full border border-neutral-300 text-sm text-neutral-700 cursor-pointer hover:bg-neutral-100"
            >
              {city}
            </span>
          ))}
        </div>

        <button
          onClick={onClose}
          className="absolute -bottom-10 text-xs text-neutral-400"
        >
          close
        </button>
      </div>
    </div>
  );
}
