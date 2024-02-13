/** @type {import('tailwindcss').Config} */
export default {
  content: [],
  theme: {
    extend: {
      colors: {
        'black': '#0a253c',
        'blacker': '#082035',
        'blue': '#0572ec',
        'blue-hover': '#0458b9',
        'red': '#e64a4a',
        'midnight-blue': '#0a2d4d',
        'white': '#f5f5f5',
      },
      fontFamily: {
        'averta': ['Averta OP', 'sans-serif'],
        'averta-bold': ['Averta OP Bold', 'sans-serif'],
        'courier': ['Courier Prime Bits', 'monospace']
      }
    },
  },
  variants: {
    extend: {
      opacity: ['disabled'],
      cursor: ['disabled'],
      backgroundColor: ['disabled'],
    },
  },
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  plugins: [],
}
