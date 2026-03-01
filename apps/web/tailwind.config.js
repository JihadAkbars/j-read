/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: '#B8FF3D',
        background: '#F6F7F6',
        foreground: '#11130E',
      },
    },
  },
  plugins: [],
}
