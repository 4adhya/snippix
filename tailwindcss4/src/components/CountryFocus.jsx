import cities from "../data/cities.json";

export default function CountryFocus({ country, onClose }) {
  const cityList = cities[country.code] || [];

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
      <div className="w-[420px] h-[420px] rounded-full bg-white shadow-xl flex flex-col items-center justify-center">
        <h2 className="text-xl mb-4">{country.name}</h2>

        <div className="space-y-2">
          {cityList.map((city) => (
            <div
              key={city}
              className="px-4 py-2 rounded-full bg-neutral-100 hover:bg-neutral-200 cursor-pointer text-center"
            >
              {city}
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="absolute bottom-10 text-xs opacity-60"
        >
          close
        </button>
      </div>
    </div>
  );
}
