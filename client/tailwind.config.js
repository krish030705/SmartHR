/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Core brand — deep teal for structure/trust, amber for action.
        ink: '#1C1F22',
        paper: '#F6F4EF',
        slate: {
          soft: '#8A8F98',
        },
        brand: {
          50: '#EAF2EF',
          100: '#CFE1DA',
          300: '#7FAB9C',
          500: '#2F6E5D',
          700: '#1B4B43',
          900: '#0F2E29',
        },
        amber: {
          400: '#F0B95B',
          500: '#E8A33D',
          600: '#C9832A',
        },
        // Role identity accents — one per SmartHR role, used consistently
        // across login, badges, and nav so a user always knows "where" they are.
        role: {
          admin: '#1B4B43',   // brand teal
          manager: '#5B4B8A', // muted violet
          employee: '#B2562F', // warm clay
        },
        success: '#3C8A5D',
        danger: '#C4463A',
      },
      fontFamily: {
        display: ['"Fraunces"', 'serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(15, 46, 41, 0.06), 0 8px 24px rgba(15, 46, 41, 0.08)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
}
