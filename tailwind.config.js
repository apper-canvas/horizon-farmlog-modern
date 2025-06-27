/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9f2',
          100: '#dcf2e1',
          200: '#bce5c7',
          300: '#8dd1a1',
          400: '#57b674',
          500: '#2B7A3B',
          600: '#236632',
          700: '#1e5229',
          800: '#1b4224',
          900: '#17371f'
        },
        secondary: {
          50: '#fefbf0',
          100: '#fef6dc',
          200: '#fde9b8',
          300: '#fbd688',
          400: '#f7bd56',
          500: '#8B6914',
          600: '#7d5f12',
          700: '#6a4f0f',
          800: '#574010',
          900: '#483510'
        },
        accent: {
          50: '#fef3f0',
          100: '#fde4dc',
          200: '#fbcdb9',
          300: '#f7a889',
          400: '#f17c52',
          500: '#E85D04',
          600: '#d04303',
          700: '#ae3203',
          800: '#8d2906',
          900: '#74240a'
        },
        surface: '#F5F3F0',
        background: '#FDFCFA'
      },
      fontFamily: {
        display: ['Outfit', 'sans-serif'],
        body: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}