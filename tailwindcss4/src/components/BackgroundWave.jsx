import { useEffect, useRef } from "react";

export default function BackgroundWave() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }

    window.addEventListener("resize", resize);

    // --------- ORGANIC NOISE FUNCTION (3-layer wave blend) ---------
    function noise(x, y, t) {
      return (
        Math.sin(x * 0.13 + t * 0.006) * 0.5 +
        Math.cos(y * 0.15 + t * 0.007) * 0.35 +
        Math.sin((x + y) * 0.1 + t * 0.009) * 0.15
      );
    }

    let t = 0;

    function draw() {
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, width, height);

      const cols = 200;
      const rows = 200;
      const spacingX = width / cols;
      const spacingY = height / rows;

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * spacingX + spacingX / 2;
          const y = j * spacingY + spacingY / 2;

          let n1 = noise(i * 0.9, j * 0.9, t);
          let n2 = noise(i * 0.45 + 40, j * 0.45 - 10, t * 0.7);
          let n3 = noise(i * 0.22 - 30, j * 0.22 + 50, t * 1.25);

          let blend = (n1 * 0.6 + n2 * 0.3 + n3 * 0.1 + 1) / 2;
          let shape = Math.pow(blend, 3.3);

          const size = (spacingX + spacingY) * (0.03 + shape * 0.33);

          const blue = Math.floor(40 + shape * 215);
          const green = Math.floor(blue * 0.82);
          const red = Math.floor(blue * 0.38);

          const warp = Math.sin(i * 0.14 + t * 0.01) * 3 +
                       Math.cos(j * 0.14 + t * 0.009) * 3;

          ctx.fillStyle = `rgb(${red}, ${green}, ${blue})`;
          ctx.beginPath();
          ctx.arc(x + warp, y + warp, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      t += 1;
      requestAnimationFrame(draw);
    }

    draw();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
    />
  );
}


