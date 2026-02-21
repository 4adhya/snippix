import { useEffect, useRef } from "react";

export default function BeachBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let W, H;
    const BASE_FRAC = 0.42;

    let tidePhase = 0;
    let shoreY = 0;

    let isScrolling = false;
    let scrollTimeout = null;
    let lastScrollY = window.scrollY;
    let frameId = null;

    function resize() {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
      shoreY = H * BASE_FRAC;
    }

    resize();
    window.addEventListener("resize", resize);

    // ─────────────────────────────────────────────
    // Unified wave function
    // ─────────────────────────────────────────────
    function waveY(x, baseY) {
      return (
        baseY +
        Math.sin(x * 0.0095 + tidePhase * 1.1)  * 13 +
        Math.sin(x * 0.018  - tidePhase * 0.72) *  8 +
        Math.sin(x * 0.032  + tidePhase * 0.48) *  5 +
        Math.cos(x * 0.0065 - tidePhase * 0.95) * 10 +
        Math.cos(x * 0.026  + tidePhase * 0.38) *  6
      );
    }

    // ─────────────────────────────────────────────
    // Draw helpers
    // ─────────────────────────────────────────────
    function drawWaveBand(baseY, yOff, thickness, color, blur = 0) {
      ctx.beginPath();
      for (let x = 0; x <= W; x += 3) {
        const y = waveY(x, baseY) + yOff;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      for (let x = W; x >= 0; x -= 3) {
        ctx.lineTo(x, waveY(x, baseY) + yOff + thickness);
      }
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.shadowColor = color;
      ctx.shadowBlur = blur;
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    function drawWaveLine(baseY, yOff, lineWidth, color, shadowColor, shadowBlur) {
      ctx.beginPath();
      for (let x = 0; x <= W; x += 2) {
        const y = waveY(x, baseY) + yOff;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = shadowColor;
      ctx.shadowBlur = shadowBlur;
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    function drawTendrils(baseY) {
      const count = 24;
      for (let t = 0; t < count; t++) {
        const bx = (W / count) * t + W / (count * 2);
        const rootY = waveY(bx, baseY) + 4;
        const reach =
          14 +
          Math.sin(tidePhase * 0.55 + t * 0.9) * 8 +
          Math.cos(tidePhase * 0.38 + t * 1.4) * 6;

        ctx.beginPath();
        ctx.moveTo(bx, rootY);
        for (let i = 0; i <= reach; i += 1.5) {
          const fx =
            bx +
            Math.sin(i * 0.22 + t * 0.65 + tidePhase * 0.3) *
              Math.max(0, 4.5 - i * 0.1);
          ctx.lineTo(fx, rootY + i);
        }

        const ta = Math.max(
          0.04,
          0.28 * (0.5 + 0.5 * Math.sin(tidePhase * 0.6 + t))
        );

        ctx.strokeStyle = `rgba(220,245,252,${ta})`;
        ctx.lineWidth = 1.3;
        ctx.stroke();
      }
    }

    // ─────────────────────────────────────────────
    // Draw Scene
    // ─────────────────────────────────────────────
    function draw() {
      ctx.clearRect(0, 0, W, H);

      // Sand
      const sandGrad = ctx.createLinearGradient(0, 0, 0, H);
      sandGrad.addColorStop(0, "#cdb082");
      sandGrad.addColorStop(0.3, "#dbbf8e");
      sandGrad.addColorStop(0.6, "#e8ce9e");
      sandGrad.addColorStop(1, "#c9a97a");
      ctx.fillStyle = sandGrad;
      ctx.fillRect(0, 0, W, H);

      // Water polygon
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(W, 0);
      ctx.lineTo(W, waveY(W, shoreY));
      for (let x = W; x >= 0; x -= 3) {
        ctx.lineTo(x, waveY(x, shoreY));
      }
      ctx.closePath();

      const waterGrad = ctx.createLinearGradient(0, 0, 0, shoreY + 20);
      waterGrad.addColorStop(0, "#062f50");
      waterGrad.addColorStop(0.25, "#0a5a82");
      waterGrad.addColorStop(0.65, "#1390bc");
      waterGrad.addColorStop(0.88, "#18afd4");
      waterGrad.addColorStop(1, "#1ec5e2");

      ctx.fillStyle = waterGrad;
      ctx.fill();

      // Foam layers
      drawWaveBand(shoreY, -18, 36, "rgba(60,190,220,0.18)");
      drawWaveBand(shoreY, -6, 18, "rgba(150,220,242,0.45)", 8);
      drawWaveLine(shoreY, 0, 7, "rgba(220,246,255,0.92)", "rgba(200,240,255,0.7)", 10);
      drawWaveLine(shoreY, 3, 3, "rgba(255,255,255,1)", "rgba(255,255,255,0.8)", 7);
      drawTendrils(shoreY);
      drawWaveBand(shoreY, 4, 14, "rgba(180,210,200,0.18)");
    }

    // ─────────────────────────────────────────────
    // Scroll Logic (FIXED)
    // ─────────────────────────────────────────────
    function onScroll() {
      const currentY = window.scrollY;
      const rawDelta = currentY - lastScrollY;
      lastScrollY = currentY;

      const delta = Math.abs(rawDelta);
      const dir = rawDelta > 0 ? 1 : -1;

      tidePhase += delta * 0.01;

      shoreY += dir * delta * 0.12;
      shoreY = Math.max(H * 0.2, Math.min(H * 0.65, shoreY));

      isScrolling = true;

      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        isScrolling = false;
        snapBack();
      }, 120);

      if (!frameId) scheduleFrame();
    }

    function snapBack() {
      const target = H * BASE_FRAC;

      function ease() {
        if (isScrolling) return;

        const diff = target - shoreY;

        if (Math.abs(diff) < 0.2) {
          shoreY = target;
          draw();
          frameId = null;
          return;
        }

        shoreY += diff * 0.06;
        draw();
        frameId = requestAnimationFrame(ease);
      }

      frameId = requestAnimationFrame(ease);
    }

    function scheduleFrame() {
      frameId = requestAnimationFrame(() => {
        draw();
        frameId = null;
        if (isScrolling) scheduleFrame();
      });
    }

    window.addEventListener("scroll", onScroll, { passive: true });

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
      clearTimeout(scrollTimeout);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        display: "block",
      }}
    />
  );
}