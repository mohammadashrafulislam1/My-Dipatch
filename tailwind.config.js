/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";

export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  darkMode: "class", // 👈 ADD THIS LINE
  plugins: [daisyui], // Add DaisyUI here
  daisyui: {
    themes: ["light", "dark"], // or customize further
  },
}