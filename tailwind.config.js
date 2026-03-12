/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // tbrelo brand colors — clean, coastal, trustworthy
        brand: {
          navy: '#1B2A4A',
          blue: '#2563EB',
          sky: '#38BDF8',
          sand: '#F5F0EB',
          white: '#FFFFFF',
          slate: '#64748B',
          dark: '#0F172A',
        }
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
