
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wavygo: {
          green: "#16894b",
          dark: "#064e3b",
          light: "#e8f5ec",
        },
      },
    },
  },
  plugins: [],
};
