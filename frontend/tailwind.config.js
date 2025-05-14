/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,html}' // Include all files in the src directory and subdirectories with specified extensions
  ],
  theme: {
    extend: {
      colors: {
        blush: '#EDAFB8',
        peach: '#F7E1D7',
        beige: '#DEDBD2',
        mint: '#B0C4B1',
        charcoal: '#4A5759',
      },
    },
  },
  plugins: [],
};
