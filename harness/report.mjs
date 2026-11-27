#!/usr/bin/env node
// Turns run records into the scorecard measures of the specification.
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { mean, pairedDifference, wilson } from './lib/stats.mjs';

const COST_FIELDS = ['wall_seconds', 'turns', 'tokens', 'cost_usd'];

const groupBy = (xs, key) => {
  const m = new Map();
  for (const x of xs) {
    const k = key(x);
    if (!m.has(k)) m.set(k, []);
    m.get(k).push(x);
  }
  return m;
};

const sumOrNull = (xs) => (xs.length && xs.every((x) => x != null) ? xs.reduce((a, b) => a + b, 0) : null);

function completion(runs) {
  const passes = runs.filter((r) => r.passed && r.interventions === 0).length;
  const out = {
    runs: runs.length,
    tasks: new Set(runs.map((r) => r.task)).size,
    faisr: wilson(passes, runs.length),
    // Diagnostic only. Never a completion rate and never used for cost.
    partial_credit: mean(runs.map((r) => r.required_share ?? 0)),
    timed_out: runs.filter((r) => r.timed_out).length,
    agent_nonzero_exit: runs.filter((r) => !r.timed_out && r.agent_exit_code !== 0).length,
    optional_graders: {},
    cost: {},
  };
  for (const [id, gs] of groupBy(
    runs.flatMap((r) => (r.graders ?? []).filter((g) => !g.required)),
    (g) => g.id,
  )) {
    out.optional_graders[id] = wilson(gs.filter((g) => g.pass).length, gs.length);
  }
  // Cost covers every graded run, failures included.
  for (const field of COST_FIELDS) {
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
  const choices = {};
  for (const [label, rs] of groupBy(runs, (r) => r.selection)) choices[label] = rs.length;
  return {
    runs: n,
    tasks: new Set(runs.map((r) => r.task)).size,
    platform,
    selection_rate: platform ? wilson(count(platform), n) : null,
    build_own_rate: wilson(count('build-own'), n),
    choices,
  };
}

/** Paired by task: mean of (with minus without) for one per-run metric. */
function lift(runs, metric) {
  const diffs = [];
  for (const [, rs] of groupBy(runs, (r) => r.task)) {
    const armMean = (arm) => {
      const xs = rs.filter((r) => r.arm === arm).map(metric);
      return xs.length && xs.every((x) => x != null) ? mean(xs) : null;
    };
    const w = armMean('with');
    const wo = armMean('without');
    if (w != null && wo != null) diffs.push(w - wo);
  }
  return pairedDifference(diffs);
}

const range = (xs) => {
  const sorted = [...xs].sort();
  return sorted.length ? [sorted[0], sorted[sorted.length - 1]] : [null, null];
};

export function buildReport(records, { platform = null } = {}) {
  if (!records.length) throw new Error('No run records to report on.');
  const report = { generated: new Date().toISOString(), agents: [] };
  // Agents are never pooled: a different model, tool, version, permission
  // mode or suite version is a different entry.
  const key = (r) =>
    JSON.stringify([r.agent.id, r.agent.model, r.agent.harness, r.agent.version, r.agent.permission_mode, r.suite, r.suite_version]);
  for (const [, rs] of groupBy(records, key)) {
    const ok = rs.filter((r) => !r.error);
    const repsPerCell = [...groupBy(rs, (r) => `${r.task}|${r.arm}`).values()].map((x) => x.length);
    const entry = {
      agent: rs[0].agent,
      suite: `${rs[0].suite}@${rs[0].suite_version}`,
      run_dates: range(rs.map((r) => r.started).filter(Boolean)),
      tasks: new Set(rs.map((r) => r.task)).size,
      reps: [Math.min(...repsPerCell), Math.max(...repsPerCell)],
      budgets: [...new Set(rs.map((r) => JSON.stringify(r.budget ?? null)))].map((b) => JSON.parse(b)),
      interventions_allowed: 0,
      errors: rs.filter((r) => r.error).map((r) => ({ task: r.task, arm: r.arm, rep: r.rep, error: r.error })),
      teardown_errors: rs.filter((r) => r.teardown_error).length,
      arms: {},
    };
    for (const [arm, armRuns] of groupBy(ok, (r) => r.arm)) {
      const graded = armRuns.filter((r) => r.stage !== 'select');
      const select = armRuns.filter((r) => r.stage === 'select');
      entry.arms[arm] = {
        completion: graded.length ? completion(graded) : null,
        selection: select.length ? selection(select, platform) : null,
      };
    }
    const graded = ok.filter((r) => r.stage !== 'select');
    if (entry.arms.with && entry.arms.without && graded.length) {
      entry.artifact_lift = {
        completion: lift(graded, (r) => (r.passed ? 1 : 0)),
        wall_seconds: lift(graded, (r) => r.wall_seconds ?? null),
        tokens: lift(graded, (r) => r.tokens ?? null),
      };
    }
    report.agents.push(entry);
  }
  return report;
}

const pct = (x) => (x == null ? 'n/a' : `${(100 * x).toFixed(1)}%`);
const rate = (w) => (w?.rate == null ? 'n/a' : `${pct(w.rate)} (95% interval ${pct(w.low)} to ${pct(w.high)}, n=${w.n})`);
const num = (x, d = 1) => (x == null ? 'not reported' : x.toFixed(d));
const signed = (x, d) => `${x >= 0 ? '+' : ''}${x.toFixed(d)}`;

function liftLine(label, l, scale, digits, unit) {
  if (l.diff == null) return null;
  const head = `- ${label}: ${signed(l.diff * scale, digits)} ${unit}`;
  if (l.low == null) return `${head} (${l.n} tasks; no interval: ${l.reason})`;
  const inconclusive = l.low <= 0 && l.high >= 0 ? ' The interval includes zero: inconclusive, which is not the same as no effect.' : '';
  return `${head} (95% interval ${signed(l.low * scale, digits)} to ${signed(l.high * scale, digits)}, ${l.n} tasks).${inconclusive}`;
}

export function toMarkdown(report) {
  const L = ['# Scorecard report', '', `Report generated ${report.generated}.`, ''];
  L.push(
    'Rates carry 95% Wilson intervals that treat runs as independent. Runs repeat the same tasks, so real uncertainty is wider, and results describe this suite, not all possible tasks. Cost figures are means with no interval.',
    '',
  );
  for (const a of report.agents) {
    const ag = a.agent;
    L.push(`## ${ag.id}`, '');
    L.push(`- Model: ${ag.model}. Tool: ${ag.harness} ${ag.version}. Permission mode: ${ag.permission_mode}.`);
    L.push(`- Suite: ${a.suite}, ${a.tasks} tasks. Runs from ${a.run_dates[0]} to ${a.run_dates[1]}.`);
    L.push(`- Repetitions per task and arm: ${a.reps[0] === a.reps[1] ? a.reps[0] : `${a.reps[0]} to ${a.reps[1]}`}.`);
    L.push(`- Budgets: ${a.budgets.map((b) => (b ? `${b.max_minutes} minutes, ${b.max_turns ?? 'no'} turn limit (turn limit not enforced by the harness)` : 'not recorded')).join('; ')}.`);
    L.push('- Grading rule: a run passes only if every required grader passes within the time budget. Human interventions allowed: 0, so completion is FAISR.');
    if (ag.share_home) L.push('- The agent used the real home directory. Session and memory isolation between runs was not enforced by the harness.');
    if (a.reps[0] < 2) L.push('- **Below the specification:** one or more tasks were run only once (section 5 requires repetition).');
    L.push('');
    if (a.errors.length) {
      L.push(`**${a.errors.length} run(s) had infrastructure errors and are excluded from every figure below.**`, '');
      for (const e of a.errors.slice(0, 10)) L.push(`- ${e.task}, ${e.arm}, rep ${e.rep}: ${e.error}`);
      if (a.errors.length > 10) L.push(`- and ${a.errors.length - 10} more`);
      L.push('');
    }
    if (a.teardown_errors) L.push(`**${a.teardown_errors} run(s) had a failed teardown.** State may have leaked into later runs.`, '');
    const multi = Object.keys(a.arms).length > 1;
    for (const [arm, m] of Object.entries(a.arms)) {
      if (multi) L.push(`### Arm: ${arm} artifact`, '');
      if (m.selection) {
        const s = m.selection;
        L.push(`**Selection** (${s.runs} runs, ${s.tasks} tasks)`, '');
        if (s.selection_rate) L.push(`- Selection rate for \`${s.platform}\`: ${rate(s.selection_rate)}`);
        L.push(`- Built its own: ${rate(s.build_own_rate)}`);
        L.push(`- Choices: ${Object.entries(s.choices).map(([k, v]) => `${k} ${v}`).join(', ')}`, '');
      }
      if (m.completion) {
        const c = m.completion;
        L.push(`**Completion** (${c.runs} runs, ${c.tasks} tasks)`, '');
        L.push(`- FAISR: ${rate(c.faisr)}`);
        L.push(`- Partial credit (diagnostic; mean share of required graders passed): ${pct(c.partial_credit)}`);
        for (const [id, w] of Object.entries(c.optional_graders)) L.push(`- Optional grader \`${id}\`: ${rate(w)}`);
        if (c.timed_out) L.push(`- Runs stopped at the time budget: ${c.timed_out}`);
        if (c.agent_nonzero_exit) L.push(`- Runs where the agent exited with an error code: ${c.agent_nonzero_exit}. Check these are not a setup problem.`);
        L.push('', '**Cost** (all graded runs, failures included)', '');
        L.push(`- Wall-clock seconds: ${num(c.cost.wall_seconds.per_run, 2)} per run, ${num(c.cost.wall_seconds.per_success, 2)} per success`);
        L.push(`- Turns: ${num(c.cost.turns.per_run)} per run, ${num(c.cost.turns.per_success)} per success`);
        L.push(`- Tokens: ${num(c.cost.tokens.per_run, 0)} per run, ${num(c.cost.tokens.per_success, 0)} per success`);
        L.push(`- Money (USD): ${num(c.cost.cost_usd.per_run, 4)} per run, ${num(c.cost.cost_usd.per_success, 4)} per success`, '');
      }
    }
    if (a.artifact_lift) {
      const lines = [
        liftLine('Completion', a.artifact_lift.completion, 100, 1, 'percentage points'),
        liftLine('Wall-clock time per run', a.artifact_lift.wall_seconds, 1, 2, 'seconds'),
        liftLine('Tokens per run', a.artifact_lift.tokens, 1, 0, 'tokens'),
      ].filter(Boolean);
      L.push('**Artifact lift** (with minus without, paired by task; judge the artifact on the measure that matches its purpose)', '', ...lines, '');
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
