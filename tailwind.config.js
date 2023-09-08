/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    {
      pattern: /(text)-(body|header|subheader)-(sm|md|lg|xl|2xl)/,
      variants: ["sm", "md", "lg", "xl", "2xl"],
    },
    {
      pattern: /(font)-(.*)/,
      variants: ["sm", "md", "lg", "xl", "2xl"],
    },
    {
      pattern: /(text)-(.*)/,
      variants: ["sm", "md", "lg", "xl", "2xl"],
    },
  ],
  theme: {
    extend: {
      fontSize: {
        "body-sm": "0.875rem",
        "body-md": "1rem",
        "body-lg": "1.125rem",
        "body-xl": "1.25rem",
        "body-2xl": "1.5rem",
      },
      colors: {
        dark: "#1B1B1B",
        disabled: "#BDBDBD",
        border: "#E0E0E0",

        greyscale1: "#FFFFFF",
        greyscale2: "#F5F4F5",
        greyscale3: "#ECEAEC",
        greyscale4: "#A89FA8",
        greyscale5: "#000000",
        purple1: "#651FFF",
        purple2: "#4C17BF",
        correct: "#43A047",
        incorrect: "#E1233D",
        pending: "#FCF6C6",
        data: "#FECE00",
      },
      screens: {
        xs: "281px",
        "3xl": "1800px",
        "4xl": "2100px",
      },
      transitionProperty: {
        height: "height",
      },
      animation: {
        "slide-down": "slide-down .4s ease-out forwards",
        "slide-up": "slide-up .4s ease-out forwards",
      },
      keyframes: {
        "slide-down": {
          "0%": { height: "0px" },
          "100%": { height: "45px" },
        },
        "slide-up": {
          "0%": { height: "45px" },
          "100%": { height: "0px" },
        },
      },
    },
    fontFamily: {
      base: ["pixel", "-apple-system", "system-ui", "monospace"],
      "base-b": ["pixel-bold", "-apple-system", "system-ui", "monospace"],
    },
  },
  plugins: [],
};
