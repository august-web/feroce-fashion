/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#141210',
        bone: '#F5F1E9',
        ivory: '#FAFAFA',
        paper: '#FFFFFF',
        oxblood: '#551B24',
        gold: '#C9A24B',
        sable: '#A78D70',
        moss: '#26372D',
        blush: '#F9E9E9',
        lilac: '#EFEAFA',
        mint: '#E4F6F0',
      },
      fontFamily: {
        display: ['Poppins', 'Instrument Sans', 'system-ui', 'sans-serif'],
        sans: ['Instrument Sans', 'Poppins', 'system-ui', 'Arial', 'sans-serif'],
      },
      letterSpacing: {
        luxury: '0.18em',
      },
      animation: {
        'fade-up': 'fadeUp .8s ease-out both',
        'reveal': 'reveal 1.1s cubic-bezier(.16,1,.3,1) both',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(18px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        reveal: { '0%': { opacity: '0', transform: 'scale(1.03)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        bounceSoft: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(5px)' } },
      },
    },
  },
  plugins: [],
}
