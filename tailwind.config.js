/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cosmic: {
          black: '#0a0f1a',
          'deep-blue': '#151d2e',
          misty: '#2a3a4d',
          steel: '#4a5a6a',
          'steel-light': '#6b7c8a',
        },
        archive: {
          cream: '#f5f2e8',
          'cream-dark': '#e8e4d9',
          yellow: '#fef3c7',
          'yellow-dark': '#fcd34d',
          olive: '#a3b18a',
          tan: '#d4b483',
          manila: '#f0e6d3',
          'blue-folder': '#5b7fa3',
        },
        paper: {
          white: '#fafaf9',
          'warm-white': '#f5f5f0',
          note: '#fffbeb',
        }
      },
      fontFamily: {
        typewriter: ['"Special Elite"', 'Courier New', 'monospace'],
        display: ['"Cooper Black"', 'Georgia', 'serif'],
        handwritten: ['"Caveat"', 'cursive'],
      },
      boxShadow: {
        'folder': '0 10px 30px -5px rgba(0, 0, 0, 0.4), 0 2px 10px rgba(0, 0, 0, 0.2)',
        'card': '0 4px 15px -3px rgba(0, 0, 0, 0.3)',
        'lifted': '0 15px 35px -5px rgba(0, 0, 0, 0.5)',
      },
      backgroundImage: {
        'cosmic-gradient': 'linear-gradient(180deg, #0a0f1a 0%, #151d2e 40%, #2a3a4d 100%)',
        'space-orbit': 'linear-gradient(180deg, #0a0f1a 0%, #1a2740 50%, #2a3a4d 100%)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: 0.4, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.2)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 5px rgba(74, 144, 217, 0.5)' },
          '50%': { boxShadow: '0 0 20px rgba(74, 144, 217, 0.8)' },
        },
      },
    },
  },
  plugins: [],
}
