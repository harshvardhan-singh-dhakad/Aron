/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // User Theme
        u: {
          bg: '#f3f4f6',
          card: '#ffffff',
          navy: '#111827',
          accent: '#2563eb',
          'accent-soft': '#eff6ff',
          text: '#374151',
          sub: '#6b7280',
          border: '#e5e7eb',
          green: '#10b981',
          red: '#ef4444',
          orange: '#f59e0b',
        },
        // Partner Theme
        p: {
          bg: '#fffdf5',
          card: '#ffffff',
          card2: '#fffbef',
          amber: '#d97706',
          'amber-soft': '#fff7ed',
          text: '#271c19',
          sub: '#78716c',
          border: '#fde68a',
          green: '#059669',
          red: '#dc2626',
          blue: '#2563eb',
        },
      },
    },
  },
  plugins: [],
}

