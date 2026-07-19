# Agentic Developer Relations — Astro Website Build Plan

**Author:** Chris Woodruff  
**Domain target:** agenticrelations.dev (or agenticrelations.com)  
**Framework:** Astro 4.x — static output, zero JS by default  
**Purpose:** Establish Chris Woodruff as the defining voice in Agentic Developer Relations; educate the DevRel community; generate speaking, consulting, and EcoSynt pipeline  
**Status:** Build-ready specification  

---

## Table of Contents

1. [Strategic Intent](#1-strategic-intent)
2. [Information Architecture](#2-information-architecture)
3. [Design System](#3-design-system)
4. [Page-by-Page Content Plan](#4-page-by-page-content-plan)
5. [Diagram Specifications](#5-diagram-specifications)
6. [Image and Visual Direction](#6-image-and-visual-direction)
7. [Astro Technical Architecture](#7-astro-technical-architecture)
8. [Content Collections Structure](#8-content-collections-structure)
9. [Component Library](#9-component-library)
10. [SEO and Metadata Strategy](#10-seo-and-metadata-strategy)
11. [Launch Sequence](#11-launch-sequence)
12. [Full Page Copy — Home](#12-full-page-copy--home)
13. [Full Page Copy — What Is Agentic Developer Relations](#13-full-page-copy--what-is-agentic-relations)
14. [Full Page Copy — The 37 Patterns Reframed](#14-full-page-copy--the-37-patterns-reframed)
15. [Full Page Copy — New Roles](#15-full-page-copy--new-roles)
16. [Full Page Copy — Measurement Framework](#16-full-page-copy--measurement-framework)
17. [Full Page Copy — For DevRel Teams](#17-full-page-copy--for-devrel-teams)
18. [Full Page Copy — For Companies](#18-full-page-copy--for-companies)
19. [Full Page Copy — About Chris Woodruff](#19-full-page-copy--about-chris-woodruff)
20. [Essay Series Plan](#20-essay-series-plan)

---

## 1. Strategic Intent

### What this site is

Agentic Developer Relations is a new discipline inside Developer Relations. No authoritative resource exists for it. This site occupies that vacuum deliberately and permanently. It is the canonical reference point for the concept — the place a journalist, conference program committee, or DevRel leader goes when they need to understand what Agentic Developer Relations is and who defined it.

The site serves three concurrent purposes:

**Authority establishment.** Chris Woodruff co-authored the definitive book on DevRel activity patterns. This site extends that intellectual lineage into the AI-agent era. Every page reinforces the same framing: the field has changed, the change has been named, and it was named here.

**Community hub.** DevRel practitioners are already discovering that their work is bifurcating — some of it is still human community work, some of it is now agent ecosystem work. This site gives that bifurcation a name, a framework, and a community to join. It is where the emerging Agentic Developer Relations practice coalesces.

**Pipeline.** Speaking invitations, consulting engagements, EcoSynt leads, and book opportunities flow from authority. The site converts authority into pipeline without ever reading like a marketing site. It earns trust by being genuinely useful, then lets the contact form and essay subscription do the rest.

### What it is not

Not a product site. Not a consulting pitch. Not an AI tools directory. EcoSynt is mentioned once, briefly, in context. The focus is the discipline, not the product.

### Tone

Practitioner-to-practitioner. The voice of someone who has done the work, seen the patterns, built the frameworks, and is sharing what they found. Authoritative without being academic. Opinionated without being combative. The same register as the best conference keynotes — conversational, precise, occasionally funny, always grounded in real work.

---

## 2. Information Architecture

```
agenticrelations.dev/
│
├── /                               Home — The definition, the argument, the invitation
│
├── /what-is-agentic-relations      Canonical definition + three principles
│
├── /the-amdahl-tax                 The infrastructure argument (derived from Nate's summary)
│
├── /devrel-patterns-reframed       How the 37 patterns bifurcate
│
├── /new-roles                      Agent Champion, Documentation Architect, API Experience Designer
│
├── /measurement                    FAISR, Amdahl ceiling, the four-layer dashboard
│
├── /for-devrel-teams               The practitioner pitch — five talking points, objections
│
├── /for-companies                  The executive pitch — business arguments, investment tiers
│
├── /essays/                        Essay series index
│   ├── /essays/your-community-cant-read      Essay 1
│   ├── /essays/the-agent-champion            Essay 2
│   └── /essays/the-amdahl-tax-on-devrel      Essay 3
│
├── /about                          Chris Woodruff — bio, book, EcoSynt, speaking
│
└── /newsletter                     Subscribe to the Agentic Developer Relations newsletter
```

### Navigation structure

**Primary nav:** What Is It · The Patterns · New Roles · Measurement · Essays · About  
**Secondary (footer):** For DevRel Teams · For Companies · Newsletter · Speaking · EcoSynt

---

## 3. Design System

### Typography

```
Heading font:    Inter or DM Sans — geometric, clean, technical authority
Body font:       Inter — consistent, highly readable at 16–18px
Mono font:       JetBrains Mono — for code blocks, metrics, definitions
```

All available via `@fontsource` in Astro for zero-CDN self-hosting.

### Color palette

```
Primary teal:         #0F6E56    --color-primary
Primary teal light:   #1D9E75    --color-primary-light  
Teal surface:         #E1F5EE    --color-primary-surface
Near-black:           #1A1A18    --color-heading
Body text:            #2C2C2A    --color-body
Muted text:           #5F5E5A    --color-muted
Border:               #D3D1C7    --color-border
Background:           #FAFAF8    --color-bg
White surface:        #FFFFFF    --color-surface
Amber accent:         #854F0B    --color-amber        (warnings, callouts)
Amber surface:        #FAEEDA    --color-amber-surface
Purple accent:        #3C3489    --color-purple       (secondary concept color)
Purple surface:       #EEEDFE    --color-purple-surface
```

### Spacing scale (Tailwind-compatible)

```
4px   0.25rem   xs
8px   0.5rem    sm
16px  1rem      md
24px  1.5rem    lg
32px  2rem      xl
48px  3rem      2xl
64px  4rem      3xl
96px  6rem      4xl
```

### Component aesthetic

- Flat design, no gradients, no shadows deeper than `shadow-sm`
- Generous whitespace — this is a thinking site, not a landing page
- Full-width section breaks with subtle background color alternation
- Callout boxes with left border accent (4px teal or amber)
- Data tables with light teal header rows
- Diagrams embedded as inline SVG — no raster images for diagrams

---

## 4. Page-by-Page Content Plan

### Home `/`

**Purpose:** Answer "what is this, why does it matter, and why should I care" in under 60 seconds. Earn the scroll.

**Sections:**
1. Hero — the definition as a single provocative question, then the name
2. The problem in three sentences
3. The Fundamental Triad extended (visual)
4. Three principles (cards)
5. Five things you'll find on this site (navigation cards)
6. Essay preview — latest three essays
7. About Chris — one paragraph + CTA to /about
8. Newsletter signup

**Hero headline options (choose one):**
- *"When a developer asks AI to integrate with your platform, does it work?"*
- *"Your developer community now has members who can't read your content."*
- *"Inference got fast. Everything it touches did not."*

**Recommended:** The first option — it's a direct question that every DevRel practitioner and platform leader will feel immediately.

---

### What Is Agentic Developer Relations `/what-is-agentic-relations`

**Purpose:** The canonical definitional page. This is the page that gets linked from everywhere else.

**Sections:**
1. The canonical definition (large callout)
2. The core insight — two audiences, one platform
3. The three principles (expanded from the doc)
4. The Amdahl ceiling explained visually
5. How it relates to the Fundamental Triad
6. FAISR introduced
7. What changed vs. what stays the same (comparison table)
8. CTA to essay series

---

### The Amdahl Tax `/the-amdahl-tax`

**Purpose:** The infrastructure argument. The page that makes engineers and platform leaders pay attention.

**Sections:**
1. Jeff Dean's observation at GTC — 47x is eaten by the environment
2. The METR RCT result and its correct interpretation
3. The Jellyfish data — same models, different environments
4. MCP-blindness explained
5. Agent-accessible vs. agent-native (visual comparison)
6. What the Amdahl ceiling means for DevRel's role
7. How to measure your platform's Amdahl ceiling
8. CTA to /measurement

---

### The 37 Patterns Reframed `/devrel-patterns-reframed`

**Purpose:** Connect Agentic Developer Relations to the existing DevRel canon. This page speaks directly to practitioners who know the book.

**Sections:**
1. Brief intro — the patterns don't become obsolete, they bifurcate
2. The three categories (gains agent layer / requires rewrite / grows more valuable)
3. Pattern-by-pattern reference table (all 37, with Agentic Developer Relations status for each)
4. Deep dive: Reference Documentation reframed
5. Deep dive: Ambassador → Agent Champion
6. Deep dive: Hackathon → Agentic Hackathon
7. Deep dive: SDK reframed
8. CTA to /new-roles

---

### New Roles `/new-roles`

**Purpose:** Operational page. Answers "so what do I actually do?"

**Sections:**
1. Intro — scarcity migrates upstream
2. The Agent Champion — full role description, day-to-day, skills, metrics
3. The Documentation Architect (agent consumption) — full role description
4. The API Experience Designer — full role description
5. How the roles interact (diagram)
6. Who these people are today — where to find them, how to develop them
7. Staffing model by org size
8. CTA to /for-devrel-teams

---

### Measurement `/measurement`

**Purpose:** The practitioner reference page for the Agent Ecosystem Health Dashboard.

**Sections:**
1. Why traditional DevRel metrics are blind to agent ecosystem health
2. FAISR — definition, instrumentation approach, three methods
3. The four-layer dashboard (visual)
4. Layer 1: Integration quality signals
5. Layer 2: Documentation effectiveness for agents
6. Layer 3: Recipe ecosystem health
7. Layer 4: Competitive positioning
8. Starting sequence for teams without existing instrumentation
9. CTA to /for-devrel-teams and /for-companies

---

### For DevRel Teams `/for-devrel-teams`

**Purpose:** The practitioner conversion page. Convince a practicing DevRel professional that Agentic Developer Relations is real, urgent, and something they should own.

**Sections:**
1. The relevance crisis — what practitioners are feeling but can't name
2. Five talking points that land
3. Objections and responses
4. The two-layer operating model
5. What to do in week one (concrete, minimal, no budget required)
6. Newsletter CTA + community CTA

---

### For Companies `/for-companies`

**Purpose:** The executive conversion page. Convince a VP of DevRel, Head of Platform, or CTO that Agentic Developer Relations deserves investment.

**Sections:**
1. The executive frame — FAISR as a causal metric
2. The competitive threat argument
3. Four business arguments
4. Investment tiers by org size
5. The board metrics table
6. The closing argument
7. Speaking / consulting inquiry CTA

---

### About `/about`

**Purpose:** Establish Chris's authority and make him approachable. Convert authority to speaking invitations and consulting inquiries.

**Sections:**
1. Photo + one-sentence positioning
2. Why this, why now — the intellectual origin story
3. The book — *Developer Relations Activity Patterns*
4. EcoSynt — one paragraph, no sales pitch
5. Speaking — recent and upcoming
6. Contact / inquiry form

---

### Essays `/essays`

**Purpose:** Ongoing intellectual output that builds search authority and newsletter subscriptions.

**Initial series:** Three essays (full text in Section 20)

**Ongoing cadence:** One essay per month minimum. Each essay addresses one aspect of Agentic Developer Relations in depth, with the same practitioner-to-practitioner voice.

---

## 5. Diagram Specifications

Every diagram is built as inline SVG using the site's design tokens. No external image dependencies. All diagrams are accessible with `role="img"`, `<title>`, and `<desc>`.

---

### Diagram 1: The Extended Fundamental Triad

**Page:** Home, /what-is-agentic-relations  
**Type:** Structural — two concentric triangles  
**Concept:** The original Triad (Community, Company, Customer) as an inner triangle; the Agentic Developer Relations extensions as an outer ring around each vertex.

**Layout description:**
- Inner equilateral triangle, vertices labeled Community / Company / Customer, teal fill (#E1F5EE), teal border (#0F6E56)
- Outer three "extension nodes" connected by dashed lines from each vertex, purple fill (#EEEDFE), purple border (#3C3489)
  - Community → Agent Ecosystem
  - Company → Signal Loss / New Metrics
  - Customer → AI-Assisted Buyer
- Center label: "Fundamental Triad" in teal, "Extended for Agentic Developer Relations" in muted
- ViewBox: 0 0 680 520
- Arrow heads on dashed extension lines

**SVG color tokens:**
```
Inner triangle fill:    #E1F5EE
Inner triangle stroke:  #0F6E56
Inner text:             #1A1A18
Extension node fill:    #EEEDFE
Extension node stroke:  #3C3489
Extension text:         #3C3489
Dashed connector:       #5F5E5A, stroke-dasharray="6 4"
Center label:           #0F6E56 (bold), #5F5E5A (subtitle)
```

---

### Diagram 2: The Amdahl Ceiling Bar Chart

**Page:** /what-is-agentic-relations, /the-amdahl-tax  
**Type:** Horizontal stacked bar — conceptual, not data-precise  
**Concept:** Two platform scenarios side by side, each bar divided into "Model reasoning (fast)" and "Tool interaction (human-speed)". Shows that even with the same model, the ceiling is set by the tool interaction fraction.

**Layout description:**
- Two horizontal stacked bars, full width 580px, height 52px each, gap 48px
- Platform A (human-speed): 20% teal (model) + 80% amber (tool interaction) → "5x ceiling"
- Platform B (agent-native): 70% teal (model) + 30% amber (tool interaction) → "3.3x ceiling if model 10x faster, but better baseline"
- Labels: "Model reasoning" (teal) and "Tool interaction / human-speed overhead" (amber)
- Ceiling annotation: right-side text indicating theoretical max improvement
- Title: "Why the environment is the binding constraint"
- ViewBox: 0 0 680 260

**Visual note:** The amber segment should feel dominant in Platform A to make the point viscerally. Include a vertical dashed line at 50% to anchor the comparison.

---

### Diagram 3: FAISR Measurement Funnel

**Page:** /measurement  
**Type:** Vertical funnel with three instrumentation approaches  
**Concept:** Three approaches to measuring first-attempt integration success rate, from most direct (controlled testing) to most scalable (API log analysis) to most accessible (developer survey).

**Layout description:**
- Three horizontally stacked cards, each 200px wide, 280px tall, with rounded corners
- Card 1 (teal): Controlled Test Suite — "Direct / Most accurate / Agent Champion runs weekly"
- Card 2 (purple): API Log Analysis — "Continuous / Production signal / Requires data engineering"
- Card 3 (amber): Developer Survey — "Fastest to deploy / Most biased / Triangulation"
- Below cards: "Combined → FAISR score" with converging arrows into a single metric callout
- Small numbered steps inside each card (3-4 bullet points per card)
- ViewBox: 0 0 680 420

---

### Diagram 4: The Two-Layer DevRel Operating Model

**Page:** /for-devrel-teams, /new-roles  
**Type:** Structural — two parallel horizontal lanes  
**Concept:** Human Relations Layer (top) and Agent Relations Layer (bottom) as distinct operating tracks, with feedback arrows flowing between them.

**Layout description:**
- Two rounded rect lanes, full width 620px, height 120px each, gap 40px
- Top lane (teal): "Human Relations Layer" — Ambassadors, Community, Events, Content, Office Hours
- Bottom lane (purple): "Agent Relations Layer" — Agent Champions, Recipe Library, FAISR Testing, API Feedback
- Between lanes: two-way dashed arrow labeled "Feedback flows both ways"
- Left margin: "Shared: Platform expertise, leadership, developer empathy"
- Right margin: "Distinct: Skills, metrics, time horizons, practitioners"
- ViewBox: 0 0 680 360

---

### Diagram 5: The Agent Champion Day-in-the-Life Flow

**Page:** /new-roles  
**Type:** Flowchart — three-column weekly rhythm  
**Concept:** Monitoring → Maintenance → Feedback as a weekly operational cycle, with specific activities under each column.

**Layout description:**
- Three columns labeled Monitoring / Maintenance / Feedback
- Each column contains 3-4 rounded rect nodes describing specific activities
- Arrows flowing right between columns at the bottom showing the cycle
- A fourth "Platform Engineering" node at the bottom receiving the feedback arrow, lighter styling
- Column headers in teal with white text
- Activity nodes in white with light border
- ViewBox: 0 0 680 480

---

### Diagram 6: MCP Blindness — Three States

**Page:** /the-amdahl-tax, /what-is-agentic-relations  
**Type:** Three-card progression  
**Concept:** Not agent-accessible → Agent-accessible (MCP wrapper) → Agent-native (purpose-built). Each card shows the integration speed, the overhead fraction, and the resulting ceiling.

**Layout description:**
- Three cards in a row, each 190px wide, 220px tall
- State 1 (gray): "Not accessible" — no MCP, agents fail silently
- State 2 (amber): "Agent-accessible" — MCP wrapper on human-speed API, ceiling shown
- State 3 (teal): "Agent-native" — purpose-built primitives, low overhead, high ceiling
- Progress arrow connecting cards labeled "Investment required →"
- Under each card: 2-3 stat-like lines (overhead %, ceiling estimate, typical auth pattern)
- ViewBox: 0 0 680 320

---

### Diagram 7: The 37 Patterns Bifurcation Map

**Page:** /devrel-patterns-reframed  
**Type:** Grid / matrix  
**Concept:** All 37 patterns shown in three groups with color coding — gains agent layer (teal), requires rewrite (amber), grows more valuable (purple).

**Layout description:**
- Three columns with colored headers matching the three categories
- Each pattern listed as a small pill/badge with its name
- Under each column header: a one-sentence descriptor of what changes
- Counts in header: "15 patterns" / "8 patterns" / "14 patterns" (approximate — adjust in implementation)
- ViewBox: 0 0 680 560

**Pattern assignments:**

*Gains agent layer (both human and agent variants):*
Article, Blog Post, Book, Guide, Newsletter, Reference Documentation, Sample/Example, SDK, Social Media, Tutorial, Forum, Open-Source Project, Survey, Technical Support, Recorded Video

*Requires substantive rewrite for agentic context:*
Ambassadors (→ Agent Champion), Hackathon (→ Agentic Hackathon), Office Hours (→ Integration Debug Sessions), Training (→ Agent Direction Training), Code Review, Live Playground, Case Study, Workshop

*Remains purely human, grows more valuable:*
Conference, Conference Session, User Group Network, Parties, Live Streaming, Customer Check-In, Customer Pre-Sale, Sponsorship, Webinar, Podcast, Partnerships, Swag, Newsletter (community variant), Boot Camp / Recorded Video (high-trust variant)

---

### Diagram 8: Recipe Library as Institutional Memory

**Page:** /new-roles, /for-companies  
**Type:** Before/after structural  
**Concept:** Left side shows knowledge in practitioners' heads — a fragmented, person-dependent structure that erodes when people leave. Right side shows the same knowledge encoded in a versioned recipe library — a compounding asset.

**Layout description:**
- Left side: four silhouette-style human figures, each with a thought bubble containing partial information. Arrow showing one figure "leaving." Decay arrow downward labeled "Knowledge walks out the door."
- Right side: structured repository shape (rounded rect like a folder/DB icon), labeled layers: "Validated recipes," "Versioned alongside API," "Machine-consumable," "Community-maintained." Arrow upward labeled "Compounds over time."
- Center: transformation arrow labeled "Agent Champion encodes judgment"
- ViewBox: 0 0 680 380

---

## 6. Image and Visual Direction

### Photography / illustration style

No stock photos of robots, handshakes, or abstract "AI visualization" blue spheres. This is a practitioner site — it should look like it was built by someone who actually does the work.

**Acceptable image sources:**
- Chris Woodruff headshot — professional, conference-style, not a studio portrait
- Conference speaking photos — real slides visible in background, real audience visible
- Screenshot-style images of the Agent Ecosystem Health Dashboard concept (designed as mockups)
- Book cover of *Developer Relations Activity Patterns* — real cover, high-res

**Illustration direction (if any):**
- Minimalist line illustrations in the site's teal/purple palette
- Icon-level illustrations to accompany the three new role cards
- No cartoon characters, no abstract geometric "innovation" visuals

### Open Graph / social images

Each page gets a dedicated OG image, generated programmatically using Astro's `@astrojs/og` or Satori. The template:
- Teal left border (8px)
- Page title in Inter bold, 40px, near-black
- "agenticrelations.dev" in teal, bottom left
- Chris Woodruff name in muted, bottom right
- White background

### Favicon

Simple "AR" lettermark in teal on white, exported as SVG favicon + PNG fallback.

---

## 7. Astro Technical Architecture

### Astro config

```typescript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://agenticrelations.dev',
  integrations: [
    tailwind(),
    mdx(),
    sitemap(),
  ],
  output: 'static',
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      langs: ['typescript', 'javascript', 'python', 'bash', 'json'],
    },
  },
});
```

### Directory structure

```
agenticrelations.dev/
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
│
├── public/
│   ├── favicon.svg
│   ├── og/           (static OG images — fallback)
│   └── fonts/        (self-hosted via @fontsource)
│
├── src/
│   ├── content/
│   │   ├── config.ts           (Zod schemas for collections)
│   │   └── essays/
│   │       ├── your-community-cant-read.mdx
│   │       ├── the-agent-champion.mdx
│   │       └── the-amdahl-tax-on-devrel.mdx
│   │
│   ├── layouts/
│   │   ├── BaseLayout.astro     (head, fonts, global styles)
│   │   ├── PageLayout.astro     (nav, footer, main)
│   │   └── EssayLayout.astro   (essay-specific layout with TOC)
│   │
│   ├── components/
│   │   ├── nav/
│   │   │   ├── SiteNav.astro
│   │   │   └── MobileNav.astro
│   │   ├── content/
│   │   │   ├── Callout.astro       (teal/amber callout boxes)
│   │   │   ├── CompareTable.astro  (two-col comparison)
│   │   │   ├── DefinitionBox.astro (canonical definition display)
│   │   │   ├── PatternCard.astro   (pattern with category badge)
│   │   │   └── RoleCard.astro      (new role description card)
│   │   ├── diagrams/
│   │   │   ├── FundamentalTriad.astro
│   │   │   ├── AmdahlBar.astro
│   │   │   ├── FAISRFunnel.astro
│   │   │   ├── TwoLayerModel.astro
│   │   │   ├── AgentChampionFlow.astro
│   │   │   ├── MCPStates.astro
│   │   │   ├── PatternBifurcation.astro
│   │   │   └── RecipeLibrary.astro
│   │   ├── sections/
│   │   │   ├── Hero.astro
│   │   │   ├── EssayPreview.astro
│   │   │   ├── NewsletterCTA.astro
│   │   │   └── AboutSnippet.astro
│   │   └── ui/
│   │       ├── Button.astro
│   │       ├── Badge.astro
│   │       └── Metric.astro    (big number display for stats)
│   │
│   ├── pages/
│   │   ├── index.astro
│   │   ├── what-is-agentic-relations.astro
│   │   ├── the-amdahl-tax.astro
│   │   ├── devrel-patterns-reframed.astro
│   │   ├── new-roles.astro
│   │   ├── measurement.astro
│   │   ├── for-devrel-teams.astro
│   │   ├── for-companies.astro
│   │   ├── about.astro
│   │   ├── newsletter.astro
│   │   └── essays/
│   │       ├── index.astro
│   │       └── [...slug].astro
│   │
│   └── styles/
│       └── global.css          (CSS custom properties, base reset)
```

### Tailwind config

```javascript
// tailwind.config.mjs
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
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
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme('colors.body'),
            '--tw-prose-headings': theme('colors.heading'),
            '--tw-prose-links': theme('colors.primary.DEFAULT'),
            maxWidth: '70ch',
          },
        },
      }),
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
```

---

## 8. Content Collections Structure

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const essays = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),        // 150-char max for OG/meta
    publishDate: z.date(),
    updatedDate: z.date().optional(),
    series: z.enum(['agentic-relations-introduction', 'patterns', 'roles', 'measurement']),
    seriesOrder: z.number().optional(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
    ogImage: z.string().optional(),
  }),
});

export const collections = { essays };
```

### Essay frontmatter example

```yaml
---
title: "Your Developer Community Now Has Members Who Can't Read"
subtitle: "Introducing Agentic Developer Relations — the discipline DevRel must develop before it realizes it needed to"
description: "AI coding agents are integrating with your platform on behalf of developers. Agentic Developer Relations is the discipline for managing that relationship."
publishDate: 2026-05-01
series: agentic-relations-introduction
seriesOrder: 1
tags: [agentic-relations, devrel, ai-agents, developer-experience]
draft: false
---
```

---

## 9. Component Library

### Callout.astro

Used throughout for the definition box, key findings, and important distinctions.

```astro
---
interface Props {
  type?: 'primary' | 'amber' | 'purple';
  label?: string;
}
const { type = 'primary', label } = Astro.props;

const styles = {
  primary: 'border-primary bg-primary-surface',
  amber:   'border-amber bg-amber-surface',
  purple:  'border-purple bg-purple-surface',
};
const labelStyles = {
  primary: 'text-primary',
  amber:   'text-amber',
  purple:  'text-purple',
};
---

<div class={`border-l-4 ${styles[type]} rounded-r-lg p-5 my-6`}>
  {label && (
    <p class={`font-bold text-sm uppercase tracking-wide mb-2 ${labelStyles[type]}`}>
      {label}
    </p>
  )}
  <div class="text-body prose-sm">
    <slot />
  </div>
</div>
```

### DefinitionBox.astro

Used on /what-is-agentic-relations as the canonical definition display.

```astro
---
interface Props {
  term: string;
}
const { term } = Astro.props;
---

<div class="border-2 border-primary rounded-xl p-8 my-8 bg-primary-surface">
  <p class="text-primary font-mono text-sm font-bold mb-3 uppercase tracking-widest">
    Definition
  </p>
  <h2 class="text-heading text-2xl font-bold mb-4">{term}</h2>
  <div class="text-body text-lg leading-relaxed">
    <slot />
  </div>
</div>
```

### RoleCard.astro

Used on /new-roles for the three new role descriptions.

```astro
---
interface Props {
  title: string;
  also?: string;
  color?: 'primary' | 'purple' | 'amber';
}
const { title, also, color = 'primary' } = Astro.props;

const borderColor = {
  primary: 'border-primary',
  purple:  'border-purple',
  amber:   'border-amber',
};
---

<div class={`border-t-4 ${borderColor[color]} rounded-lg bg-white p-6 shadow-sm`}>
  <p class="text-muted text-sm mb-1">{also}</p>
  <h3 class="text-heading text-xl font-bold mb-4">{title}</h3>
  <slot />
</div>
```

### PatternCard.astro

Used on /devrel-patterns-reframed for individual pattern entries.

```astro
---
interface Props {
  name: string;
  status: 'gains-layer' | 'rewrite' | 'more-valuable';
  chapterRef?: number;
}
const { name, status, chapterRef } = Astro.props;

const badge = {
  'gains-layer':    { label: 'Gains agent layer',  class: 'bg-primary-surface text-primary' },
  'rewrite':        { label: 'Requires rewrite',   class: 'bg-amber-surface text-amber' },
  'more-valuable':  { label: 'Grows more valuable', class: 'bg-purple-surface text-purple' },
};
---

<div class="flex items-start gap-3 p-3 border border-border rounded-lg hover:border-primary transition-colors">
  {chapterRef && (
    <span class="text-muted font-mono text-xs mt-0.5 w-6 shrink-0">
      {chapterRef}
    </span>
  )}
  <div class="flex-1">
    <p class="font-medium text-heading text-sm">{name}</p>
    <span class={`inline-block mt-1 text-xs px-2 py-0.5 rounded-full font-medium ${badge[status].class}`}>
      {badge[status].label}
    </span>
  </div>
</div>
```

### Metric.astro

Used on /measurement for displaying FAISR scores and Amdahl ceiling values.

```astro
---
interface Props {
  value: string;
  label: string;
  delta?: string;
  deltaDirection?: 'up' | 'down' | 'neutral';
}
const { value, label, delta, deltaDirection = 'neutral' } = Astro.props;
const deltaColor = { up: 'text-primary', down: 'text-red-600', neutral: 'text-muted' };
---

<div class="bg-white border border-border rounded-xl p-6 text-center">
  <p class="text-4xl font-bold text-heading font-mono">{value}</p>
  {delta && (
    <p class={`text-sm mt-1 ${deltaColor[deltaDirection]}`}>{delta}</p>
  )}
  <p class="text-sm text-muted mt-2">{label}</p>
</div>
```

---

## 10. SEO and Metadata Strategy

### Target keywords

**Primary (own these):**
- "agentic relations" — zero competition, we define it
- "agentic devrel" — same
- "agent champion devrel" — same
- "first attempt integration success rate" — same

**Secondary (compete in):**
- "developer relations AI" — high competition, build toward
- "AI coding tools devrel" — medium competition
- "developer advocate AI agents" — medium competition
- "devrel measurement AI" — medium competition

**Long-tail (essay-driven):**
- "how does copilot affect developer relations"
- "MCP server devrel strategy"
- "amdahl law software development AI"
- "agent ecosystem health"

### Meta template

```astro
<!-- In BaseLayout.astro -->
<title>{title} — Agentic Developer Relations</title>
<meta name="description" content={description} />
<meta name="author" content="Chris Woodruff" />

<!-- Open Graph -->
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:type" content={type ?? 'website'} />
<meta property="og:url" content={canonicalURL} />
<meta property="og:image" content={ogImage} />
<meta property="og:site_name" content="Agentic Developer Relations" />

<!-- Twitter/X -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:creator" content="@woodruff" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={ogImage} />

<!-- Canonical -->
<link rel="canonical" href={canonicalURL} />
```

### Structured data

Each essay gets `Article` schema. The About page gets `Person` schema. The home page gets `WebSite` schema with `sameAs` pointing to LinkedIn, Twitter/X, and the book's Apress page.

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Chris Woodruff",
  "url": "https://agenticrelations.dev/about",
  "jobTitle": "Developer Relations Practitioner & Author",
  "knowsAbout": ["Developer Relations", "Agentic Developer Relations", "AI Agents", "Software Architecture"],
  "sameAs": [
    "https://www.linkedin.com/in/woodruff",
    "https://twitter.com/woodruff",
    "https://www.apress.com/developer-relations-activity-patterns"
  ]
}
```

---

## 11. Launch Sequence

### Phase 1 — Foundation (Week 1-2)

- [ ] Register domain `agenticrelations.dev`
- [ ] Initialize Astro project, install dependencies
- [ ] Implement design system (Tailwind config, CSS custom properties, fonts)
- [ ] Build BaseLayout and PageLayout
- [ ] Implement all 8 diagrams as Astro components with inline SVG
- [ ] Build component library (Callout, DefinitionBox, RoleCard, PatternCard, Metric)

### Phase 2 — Core pages (Week 3-4)

- [ ] Home page — all sections
- [ ] /what-is-agentic-relations — complete
- [ ] /the-amdahl-tax — complete
- [ ] /about — complete with speaking section
- [ ] SEO setup — sitemap, robots.txt, meta templates, OG images

### Phase 3 — Deep content (Week 5-6)

- [ ] /devrel-patterns-reframed — complete with all 37 patterns
- [ ] /new-roles — complete with all three role descriptions
- [ ] /measurement — complete with four-layer dashboard
- [ ] /for-devrel-teams — complete
- [ ] /for-companies — complete

### Phase 4 — Essay series (Week 7)

- [ ] Content collection setup
- [ ] EssayLayout.astro with TOC
- [ ] Essay 1: "Your Developer Community Now Has Members Who Can't Read"
- [ ] Essay 2: "The Agent Champion — A Role DevRel Didn't Know It Needed"
- [ ] Essay 3: "The Amdahl Tax on Developer Relations"
- [ ] Essay index page

### Phase 5 — Launch (Week 8)

- [ ] Newsletter integration (ConvertKit or Buttondown — both have good Astro integrations)
- [ ] Final SEO audit
- [ ] Performance audit (Astro static output should score 100 on Lighthouse)
- [ ] Soft launch to DevRel community channels
- [ ] LinkedIn announcement post (use Essay 1 hook: "Your developer community now has members who can't read your content")
- [ ] Submit to DevRel.co, Developer Advocate communities

---

## 12. Full Page Copy — Home

```
headline:     When a developer asks AI to integrate with your platform,
              does it work?
subheadline:  Most DevRel programs don't know. Agentic Developer Relations is the
              discipline that makes the answer knowable — and then
              systematically improves it.
cta-primary:  What is Agentic Developer Relations?
cta-secondary: Read the essays
```

---

### Hero section copy

The developer community has a new member.

It doesn't attend your conferences. It doesn't read your blog posts. It doesn't care about your ambassador program. But it touches every integration your platform hosts, amplifies every ambiguity in your documentation, and makes a decision about your platform on behalf of every developer who asks it to write some code.

That member is the AI coding agent. And Developer Relations, as a field, has no framework for serving it.

**Agentic Developer Relations** is that framework.

---

### The problem in brief

For fifty years, software was built for humans. Every API response, auth flow, error message, and documentation page was calibrated to the pace of a human reading and typing. AI coding agents work 10–50x faster — and they consume all of it at that speed, amplifying every flaw.

The result: most platforms have a silent, growing failure rate in AI-assisted integrations that no traditional DevRel metric measures. Developers who experience it don't file support tickets. They move on.

---

### Three things this site will give you

**A definition.** Agentic Developer Relations is a named discipline now. The canonical definition lives here, grounded in the Fundamental Triad of Developer Relations Activity Patterns and extended for the AI-agent era.

**A framework.** The 37 patterns of DevRel bifurcate in the agentic era. New roles emerge. New metrics apply. The framework for all of it is documented here in operational depth.

**A practice.** Week one. First metrics. Starting sequence. The most concrete possible answer to "so what do I actually do?"

---

### Five pages worth reading first

[What Is Agentic Developer Relations] — The canonical definition, three principles, and how it extends the Fundamental Triad.

[The Amdahl Tax] — Why the environment is the binding constraint, and what DevRel can do about it.

[The 37 Patterns Reframed] — How every DevRel activity pattern bifurcates for the AI-agent era.

[New Roles] — The Agent Champion, the Documentation Architect, and the API Experience Designer.

[Measurement] — First-Attempt Integration Success Rate and the four-layer Agent Ecosystem Health Dashboard.

---

### About Chris Woodruff

Chris Woodruff co-authored *Developer Relations Activity Patterns* (Apress, 2026) — the field's first systematic catalog of DevRel activity patterns. He is the founder of EcoSynt, an agent ecosystem health and observability platform, and has been working at the intersection of DevRel and AI systems since the earliest multi-agent frameworks reached production. He coined the term Agentic Developer Relations and maintains this site as the canonical resource for the discipline.

[Read the full bio →]

---

## 13. Full Page Copy — What Is Agentic Developer Relations

```
title:        What Is Agentic Developer Relations?
description:  The canonical definition of Agentic Developer Relations — the discipline
              within Developer Relations responsible for the AI agent layer
              of every developer platform.
```

---

### The canonical definition

> **Agentic Developer Relations (AR):** The discipline within Developer Relations responsible for ensuring that AI coding agents and autonomous AI systems can successfully integrate with, consume, and represent a platform accurately — through deliberate cultivation of agent-consumable documentation, validated prompt recipes, machine-readable schemas, and the ongoing measurement of agent ecosystem health.

Agentic Developer Relations does not replace Developer Relations. It is the next structural layer of the discipline — required because the audience for every developer platform now includes a non-human member: the AI coding agent that an increasing fraction of developers use to generate integration code before they write a single line themselves.

---

### The core insight: two audiences, one platform

Every developer platform has always had one audience: human developers. Documentation, SDKs, APIs, tutorials, support channels — all of it designed for people who read, type, ask questions, and remember.

That has changed. When a developer asks GitHub Copilot, Cursor, or Claude Code to write an integration with your platform, there are now two parties making decisions: the developer, who evaluates the output, and the AI agent, who generates it. The agent doesn't navigate your documentation. It retrieves specific sections as context for generation tasks. It doesn't tolerate ambiguity. It amplifies every imprecision in your API surface and every gap in your documentation into integration failures at scale.

The developer experience of your platform is now partly determined by how well AI agents can work with it. DevRel has always been responsible for the developer experience. Agentic Developer Relations is the recognition that this responsibility now extends to the non-human member of the development partnership.

---

### The three principles

**Principle 1: The agent ecosystem is shaped by deliberate choices or by neglect.**

When an AI coding tool is pointed at your platform, it draws on whatever is available in its context: your public documentation, code examples on GitHub, Stack Overflow threads, any structured schemas or MCP server definitions you've published. That corpus is being shaped right now. The only question is whether it is being shaped intentionally.

**Principle 2: Agent failures are silent and systemic.**

A developer whose AI tool generates a broken integration may debug silently, find a workaround, or abandon the platform. They are unlikely to file a support ticket, post a forum question, or generate any of the signals that traditional DevRel measurement tracks. The failure is invisible. The traditional DevRel dashboard shows green.

**Principle 3: Encoded judgment is the moat.**

AI models are commodities. The same model is available to your platform and every competitor's. What is not commoditized is the encoded judgment about what a correct integration looks like — which error states need handling, which architectural patterns hold under load, which edge cases the documentation doesn't cover. That judgment, encoded into machine-accessible artifacts and maintained by practitioners with deep platform expertise, becomes institutional capital that compounds. It does not walk out the door.

---

### The Amdahl Ceiling

Jeff Dean observed at GTC that making a model infinitely fast would only yield a 2–3x end-to-end improvement in software development tasks. The other 47x is eaten by the tools, APIs, auth flows, and documentation the model touches — all designed for human hands.

This is Amdahl's Law applied to platform integrations. If 80% of the time an AI agent spends integrating with your platform is consumed by human-speed tool interactions, your theoretical ceiling is 5x improvement regardless of how capable the model becomes. A competitor who has rebuilt their integration surface for agent-native consumption has a structurally higher ceiling.

DevRel's role in raising that ceiling: identify where it's binding, make it visible to the platform engineering team, and build the interim artifacts — structured schemas, semantic documentation, validated recipes — that lower the agent tax while deeper platform investment follows.

**[See Diagram: Amdahl Ceiling Bar Chart]**

---

### The primary metric: First-Attempt Integration Success Rate

Traditional DevRel has always struggled to produce metrics that connect directly to adoption. Agentic Developer Relations changes this.

**First-Attempt Integration Success Rate (FAISR):** Of all integrations generated by AI coding tools using a platform's published materials as context, what percentage produce working code without manual correction on the first attempt?

This metric is measurable through controlled testing. It is approximable through API log analysis. It is validatable through developer surveys. And it connects directly to adoption: developers who experience successful AI-assisted integrations adopt platforms. Developers who experience systematic AI-generated integration failures choose alternatives.

Most DevRel programs today cannot answer the FAISR question for their platform. Agentic Developer Relations exists to change that.

---

### What changes, what stays the same

| Traditional DevRel — unchanged | Agentic Developer Relations — new layer required |
|---|---|
| Human community remains the primary trust mechanism | Agent ecosystem operates on corpus quality, not relationship |
| Ambassadors earn trust through presence and authentic voice | Agent Champions earn relevance through validated configurations |
| Documentation written for human navigation | Documentation must also serve agent retrieval with semantic precision |
| SDK designed for developer ergonomics | SDK also needs agent-parseable error models and structured schemas |
| Metrics: reach, engagement, community health | Metrics: FAISR, Amdahl ceiling, recipe freshness, MCP adoption tier |
| Human community patterns grow more valuable as AI proliferates | Agent ecosystem layer is where AI-assisted development wins or loses |

**[Continue to: The 37 Patterns Reframed →]**

---

## 14. Full Page Copy — The 37 Patterns Reframed

```
title:        The 37 DevRel Patterns, Reframed for Agentic Developer Relations
description:  How every activity pattern in Developer Relations Activity
              Patterns bifurcates in the AI-agent era — what changes,
              what stays, and what needs a complete rewrite.
```

---

Every activity pattern in *Developer Relations Activity Patterns* was documented for a human audience. None of the 37 patterns become obsolete in the Agentic Developer Relations era. But every one of them bifurcates — some requiring only the addition of an agent-facing variant, some requiring substantive rewriting, and some growing more valuable precisely because they are irreducibly human.

Understanding which category a pattern falls into is the first step in adapting a DevRel program for the two-layer operating environment that Agentic Developer Relations requires.

---

### The three categories

**Gains an agent layer** (15 patterns): The human-facing version continues largely unchanged. A parallel agent-facing variant is required — different design, different metrics, sometimes different practitioners. Both variants run simultaneously.

**Requires substantive rewriting** (8 patterns): The core intent of the pattern survives, but the implementation, participants, metrics, and in some cases the name must change substantially to account for AI agent involvement.

**Grows more valuable** (14 patterns): Irreducibly human patterns that increase in strategic value as AI floods every content channel with generic material. These are the patterns that create the scarcest signal in an AI-saturated environment: genuine human presence, relationship, and trust.

**[See Diagram: Pattern Bifurcation Map]**

---

### Deep dive: Reference Documentation reframed

The Reference Documentation pattern in the book exists to give developers the complete technical information they need to use a platform correctly. The implementation assumes a human reader: navigating a hierarchy, reading progressively, resolving ambiguity through context and prior knowledge.

In the Agentic Developer Relations context, Reference Documentation must serve two readers simultaneously.

The human reader still navigates, still uses context, still exercises judgment. For this reader, nothing fundamental changes — the pattern's existing guidance applies.

The agent reader retrieves. It searches for specific sections as context for generation tasks. It cannot navigate ambiguity — it amplifies it into bugs. For this reader, the documentation must be semantically precise, structured for retrieval rather than navigation, and explicit about things that human readers would infer from context: every error code needs a remediation path, not just a description; every parameter needs explicit boundary conditions; every deprecated endpoint needs a migration path stated in the same sentence as the deprecation.

The practical implication: every Reference Documentation page should be audited against a standard set of agent queries — "how do I authenticate," "what do I do with a 429," "what is the correct structure for X." If the page doesn't answer those questions directly and unambiguously, agents will generate incorrect integrations using it as context, regardless of how clearly it reads to a human.

---

### Deep dive: Ambassador → Agent Champion

The Ambassador pattern is perhaps the clearest example of a pattern that requires rewriting for the Agentic Developer Relations context — not because Ambassadors become less valuable, but because the agent ecosystem requires a different practitioner with a different operating model.

The Ambassador earns trust through authentic community presence. The relationship is the mechanism. Human developers trust Ambassadors because they know them, have seen them speak honestly, have observed them using the platform in real contexts.

AI agents don't operate on trust. They operate on pattern matching against whatever context they have. The "Ambassador" for the agent ecosystem is a practitioner who maintains the corpus of configurations, recipes, and schemas that agents draw on — ensuring that corpus is accurate, current, and structured for agent consumption. I call this practitioner the **Agent Champion**.

The Agent Champion's currency is not reputation. It is a demonstrated success rate: the percentage of AI tool interactions with the platform that produce working integrations because the recipes the Agent Champion maintains are accurate. This is measurable in a way that Ambassador impact never was.

[Read the full Agent Champion role description →]

---

### Deep dive: Hackathon → Agentic Hackathon

The traditional Hackathon evaluates what developers build when given creative freedom, tools, and time pressure. The implicit assumption is that build output is primarily a product of developer skill and creativity.

When AI coding agents are the primary builders, that assumption breaks. What gets built in an Agentic Hackathon is primarily a product of how well the team directs its AI tools — and how well the platform's agent-consumable infrastructure supports that direction. Evaluation criteria designed for human builders don't work here.

The Agentic Hackathon rewrite addresses five changes:

1. **Direction as a first-class role.** Each team has a designated Director whose job is writing prompts, evaluating agent output, and deciding what to accept, reject, or redirect. This role is named, evaluated, and treated as the primary creative contribution.

2. **Robustness over completeness.** Submissions are stress-tested against error conditions, edge cases, and load scenarios — not just demo'd. AI-generated code that works in a demo and fails in production is the norm without this check.

3. **Recipe output is required.** Teams must submit the prompt recipe library they developed during the build, formatted for community reuse. The Hackathon's output extends beyond the demo.

4. **Architectural decision logs.** Teams document which AI decisions they accepted and which they overrode — and why. This surfaces the human judgment layer that traditional hackathon evaluation never captures.

5. **Platform monitors instead of just mentors.** Agent Champions observe team-AI interactions throughout the event, cataloging where the platform's agent-consumable infrastructure is failing. The event is simultaneously a community experience and an agent ecosystem intelligence operation.

**[View full pattern reference: All 37 patterns with Agentic Developer Relations status →]**

---

## 15. Full Page Copy — New Roles

```
title:        New Roles for Agentic Developer Relations
description:  Three new practitioner roles that Agentic Developer Relations requires —
              the Agent Champion, the Documentation Architect for agent
              consumption, and the API Experience Designer.
```

---

### The shift upstream

In the traditional DevRel model, value was created through production: writing tutorials, giving talks, building demos, running events. These activities required skill, but the skill was primarily in execution.

Agentic Developer Relations changes where value concentrates. As AI tools accelerate the production of content, documentation, and integration examples, the binding constraint shifts from production to judgment. Deciding whether an AI-generated tutorial encodes the right pattern, meets the trust standard that a developer audience expects, and doesn't teach an architectural shortcut that fails under real load — that is now the expensive operation. The production is cheap. The judgment is not.

This is Amdahl's Law applied to DevRel work itself. Scarcity migrates upstream: from execution to review, from review to evaluation of approaches, from evaluation to framing problems, from framing to encoded institutional standards that everything else gets evaluated against.

The three new roles Agentic Developer Relations requires each operate primarily at this upstream layer.

---

### The Agent Champion

**Also known as:** Agent Liaison, AI Integration Steward, Platform Agent Custodian

**The role in one sentence:** The Agent Champion maintains the agent-consumable infrastructure that determines whether AI coding tools produce correct integrations with the platform — monitoring success rates, maintaining the recipe library, and feeding failures back to the platform engineering team.

#### What they do day-to-day

**Monitoring (continuous).** The Agent Champion runs a structured test suite weekly — directing multiple AI coding tools at common integration tasks and scoring the output against a rubric. Did the agent authenticate correctly? Did it use current API endpoints? Did it handle the primary error states? Did it over-engineer with unnecessary abstraction? This produces a first-attempt integration success rate, tracked over time, broken down by tool and by task type.

**Maintenance (triggered).** When a new API version ships, the Agent Champion audits all published recipes for breakage and updates them before the old version is deprecated. When monitoring surfaces a recurring failure pattern, the Agent Champion produces a corrective recipe and identifies the documentation gap causing the failure.

**Feedback (systematic).** Recurring agent failures are symptoms. Behind each is either a documentation ambiguity, an API surface complexity, or a missing machine-readable schema. The Agent Champion translates symptoms into specific, actionable improvement requests for the platform engineering team. Over time, this feedback loop makes the platform structurally more agent-friendly.

#### The recipe library

The Agent Champion's primary artifact is the recipe library: a versioned collection of validated prompt recipes, MCP server definitions, and structured integration examples. This is not documentation in the traditional sense — it is designed for agent retrieval, not human navigation. Semantically precise, answer-first, with explicit error taxonomy.

Strategically, the recipe library is the platform's encoded institutional taste. The accumulated judgment of every integration failure, every architectural decision, every edge case discovered — made accessible to every AI tool a developer might use. It compounds rather than depreciates. It does not depend on any individual's continued employment.

#### Skills profile

Deep platform expertise (non-negotiable) + systematic engineering rigor + data analysis for error log interpretation + enough understanding of AI tool behavior to diagnose prompt engineering failures. This combination is currently rare. It does not describe most practicing Developer Advocates, though it does describe the 20% of Developer Advocates who already do this work informally and call it "AI tool testing."

---

### The Documentation Architect for Agent Consumption

**Also known as:** AI Documentation Strategist, Agent-Readable Documentation Lead

**The role in one sentence:** Optimizes documentation for machine retrieval and semantic precision rather than human navigation — the technical writer equivalent who thinks in chunking strategy, RAG accuracy, and agent query patterns rather than reader journey and progressive disclosure.

#### What distinguishes this from technical writing

Traditional technical writing optimizes for the human reader: narrative flow, progressive disclosure, the reader's assumed prior knowledge, clear headings that support skimming. A skilled technical writer produces documentation that a human can navigate efficiently to find what they need.

The Documentation Architect for agent consumption optimizes for a fundamentally different consumer. AI tools retrieve specific sections as context for generation tasks. They don't read progressively. They extract specific passages and use them as input to code generation. Documentation that is beautifully structured for human readers can produce catastrophically bad agent context if:

- The precise answer to a specific integration question is buried inside a larger narrative
- Ambiguous pronouns make it unclear which parameter or endpoint a sentence refers to
- Error codes are described without explicit remediation paths
- Deprecated patterns appear without immediate migration guidance

The Documentation Architect audits documentation against a set of common agent queries, identifies which pages produce the highest rate of agent errors when used as context, and redesigns those pages for dual-audience consumption — preserving human readability while adding the semantic precision that agents require.

#### Skills profile

Technical writing experience + understanding of how RAG systems chunk and embed content + ability to think about documentation as a retrieval corpus rather than a narrative + willingness to instrument and measure documentation performance against agent query accuracy.

---

### The API Experience Designer

**Also known as:** Agent-Native API Strategist, Platform Experience Engineer

**The role in one sentence:** Audits the platform's API surface for agent-parseability and makes the case for agent-native investment — influencing error model design, auth flow simplicity, rate limit calibration, and the availability of machine-readable schemas.

#### The problem they solve

Most APIs are designed for human developers. Error messages are written to be readable. Auth flows are designed for session-based human login. Rate limits are set at levels that prevent abuse by human-speed calling. Response structures are optimized for human comprehension over machine parsing.

AI agents interact with all of this at a fundamentally different speed and with a fundamentally different tolerance for ambiguity. An error message that reads clearly to a human ("Invalid token — please re-authenticate") may be semantically opaque to an agent that needs to map the error to a specific remediation path in generated code. An auth flow designed for human login sessions creates unnecessary complexity for an agent that needs to authenticate programmatically at high frequency. A rate limit calibrated for human-speed calling triggers constantly when an AI agent is making rapid sequential calls during integration testing.

The API Experience Designer sits at the intersection of DevRel and platform engineering. They audit the API surface from the agent's perspective, quantify the Amdahl tax imposed by each human-speed design decision, and make the engineering case for agent-native redesign backed by adoption data and competitive benchmarking.

#### Skills profile

Platform engineering credibility + DevRel orientation + deep understanding of AI agent behavior + ability to translate adoption data into engineering investment arguments. The rarest combination of the three new roles. Often found at the intersection of senior DevRel practitioners who have moved into platform roles, or platform engineers who have spent time in DevRel.

---

### How the roles interact

**[See Diagram: Agent Champion Day-in-the-Life Flow]**

The three roles form a feedback loop. The Agent Champion's monitoring surfaces integration failures. The Documentation Architect for Agent Consumption addresses failures caused by documentation quality. The API Experience Designer addresses failures caused by API surface design. The Agent Champion's metrics validate that the fixes worked.

The loop runs on a weekly cadence for monitoring and maintenance. It runs on a release cadence for API changes. It informs a quarterly product roadmap review for structural investment decisions.

---

### Who fills these roles today

These roles do not yet exist as named positions in most DevRel organizations. The work exists, scattered and unnamed:

The Agent Champion work is being done informally by Developer Advocates who have started "testing how AI tools handle our API." It is underfunded, unmeasured, and treated as a side project.

The Documentation Architect work is being done by technical writers who have started adding "AI-generated example" notes to documentation, without a systematic framework for evaluating whether those examples are actually correct.

The API Experience Designer work is not being done at all in most organizations. The feedback loop from agent integration failures to API design decisions is broken by the organizational distance between DevRel and platform engineering.

Naming these roles is the first step to funding them properly.

---

## 16. Full Page Copy — Measurement Framework

```
title:        Measuring Agent Ecosystem Health
description:  The four-layer Agent Ecosystem Health Dashboard — what to
              measure, how to instrument it, and where to start.
```

---

### Why traditional DevRel metrics are blind

The standard DevRel dashboard tracks human participation: active community members, forum posts per month, event attendance, ambassador program NPS, documentation traffic, support ticket volume. These metrics measure the human community layer accurately.

They tell you nothing about the agent ecosystem layer.

A platform with declining forum activity and flat event attendance may have a thriving agent ecosystem — developers successfully using AI tools to integrate don't need to post questions. A platform with excellent community metrics and a well-attended ambassador program may have a catastrophically degraded agent ecosystem — developers using AI tools encountering systematic failures that never generate support tickets because developers quietly abandon the platform rather than debugging AI-generated code.

The two layers can diverge. In practice, they do diverge. And the divergence is currently invisible to most DevRel programs.

The Agent Ecosystem Health Dashboard is the measurement infrastructure that makes agent ecosystem health visible.

---

### The four measurement layers

**[See Diagram: FAISR Measurement Funnel]**

---

#### Layer 1: Integration quality signals

**First-Attempt Integration Success Rate (FAISR)** is the primary metric. It measures what percentage of integrations generated by AI coding tools — using the platform's published materials as context — produce working code on the first attempt without manual correction.

*Instrumentation approach 1: Controlled test suite (most direct)*

Build a suite of 10–15 canonical integration tasks covering the most common integration paths. For each task, write a standard "median" prompt — not the cleverest prompt, the one a reasonably competent developer would actually type. Run each prompt through each AI tool in scope. Evaluate output against a rubric:

- Does it compile? (automated)
- Does it use current API endpoints? (automated — parse and diff against API spec)
- Does it authenticate correctly? (automated — run against test API instance)
- Does it handle the primary error state? (human review, scored 0–2)
- Is it architecturally sound, or over-engineered? (human review, scored 0–3)

FAISR = percentage of outputs passing binary checks and scoring above threshold on scored checks, on the first attempt. Track as a time series. Run weekly.

*Instrumentation approach 2: API log analysis (continuous signal)*

AI-generated code has characteristic error patterns in API logs that distinguish it statistically from human-authored code:
- Burst errors at session start (failed auth on first call, no successful calls before errors)
- Deprecated endpoint hits in known AI-training patterns
- Burst-429 errors at regular intervals (fixed retry interval generated by AI rather than exponential backoff)

Add three queries to your weekly log review: deprecated endpoint hit rate, burst-401/403 rate at session start, burst-429 rate at regular intervals. Track as time series alongside controlled test results.

*Instrumentation approach 3: Developer survey (self-reported baseline)*

Add two questions to your existing survey instrument:
1. "When you use AI coding tools to integrate with this platform, approximately what percentage of the time does the generated code work without significant manual correction?"
2. "When AI-generated code for this platform doesn't work, what is the most common reason?" (Options: deprecated endpoints, incorrect auth, missing error handling, over-engineered output, unclear documentation, other)

---

#### Layer 2: Documentation effectiveness for agents

**Semantic coverage score:** What percentage of common agent integration queries does the documentation answer directly and unambiguously? Audited against the Agent Champion's test suite queries.

**Documentation drift rate:** Average lag between API changes and documentation updates, measured in days. Target: under 7 days. Above 14 days is an elevated risk condition.

**Documentation-to-failure correlation:** Which documentation pages, when retrieved as agent context, produce the highest rate of integration failures? Tracked by correlating API error clusters with the documentation most recently updated or most frequently linked from developer tooling.

---

#### Layer 3: Recipe ecosystem health

**Recipe coverage:** Percentage of common integration tasks with at least one validated prompt recipe in the library.

**Recipe freshness:** Distribution of days since last update for all published recipes, compared against API change dates. A recipe that hasn't been updated since the last API version change is a liability.

**Recipe adoption rate:** Downloads, links followed, and community sharing of Agent Champion-published recipes.

**MCP adoption tier:** Position on the three-tier scale — not accessible / agent-accessible (MCP wrapper on human-speed API) / agent-native (purpose-built primitives). This is a categorical metric updated with each significant API or tooling release.

---

#### Layer 4: Competitive positioning

**Competitive FAISR benchmark:** Your platform's FAISR score versus competitors', measured on equivalent canonical tasks using the same controlled test methodology. Run quarterly.

**Developer sentiment on AI tool compatibility:** Survey question: "Compared to other platforms you integrate with, how would you rate this platform's compatibility with AI coding tools?" Five-point scale, tracked quarterly.

---

### Starting sequence for teams with no existing instrumentation

**Week 1:** Write the canonical task list (10 tasks, standard prompts). Run manually against two AI tools. Score by hand. This is your baseline.

**Weeks 2–4:** Build automated checks (compile test, endpoint parser, test API runner). Rerun. Compare manual to automated to validate.

**Month 2:** Add the two survey questions to your next developer survey. Add deprecated endpoint hit rate to weekly log review.

**Month 3:** Add burst-error pattern queries to log review. All three approaches are now running at sustainable cadence.

The temptation is to wait until full instrumentation is in place. Don't. The manual controlled test suite from Week 1 already produces more signal about agent ecosystem health than anything in the traditional DevRel dashboard.

---

## 17. Full Page Copy — For DevRel Teams

```
title:        Agentic Developer Relations for DevRel Practitioners
description:  What Agentic Developer Relations means for practicing DevRel professionals —
              five talking points, the objections you'll face, and what to
              do in week one.
```

---

### The crisis you can feel but might not have named

Something has shifted in DevRel, and most practitioners can feel it without being able to name it precisely.

AI tools are flooding every content channel. Documentation that took days to write can be generated in hours. Tutorials that required real technical expertise are being produced by developers who point AI tools at API references. Blog posts, guides, quick starts — the traditional content output of DevRel — are available at a price approaching zero.

This doesn't make DevRel obsolete. But it does change where DevRel's value concentrates. The execution layer is being automated. The judgment layer is not. And a new layer has appeared that most DevRel programs aren't serving at all: the agent ecosystem layer, where AI coding tools either produce correct integrations with a platform or don't — silently, at scale, without generating any of the traditional feedback signals.

Agentic Developer Relations names the work that DevRel needs to do at that layer.

---

### Five talking points for your team and your leadership

**1. Agentic Developer Relations produces a direct causal metric.**

The First-Attempt Integration Success Rate connects DevRel work directly to adoption outcomes. When the Agent Champion program improves FAISR by ten percentage points, you can show that AI-assisted developers are succeeding with the platform at a higher rate. This is not reach, engagement, or pipeline influence. It is a number that directly predicts adoption. The conversation with leadership changes.

**2. The Amdahl Tax argument wins the engineering conversation.**

When the Agent Champion can show that 70% of the time an AI agent spends integrating with the platform is consumed by human-speed tool interactions — and that a competitor has lowered that fraction through agent-native API design — DevRel has an engineering argument backed by measurable data. The feedback loop from agent integration failures to platform improvement has always existed informally. Agentic Developer Relations makes it formal and quantified.

**3. The recipe library is the encoded institutional memory the field has always needed.**

Senior DevRel practitioners carry enormous tacit knowledge. That knowledge walks out the door when they leave. The recipe library, maintained by Agent Champions and versioned alongside the API, encodes that knowledge into compounding institutional capital. It is the DevRel program's accumulated taste, made accessible to every AI tool a developer might use.

**4. Human community patterns become more valuable, not less.**

As AI floods every content channel, the patterns that require genuine human presence — conference sessions, office hours, community events, ambassador relationships — become the scarcest signal in the ecosystem. Agentic Developer Relations doesn't compete with these patterns. It creates a separate layer for agent-specific work, freeing human-facing programs to invest in the things only humans can provide.

**5. The field is splitting, and Agentic Developer Relations names the split.**

DevRel teams everywhere are discovering that some of their work has shifted toward AI-adjacent tasks: maintaining MCP definitions, testing how AI tools handle the platform's API, reviewing AI-generated documentation. This work exists without a name, without a career path, and without measurement frameworks. Agentic Developer Relations names it, structures it, and gives practitioners who are already doing this work a vocabulary and a professional community.

---

### Objections you'll face — and responses

**"We already ship an MCP server."**
MCP makes the platform accessible to agents. It does not make it fast enough for agents — and it does not make it accurate enough. Measure the fraction of integration time that is tool interaction versus model reasoning. Measure the first-attempt success rate. The MCP server is the starting point, not the finish line.

**"We don't have budget for new roles."**
Start with one day per week from an existing practitioner, dedicated explicitly to the Agent Champion monitoring function. The first controlled test suite run will surface findings that justify the investment. Most teams that run the test for the first time discover their FAISR is significantly lower than they assumed.

**"Our developers don't use AI tools that heavily."**
The silent majority is the measurement problem. Developers who use AI tools to integrate and fail don't generate support tickets — they leave. Run one controlled test suite against your top five integration tasks and measure what you find. The number is almost always surprising.

**"This is an engineering problem, not a DevRel problem."**
DevRel has always influenced documentation and integration design. Agentic Developer Relations formalizes that influence and backs it with measurement. The Agent Champion's feedback loop to engineering is the same feedback loop DevRel has always run — with better data.

---

### What to do in week one

No new budget required. No new headcount required. One decision required: designate one practitioner as the responsible owner of agent ecosystem monitoring. Give them one day per week. Ask them to do three things:

1. Write a list of the 10 most common integration tasks developers ask for help with. These are your canonical tasks.

2. For each task, write the median prompt — what a reasonably competent developer would actually type into Copilot or Claude Code. Not the best prompt. The typical one.

3. Run those prompts through two AI tools. Score the outputs using the rubric from the Measurement page. Document the scores.

That's your baseline. You now have more signal about agent ecosystem health than anything in your current dashboard. Everything else — automation, broader tooling, full recipe library — is built on top of this baseline.

---

## 18. Full Page Copy — For Companies

```
title:        Agentic Developer Relations for Organizations Evaluating DevRel Investment
description:  The business case for Agentic Developer Relations — four arguments,
              the competitive data, and the investment tiers.
```

---

### The question under all the others

Every executive evaluating DevRel investment has one question beneath all the others: does DevRel drive revenue?

The traditional answer involves reach, engagement, pipeline influence, and brand sentiment — metrics that are real but notoriously difficult to connect to adoption numbers. DevRel teams have spent years developing increasingly sophisticated attribution models to answer a question that the metrics were never designed to answer directly.

Agentic Developer Relations changes this.

The First-Attempt Integration Success Rate is a metric that directly predicts adoption. Developers who experience successful AI-assisted integrations on the first attempt adopt platforms. Developers who experience systematic AI-generated integration failures choose alternatives — and they do it silently, without generating the support tickets or community posts that would give the company a chance to respond.

Agentic Developer Relations is the practice of measuring and improving that rate. It produces a DevRel program that can answer the executive question with data, not proxies.

---

### The competitive data

A rigorous randomized controlled trial found that experienced software engineers using AI tools in environments not designed for agent consumption were **19% slower** while estimating they were **20% faster**. The same models, at companies that had rebuilt their toolchains for agent-speed consumption, drove pull requests per engineer from **1.36 to 2.9**.

The model wasn't the variable. The environment was.

Your documentation, your API surface, your auth flows, your error model, and your integration examples are the environment for every developer integrating with your platform using AI tools. Agentic Developer Relations is the discipline of managing that environment deliberately.

---

### Four business arguments

**1. Platform selection is shifting to AI-assisted evaluation.**

A technical evaluator choosing between platforms in 2024 ran a proof-of-concept personally. In 2026, they increasingly ask an AI agent to run the proof-of-concept. The platform that produces a working integration in the agent-assisted evaluation wins. This is not a future scenario. It is a current competitive dynamic, and most platforms are not measuring it.

**2. Agent ecosystem failures are invisible until they are catastrophic.**

When an AI tool produces a broken integration, the developer may debug silently, find a workaround, or abandon the platform. They are unlikely to file a support ticket. The signal never reaches the product team. The documentation team doesn't know its documentation is ambiguous. The company's metrics look stable while adoption degrades. Agentic Developer Relations creates the measurement infrastructure that makes this degradation visible before it compounds.

**3. Encoded judgment compounds; talent mobility does not.**

The most valuable asset in a mature DevRel program is accumulated institutional judgment. It currently lives in senior practitioners' heads and walks out the door when they leave. The recipe library maintained by an Agentic Developer Relations program encodes that judgment into versioned, machine-accessible artifacts that compound over time. This is a durable competitive advantage that does not depend on the tenure of specific individuals.

**4. The Amdahl ceiling is a product roadmap argument.**

When the Agent Champion can show that 70% of integration time is consumed by human-speed tool interactions — and a competitor has lowered that fraction through agent-native design — DevRel has produced a product investment argument backed by competitive data. This connects DevRel measurement directly to engineering investment decisions in a way no traditional DevRel program has achieved.

---

### Investment tiers

| Organization | Minimum viable | Full program |
|---|---|---|
| Small (1–5 DevRel) | One practitioner owns Agent Champion function 1 day/week. Manual test suite of 10 tasks. Recipes in docs. | Grow suite + library. Hire dedicated Agent Champion at 20% AI tool adoption threshold. |
| Mid-size (6–15) | Dedicated Agent Champion role, full-time. Automated test suite, 5 AI tools. Versioned recipe library. | Add Documentation Architect. Agentic Hackathon program. Full four-layer dashboard. |
| Large (15+) | Two-track structure: Human Relations + Agent Relations, shared leadership. FAISR and Amdahl ceiling as primary metrics. | API Experience Designer role. Agent-native MCP server. Competitive benchmarking program. Recipe library as published community resource. |

---

### The board metrics

| Metric | What it measures | Why it matters to leadership |
|---|---|---|
| FAISR | First-attempt integration success rate across AI coding tools | Direct predictor of AI-assisted developer adoption |
| Amdahl ceiling | Fraction of integration time consumed by human-speed overhead | Product roadmap argument — quantifies the engineering investment needed to compete |
| Recipe coverage | Percentage of common tasks with a validated AI prompt recipe | Measures completeness of agent ecosystem infrastructure |
| Recipe freshness | Lag between API changes and recipe updates | Measures operational health of the Agentic Developer Relations program |
| Competitive FAISR delta | Your FAISR vs. competitors on equivalent tasks | The board metric — are we winning or losing the AI-assisted developer experience? |

---

### The question to ask

When a developer asks an AI coding tool to integrate with your platform, does it work?

If you don't know the answer, your DevRel program is not measuring the most consequential dimension of your developer experience. Agentic Developer Relations is the discipline that makes the answer knowable — and then systematically improves it.

[Get in touch about speaking or advisory work →]

---

## 19. Full Page Copy — About Chris Woodruff

```
title:        About Chris Woodruff
description:  DevRel practitioner, co-author of Developer Relations Activity
              Patterns, founder of EcoSynt, and the practitioner who coined
              Agentic Developer Relations.
```

---

### Why Agentic Developer Relations, why now

I've spent twenty years at the intersection of developer communities and the platforms they build on. I've been a developer advocate, a community manager, a DevRel leader, and — in the process of writing *Developer Relations Activity Patterns* with Ted Neward, Scott McAllister, and David Neal — one of the practitioners who tried to put the entire field on systematic ground.

When we wrote the book, we documented 37 activity patterns for a field that had been operating on institutional knowledge and instinct for thirty years. The response from the community was what it always is when you name things that people have been experiencing without vocabulary: recognition. This is the thing I've been doing. Now I have a name for it.

Agentic Developer Relations happened the same way. I started noticing that a significant fraction of the questions being asked about developer platform integrations were coming from developers who weren't writing the code themselves — they were asking AI tools to write it, and the AI tools were producing broken integrations. The failures were silent. The documentation was unchanged. The API hadn't changed. But something had changed: the audience.

I named it. I built the framework. And I built this site to make the framework available to the field.

---

### The book

*Developer Relations Activity Patterns: A Unified Approach to DevRel, DX, and Community Management* — co-authored with Ted Neward, Scott McAllister, and David Neal — is the field's first systematic catalog of DevRel activity patterns. Inspired by the Gang of Four's design pattern methodology applied to software development, it documents 37 recurring activities in developer-facing programs, each with intent, context, solution, participants, implementation, metrics, examples, and variants.

Published by Apress in 2026. Available wherever technical books are sold.

[Find the book on Apress →]

---

### EcoSynt

EcoSynt is an agent ecosystem health and observability platform — the infrastructure that makes the Agent Ecosystem Health Dashboard real at production scale. It instruments multi-agent AI systems using OpenTelemetry GenAI semantic conventions, produces AgentScore health metrics, and gives DevRel teams the measurement layer that Agentic Developer Relations requires.

EcoSynt is where I am applying the Agentic Developer Relations framework in practice. It is not the subject of this site — Agentic Developer Relations is — but it is the proof of concept.

[Learn more about EcoSynt →]

---

### Speaking

I speak on Agentic Developer Relations, DevRel evolution in the AI era, agent ecosystem health, and the pattern-based approach to DevRel program design. Recent and upcoming engagements include developer conferences, DevRel community events, and enterprise engineering leadership summits.

If you're building a program on the topic of DevRel in the AI era — a conference track, a corporate training series, a community event — I'd welcome the conversation.

[Speaking inquiry →]

---

### Contact

chris@agenticrelations.dev  
[LinkedIn] · [Twitter/X] · [GitHub]

---

## 20. Essay Series Plan

### Inaugural series: Three essays

These three essays launch the site and establish the intellectual framework. They are designed to be self-contained, shareable, and to function as a discovery mechanism — each one reaching a different segment of the DevRel and platform engineering audience.

---

**Essay 1: Your Developer Community Now Has Members Who Can't Read**

*Subtitle:* Introducing Agentic Developer Relations — the discipline DevRel must develop before it realizes it needed to

*Hook:* "When my co-authors and I documented the 37 activity patterns that make up the practice of Developer Relations, we made an assumption so foundational we never stated it explicitly: the audience is human."

*Argument:* The developer community has bifurcated. AI coding agents are now a meaningful fraction of the entities integrating with developer platforms. DevRel has no framework for serving them. Agentic Developer Relations names and provides that framework.

*Target reader:* DevRel practitioners. The angle is professional identity — this is about what DevRel is becoming, and whether practitioners will shape that becoming or have it happen to them.

*Distribution:* LinkedIn (primary), DevRel.co community, Developer Advocate newsletter circuits.

*Length:* 1,800–2,200 words. Long enough to be substantive, short enough for a LinkedIn read.

---

**Essay 2: The Agent Champion — A Role DevRel Didn't Know It Needed**

*Subtitle:* What happens when you take the agent ecosystem seriously enough to staff it

*Hook:* "Every new discipline in tech produces a role before it produces a name for the role. Somebody was running the company's social media presence before 'Social Media Manager' was a title. The Agent Champion is in that pre-naming phase right now."

*Argument:* The Agent Champion is a specific, definable practitioner role with a specific operating model, distinct from the Developer Advocate. It exists in pieces today. Naming it is the first step to funding it properly.

*Target reader:* DevRel leaders making staffing decisions; practitioners wondering what their role will look like in three years.

*Distribution:* LinkedIn, DevRel podcasts (this essay makes a good episode conversation), conference submissions.

*Length:* 2,000–2,500 words.

---

**Essay 3: The Amdahl Tax on Developer Relations**

*Subtitle:* Why the entire DevRel stack is being rebuilt whether you participate or not

*Hook:* "Here is a finding that should stop every DevRel leader cold. In a rigorous randomized controlled trial, sixteen experienced engineers working on their own repositories with AI tools were 19% slower while estimating they were 20% faster."

*Argument:* The METR and Jellyfish data are not about AI capability — they're about environment. DevRel is the environment for developer integrations. Platforms and programs that rebuild that environment for agent-native consumption will compound advantage over the next three to five years. Those that don't will discover the gap when it's visible in adoption data.

*Target reader:* Platform engineers, engineering leaders, VPs of Developer Experience — the people who make infrastructure investment decisions.

*Distribution:* LinkedIn, Hacker News (the Amdahl angle will resonate), engineering leadership newsletter circuits.

*Length:* 1,800–2,200 words.

---

### Ongoing essay cadence

One essay per month minimum. Suggested topics for months 4–12:

- *The Recipe Library as a New Kind of Documentation* — what it is, how to build it, why it compounds
- *Measuring What Traditional DevRel Metrics Miss* — a deep dive into API log analysis for agent failure detection
- *The Agentic Hackathon: A Pattern Rewrite* — full treatment of how the Hackathon pattern changes
- *MCP Is Not Enough: The Three Tiers of Agent Accessibility* — the agent-accessible vs. agent-native distinction in depth
- *How the Fundamental Triad Extends for the Agent Era* — grounded in the book's framework
- *The Two-Layer Budget Problem: Why You Can't Fund Both Layers from One Line* — the staffing and budget argument
- *What Does Good Documentation Look Like for an AI Agent?* — a practical guide for documentation teams
- *The Competitive FAISR Benchmark: How to Know If You're Winning or Losing*

---

### Newsletter strategy

The newsletter is called *The Agentic Developer Relations Brief*. It publishes when there is something worth saying — approximately twice per month. Each issue contains:

- One original observation or framework fragment (100–300 words)
- One relevant external link with annotation
- One practical action item for practitioners

The newsletter serves as the bridge between essays — keeping the community engaged between major publications, and providing the kind of specific, actionable guidance that makes people open the next issue.

Hosting recommendation: Buttondown (Markdown-native, developer-friendly, reasonable pricing, good Astro integration via API).

---

## Dependencies and package.json

```json
{
  "name": "agentic-relations-site",
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "astro": "^4.x",
    "@astrojs/tailwind": "^5.x",
    "@astrojs/mdx": "^3.x",
    "@astrojs/sitemap": "^3.x",
    "@fontsource/inter": "^5.x",
    "@fontsource/jetbrains-mono": "^5.x",
    "tailwindcss": "^3.x",
    "@tailwindcss/typography": "^0.5.x"
  }
}
```

---

*Document version 1.0 — April 2026*  
*Chris Woodruff — agenticrelations.dev*  
*Grounded in Developer Relations Activity Patterns (Neward, McAllister, Neal, Woodruff, Apress 2026)*  
*See also: EcoSynt — ecosynt.io*
MDEOF