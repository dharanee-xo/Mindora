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
        obsidian: {
          DEFAULT: "#07090e",
          50: "#131826",
          100: "#0f131f",
          200: "#0b0f19",
          card: "#0d111a",
          border: "#1a2233",
        },
        teal: {
          neon: "#00F5D4",
          soft: "#48CAE4",
          glow: "rgba(0, 245, 212, 0.4)",
        },
        purple: {
          neon: "#8A2BE2",
          orchid: "#9D4EDD",
          lilac: "#C77DFF",
          glow: "rgba(138, 43, 226, 0.4)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
      boxShadow: {
        "glow-teal": "0 0 25px -3px rgba(0, 245, 212, 0.25)",
        "glow-purple": "0 0 25px -3px rgba(138, 43, 226, 0.25)",
        "glow-dual": "0 0 35px -5px rgba(0, 245, 212, 0.15), 0 0 35px -5px rgba(138, 43, 226, 0.15)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "pulse-subtle": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 3s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        glow: {
          "0%": { opacity: "0.4" },
          "100%": { opacity: "0.8" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
