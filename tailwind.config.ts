import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#172033",
        line: "#d8dee8",
        surface: "#f7f8fb",
        brand: "#2563eb",
        ocean: "#0f766e",
        amber: "#b45309",
        danger: "#b91c1c",
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15, 23, 42, 0.06), 0 8px 24px rgba(15, 23, 42, 0.05)",
      },
    },
  },
  plugins: [],
};

export default config;
