/**
 * Tokens trasladados desde design-tokens.json.
 * Los nombres siguen la ruta del token original para que cada clase sea trazable.
 */
export default {
  content: ['./index.html', './src/**/*.{js,html}'],
  theme: {
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        background: {
          base: '#E8DFD0',
          muted: '#D6CDBF',
          inverse: '#1F1814',
        },
        text: {
          primary: '#2B221C',
          secondary: '#4A3D34',
          ondark: '#EFE7DA',
        },
        accent: {
          star: '#6B4733',
        },
        border: {
          hairline: 'rgba(43, 34, 28, 0.15)',
          'hairline-dark': 'rgba(239, 231, 218, 0.30)',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Cormorant', '"Times New Roman"', 'serif'],
        label: ['"Hanken Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-xl': ['clamp(3.5rem, 7.3vw, 8.75rem)', { lineHeight: '0.95', letterSpacing: '-0.01em' }],
        'display-l': ['clamp(2.5rem, 4.2vw, 5rem)', { lineHeight: '0.92', letterSpacing: '-0.01em' }],
        lead: ['19px', { lineHeight: '1.32', letterSpacing: '0' }],
        'hero-paragraph': ['20px', { lineHeight: '1.28', letterSpacing: '0' }],
        logo: ['24px', { lineHeight: '1', letterSpacing: '-0.01em' }],
        nav: ['17px', { lineHeight: '1', letterSpacing: '0' }],
        'card-title': ['30px', { lineHeight: '1.05', letterSpacing: '0' }],
        'card-meta': ['15px', { lineHeight: '1.3', letterSpacing: '0' }],
        'card-price': ['19px', { lineHeight: '1.2', letterSpacing: '0' }],
        label: ['11.5px', { lineHeight: '1.4', letterSpacing: '0.08em' }],
        'rating-value': ['56px', { lineHeight: '1', letterSpacing: '0' }],
        'rating-scale': ['15px', { lineHeight: '1', letterSpacing: '0' }],
        'rating-title': ['17px', { lineHeight: '1.2', letterSpacing: '0' }],
        'rating-meta': ['11px', { lineHeight: '1.3', letterSpacing: '0' }],
      },
      spacing: {
        gutter: '32px',
        header: '86px',
        corner: '32px',
      },
      maxWidth: {
        lead: '460px',
        'hero-paragraph': '240px',
      },
      borderRadius: {
        none: '0',
      },
      boxShadow: {
        header: '0 1px 0 rgba(43, 34, 28, 0.15)',
      },
      transitionTimingFunction: {
        'out-expo': 'cubic-bezier(0.22, 1, 0.36, 1)',
        'in-out-quart': 'cubic-bezier(0.76, 0, 0.24, 1)',
      },
      transitionDuration: {
        300: '300ms',
        400: '400ms',
        500: '500ms',
        600: '600ms',
        800: '800ms',
        1000: '1000ms',
        1200: '1200ms',
      },
    },
  },
  plugins: [],
};
