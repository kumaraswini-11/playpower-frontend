/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        bgColor: {
          1: "hsl(var(--color-background1))",
          2: "hsl(var(--color-background2))",
          3: "hsl(var(--color-background3))",
          4: "hsl(var(--color-background4))",
        },
        textColor: {
          1: "hsl(var(--color-text1))",
          2: "hsl(var(--color-text2))",
          3: "hsl(var(--color-text3))",
        },
        accent: {
          1: "hsl(var(--color-accent1))",
          2: "hsl(var(--color-accent2))",
        },
      },
    },
  },
  plugins: [],
};
