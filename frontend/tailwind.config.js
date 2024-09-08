/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      spacing:{
        '40':'30%',
        '200':'5%',
        '35': '25rem'
      },
      screens:{
        'sd': '1200px'
      }
    },
  },
  plugins: [],
}

