# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

> This is an **Astro static site**, not a .NET solution. The global .NET guidance in `~/.claude/CLAUDE.md` does not apply here.

## Commands

```bash
npm install
npm run dev        # dev server at http://localhost:4321
npm run build      # static output to ./dist
npm run preview    # serve the production build locally
```

`npm test` runs the measurement harness tests (`harness/test/`, Node's built-in runner). No linter or formatter is configured, and the site itself has no tests. `tsconfig.json` extends `astro/tsconfigs/strict`; type errors surface at build time (`astro build`) and in the editor.

## Deployment

Push to `main` triggers `.github/workflows/deploy.yml`, which runs `npm ci && npm run build` and publishes `dist/` to GitHub Pages (Node 20). Custom domain `agenticairelations.com` is set by `public/CNAME`; `public/.nojekyll` stops GitHub Pages from processing the output as Jekyll. No manual deploy step.

## Architecture

Astro 4, `output: 'static'`, integrations: Tailwind, MDX, sitemap (`astro.config.mjs`). `site` is set there and drives sitemap + RSS absolute URLs.

**Theming is the load-bearing system.** All color lives as space-separated RGB triplets in CSS custom properties in `src/styles/global.css` (`:root` for light, `[data-theme="dark"]` block for dark). `tailwind.config.mjs` maps semantic color names (`primary`, `amber`, etc.) to `rgb(var(--color-x) / <alpha-value>)`, so dark mode flips the whole palette by toggling one `data-theme` attribute — never hardcode hex/rgb in components; add a token and reference the Tailwind semantic name. `ThemeToggle.astro` sets that attribute. `darkMode: ['class', '[data-theme="dark"]']`.

**Essays are an Astro content collection.** `src/content/config.ts` defines the `essays` collection with a Zod schema (title, description, publishDate, optional `series`/`seriesOrder`, `tags`, `draft`, `ogImage`). Essay files are MDX in `src/content/essays/`. `src/pages/essays/[...slug].astro` generates one page per non-draft essay via `getStaticPaths`, rendering through `EssayLayout`. `series` must be one of the enum values in the schema — adding a new series means editing the enum. Set `draft: true` to keep an essay out of the build. `rss.xml.ts` builds the feed from the collection.

**Layouts** (`src/layouts/`): `BaseLayout` (html shell, head, theme boot) → `PageLayout` (standard pages) and `EssayLayout` (essay chrome + metadata from frontmatter). Pages under `src/pages/` are one `.astro` file per route.

**Components** are organized by role under `src/components/`: `content/` (Callout, DefinitionBox, CompareTable, PullQuote, RoleCard — usable inside MDX essays), `diagrams/` (inline-SVG framework diagrams; SVGs should use theme tokens so they track light/dark), `sections/`, `nav/`, `ui/`.

**Agent-readable output.** `integrations/agent-readable.mjs` (registered in `astro.config.mjs`) post-processes `dist/` on `astro:build:done`: it writes a markdown copy of each page's `<main>` to `<route>/index.md` and `<route>.md` (404 excluded) and generates `llms.txt` from each page's `<title>` and meta description. `BaseLayout` emits the matching `<link rel="alternate" type="text/markdown">`. Inline SVG diagrams become a text line from their `<title>`/`<desc>`; an SVG without a `<title>` is treated as decorative and dropped.

## Content source

The current framework is `docs/agentic-devrel-v2-vision.md`; site copy follows it. The measurement specification is `docs/measurement-specification.md` (CC BY 4.0), with a reference harness in `harness/` (`npm test`). Version 1 documents are in `docs/archive/` and must not be used as a source for copy. Site source is MIT; essay/framework content is © Chris Woodruff, all rights reserved.
