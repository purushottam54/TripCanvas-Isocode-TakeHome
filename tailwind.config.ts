import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT: "#173F35",
          50: "#f2f7f5",
          100: "#e0ede8",
          200: "#c2dcd3",
          300: "#98c3b6",
          400: "#6aa394",
          500: "#498777",
          600: "#366c5e",
          700: "#2a554b",
          800: "#173F35",
          900: "#14352d",
          950: "#0b1f1a",
        },
        ivory: {
          DEFAULT: "#F7F5EF",
          50: "#fdfcf9",
          100: "#fbf9f4",
          200: "#F7F5EF",
          300: "#ede8db",
          400: "#ddd4c0",
          500: "#c7bba2",
        },
        terracotta: {
          DEFAULT: "#C58B63",
          50: "#faf4f0",
          100: "#f4e7dc",
          200: "#e9cfbc",
          300: "#dbb297",
          400: "#C58B63",
          500: "#b5764d",
          600: "#9d5d3b",
          700: "#804830",
        },
        sage: {
          DEFAULT: "#D9E2D8",
          50: "#f6f8f6",
          100: "#ecefec",
          200: "#D9E2D8",
          300: "#b9c9b7",
          400: "#97ad95",
          500: "#758e73",
        },
        charcoal: {
          DEFAULT: "#252A27",
          50: "#f6f7f6",
          100: "#e2e4e3",
          200: "#c4c8c5",
          300: "#9fa6a1",
          400: "#6a736d",
          500: "#4d5550",
          600: "#3b413d",
          700: "#2d322f",
          800: "#252A27",
          900: "#1a1e1c",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
