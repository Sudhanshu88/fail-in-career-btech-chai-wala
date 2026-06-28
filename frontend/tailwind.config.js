/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'chai-dark': '#3e2723',
        'chai-cream': '#fff3e0',
        'chai-orange': '#e65100',
        'chai-light': '#ffffff',
      }
    },
  },
  plugins: [],
}
