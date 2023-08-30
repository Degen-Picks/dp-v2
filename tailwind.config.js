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
        light: "#ECEAEC",
        dark: "#181925",
        primary: "black",
        secondary: "#A89FA8",
        disabled: "#BDBDBD",
        versusBg: "#F5F4F5",
        border: "#E0E0E0",
        containerHead: "white",
        container: "black",
        link: "#651FFF",
        linkHover: "#5018cc",
        correct: "#43A047",
        incorrect: "#E53935",
        pending: "#FCF6C6",
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
