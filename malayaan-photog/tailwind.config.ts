import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Surfaces — formerly dark "ink", now warm whites for a photo-studio look.
        ink: {
          950: "#ffffff",
          900: "#faf7f1",
          850: "#f3efe5",
          800: "#ebe6d8",
          700: "#d9d3c2",
        },
        // Text — formerly light "ivory", now charcoal so opacity-based text classes still work.
        ivory: {
          50: "#0d0c10",
          100: "#1c1a22",
          200: "#3a3640",
        },
        gold: {
          300: "#d6b977",
          400: "#c2a14b",
          500: "#a4863a",
          600: "#7d672e",
          700: "#5a4b22",
        },
        // Soft azure — used for underlines, dividers, and focus strokes on the white theme.
        azure: {
          50: "#f0f7fc",
          100: "#dbeaf5",
          200: "#bcd6ec",
          300: "#92bcdd",
          400: "#5e9bc8",
          500: "#3b7faf",
          600: "#2c648c",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-up": "fade-up 0.8s ease-out forwards",
        "fade-in": "fade-in 1.2s ease-out forwards",
        shimmer: "shimmer 8s linear infinite",
        "scroll-x": "scroll-x 40s linear infinite",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "scroll-x": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
