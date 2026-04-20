import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // All colors resolve from CSS custom properties so dark mode flips
        // everything at once by setting [data-theme="dark"] on the root.
        primary: {
          DEFAULT: 'rgb(var(--color-primary) / <alpha-value>)',
          light: 'rgb(var(--color-primary-light) / <alpha-value>)',
          surface: 'rgb(var(--color-primary-surface) / <alpha-value>)',
          ink: 'rgb(var(--color-primary-ink) / <alpha-value>)',
        },
        amber: {
          DEFAULT: 'rgb(var(--color-amber) / <alpha-value>)',
          light: 'rgb(var(--color-amber-light) / <alpha-value>)',
          surface: 'rgb(var(--color-amber-surface) / <alpha-value>)',
          ink: 'rgb(var(--color-amber-ink) / <alpha-value>)',
        },
        purple: {
          DEFAULT: 'rgb(var(--color-purple) / <alpha-value>)',
          light: 'rgb(var(--color-purple-light) / <alpha-value>)',
          surface: 'rgb(var(--color-purple-surface) / <alpha-value>)',
          ink: 'rgb(var(--color-purple-ink) / <alpha-value>)',
        },
        heading: 'rgb(var(--color-heading) / <alpha-value>)',
        body: 'rgb(var(--color-body) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        bg: 'rgb(var(--color-bg) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--color-surface) / <alpha-value>)',
          raised: 'rgb(var(--color-surface-raised) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: 'var(--shadow-card)',
        'card-hover': 'var(--shadow-card-hover)',
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: 'rgb(var(--color-body))',
            '--tw-prose-headings': 'rgb(var(--color-heading))',
            '--tw-prose-links': 'rgb(var(--color-primary))',
            '--tw-prose-bold': 'rgb(var(--color-heading))',
            '--tw-prose-quotes': 'rgb(var(--color-heading))',
            '--tw-prose-quote-borders': 'rgb(var(--color-primary))',
            '--tw-prose-code': 'rgb(var(--color-heading))',
            '--tw-prose-hr': 'rgb(var(--color-border))',
            '--tw-prose-counters': 'rgb(var(--color-muted))',
            '--tw-prose-bullets': 'rgb(var(--color-border))',
            maxWidth: '70ch',
            a: {
              textDecoration: 'underline',
              textDecorationColor: 'rgb(var(--color-primary) / 0.6)',
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
