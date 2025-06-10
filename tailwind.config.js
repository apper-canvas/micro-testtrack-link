/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0066CC",
        secondary: "#4A5568", 
        accent: "#7C3AED",
        surface: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
700: '#334155',
          800: '#1e293b',
          900: '#0f172a'
        },
        tree: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          hover: '#f1f5f9',
          selected: '#dbeafe',
          dragOver: '#fef3c7'
        }
      },
      fontFamily: { 
        sans: ['Inter', 'ui-sans-serif', 'system-ui'], 
        heading: ['Inter', 'ui-sans-serif', 'system-ui'] 
      }
    },
  },
  plugins: [],
}