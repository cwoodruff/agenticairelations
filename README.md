# agenticairelations.com

The canonical reference site for **Agentic Relations** — the discipline
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

## Project structure

```
src/
├── components/
│   ├── content/     Callouts, definition boxes, pattern cards, tables
│   ├── diagrams/    8 inline-SVG framework diagrams
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

- **Site plan:** `docs/Agentic_Relations_Site_Plan.md`
- **Framework source:** `docs/Agentic_Relations_Framework.docx`

## License

Site source: MIT (see `LICENSE`). Essays and framework content: © Chris
Woodruff, all rights reserved unless otherwise noted.
