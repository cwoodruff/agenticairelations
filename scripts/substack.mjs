#!/usr/bin/env node
// Writes a paste-ready copy of each essay to docs/substack/.
// Usage: node scripts/substack.mjs [--since YYYY-MM-DD]
import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'yaml';

const SITE = 'https://agenticairelations.com';
const SRC = 'src/content/essays';
const OUT = 'docs/substack';
const sinceArg = process.argv.indexOf('--since');
const since = sinceArg >= 0 ? process.argv[sinceArg + 1] : '0000-00-00';

await mkdir(OUT, { recursive: true });
const index = [];
for (const file of (await readdir(SRC)).filter((f) => f.endsWith('.mdx')).sort()) {
  const raw = await readFile(path.join(SRC, file), 'utf8');
  const [, front, body] = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  const meta = parse(front);
  if (meta.draft) continue;
  const slug = file.replace(/\.mdx$/, '');
  const url = `${SITE}/essays/${slug}/`;
  const date = new Date(meta.publishDate).toISOString().slice(0, 10);
  if (date < since) continue;

  const text = body
    .trim()
    // Substack keeps single line breaks, so join hard-wrapped lines.
    .split(/\n{2,}/)
    .map((block) => (/^(\s*[-*] |\s*\d+\. |#|---$)/m.test(block) ? joinListItems(block) : block.replace(/\s*\n\s*/g, ' ')))
    .join('\n\n')
    // Site-relative links become absolute.
    .replace(/\]\(\/(?!\/)/g, `](${SITE}/`);

  const doc = [
    '<!--',
    `Title:        ${meta.title}`,
    `Subtitle:     ${meta.subtitle ?? ''}`,
    `Email preview: ${meta.description}`,
    `Publish on:   ${date}`,
    `Canonical URL: ${url}   (Substack: Settings for the post > SEO > Canonical URL)`,
    `Tags:         ${(meta.tags ?? []).join(', ')}`,
    'Everything below this comment is the post body.',
    '-->',
    '',
    text,
    '',
    '---',
    '',
    `*This essay first appeared at [agenticairelations.com](${url}). The measurement specification and harness it refers to are open: [github.com/cwoodruff/agenticairelations](https://github.com/cwoodruff/agenticairelations).*`,
    '',
  ].join('\n');
  await writeFile(path.join(OUT, `${date}-${slug}.md`), doc);
  index.push({ date, title: meta.title, file: `${date}-${slug}.md` });
}

function joinListItems(block) {
  // Keep one list item or heading per line; join its wrapped continuation lines.
  return block
    .split('\n')
    .reduce((lines, line) => {
      if (/^(\s*[-*] |\s*\d+\. |#|---$)/.test(line) || !lines.length) lines.push(line.trimEnd());
      else lines[lines.length - 1] += ` ${line.trim()}`;
      return lines;
    }, [])
    .join('\n');
}

index.sort((a, b) => a.date.localeCompare(b.date));
console.log(index.map((i) => `${i.date}  ${i.file}`).join('\n'));
