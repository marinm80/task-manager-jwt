/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#17211D',
        muted: '#66736D',
        paper: '#FBFCF8',
        surface: '#FFFFFF',
        line: '#DDE4DC',
        green: { DEFAULT: '#175F48', hover: '#267B5D' },
        mint: '#DFF2E7',
        purple: '#6E62D9',
        coral: { DEFAULT: '#E56C5B', dark: '#A6392B' },
        amber: { DEFAULT: '#E6A84D', dark: '#8A5A17' },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'], // Geist no viene por CDN sin licencia local; Inter es el fallback explícito del handoff
      },
      fontSize: {
        hero: ['54px', { lineHeight: '1.05', fontWeight: '700' }],
        'hero-mobile': ['46px', { lineHeight: '1.08', fontWeight: '700' }],
        section: ['38px', { lineHeight: '1.1', fontWeight: '700' }],
        'section-mobile': ['36px', { lineHeight: '1.15', fontWeight: '700' }],
        'card-title': ['18px', { lineHeight: '1.3', fontWeight: '650' }],
        eyebrow: ['10px', { letterSpacing: '0.2em', fontWeight: '800' }],
      },
      borderRadius: {
        btn: '10px',
        card: '14px',
        modal: '22px',
      },
      maxWidth: {
        content: '1180px',
        dashboard: '1420px',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(15px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        toastInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 220ms ease-out',
        'toast-in-up': 'toastInUp 200ms ease-out',
      },
    },
  },
  plugins: [],
};
