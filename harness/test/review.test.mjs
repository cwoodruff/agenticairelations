import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { runSuite } from '../run.mjs';
import { validateTask } from '../lib/suite.mjs';
import { pairedDifference } from '../lib/stats.mjs';
import { buildReport, toMarkdown } from '../report.mjs';

const base = { model: 'none', harness: 'sh', version: '0', permission_mode: 'non-interactive' };
const noop = { ...base, id: 'noop', command: ['true'] };

async function tinySuite(lines) {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'adr-suite-'));
  const taskDir = path.join(dir, 'tasks', 't');
  await mkdir(path.join(taskDir, 'start'), { recursive: true });
  await writeFile(path.join(dir, 'suite.yaml'), 'id: tiny\nversion: "1"\n');
  await writeFile(path.join(taskDir, 'start', 'seed.txt'), 'seed\n');
  await writeFile(
    path.join(taskDir, 'task.yaml'),
    ['id: t', 'title: T', 'stage: complete', 'prompt: do it', 'starting_state: start', ...lines].join('\n'),
  );
  return { dir, out: path.join(dir, 'runs.jsonl') };
}

test('a time budget that would disable the timeout is rejected', () => {
  const t = { id: 'x', title: 'x', stage: 'complete', prompt: 'p', graders: [{ id: 'g', run: 'true', required: true }] };
  for (const max_minutes of [0, null, -1, 'ten', Infinity]) {
    assert.throws(() => validateTask({ ...t, budget: { max_minutes } }, '.'), /max_minutes/, String(max_minutes));
  }
  assert.equal(validateTask(t, '.').budget.max_minutes, 20);
  assert.equal(validateTask({ ...t, budget: { max_minutes: 0.5 } }, '.').budget.max_minutes, 0.5);
  assert.throws(() => validateTask({ ...t, graders: [{ id: 'g', run: 'true', required: true, timeout_seconds: 0 }] }, '.'), /timeout_seconds/);
});

test('teardown runs for a task with no setup', async () => {
  const dir0 = await mkdtemp(path.join(os.tmpdir(), 'adr-td-'));
  const flag = path.join(dir0, 'torn-down');
  const { dir, out } = await tinySuite([`teardown: touch ${flag}`, 'graders:', '  - id: g', '    required: true', '    run: "true"']);
  const [r] = await runSuite({ suiteDir: dir, agents: [noop], reps: 1, out });
  assert.equal(r.passed, true);
  assert.equal(existsSync(flag), true);
  await rm(dir, { recursive: true, force: true });
  await rm(dir0, { recursive: true, force: true });
});

test('the t interval stays conservative beyond the tabulated range', () => {
  // 32 tasks alternating 0 and 1: mean 0.5, sd = sqrt(32/31)/2.
  const diffs = Array.from({ length: 32 }, (_, i) => i % 2);
  const d = pairedDifference(diffs);
  const sd = Math.sqrt(32 / 31) / 2;
  const half = (d.high - d.low) / 2;
  const critical = (half * Math.sqrt(32)) / sd;
  assert.ok(critical > 2.03, `critical value ${critical} must not fall to 1.96`);
});

test('fresh-home and shared-home runs of one agent are reported separately', () => {
  const agent = { ...base, id: 'a', share_home: false };
  const run = (over) => ({
    suite: 's', suite_version: '1', stage: 'complete', task: 't1', agent, arm: 'without', rep: 1, error: null,
    started: '2026-11-27T10:00:00.000Z', budget: { max_minutes: 1, max_turns: null }, interventions: 0,
    wall_seconds: 1, timed_out: false, agent_exit_code: 0, graders: [], passed: true, required_share: 1, ...over,
  });
  const report = buildReport([run({}), run({ agent: { ...agent, share_home: true }, passed: false })]);
  assert.equal(report.agents.length, 2);
  const shared = report.agents.find((a) => a.agent.share_home);
  assert.equal(shared.arms.without.completion.faisr.rate, 0);
  assert.match(toMarkdown(report), /used the real home directory/);
});

test('a wrapper that exits while a background child holds its output open is not a timeout', async () => {
  const { dir, out } = await tinySuite(['budget:', '  max_minutes: 0.05', 'graders:', '  - id: g', '    required: true', '    run: test -f done.txt']);
  // The background sleep inherits stdout and would keep the pipe open past the 3-second budget.
  const agent = { ...base, id: 'bg', command: ['sh', '-c', 'sleep 20 & echo ok > done.txt; exit 0'] };
  const [r] = await runSuite({ suiteDir: dir, agents: [agent], reps: 1, out });
  assert.equal(r.timed_out, false);
  assert.equal(r.agent_exit_code, 0);
  assert.equal(r.passed, true);
  assert.ok(r.wall_seconds < 2);
  await rm(dir, { recursive: true, force: true });
});

test('a grader that times out is a failed check, not an infrastructure error', async () => {
  const { dir, out } = await tinySuite([
    'graders:', '  - id: hangs', '    required: true', '    run: sleep 30', '    timeout_seconds: 0.3',
    '  - id: fine', '    required: true', '    run: "true"',
  ]);
  const [r] = await runSuite({ suiteDir: dir, agents: [noop], reps: 1, out });
  assert.equal(r.error, null);
  assert.equal(r.passed, false);
  assert.equal(r.required_share, 0.5);
  assert.deepEqual(r.graders[0], { id: 'hangs', required: true, pass: false, timed_out: true });
  const report = buildReport([r]);
  assert.equal(report.agents[0].arms.without.completion.faisr.n, 1);
  assert.match(toMarkdown(report), /a grader timed out, counted as a failed check: 1/);
  await rm(dir, { recursive: true, force: true });
});
