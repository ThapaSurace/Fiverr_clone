/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        "hero-pattern": "url('/src/assests/bg8.jpg')",
        "login": "url('/src/assests/bg9.png')",
        "login-pattern": "url('/src/assests/pattern2.png')",
        "home": "url('/src/assests/home.jpg')"
      },
      colors: {
        primary: "#41B3A3",
        teal: "#18767B",
        darkteal: "#004c4c",
        blackteal:"#004040",
        lightblue: "#659DBD",
        maroon: "#F64C72",
        white: "#ffffff",
        black: "#000000",
        lightblack: "#434343",
        gray: " #5A5A5A",
        lightteal: "#f1fdf7",
        lightgray: "#999999",
        smoke: "#858585",
        extralightgreen: "#7aeb7a",
        lightgreen: "#4ee44e",
        dimGrey: "#3b444b",
        
      },
      boxShadow: {
        custom:
          "rgba(60, 64, 67, 0.3) 0px 1px 2px 0px, rgba(60, 64, 67, 0.15) 0px 1px 3px 1px",
      },
    },
   
    screens: {
      sm: "576px",
      md: "768px",
      lg: "992px",
      xl: "1024px",
      "2xl": "1280px",
    },
    
  },
  plugins: [
    require("tailwind-scrollbar-hide"),
    require("tailwind-scrollbar"),
    require("@tailwindcss/forms"),
  ],
};
