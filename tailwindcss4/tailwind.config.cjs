/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      /* ===============================
         COLOR SYSTEMS
      ================================ */
      colors: {
        /* Existing palettes (kept) */
        sunflower: {
          light: "#FFF8E1",
          DEFAULT: "#FFEB3B",
          dark: "#FBC02D",
        },
        ocean: {
          light: "#E1F5FE",
          DEFAULT: "#03A9F4",
          dark: "#0288D1",
        },

        /* Jade Horizon (Snippix main theme) */
        jade: {
          50:  "#EAFBF3",
          100: "#CFF3E2",
          200: "#9FD6B8",
          300: "#5CA87C",
          400: "#1FAE78",
          500: "#188F62",
          600: "#146F4C",
          700: "#123D2B",
          800: "#0F2F23",
          900: "#0B1F17",
        },
      },

      /* ===============================
         SHADOWS (GLOW EFFECTS)
      ================================ */
      boxShadow: {
        "jade-soft": "0 0 25px rgba(31,174,120,0.35)",
        "jade-glow": "0 0 40px rgba(31,174,120,0.6)",
        "jade-strong": "0 0 60px rgba(31,174,120,0.8)",
      },

      /* ===============================
         BACKDROP BLUR
      ================================ */
      backdropBlur: {
        xs: "2px",
        sm: "6px",
        md: "12px",
        lg: "18px",
        xl: "24px",
      },

      /* ===============================
         BORDER RADIUS (SOFT UI)
      ================================ */
      borderRadius: {
        xl: "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },

      /* ===============================
         TRANSITIONS
      ================================ */
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      transitionDuration: {
        250: "250ms",
        400: "400ms",
      },
    },
  },
  plugins: [],
};
