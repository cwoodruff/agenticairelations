#!/usr/bin/env node
// Turns run records into the scorecard measures of the specification.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { mean, pairedDifference, wilson } from './lib/stats.mjs';

const groupBy = (xs, key) => {
  const m = new Map();
  for (const x of xs) {
    const k = key(x);
    if (!m.has(k)) m.set(k, []);
    m.get(k).push(x);
  }
  return m;
};

const sumOrNull = (xs) => (xs.every((x) => x != null) && xs.length ? xs.reduce((a, b) => a + b, 0) : null);

function completion(runs) {
  const passes = runs.filter((r) => r.passed && r.interventions === 0).length;
  const out = {
    runs: runs.length,
    tasks: new Set(runs.map((r) => r.task)).size,
    faisr: wilson(passes, runs.length),
    // Diagnostic only. Never a completion rate and never used for cost.
    partial_credit: mean(runs.map((r) => r.required_share ?? 0)),
    optional_graders: {},
    cost: {},
  };
  for (const [id, gs] of groupBy(
    runs.flatMap((r) => (r.graders ?? []).filter((g) => !g.required)),
    (g) => g.id,
  )) {
    out.optional_graders[id] = wilson(gs.filter((g) => g.pass).length, gs.length);
  }
  // Cost covers every run, failures included.
  for (const field of ['wall_seconds', 'turns', 'tokens', 'cost_usd']) {
    const total = sumOrNull(runs.map((r) => r[field] ?? null));
    out.cost[field] = {
      per_run: total == null ? null : total / runs.length,
      per_success: total == null || passes === 0 ? null : total / passes,
    };
  }
  return out;
}

function selection(runs, platform) {
  const n = runs.length;
  const count = (label) => runs.filter((r) => r.selection === label).length;
  const labels = {};
  for (const [label, rs] of groupBy(runs, (r) => r.selection ?? 'unclassified')) labels[label] = rs.length;
  return {
    runs: n,
    tasks: new Set(runs.map((r) => r.task)).size,
    platform,
    selection_rate: platform ? wilson(count(platform), n) : null,
    build_own_rate: wilson(count('build-own'), n),
    choices: labels,
  };
}

function lift(runs) {
  const diffs = [];
  for (const [, rs] of groupBy(runs, (r) => r.task)) {
    const rate = (arm) => {
      const a = rs.filter((r) => r.arm === arm);
      return a.length ? a.filter((r) => r.passed).length / a.length : null;
    };
    const w = rate('with');
    const wo = rate('without');
    if (w != null && wo != null) diffs.push(w - wo);
  }
  return pairedDifference(diffs);
}

export function buildReport(records, { platform = null } = {}) {
  const report = { generated: new Date().toISOString(), suites: [...new Set(records.map((r) => `${r.suite}@${r.suite_version}`))], agents: [] };
  // Agents are never pooled.
  for (const [, rs] of groupBy(records, (r) => r.agent.id)) {
    const entry = { agent: rs[0].agent, arms: {} };
    for (const [arm, armRuns] of groupBy(rs, (r) => r.arm)) {
      const graded = armRuns.filter((r) => r.stage !== 'select');
      const select = armRuns.filter((r) => r.stage === 'select');
      entry.arms[arm] = {
        completion: graded.length ? completion(graded) : null,
        selection: select.length ? selection(select, platform) : null,
      };
    }
    const graded = rs.filter((r) => r.stage !== 'select');
    if (entry.arms.with && entry.arms.without && graded.length) entry.artifact_lift = lift(graded);
    report.agents.push(entry);
  }
  return report;
}

const pct = (x) => (x == null ? 'n/a' : `${(100 * x).toFixed(1)}%`);
const pts = (x) => (x == null ? 'n/a' : `${(100 * x).toFixed(1)}`);
const rate = (w) => (w?.rate == null ? 'n/a' : `${pct(w.rate)} (95% interval ${pct(w.low)} to ${pct(w.high)}, n=${w.n})`);
const num = (x, d = 1) => (x == null ? 'not reported' : x.toFixed(d));

export function toMarkdown(report) {
  const L = [`# Scorecard report`, '', `Generated ${report.generated}. Suite: ${report.suites.join(', ')}.`, ''];
  L.push(
    'Intervals are 95% Wilson intervals that treat runs as independent. Runs repeat the same tasks, so real uncertainty is wider, and results describe this suite, not all possible tasks.',
    '',
  );
  for (const a of report.agents) {
    const ag = a.agent;
    L.push(`## ${ag.id}`, '', `Model: ${ag.model}. Harness: ${ag.harness}${ag.version ? ` ${ag.version}` : ''}. Permission mode: ${ag.permission_mode ?? 'not stated'}.`, '');
    for (const [arm, m] of Object.entries(a.arms)) {
      if (Object.keys(a.arms).length > 1) L.push(`### Arm: ${arm} artifact`, '');
      if (m.selection) {
        const s = m.selection;
        L.push(`**Selection** (${s.runs} runs, ${s.tasks} tasks)`, '');
        if (s.selection_rate) L.push(`- Selection rate for \`${s.platform}\`: ${rate(s.selection_rate)}`);
        L.push(`- Built its own: ${rate(s.build_own_rate)}`);
        L.push(`- Choices: ${Object.entries(s.choices).map(([k, v]) => `${k} ${v}`).join(', ')}`, '');
      }
      if (m.completion) {
        const c = m.completion;
        L.push(`**Completion** (${c.runs} runs, ${c.tasks} tasks, no human interventions)`, '');
        L.push(`- FAISR: ${rate(c.faisr)}`);
        L.push(`- Partial credit (diagnostic; mean share of required graders passed): ${pct(c.partial_credit)}`);
        for (const [id, w] of Object.entries(c.optional_graders)) L.push(`- Optional grader \`${id}\`: ${rate(w)}`);
        L.push('', '**Cost** (all runs, failures included)', '');
        L.push(`- Wall-clock seconds: ${num(c.cost.wall_seconds.per_run, 2)} per run, ${num(c.cost.wall_seconds.per_success, 2)} per success`);
        L.push(`- Turns: ${num(c.cost.turns.per_run)} per run, ${num(c.cost.turns.per_success)} per success`);
        L.push(`- Tokens: ${num(c.cost.tokens.per_run, 0)} per run, ${num(c.cost.tokens.per_success, 0)} per success`, '');
      }
    }
    if (a.artifact_lift) {
      const l = a.artifact_lift;
      const interval = l.low == null ? 'no interval with one task' : `95% interval ${pts(l.low)} to ${pts(l.high)}`;
      L.push(`**Artifact lift on completion**, paired by task: ${l.diff >= 0 ? '+' : ''}${pts(l.diff)} percentage points (${interval}, ${l.n} tasks)`, '');
      if (l.n < 10) L.push(`With ${l.n} tasks this interval is a rough guide only.`, '');
      if (l.low != null && l.low <= 0 && l.high >= 0) L.push('The interval includes zero: the result is inconclusive, which is not the same as no effect.', '');
    }
  }
  return L.join('\n');
}

async function main() {
  const { values } = parseArgs({
    options: { in: { type: 'string', default: 'results/runs.jsonl' }, platform: { type: 'string' }, json: { type: 'string' }, md: { type: 'string' } },
  });
  const records = (await readFile(values.in, 'utf8')).split('\n').filter(Boolean).map((l) => JSON.parse(l));
  const report = buildReport(records, { platform: values.platform ?? null });
  const md = toMarkdown(report);
  if (values.json) await writeFile(values.json, JSON.stringify(report, null, 2));
  if (values.md) await writeFile(values.md, md);
  console.log(md);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err.message ?? err);
    process.exit(1);
  });
}
