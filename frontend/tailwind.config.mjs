/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#e6f2f0",
          100: "#c2d9d4",
          200: "#9cbfb8",
          300: "#76a59c",
          400: "#508c81",
          500: "#2a7266",
          600: "#15594f",
          700: "#0f4f46",
          800: "#084b41",
          900: "#05322c"
        },
        accent: {
          50:  "#fbf5e7",
          100: "#f5e8c7",
          200: "#efdba9",
          300: "#e9ce8b",
          400: "#e3c26f",
          500: "#dcc594"
        },
        ink: {
          900: "#111827",
          700: "#374151",
          500: "#6b7280"
        },
        base: "#ffffff",
        "base-50": "#fafaf9"
      },
      borderRadius: {
        xl: "1rem"
      }
    }
  },
  plugins: [],
};
