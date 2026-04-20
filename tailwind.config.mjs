import typography from '@tailwindcss/typography';

export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F6E56',
          light: '#1D9E75',
          surface: '#E1F5EE',
        },
        purple: {
          DEFAULT: '#3C3489',
          surface: '#EEEDFE',
        },
        amber: {
          DEFAULT: '#854F0B',
          surface: '#FAEEDA',
        },
        heading: '#1A1A18',
        body: '#2C2C2A',
        muted: '#5F5E5A',
        border: '#D3D1C7',
        bg: '#FAFAF8',
        surface: '#FFFFFF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.body'),
            '--tw-prose-headings': theme('colors.heading'),
            '--tw-prose-links': theme('colors.primary.DEFAULT'),
            '--tw-prose-bold': theme('colors.heading'),
            '--tw-prose-quotes': theme('colors.heading'),
            '--tw-prose-quote-borders': theme('colors.primary.DEFAULT'),
            '--tw-prose-code': theme('colors.heading'),
            '--tw-prose-hr': theme('colors.border'),
            maxWidth: '70ch',
            a: {
              textDecoration: 'underline',
              textDecorationColor: theme('colors.primary.DEFAULT'),
              textUnderlineOffset: '3px',
              fontWeight: '500',
            },
          },
        },
      }),
    },
  },
  plugins: [typography],
};
