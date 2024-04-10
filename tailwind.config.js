/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    screens: {
      xs: '320px',
      sm: '380px',
      md: '768px',
      lg: '1025px',
      xl: '1280px',
      '2xl': '1536px'
    },
    extend: {
      boxShadow: {
        isLight: 'inset 9.91px 9.91px 15px #0891b2, inset -9.91px -9.91px 15px #0e7490;',
        isDark: 'inset 9.91px 9.91px 15px #111111, inset -9.91px -9.91px 15px #151515;'
      },
      fontFamily: {
        outfit: 'Outfit, sans-serif',
        league: 'League Spartan, sans-serif',
        reem: 'Reem Kufi, sans-serif',
        geologica: 'Geologica, sans-serif',
        ysabeau: 'Ysabeau S, sans-serif'
      }
    }
  },
  plugins: []
}
