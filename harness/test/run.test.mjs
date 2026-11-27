import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runSuite } from '../run.mjs';
import { validateTask } from '../lib/suite.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const suiteDir = path.join(here, '..', 'examples', 'suite');
const mock = (skill) => ({
  id: `mock-${skill}`, model: 'mock', harness: 'mock-agent', version: '0.1', permission_mode: 'non-interactive',
  command: ['node', '{harness_dir}/examples/mock-agent.mjs', '--skill', String(skill), '--guidance-boost', '0'],
});

test('a perfect agent passes every task and a hopeless one passes none', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'adr-test-'));
  const out = path.join(dir, 'runs.jsonl');
  const records = await runSuite({ suiteDir, agents: [mock(1), mock(0)], reps: 2, out });
  const graded = records.filter((r) => r.stage === 'complete');
  assert.equal(graded.length, 8);
  assert.ok(graded.filter((r) => r.agent.id === 'mock-1').every((r) => r.passed));
  assert.ok(graded.filter((r) => r.agent.id === 'mock-0').every((r) => !r.passed));
  // The wrong answers load and partly work, so partial credit is above zero.
  assert.ok(graded.filter((r) => r.agent.id === 'mock-0').every((r) => r.required_share > 0 && r.required_share < 1));
  assert.ok(records.filter((r) => r.stage === 'select').every((r) => typeof r.selection === 'string'));
  const lines = (await readFile(out, 'utf8')).split('\n').filter(Boolean);
  assert.equal(lines.length, records.length);
  await rm(dir, { recursive: true, force: true });
});

test('every run starts from a fresh copy of the starting state', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'adr-suite-'));
  const taskDir = path.join(dir, 'tasks', 'leak');
  await mkdir(path.join(taskDir, 'start'), { recursive: true });
  await writeFile(path.join(dir, 'suite.yaml'), 'id: leak\nversion: "1"\n');
  await writeFile(path.join(taskDir, 'start', 'seed.txt'), 'seed');
  // The "agent" leaves a marker behind. The grader fails if a marker from an
  // earlier run is already present before the agent's own line is counted.
  await writeFile(
    path.join(taskDir, 'task.yaml'),
    [
      'id: leak', 'title: State must not leak', 'stage: complete', 'prompt: leave a marker',
      'starting_state: start', 'graders:', '  - id: single-marker', '    required: true',
      '    run: test "$(wc -l < marker.txt)" -eq 1',
    ].join('\n'),
  );
  const agent = { id: 'marker', model: 'none', harness: 'sh', command: ['sh', '-c', 'echo run >> marker.txt'] };
  const records = await runSuite({ suiteDir: dir, agents: [agent], reps: 3, out: path.join(dir, 'runs.jsonl') });
  assert.equal(records.length, 3);
  assert.ok(records.every((r) => r.passed));
  await rm(dir, { recursive: true, force: true });
});

test('a run that exceeds its time budget fails', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'adr-suite-'));
  const taskDir = path.join(dir, 'tasks', 'slow');
  await mkdir(taskDir, { recursive: true });
  await writeFile(path.join(dir, 'suite.yaml'), 'id: slow\nversion: "1"\n');
  await writeFile(
    path.join(taskDir, 'task.yaml'),
    ['id: slow', 'title: Slow', 'stage: complete', 'prompt: wait', 'budget:', '  max_minutes: 0.01',
      'graders:', '  - id: always', '    required: true', '    run: "true"'].join('\n'),
  );
  const agent = { id: 'sleeper', model: 'none', harness: 'sh', command: ['sleep', '5'] };
  const [r] = await runSuite({ suiteDir: dir, agents: [agent], reps: 1, out: path.join(dir, 'runs.jsonl') });
  assert.equal(r.timed_out, true);
  assert.equal(r.passed, false);
  await rm(dir, { recursive: true, force: true });
});

test('task validation rejects tasks the specification does not allow', () => {
  const base = { id: 'x', title: 'x', stage: 'complete', prompt: 'p' };
  assert.throws(() => validateTask({ ...base, graders: [{ id: 'g', run: 'true', required: false }] }, '.'), /required graders/);
  assert.throws(() => validateTask({ ...base, stage: 'select' }, '.'), /classify/);
  assert.throws(() => validateTask({ ...base, stage: 'nope' }, '.'), /stage/);
});
