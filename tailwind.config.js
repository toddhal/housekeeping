/** @type {import('tailwindcss').Config} */
// Tailwind v4 reads configuration primarily from CSS via @theme,
// but we keep this file for content scanning compatibility.
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pink: {
          DEFAULT: '#f472b6',
          deep: '#fb7185',
          soft: '#fdf2f8',
        },
        teal: {
          DEFAULT: '#14b8a6',
          light: '#2dd4bf',
          soft: '#f0fdfa',
        },
        violet: {
          DEFAULT: '#a78bfa',
        },
      },
      fontFamily: {
        display: ['"Fredoka One"', 'cursive'],
        body: ['Nunito', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
