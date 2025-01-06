module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'],  // Default sans-serif to Roboto
      },
    },
  },
  darkMode: 'class',  // Enable dark mode with the 'class' strategy
  plugins: [],
};
