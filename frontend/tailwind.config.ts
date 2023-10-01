/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        basic: {
          primary: "#fcb985",
          secondary: "#db8e4a",
          accent: "#efed70",
          neutral: "#1e2734",
          info: "#1bcff3",
          success: "#31c498",
          warning: "#f3bc30",
          error: "#f71857",
        },
      },
    ],
  },
};
