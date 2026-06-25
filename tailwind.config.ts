import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        pitch: "#1a6b2e",
        accent: "#f5c518",
        ink: "#0f3a1a", // very dark green for text on white
      },
      fontFamily: {
        sans: ["var(--font-inter)"],
        display: ["var(--font-bebas)"],
      },
    },
  },
  plugins: [],
};
export default config;
