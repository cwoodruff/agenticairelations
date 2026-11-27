// Keyword classifier for the example. A real suite needs something sturdier,
// and should spot-check its classifier against hand labels.
import { readFileSync } from 'node:fs';
const text = readFileSync(process.env.ADR_AGENT_OUTPUT_FILE, 'utf8').toLowerCase();
const first = [
  ['tally', /\btally\b/],
  ['build-own', /\b(build|write|roll) (it|your own|my own|a custom)|custom (table|solution)/],
  ['countly', /\bcountly\b/],
]
  .map(([label, re]) => [label, text.search(re)])
  .filter(([, i]) => i >= 0)
  .sort((a, b) => a[1] - b[1])[0];
console.log(first ? first[0] : 'unclassified');
