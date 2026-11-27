# agenticairelations.com

The canonical reference site for **Agentic Developer Relations** — the discipline
inside Developer Relations responsible for the AI agent layer of every
developer platform.

Built with [Astro](https://astro.build/) 4.x. Static output. Deployed to
GitHub Pages at [agenticairelations.com](https://agenticairelations.com).

## Local development

```bash
npm install
npm run dev        # http://localhost:4321
```

## Build

```bash
npm run build      # output: ./dist
npm run preview    # preview the production build
```

## Agent-readable output

The site is also published in a form AI agents can read directly. A local Astro integration, `integrations/agent-readable.mjs`, runs after each build (`astro:build:done`) and writes into `dist/`:

- **A markdown copy of every page** (except the 404 page), at both `/<route>/index.md` and `/<route>.md`; the home page is `/index.md`. Each file holds the page's main content only (no navigation or footer), with an H1, a `Source:` line giving the HTML URL, absolute links, markdown tables, and each SVG diagram replaced by a `*Diagram: title. description*` line built from its `<title>` and `<desc>`.
- **`/llms.txt`**, an index of those markdown files in the [llms.txt](https://llmstxt.org/) format, with titles and descriptions taken from each page's `<title>` and meta description. Pages follow the site navigation order; essays are listed in their own section, newest first.

Every page's `<head>` also carries `<link rel="alternate" type="text/markdown" href=".../index.md">` (set in `src/layouts/BaseLayout.astro`). The page list is derived from the build output, so new pages and essays are picked up automatically. Diagrams need a `<title>` to appear in the markdown; SVGs without one are treated as decorative and dropped.

## Project structure

```
src/
├── components/
│   ├── content/     Callouts, definition boxes, tables
│   ├── diagrams/    Inline-SVG framework diagrams
│   ├── nav/         Site nav and footer
│   ├── sections/    Hero, EssayPreview, NewsletterCTA, AboutSnippet
│   └── ui/          Button, Badge, Metric
├── content/
│   └── essays/      Essay MDX files (content collection)
├── layouts/         Base, Page, Essay layouts
├── pages/           One .astro file per route
└── styles/          Global CSS (custom properties, base reset)
```

## Deployment

Pushes to `main` trigger the GitHub Actions workflow at
`.github/workflows/deploy.yml`, which builds the site and deploys the
`dist/` directory to GitHub Pages. The site is served at the custom
domain `agenticairelations.com` via the `public/CNAME` file.

To enable this, in the repository settings enable **Pages → Source:
GitHub Actions**, and configure the custom domain.

## Content

- **Current framework (version 2):** `docs/agentic-devrel-v2-vision.md`
- **Measurement specification:** `docs/measurement-specification.md`
- **Review of version 1:** `docs/agentic-devrel-critique.md`
- **Original site plan (version 1, superseded):** `docs/Agentic_Relations_Site_Plan.md`
- **Original framework document (version 1, superseded):** `docs/Agentic_Relations_Framework.docx`

## License

Site source: MIT (see `LICENSE`). Essays and framework content: © Chris
Woodruff, all rights reserved unless otherwise noted.

The measurement specification (`docs/measurement-specification.md`) is
licensed under [Creative Commons Attribution 4.0 International](https://creativecommons.org/licenses/by/4.0/).
