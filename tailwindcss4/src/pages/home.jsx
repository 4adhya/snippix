import WebGLOcean from "../components/WebGLOcean";
import Navbar from "../components/navbar";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">

      {/* Background Ocean (WebGL) */}
      <WebGLOcean />

      {/* Foreground Content */}
      <div className="relative z-10">
        <Navbar />

        <section className="min-h-screen flex items-center justify-center text-white">
          <h1 className="text-5xl font-bold">
            Extraordinary Design
          </h1>
        </section>
      </div>

    </div>
  );
}