/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
				sans: ['"Share Tech Mono"', ...defaultTheme.fontFamily.sans],
        heading: ['"Press Start 2P"', 'sans-serif'],
			  },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            a: {
              'text-decoration': 'none',
              'background-repeat': 'no-repeat',
              'background-size': '100% 1.5px',
              'background-position': '0 100%',
              'background-image':
                'linear-gradient(to right, rgb(var(--color-text-link)/1), rgb(var(--color-text-link)/1))',
              '&:hover': {
                color: 'rgb(var(--color-text-link))',
              },
            },
            'h1, h2, h3, h4, h5': {
              color: 'rgb(var(--color-text-heading))',
            },
            iframe: {
              'border-radius': '0.5rem',
            },
            code: {
              'background-color': 'rgba(128, 128, 128, 0.2)',
              'border':'rgba(128, 128, 128, 0.8) 1px solid',
              color: 'rgb(var(--color-code-text))',
              padding: '0.25rem 0.5rem',
              'border-radius': '0.25rem',
              'font-size': '0.875rem',
              'line-height': '1.5',
              'font-family': "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
            },
            'ol > li::before': {
              color: 'rgb(var(--color-text-bold))',
            },
            li: {
              'margin-bottom': '0.5rem',
              color: 'rgb(var(--color-code-text))',
              'font-size': '1rem',
              'line-height': '1.5',
              'font-family': "Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace",
            },
            'code::before': {
              content: 'none',
            },
            'code::after': {
              content: 'none',
            },
            blockquote: {
              "font-style": "normal",
              border:'rgba(128, 128, 128, 0.8) 2px solid',
              'border-radius': '0.4rem',
              position: 'relative',
              width: '96%',
              margin: '0 auto',
              'font-size': '1rem',
              'padding-top': '0.1rem',
              'padding-bottom': '0.1rem',
              'padding-left': '1rem',
              'padding-right': '1rem',
            },
            'blockquote::before': {
              'font-family': 'Arial',
              content: "",
              'font-size': '4em',
              color: 'rgb(var(--color-text-bold))',
              position: 'absolute',
              left: '-10px',
              top: '-10px',
            },
            'blockquote::after': {
              content: '',
            },
            'blockquote p:first-of-type::before': {
              content: '',
            },
            'blockquote p:last-of-type::after': {
              content: '',
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/typography'), require('@tailwindcss/aspect-ratio')],
};
