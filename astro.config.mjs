import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from 'tailwindcss';
import autoprefixer from 'autoprefixer';
import agentReadable from './integrations/agent-readable.mjs';

export default defineConfig({
  site: 'https://agenticairelations.com',
  integrations: [
    mdx(),
    sitemap(),
    agentReadable(),
  ],
  output: 'static',
  vite: {
    css: {
      postcss: {
        plugins: [tailwind(), autoprefixer()],
      },
    },
  },
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      langs: ['typescript', 'javascript', 'python', 'bash', 'json'],
    },
  },
});
