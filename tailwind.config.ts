import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          950: '#020617',
          900: '#071014',
          800: '#0c1720',
          700: '#112430',
          600: '#164047'
        },
        accent: {
          500: '#10b981',
          400: '#34d399',
          600: '#059669'
        }
      }
    }
  },
  plugins: []
};

export default config;
