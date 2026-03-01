import Navbar from "../components/navbar";
import HeroFilm from "../components/HeroFilm";

export default function Home({ onSearchOpen }) {
  return (
    <div className="relative min-h-screen bg-[#2b1f1a] text-white overflow-x-hidden">

      {/* NAVBAR */}
      <div className="relative z-20">
        <Navbar onSearchClick={onSearchOpen} />
      </div>

      {/* HERO SECTION */}
      <div className="relative z-10">
        <HeroFilm />
      </div>

    </div>
  );
}