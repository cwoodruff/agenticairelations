// Local Astro integration: after the static build, write a markdown copy of
// every HTML page plus an llms.txt index, so AI agents can read the site
// without parsing its HTML.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { parse } from 'node-html-parser';
import TurndownService from 'turndown';
import { gfm } from 'turndown-plugin-gfm';

const SKIP = new Set(['404.html']);

const clean = (s) => (s ?? '').replace(/\s+/g, ' ').trim();
const sentence = (s) => (/[.!?]$/.test(s) ? s : `${s}.`);
const escapeHtml = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

async function findHtml(dir, rel = '') {
  const out = [];
  for (const entry of await readdir(path.join(dir, rel), { withFileTypes: true })) {
    const p = path.posix.join(rel, entry.name);
    if (entry.isDirectory()) out.push(...(await findHtml(dir, p)));
    else if (entry.name.endsWith('.html') && !SKIP.has(p)) out.push(p);
  }
  return out;
}

function createTurndown() {
  const td = new TurndownService({
    headingStyle: 'atx',
    hr: '---',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    emDelimiter: '*',
  });
  td.use(gfm);
  // Table cells must stay on one line and must not contain bare pipes.
  td.addRule('tableCellInline', {
    filter: ['th', 'td'],
    replacement(content, node) {
      const text = clean(content).replace(/\|/g, '\\|');
      const first = !node.previousElementSibling;
      return `${first ? '| ' : ' '}${text} |`;
    },
  });
  return td;
}

// A diagram's text labels are meaningless out of position, so each SVG is
// replaced by its <title>/<desc>. Decorative SVGs (no title) are dropped.
function replaceSvgs(root) {
  for (const svg of root.querySelectorAll('svg')) {
    const title = clean(svg.querySelector('title')?.text);
    const desc = clean(svg.querySelector('desc')?.text);
    const label = [title, desc].filter(Boolean).map(sentence).join(' ');
    if (label) svg.replaceWith(`<p><em>Diagram: ${escapeHtml(label)}</em></p>`);
    else svg.remove();
  }
}

// Card-style links wrap headings and paragraphs, which markdown link syntax
// cannot express. Move the link onto the card's heading, or flatten to text.
function unwrapBlockLinks(root) {
  const BLOCK = 'h1, h2, h3, h4, h5, h6, p, div, ul, ol, table, figure, section, article';
  for (const a of root.querySelectorAll('a[href]')) {
    if (!a.querySelector(BLOCK)) continue;
    const heading = a.querySelector('h1, h2, h3, h4, h5, h6');
    if (heading) {
      const link = `<a href="${escapeHtml(a.getAttribute('href')).replace(/"/g, '&quot;')}">`;
      heading.innerHTML = `${link}${heading.innerHTML}</a>`;
      a.replaceWith(`<div>${a.innerHTML}</div>`);
    } else {
      a.textContent = clean(a.text);
    }
  }
}

// A block made only of sibling <span>s is a row of visual "chips"; as plain
// text the labels would run together, so emit them as a list.
function chipsToLists(root) {
  for (const el of root.querySelectorAll('div')) {
    const kids = el.childNodes.filter((n) => n.nodeType === 1);
    const looseText = el.childNodes.some((n) => n.nodeType === 3 && clean(n.text));
    if (kids.length < 3 || looseText || kids.some((k) => k.rawTagName !== 'span')) continue;
    el.innerHTML = `<ul>${kids.map((k) => `<li>${k.innerHTML}</li>`).join('')}</ul>`;
  }
}

function absolutize(root, pageUrl) {
  for (const [selector, attr] of [['a[href]', 'href'], ['img[src]', 'src']]) {
    for (const el of root.querySelectorAll(selector)) {
      try {
        el.setAttribute(attr, new URL(el.getAttribute(attr), pageUrl).href);
      } catch {
        // leave unparseable URLs untouched
      }
    }
  }
}

function readPage(html, pageUrl, siteName) {
  const doc = parse(html);
  const meta = (sel) => clean(doc.querySelector(sel)?.getAttribute('content'));
  const fullTitle = clean(doc.querySelector('title')?.text);
  const name = siteName || meta('meta[property="og:site_name"]');
  const suffix = name ? ` — ${name}` : '';
  const title =
    suffix && fullTitle.endsWith(suffix) ? fullTitle.slice(0, -suffix.length) : fullTitle;

  const main = doc.querySelector('main') ?? doc.querySelector('article') ?? doc.querySelector('body');
  // Not a content page: no container (e.g. a site-verification file copied
  // from public/) or a redirect stub.
  if (!main || doc.querySelector('meta[http-equiv="refresh" i]')) return null;
  main.querySelectorAll('script, style, noscript, template, nav').forEach((el) => el.remove());
  replaceSvgs(main);
  // Purely decorative wrappers; aria-hidden elements that carry text
  // (separators, arrows) are kept so adjacent words do not run together.
  main
    .querySelectorAll('[aria-hidden="true"]')
    .forEach((el) => !clean(el.text) && el.remove());
  absolutize(main, pageUrl);
  unwrapBlockLinks(main);
  chipsToLists(main);

  // Pages put an eyebrow label before the <h1>; lift the heading so the file
  // always opens with exactly one H1.
  const h1 = main.querySelector('h1');
  const heading = clean(h1?.text) || title;
  h1?.remove();

  return {
    title,
    heading,
    description: meta('meta[name="description"]'),
    siteName: name,
    published: doc.querySelector('main time[datetime]')?.getAttribute('datetime') ?? '',
    navLinks: doc.querySelectorAll('nav a[href]').map((a) => a.getAttribute('href')),
    bodyHtml: main.innerHTML,
  };
}

function toMarkdown(td, page, pageUrl) {
  const body = td
    .turndown(page.bodyHtml)
    .replace(/[ \t]+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return `# ${page.heading}\n\nSource: ${pageUrl}\n\n${body}\n`;
}

function buildLlmsTxt(pages) {
  const home = pages.find((p) => p.route === '/') ?? pages[0];
  const navOrder = [...new Set(home.navLinks)];
  const rank = (p) => {
    if (p.route === '/') return -1;
    const i = navOrder.indexOf(p.route);
    return i === -1 ? navOrder.length : i;
  };
  const isEssay = (p) => p.route.startsWith('/essays/');
  const general = pages
    .filter((p) => !isEssay(p))
    .sort((a, b) => rank(a) - rank(b) || a.route.localeCompare(b.route));
  // Essay index first, then newest essay first.
  const essays = pages
    .filter(isEssay)
    .sort(
      (a, b) =>
        (a.route === '/essays/' ? 0 : 1) - (b.route === '/essays/' ? 0 : 1) ||
        b.published.localeCompare(a.published) ||
        a.route.localeCompare(b.route),
    );

  const item = (p) =>
    `- [${p.title.replace(/([\[\]])/g, '\\$1')}](${p.mdUrl})${p.description ? `: ${p.description}` : ''}`;
  const lines = [`# ${home.siteName || home.title}`, ''];
  if (home.description) lines.push(`> ${home.description}`, '');
  lines.push(
    'Every page on this site is also published as markdown: append `index.md` to a page URL, or replace its trailing slash with `.md`.',
    '',
  );
  if (general.length) lines.push('## Pages', '', ...general.map(item), '');
  if (essays.length) lines.push('## Essays', '', ...essays.map(item), '');
  return lines.join('\n');
}

export default function agentReadable() {
  let siteRoot;
  return {
    name: 'agent-readable',
    hooks: {
      'astro:config:done': ({ config }) => {
        if (config.site) siteRoot = new URL(config.base || '/', config.site);
      },
      'astro:build:done': async ({ dir, logger }) => {
        if (!siteRoot) {
          logger.warn('`site` is not set in astro.config; skipping markdown and llms.txt output.');
          return;
        }
        if (!siteRoot.pathname.endsWith('/')) siteRoot.pathname += '/';
        const dist = fileURLToPath(dir);
        const td = createTurndown();
        const pages = [];

        for (const file of (await findHtml(dist)).sort()) {
          // "about/index.html" -> "about/", "index.html" -> "", "x.html" -> "x"
          const rel = file.endsWith('index.html')
            ? file.slice(0, -'index.html'.length)
            : file.slice(0, -'.html'.length);
          const pageUrl = new URL(rel, siteRoot);
          const page = readPage(await readFile(path.join(dist, file), 'utf8'), pageUrl);
          if (!page) {
            logger.warn(`Skipping ${file}: no page content to convert.`);
            continue;
          }
          const markdown = toMarkdown(td, page, pageUrl.href);

          const targets = [];
          if (rel === '' || rel.endsWith('/')) {
            targets.push(`${rel}index.md`);
            if (rel) targets.push(`${rel.slice(0, -1)}.md`);
          } else {
            targets.push(`${rel}.md`);
          }
          await Promise.all(targets.map((t) => writeFile(path.join(dist, t), markdown)));

          pages.push({
            ...page,
            route: pageUrl.pathname.slice(siteRoot.pathname.length - 1),
            mdUrl: new URL(targets[0], siteRoot).href,
          });
        }

        if (!pages.length) return;
        await writeFile(path.join(dist, 'llms.txt'), buildLlmsTxt(pages));
        logger.info(`Wrote markdown for ${pages.length} pages and llms.txt`);
      },
    },
  };
}
