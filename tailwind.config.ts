import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#10100e",
        night: "#090806",
        pearl: "#f7efe2",
        champagne: "#dcc28b",
        gold: "#c89b46",
        emerald: "#062f27",
        rose: "#8f2634"
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"]
      },
      boxShadow: {
        glow: "0 30px 90px rgba(200, 155, 70, .22)",
        glass: "0 24px 80px rgba(0, 0, 0, .28)"
      }
    }
  },
  plugins: []
};

export default config;
