import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0A0B0D", // app background
          800: "#111317",
          700: "#181B20",
          600: "#22262D",
          500: "#2D323B",
        },
        lime: {
          DEFAULT: "#C7F551", // primary accent (energy / performance)
          dark: "#A8DB2E",
          glow: "#D9FF6B",
        },
        ember: {
          DEFAULT: "#FF6B35", // nutrition / warmth accent
          soft: "#FF8A5E",
        },
        chalk: {
          DEFAULT: "#F4F5F0",
          muted: "#9CA3AF",
          faint: "#6B7280",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(199,245,81,0.15), 0 8px 40px -8px rgba(199,245,81,0.25)",
        card: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 30px -12px rgba(0,0,0,0.6)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "ring-fill": {
          "0%": { strokeDashoffset: "var(--ring-circ)" },
        },
        "pulse-dot": {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.22,1,0.36,1) both",
        "pulse-dot": "pulse-dot 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
