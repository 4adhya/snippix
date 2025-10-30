/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
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
      },
    },
  },
  plugins: [],
};
