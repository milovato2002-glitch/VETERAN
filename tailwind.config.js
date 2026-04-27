/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Archivo Black"', "sans-serif"],
        body: ['"Archivo"', "sans-serif"],
        mono: ['"JetBrains Mono"', "monospace"],
      },
      colors: {
        accent: {
          DEFAULT: "#FACC15", // yellow-400 — match HYROX-adjacent brand language
          dim: "#A88E0E",
        },
      },
    },
  },
  plugins: [],
};
