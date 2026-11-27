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
const TAIL = 2000;

/**
 * Run a command in its own process group. On timeout the whole group is
 * killed and the call returns at once, so a wrapper script or a background
 * child cannot outlive the budget.
 */
function exec(command, args, { cwd, env, timeoutMs, shell = false }) {
  return new Promise((resolve) => {
    const started = Date.now();
    let stdout = '';
    let stderr = '';
    let settled = false;
    const child = spawn(command, args, { cwd, env, shell, detached: true, stdio: ['ignore', 'pipe', 'pipe'] });
    const killGroup = () => {
      try {
        process.kill(-child.pid, 'SIGKILL');
      } catch {
        // already gone
      }
    };
    const finish = (extra) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve({ stdout, stderr, seconds: (Date.now() - started) / 1000, timedOut: false, spawnError: null, ...extra });
    };
    const timer = timeoutMs
      ? setTimeout(() => {
          killGroup();
          child.stdout.destroy();
          child.stderr.destroy();
          finish({ code: null, timedOut: true });
        }, timeoutMs)
      : null;
    child.stdout.on('data', (d) => (stdout += d));
    child.stderr.on('data', (d) => (stderr += d));
    child.on('error', (err) => finish({ code: null, spawnError: String(err.message ?? err) }));
    // When the command itself exits, stop anything it left running in the
    // background. Those children may hold the output pipes open, and would
    // otherwise delay `close` until the timeout and be mistaken for one.
    child.on('exit', killGroup);
    child.on('close', (code) => finish({ code }));
  });
}

const sh = (script, opts) => exec(script, [], { ...opts, shell: true });

/** Replace placeholders in one pass, so text inside the prompt is never reinterpreted. */
export function substitute(arg, values) {
  return arg.replace(/\{(prompt|prompt_file|harness_dir|suite_dir)\}/g, (_, key) => values[key]);
}

class InfrastructureError extends Error {}

/**
 * Run a harness-side command (setup, grader, classifier). Anything but a clean
 * verdict is an error, except that with `timeoutIsVerdict` a timeout is
 * returned to the caller to judge.
 */
async function tool(label, script, opts, { timeoutIsVerdict = false } = {}) {
  const r = await sh(script, opts);
  if (r.spawnError) throw new InfrastructureError(`${label} could not start: ${r.spawnError}`);
  if (r.timedOut && timeoutIsVerdict) return r;
  if (r.timedOut) throw new InfrastructureError(`${label} timed out`);
  if (r.code === 126 || r.code === 127) {
    throw new InfrastructureError(`${label} could not run (exit ${r.code}): ${r.stderr.trim().slice(-300)}`);
  }
  return r;
}

export async function runOnce({ suite, task, agent, arm, artifactDir, rep, keep }) {
  // A fresh directory, a fresh home directory and a fresh agent process for
  // every run: no code, files, tool history or memory carry over between
  // runs or between arms.
  const workdir = await mkdtemp(path.join(os.tmpdir(), `adr-${task.id}-`));
  const scratch = await mkdtemp(path.join(os.tmpdir(), 'adr-meta-'));
  const home = path.join(scratch, 'home');
  await mkdir(home);
  const promptFile = path.join(scratch, 'prompt.txt');
  const metricsFile = path.join(scratch, 'metrics.json');
  const outputFile = path.join(scratch, 'agent-output.txt');
  const shared = {
    ...process.env,
    ADR_TASK_ID: task.id,
    ADR_WORKDIR: workdir,
    ADR_PROMPT_FILE: promptFile,
    ADR_METRICS_FILE: metricsFile,
    ADR_MAX_TURNS: task.budget.max_turns == null ? '' : String(task.budget.max_turns),
    ADR_SEED: `${task.id}|${agent.id}|${arm}|${rep}`,
  };
  // The agent is never told where the graders or reference answers are.
  const agentEnv = { ...shared };
  if (!agent.share_home) {
    Object.assign(agentEnv, {
      HOME: home,
      XDG_CONFIG_HOME: path.join(home, '.config'),
      XDG_CACHE_HOME: path.join(home, '.cache'),
      XDG_DATA_HOME: path.join(home, '.local', 'share'),
      XDG_STATE_HOME: path.join(home, '.local', 'state'),
    });
  }
  const toolEnv = { ...shared, ADR_TASK_DIR: task.dir, ADR_AGENT_OUTPUT_FILE: outputFile };
  const toolOpts = { cwd: workdir, env: toolEnv, timeoutMs: 5 * 60_000 };

  const record = {
    suite: suite.id,
    suite_version: suite.version,
    task: task.id,
    stage: task.stage,
    agent: {
      id: agent.id,
      model: agent.model,
      harness: agent.harness,
      version: agent.version,
      permission_mode: agent.permission_mode,
      share_home: Boolean(agent.share_home),
    },
    arm,
    rep,
    started: new Date().toISOString(),
    budget: task.budget,
    interventions_allowed: 0,
    interventions: 0,
    error: null,
  };
  let reachedSetup = false;
  try {
    if (task.starting_state) {
      await cp(path.resolve(task.dir, task.starting_state), workdir, { recursive: true });
    }
    if (arm === 'with' && artifactDir) await cp(artifactDir, workdir, { recursive: true });
    await writeFile(promptFile, task.prompt);
    // From here on the task may have created state outside the working
    // directory, whether through setup or through the agent itself.
    reachedSetup = true;
    if (task.setup) {
      const s = await tool('setup', task.setup, toolOpts);
      if (s.code !== 0) {
        throw new InfrastructureError(`setup failed (exit ${s.code}): ${(s.stderr || s.stdout).trim().slice(-300)}`);
      }
    }

    const values = { prompt: task.prompt, prompt_file: promptFile, harness_dir: HARNESS_DIR, suite_dir: suite.root };
    const [cmd, ...args] = agent.command.map((a) => substitute(a, values));
    const run = await exec(cmd, args, { cwd: workdir, env: agentEnv, timeoutMs: task.budget.max_minutes * 60_000 });
    if (run.spawnError) throw new InfrastructureError(`agent could not start: ${run.spawnError}`);
    await writeFile(outputFile, run.stdout);
    record.wall_seconds = run.seconds;
    record.timed_out = run.timedOut;
    record.agent_exit_code = run.code;
    if (run.code !== 0 && !run.timedOut) record.agent_stderr_tail = run.stderr.slice(-TAIL);

    let metrics = {};
    if (existsSync(metricsFile)) {
      try {
        metrics = JSON.parse(await readFile(metricsFile, 'utf8'));
      } catch {
        metrics = {};
      }
    }
    for (const field of ['turns', 'tokens', 'cost_usd']) {
      record[field] = Number.isFinite(metrics[field]) ? metrics[field] : null;
    }

    if (task.stage === 'select') {
      const c = await tool('classify', task.classify, toolOpts);
      if (c.code !== 0) throw new InfrastructureError(`classify failed (exit ${c.code})`);
      record.selection = c.stdout.trim().split('\n').pop() || 'unclassified';
    } else {
      record.graders = [];
      for (const g of task.graders) {
        // A grader usually runs the agent's code. If that code never
        // returns, the check has failed; it is not a harness fault.
        const timeoutMs = (g.timeout_seconds ?? 300) * 1000;
        const r = await tool(`grader ${g.id}`, g.run, { ...toolOpts, timeoutMs }, { timeoutIsVerdict: true });
        const verdict = { id: g.id, required: Boolean(g.required), pass: !r.timedOut && r.code === 0 };
        if (r.timedOut) verdict.timed_out = true;
        record.graders.push(verdict);
      }
      const required = record.graders.filter((g) => g.required);
      // Completion is binary: every required grader passes, within budget.
      record.passed = !run.timedOut && required.every((g) => g.pass);
      record.required_share = required.filter((g) => g.pass).length / required.length;
    }
  } catch (err) {
    // The run says nothing about the agent. Reports exclude it and count it.
    record.error = String(err.message ?? err);
    delete record.passed;
    delete record.selection;
  } finally {
    if (task.teardown && reachedSetup) {
      const t = await sh(task.teardown, toolOpts);
      if (t.code !== 0) record.teardown_error = `teardown exit ${t.code ?? 'none'}${t.timedOut ? ' (timed out)' : ''}`;
    }
    if (keep) record.workdir = workdir;
    else await rm(workdir, { recursive: true, force: true });
    await rm(scratch, { recursive: true, force: true });
  }
  return record;
}

export function validateAgents(agents) {
  if (!Array.isArray(agents) || !agents.length) throw new Error('No agents configured.');
  const ids = new Set();
  for (const a of agents) {
    for (const f of ['id', 'model', 'harness', 'version', 'permission_mode']) {
      if (!a[f]) throw new Error(`Agent ${a.id ?? '(no id)'}: \`${f}\` is required (specification, section 5).`);
    }
    if (!Array.isArray(a.command) || !a.command.length) throw new Error(`Agent ${a.id}: \`command\` must be a non-empty array.`);
    if (ids.has(a.id)) throw new Error(`Agent id ${a.id} is used twice.`);
    ids.add(a.id);
  }
  return agents;
}

export async function runSuite({ suiteDir, agents, reps, artifactDir, out, keep = false, only, log = () => {} }) {
  validateAgents(agents);
  const suite = await loadSuite(suiteDir);
  const tasks = only ? suite.tasks.filter((t) => only.includes(t.id)) : suite.tasks;
  if (!tasks.length) throw new Error(`No tasks selected${only ? ` by --only ${only.join(',')}` : ''}.`);
  if (artifactDir && !existsSync(artifactDir)) throw new Error(`Artifact directory not found: ${artifactDir}`);
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
          const outcome = record.error
            ? `ERROR ${record.error}`
            : task.stage === 'select'
              ? record.selection
              : record.passed
                ? 'pass'
                : 'fail';
          log(`${agent.id}  ${task.id}  ${arm}  rep ${rep}: ${outcome}${record.teardown_error ? `  [${record.teardown_error}]` : ''}`);
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
  if (reps < 2) console.warn('Warning: the specification requires more than one repetition per task (section 5).');
  const { agents } = JSON.parse(await readFile(values.agents, 'utf8'));
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
  const errors = records.filter((r) => r.error).length;
  console.log(`\nWrote ${records.length} runs to ${values.out}${errors ? `, ${errors} with errors` : ''}`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    console.error(err.message ?? err);
    process.exit(1);
  });
}
