/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      sans: ['Inter', 'Be Vietnam Pro', 'Arial', 'sans-serif'],
    },
    extend: {
      colors: {
        primary: '#2563eb',
        accent: '#f59e42',
        bg: '#f9fafb',
        'bg-alt': '#f3f4f6',
        success: '#22c55e',
        warn: '#facc15',
        error: '#ef4444',
      },
      borderRadius: {
        DEFAULT: '16px',
        lg: '20px',
      },
      boxShadow: {
        soft: '0 2px 8px 0 rgba(0,0,0,0.04)',
      },
      spacing: {
        0: '0px',
        1: '4px',
        2: '8px',
        3: '12px',
        4: '16px',
        5: '20px',
        6: '24px',
        8: '32px',
        10: '40px',
        12: '48px',
        16: '64px',
      },
      fontSize: {
        h1: ['40px', '48px'],
        h2: ['32px', '40px'],
        h3: ['24px', '32px'],
        body: ['16px', '24px'],
        badge: ['14px', '20px'],
      },
    },
  },
  plugins: [],
};
