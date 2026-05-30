/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      screens: {
        'xs': '475px',      // Extra small devices (large phones)
        'sm': '640px',      // Small devices (tablets)
        'md': '768px',      // Medium devices (tablets landscape)
        'lg': '1024px',     // Large devices (desktops)
        'xl': '1280px',     // Extra large devices (large desktops)
        '2xl': '1536px',    // 2X large devices (larger desktops)
        'mobile': {'max': '640px'},        // Mobile only
        'tablet': {'min': '641px', 'max': '1024px'}, // Tablet only
        'desktop': {'min': '1025px'},      // Desktop and above
      },
    },
  },
  plugins: [],
}
