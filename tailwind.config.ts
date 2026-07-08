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
        // Legacy
        ivory: {
          50: "#FDFCF8",
          100: "#FAF8F0",
          200: "#F5F0E0",
          300: "#EDE5C8",
        },
        champagne: {
          300: "#F5E6C0",
          400: "#EDD48A",
          500: "#D4AF37",
          600: "#B8960C",
          700: "#8B6914",
        },
        obsidian: {
          900: "#0A0A0F",
          800: "#12121A",
          700: "#1A1A28",
          600: "#222235",
        },
        // New luxury tokens
        bg: {
          deep:    "#050816",
          surface: "#0B1220",
          card:    "#111827",
        },
        brand: {
          blue:   "#3B82F6",
          cyan:   "#22D3EE",
          purple: "#7C3AED",
        },
        ui: {
          success: "#10B981",
          warning: "#F59E0B",
          text:    "#F8FAFC",
          muted:   "#94A3B8",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "Inter", "sans-serif"],
        body:    ["Inter", "-apple-system", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      animation: {
        "aurora":        "aurora 8s ease-in-out infinite alternate",
        "float":         "float 6s ease-in-out infinite",
        "float-slow":    "float-slow 8s ease-in-out infinite",
        "float-card-1":  "float-card-1 6s ease-in-out infinite",
        "float-card-2":  "float-card-2 7s ease-in-out infinite",
        "float-card-3":  "float-card-3 5.5s ease-in-out infinite",
        "shimmer":       "shimmer 2s linear infinite",
        "pulse-glow":    "pulse-glow-blue 3s ease-in-out infinite",
        "spin-slow":     "spin-slow 20s linear infinite",
        "pulse-ring":    "pulse-ring 2s ease-out infinite",
        "wave-bar":      "wave-bar 0.8s ease-in-out infinite",
        "blink-cursor":  "blink-cursor 0.8s step-end infinite",
        "slide-in-right":"slide-in-right 0.5s ease-out forwards",
        "aurora-shift":  "aurora-shift 10s ease-in-out infinite",
      },
      keyframes: {
        aurora: {
          "0%":   { backgroundPosition: "0% 50%" },
          "50%":  { backgroundPosition: "100% 50%" },
          "100%": { backgroundPosition: "0% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-12px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%":      { transform: "translateY(-18px) rotate(2deg)" },
        },
        "float-card-1": {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)" },
          "33%":      { transform: "translateY(-8px) translateX(3px)" },
          "66%":      { transform: "translateY(4px) translateX(-2px)" },
        },
        "float-card-2": {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)" },
          "33%":      { transform: "translateY(6px) translateX(-4px)" },
          "66%":      { transform: "translateY(-10px) translateX(2px)" },
        },
        "float-card-3": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-14px)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-glow-blue": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(59,130,246,0.3)" },
          "50%":      { boxShadow: "0 0 40px rgba(59,130,246,0.6), 0 0 80px rgba(59,130,246,0.2)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
        "pulse-ring": {
          "0%":   { transform: "scale(0.8)", opacity: "1" },
          "100%": { transform: "scale(2.5)", opacity: "0" },
        },
        "wave-bar": {
          "0%, 100%": { transform: "scaleY(0.3)" },
          "50%":      { transform: "scaleY(1)" },
        },
        "blink-cursor": {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0" },
        },
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(30px)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
        "aurora-shift": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1) translate(0, 0)" },
          "25%":      { opacity: "0.6", transform: "scale(1.05) translate(2%, 1%)" },
          "50%":      { opacity: "0.5", transform: "scale(0.98) translate(-1%, 2%)" },
          "75%":      { opacity: "0.7", transform: "scale(1.03) translate(1%, -1%)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [],
};

export default config;
