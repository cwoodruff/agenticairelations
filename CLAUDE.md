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

No test suite, linter, or formatter is configured. `tsconfig.json` extends `astro/tsconfigs/strict`; type errors surface at build time (`astro build`) and in the editor.

## Deployment

Push to `main` triggers `.github/workflows/deploy.yml`, which runs `npm ci && npm run build` and publishes `dist/` to GitHub Pages (Node 20). Custom domain `agenticairelations.com` is set by `public/CNAME`; `public/.nojekyll` stops GitHub Pages from processing the output as Jekyll. No manual deploy step.

## Architecture

Astro 4, `output: 'static'`, integrations: Tailwind, MDX, sitemap (`astro.config.mjs`). `site` is set there and drives sitemap + RSS absolute URLs.

**Theming is the load-bearing system.** All color lives as space-separated RGB triplets in CSS custom properties in `src/styles/global.css` (`:root` for light, `[data-theme="dark"]` block for dark). `tailwind.config.mjs` maps semantic color names (`primary`, `amber`, etc.) to `rgb(var(--color-x) / <alpha-value>)`, so dark mode flips the whole palette by toggling one `data-theme` attribute — never hardcode hex/rgb in components; add a token and reference the Tailwind semantic name. `ThemeToggle.astro` sets that attribute. `darkMode: ['class', '[data-theme="dark"]']`.

**Essays are an Astro content collection.** `src/content/config.ts` defines the `essays` collection with a Zod schema (title, description, publishDate, optional `series`/`seriesOrder`, `tags`, `draft`, `ogImage`). Essay files are MDX in `src/content/essays/`. `src/pages/essays/[...slug].astro` generates one page per non-draft essay via `getStaticPaths`, rendering through `EssayLayout`. `series` must be one of the enum values in the schema — adding a new series means editing the enum. Set `draft: true` to keep an essay out of the build. `rss.xml.ts` builds the feed from the collection.

**Layouts** (`src/layouts/`): `BaseLayout` (html shell, head, theme boot) → `PageLayout` (standard pages) and `EssayLayout` (essay chrome + metadata from frontmatter). Pages under `src/pages/` are one `.astro` file per route.

**Components** are organized by role under `src/components/`: `content/` (Callout, DefinitionBox, PatternCard, CompareTable, PullQuote, RoleCard — usable inside MDX essays), `diagrams/` (inline-SVG framework diagrams; SVGs should use theme tokens so they track light/dark), `sections/`, `nav/`, `ui/`.

## Content source

Site plan and framework source live in `docs/` (`Agentic_Relations_Site_Plan.md`, `Agentic_Relations_Framework.docx`). Site source is MIT; essay/framework content is © Chris Woodruff, all rights reserved.
