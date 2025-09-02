/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // só ativa dark se colocar .dark manualmente
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}", // caso uses pasta /app
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          red: "#b42121",
          lightRed: "#d55050",
          bg: "var(--bg)",
          text: "var(--text)",
          border: "var(--border)",
        },
      },
    },
  },
  plugins: [],
};
