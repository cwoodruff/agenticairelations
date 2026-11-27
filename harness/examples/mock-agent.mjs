#!/usr/bin/env node
// A stand-in for a coding agent, for demonstrating and testing the harness.
// It is NOT an agent and its results mean nothing. With probability --skill it
// copies the task's reference solution; otherwise it writes a plausible wrong
// answer. Guidance in the working directory raises the probability, so the
// artifact-lift path can be exercised. Outcomes are deterministic per ADR_SEED.
import { cp, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';

const arg = (name, fallback) => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? Number(process.argv[i + 1]) : fallback;
};
const skill = arg('skill', 0.5);
const boost = arg('guidance-boost', 0.3);
const pick = arg('pick', 0.4);

const roll = (salt) =>
  createHash('sha256').update(`${process.env.ADR_SEED}|${salt}`).digest().readUInt32BE(0) / 2 ** 32;

const task = process.env.ADR_TASK_ID;
const taskDir = process.env.ADR_TASK_DIR;
const hasGuidance = existsSync('AGENTS.md');
const turns = 3 + Math.floor(roll('turns') * 6);
await writeFile(process.env.ADR_METRICS_FILE, JSON.stringify({ turns, tokens: turns * 1500 }));

const solution = path.join(taskDir, 'solution');
if (!existsSync(solution)) {
  // A selection task: answer in prose.
  const r = roll('pick');
  const p = Math.min(1, pick + (hasGuidance ? boost : 0));
  if (r < p) console.log('Use Tally. It records events and lets you export them.');
  else if (r < p + (1 - p) / 2) console.log('I would build it yourself: write a custom table and a small export script.');
  else console.log('Use Countly. It is a common choice for product analytics.');
} else if (roll('solve') < Math.min(1, skill + (hasGuidance ? boost : 0))) {
  await cp(solution, '.', { recursive: true });
  console.log(`Implemented ${task}.`);
} else if (task === 'track-signup') {
  await writeFile('src/track.mjs', "export async function trackSignup(client, userId) {\n  return client.record('signup', { userId });\n}\n");
  console.log('Implemented trackSignup.');
} else {
  await writeFile('src/export.mjs', 'export async function allEvents(client) {\n  return (await client.list()).data;\n}\n');
  console.log('Implemented allEvents.');
}
