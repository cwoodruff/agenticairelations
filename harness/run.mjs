#!/usr/bin/env node
// Reference runner for the Agentic Developer Relations measurement specification.
// Runs each task against each agent, repeated, from a fresh copy of the task's
// starting state, then grades the result. Writes one JSON record per run.
import { spawn } from 'node:child_process';
import { appendFile, cp, mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { loadSuite } from './lib/suite.mjs';

const HARNESS_DIR = path.dirname(fileURLToPath(import.meta.url));

function exec(command, args, { cwd, env, timeoutMs, shell = false }) {
  return new Promise((resolve) => {
    const started = Date.now();
    const child = spawn(command, args, { cwd, env, shell, stdio: ['ignore', 'pipe', 'pipe'] });
    let stdout = '';
    let stderr = '';
    let timedOut = false;
    const timer = timeoutMs
      ? setTimeout(() => {
          timedOut = true;
          child.kill('SIGKILL');
        }, timeoutMs)
      : null;
    child.stdout.on('data', (d) => (stdout += d));
    child.stderr.on('data', (d) => (stderr += d));
    child.on('error', (err) => {
      if (timer) clearTimeout(timer);
      resolve({ code: null, stdout, stderr: String(err), timedOut, seconds: (Date.now() - started) / 1000 });
    });
    child.on('close', (code) => {
      if (timer) clearTimeout(timer);
      resolve({ code, stdout, stderr, timedOut, seconds: (Date.now() - started) / 1000 });
    });
  });
}

const sh = (script, opts) => exec(script, [], { ...opts, shell: true });

export async function runOnce({ suite, task, agent, arm, artifactDir, rep, keep }) {
  // A fresh directory and a fresh agent process for every run: no code,
  // files or conversation state carry over between runs or between arms.
  const workdir = await mkdtemp(path.join(os.tmpdir(), `adr-${task.id}-`));
  const scratch = await mkdtemp(path.join(os.tmpdir(), 'adr-meta-'));
  const promptFile = path.join(scratch, 'prompt.txt');
  const metricsFile = path.join(scratch, 'metrics.json');
  const outputFile = path.join(scratch, 'agent-output.txt');
  const env = {
    ...process.env,
    ADR_TASK_ID: task.id,
    ADR_TASK_DIR: task.dir,
    ADR_WORKDIR: workdir,
    ADR_PROMPT_FILE: promptFile,
    ADR_METRICS_FILE: metricsFile,
    ADR_AGENT_OUTPUT_FILE: outputFile,
    ADR_MAX_TURNS: task.budget.max_turns == null ? '' : String(task.budget.max_turns),
    ADR_SEED: `${task.id}|${agent.id}|${arm}|${rep}`,
  };
  const record = {
    suite: suite.id,
    suite_version: suite.version,
    task: task.id,
    stage: task.stage,
    agent: {
      id: agent.id,
      model: agent.model,
      harness: agent.harness,
      version: agent.version ?? null,
      permission_mode: agent.permission_mode ?? null,
    },
    arm,
    rep,
    started: new Date().toISOString(),
    budget: task.budget,
    interventions: 0,
  };
  try {
    if (task.starting_state) {
      await cp(path.resolve(task.dir, task.starting_state), workdir, { recursive: true });
    }
    if (arm === 'with' && artifactDir) await cp(artifactDir, workdir, { recursive: true });
    await writeFile(promptFile, task.prompt);
    if (task.setup) {
      const s = await sh(task.setup, { cwd: workdir, env, timeoutMs: 5 * 60_000 });
      if (s.code !== 0) throw new Error(`setup failed: ${s.stderr || s.stdout}`);
    }

    const subst = (a) =>
      a
        .replaceAll('{prompt}', task.prompt)
        .replaceAll('{prompt_file}', promptFile)
        .replaceAll('{harness_dir}', HARNESS_DIR);
    const [cmd, ...args] = agent.command.map(subst);
    const run = await exec(cmd, args, { cwd: workdir, env, timeoutMs: task.budget.max_minutes * 60_000 });
    await writeFile(outputFile, run.stdout);
    record.wall_seconds = run.seconds;
    record.timed_out = run.timedOut;
    record.agent_exit_code = run.code;

    let metrics = {};
    if (existsSync(metricsFile)) {
      try {
        metrics = JSON.parse(await readFile(metricsFile, 'utf8'));
      } catch {
        metrics = {};
      }
    }
    record.turns = Number.isFinite(metrics.turns) ? metrics.turns : null;
    record.tokens = Number.isFinite(metrics.tokens) ? metrics.tokens : null;
    record.cost_usd = Number.isFinite(metrics.cost_usd) ? metrics.cost_usd : null;

    if (task.stage === 'select') {
      const c = await sh(task.classify, { cwd: workdir, env, timeoutMs: 60_000 });
      record.selection = c.code === 0 ? c.stdout.trim().split('\n').pop() || 'unclassified' : 'unclassified';
    } else {
      record.graders = [];
      for (const g of task.graders) {
        const r = await sh(g.run, { cwd: workdir, env, timeoutMs: 5 * 60_000 });
        record.graders.push({ id: g.id, required: Boolean(g.required), pass: r.code === 0 });
      }
      const required = record.graders.filter((g) => g.required);
      // Completion is binary: every required grader passes, within budget.
      record.passed = !run.timedOut && required.every((g) => g.pass);
      record.required_share = required.filter((g) => g.pass).length / required.length;
    }
  } catch (err) {
    record.error = String(err.message ?? err);
    if (task.stage !== 'select') record.passed = false;
  } finally {
    if (task.teardown) await sh(task.teardown, { cwd: workdir, env, timeoutMs: 5 * 60_000 });
    if (keep) record.workdir = workdir;
    else await rm(workdir, { recursive: true, force: true });
    await rm(scratch, { recursive: true, force: true });
  }
  return record;
}

export async function runSuite({ suiteDir, agents, reps, artifactDir, out, keep = false, only, log = () => {} }) {
  const suite = await loadSuite(suiteDir);
  const tasks = only ? suite.tasks.filter((t) => only.includes(t.id)) : suite.tasks;
  const arms = artifactDir ? ['without', 'with'] : ['without'];
  await mkdir(path.dirname(path.resolve(out)), { recursive: true });
  await writeFile(out, '');
  const records = [];
  for (const agent of agents) {
    for (const task of tasks) {
      for (const arm of arms) {
        for (let rep = 1; rep <= reps; rep++) {
          const record = await runOnce({ suite, task, agent, arm, artifactDir, rep, keep });
          await appendFile(out, JSON.stringify(record) + '\n');
          records.push(record);
          const outcome =
            task.stage === 'select' ? record.selection : record.passed ? 'pass' : 'fail';
          log(`${agent.id}  ${task.id}  ${arm}  rep ${rep}: ${outcome}`);
        }
      }
    }
  }
  return records;
}

async function main() {
  const { values } = parseArgs({
    options: {
      suite: { type: 'string' },
      agents: { type: 'string' },
      reps: { type: 'string', default: '3' },
      artifact: { type: 'string' },
      out: { type: 'string', default: 'results/runs.jsonl' },
      only: { type: 'string' },
      keep: { type: 'boolean', default: false },
    },
  });
  if (!values.suite || !values.agents) {
    console.error(
      'Usage: node harness/run.mjs --suite <dir> --agents <agents.json> [--reps 3] [--artifact <dir>] [--out results/runs.jsonl] [--only id,id] [--keep]',
    );
    process.exit(2);
  }
  const reps = Number(values.reps);
  if (!Number.isInteger(reps) || reps < 1) throw new Error('--reps must be a positive integer.');
  const { agents } = JSON.parse(await readFile(values.agents, 'utf8'));
  for (const a of agents) {
    if (!a.id || !a.model || !a.harness || !Array.isArray(a.command)) {
      throw new Error('Each agent needs `id`, `model`, `harness` and a `command` array.');
    }
  }
  const records = await runSuite({
    suiteDir: values.suite,
    agents,
    reps,
    artifactDir: values.artifact ? path.resolve(values.artifact) : null,
    out: values.out,
    keep: values.keep,
    only: values.only?.split(','),
    log: console.log,
  });
  console.log(`\nWrote ${records.length} runs to ${values.out}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err.message ?? err);
    process.exit(1);
  });
}
