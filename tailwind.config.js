/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 旅行アプリのブランドカラー（維持）
        'coral': {
          50: '#FFF5F5',
          100: '#FED7D7',
          200: '#FEB2B2',
          300: '#FC8181',
          400: '#F56565',
          500: '#FF6B6B', // Primary
          600: '#E53E3E',
          700: '#C53030',
          800: '#9B2C2C',
          900: '#742A2A',
        },
        'teal': {
          50: '#E6FFFA',
          300: '#4FD1C5',
          500: '#4ECDC4', // Secondary
          700: '#2C7A7B',
        },
        
        // Apple風のシステムカラー
        'system': {
          'background': '#FFFFFF',
          'secondary-background': '#F2F2F7',
          'tertiary-background': '#FFFFFF',
          'grouped-background': '#F2F2F7',
          'separator': 'rgba(60, 60, 67, 0.12)',
          'label': '#000000',
          'secondary-label': 'rgba(60, 60, 67, 0.6)',
          'tertiary-label': 'rgba(60, 60, 67, 0.3)',
          'quaternary-label': 'rgba(60, 60, 67, 0.18)',
        },
      },
      fontFamily: {
        'system': [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'Noto Sans JP',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
        ],
        'display': ['SF Pro Display', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        'text': ['SF Pro Text', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      borderRadius: {
        'ios-sm': '10px',
        'ios-md': '14px',
        'ios-lg': '18px',
        'ios-xl': '22px',
      },
      boxShadow: {
        'elevation-1': '0 1px 2px rgba(0, 0, 0, 0.04)',
        'elevation-2': '0 2px 8px rgba(0, 0, 0, 0.04)',
        'elevation-3': '0 5px 10px rgba(0, 0, 0, 0.08)',
        'elevation-4': '0 8px 30px rgba(0, 0, 0, 0.08)',
        'elevation-5': '0 16px 40px rgba(0, 0, 0, 0.12)',
        'coral-glow': '0 4px 20px rgba(255, 107, 107, 0.25)',
        'teal-glow': '0 4px 20px rgba(78, 205, 196, 0.25)',
      },
      transitionTimingFunction: {
        'ios-default': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'ios-in-out': 'cubic-bezier(0.42, 0, 0.58, 1)',
        'ios-out': 'cubic-bezier(0.19, 0.91, 0.38, 1)',
      },
      spacing: {
        '0': '0px',
        '1': '4px',
        '2': '8px',
        '3': '12px',
        '4': '16px',
        '5': '20px',
        '6': '24px',
        '7': '28px',
        '8': '32px',
        '10': '40px',
        '12': '48px',
        '16': '64px',
        '20': '80px',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
}