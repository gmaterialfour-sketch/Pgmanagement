import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#161616",
        campus: "#0f766e",
        saffron: "#d97706"
      }
    }
  },
  plugins: []
};

export default config;
