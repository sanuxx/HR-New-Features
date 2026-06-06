/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"', '"SF Pro Text"', 'system-ui', 'sans-serif'],
      },
      colors: {
        apple: {
          blue:   '#0071e3',
          'blue-hover': '#0077ed',
          'blue-light': '#147ce5',
          green:  '#1d8348',
          red:    '#d93025',
          yellow: '#d97706',
          'yellow-light': '#f59e0b',
          orange: '#ea580c',
          purple: '#7c3aed',
          pink:   '#db2777',
          teal:   '#0891b2',
        },
        bg: {
          primary:   '#f2f2f7',
          secondary: '#ffffff',
          tertiary:  '#e8e8ed',
          elevated:  '#f5f5f7',
          card:      '#ffffff',
          hover:     '#e5e5ea',
        },
        label: {
          primary:   '#1d1d1f',
          secondary: '#6e6e73',
          tertiary:  '#86868b',
          quaternary:'#acacb2',
        },
        separator: 'rgba(0,0,0,0.08)',
        'separator-opaque': '#d2d2d7',
      },
      borderRadius: {
        'apple': '12px',
        'apple-lg': '18px',
        'apple-xl': '24px',
      },
      boxShadow: {
        'apple-sm': '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.05)',
        'apple':    '0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
        'apple-lg': '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
        'apple-glow-blue': '0 0 20px rgba(0,113,227,0.15)',
      },
      backdropBlur: {
        'apple': '20px',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
