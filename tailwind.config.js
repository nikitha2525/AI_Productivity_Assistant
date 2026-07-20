/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0e0e10",
        panel: "#17171a",
        panel2: "#1e1e22",
        border: "#2a2a2f",
        gold: "#d4af37",
        goldSoft: "#e8cf7a",
        muted: "#9a9aa2",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
