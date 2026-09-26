/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "Audiowide", "sans-serif"],
        body: ["var(--font-body)", "Rajdhani", "sans-serif"],
      },
      colors: {
        "cs-red":    "#ef4444",
        "cs-purple": "#4a2d8a",
        "cs-bg":     "#09051a",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
