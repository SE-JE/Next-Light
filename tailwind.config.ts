import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#ebf4fc",
        foreground: "#373A40",
        "light-foreground": "#686D76",
        primary: "#5aafff",
        "light-primary": "#baddfd",
        secondary: "#04a9ca",
        "light-secondary": "#9ae9f9",
        danger: "#f3777a",
        "light-danger": "#fececf",
        warning: "#f57e2c",
        "light-warning": "#ffd7bc",
        success: "#69c9ca",
        "light-success": "#9af8f9",
        disable: "#c4c3c3",
        "light-disable": "#f4f4f4",
      },
    },
  },
  plugins: [],
} satisfies Config;
