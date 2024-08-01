/** @type {import('tailwindcss').Config} */
import daisyui from "daisyui";
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      primaryUser: "#DC9832",
      primaryBusiness: "#4B99FA",
      primaryAdmin: "#29AB87",
      secondUser: "#E1BF0E",
      secondBusiness: "#72B1FF",
      secondAdmin: "#C7EA46",
      alert: "#dc143c ",
      smoke: "#848884  ",
      white: "#FFFFFF",
      whiteSmoke: "#f1f1f1",
      dark: "#000",
    },
    extend: {
      boxShadow: {
        boxShadow: "0 0px 8px -3px rgba(0, 0, 0, 0.3)",
      },
    },
  },
  plugins: [daisyui],
};
