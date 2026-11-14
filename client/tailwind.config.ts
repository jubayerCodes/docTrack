import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#6559cc",
          hover: "#5548ba",
          soft: "#f0eefb",
        },
        sidebar: {
          DEFAULT: "#202138",
          active: "#32334e",
          hover: "#292a44",
        },
        ink: "#202337",
        textSecondary: "#626574",
        textMuted: "#777b8d",
        textSubtle: "#999ba8",
        surface: {
          DEFAULT: "#ffffff",
          subtle: "#fafafd",
        },
        border: "#e8e9f0",
        appBackground: "#f6f7fb",
        semantic: {
          success: "#288874",
          successDot: "#36a890",
          successBg: "#eaf7f3",
          warning: "#c77948",
          warningDot: "#df915e",
          warningBg: "#fff3e8",
          danger: "#c76060",
          dangerDot: "#dc6e6e",
          dangerBg: "#fff0f0",
          info: "#3b7eb8",
          infoBg: "#e8f1fa",
        },
      },
      fontFamily: {
        heading: ["var(--font-manrope)", "sans-serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
      },
      borderRadius: {
        control: "9px",
        button: "10px",
        card: "15px",
        modal: "18px",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)",
        primary: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
        modal: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
        dropdown: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
