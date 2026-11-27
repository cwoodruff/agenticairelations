import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runSuite, substitute, validateAgents } from '../run.mjs';
import { validateTask } from '../lib/suite.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const suiteDir = path.join(here, '..', 'examples', 'suite');
const base = { model: 'none', harness: 'sh', version: '0', permission_mode: 'non-interactive' };
const mock = (skill, boost = 0) => ({
  ...base, id: `mock-${skill}`, model: 'mock', harness: 'mock-agent',
  command: ['node', '{harness_dir}/examples/mock-agent.mjs', '--suite', '{suite_dir}', '--skill', String(skill), '--guidance-boost', String(boost)],
});

/** Build a one-task suite in a temp directory. `lines` is the task.yaml body after the common header. */
async function tinySuite(lines, files = {}) {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'adr-suite-'));
  const taskDir = path.join(dir, 'tasks', 't');
  await mkdir(path.join(taskDir, 'start'), { recursive: true });
  await writeFile(path.join(dir, 'suite.yaml'), 'id: tiny\nversion: "1"\n');
  await writeFile(path.join(taskDir, 'start', 'seed.txt'), 'seed\n');
  for (const [name, body] of Object.entries(files)) await writeFile(path.join(taskDir, name), body);
  await writeFile(
    path.join(taskDir, 'task.yaml'),
    ['id: t', 'title: T', 'stage: complete', 'prompt: do it', 'starting_state: start', ...lines].join('\n'),
  );
  return { dir, out: path.join(dir, 'runs.jsonl') };
}
const grader = (run) => ['graders:', '  - id: g', '    required: true', `    run: ${JSON.stringify(run)}`];

test('a perfect agent passes every task and a hopeless one passes none', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'adr-test-'));
  const out = path.join(dir, 'runs.jsonl');
  const records = await runSuite({ suiteDir, agents: [mock(1), mock(0)], reps: 2, out });
  assert.ok(records.every((r) => r.error === null), JSON.stringify(records.filter((r) => r.error)));
  const graded = records.filter((r) => r.stage === 'complete');
  assert.equal(graded.length, 8);
  assert.ok(graded.filter((r) => r.agent.id === 'mock-1').every((r) => r.passed));
  const hopeless = graded.filter((r) => r.agent.id === 'mock-0');
  assert.ok(hopeless.every((r) => !r.passed));
  // The wrong answers load and partly work, so partial credit is above zero.
  assert.ok(hopeless.every((r) => r.required_share > 0 && r.required_share < 1));
  assert.ok(records.filter((r) => r.stage === 'select').every((r) => typeof r.selection === 'string'));
  assert.ok(graded.every((r) => Number.isFinite(r.turns) && Number.isFinite(r.tokens)));
  assert.equal((await readFile(out, 'utf8')).split('\n').filter(Boolean).length, records.length);
  await rm(dir, { recursive: true, force: true });
});

test('the artifact reaches the "with" arm only', async () => {
  const { dir, out } = await tinySuite(grader('test -f AGENTS.md'));
  const artifact = path.join(dir, 'artifact');
  await mkdir(artifact);
  await writeFile(path.join(artifact, 'AGENTS.md'), 'guidance\n');
  const agent = { ...base, id: 'noop', command: ['true'] };
  const records = await runSuite({ suiteDir: dir, agents: [agent], reps: 2, artifactDir: artifact, out });
  assert.equal(records.length, 4);
  assert.ok(records.filter((r) => r.arm === 'with').every((r) => r.passed));
  assert.ok(records.filter((r) => r.arm === 'without').every((r) => r.passed === false && r.error === null));
  await rm(dir, { recursive: true, force: true });
});

test('every run starts from a fresh copy of the starting state', async () => {
  // The agent appends a line. More than one line means an earlier run leaked.
  const { dir, out } = await tinySuite(grader('test "$(wc -l < marker.txt)" -eq 1'));
  const agent = { ...base, id: 'marker', command: ['sh', '-c', 'echo run >> marker.txt'] };
  const records = await runSuite({ suiteDir: dir, agents: [agent], reps: 3, out });
  assert.ok(records.every((r) => r.passed));
  await rm(dir, { recursive: true, force: true });
});

test('the agent gets a fresh home directory and is not told where the graders are', async () => {
  const realHome = os.homedir();
  const { dir, out } = await tinySuite(grader(`test "$(cat home.txt)" != "${realHome}" && test -z "$(cat taskdir.txt)" && test -n "$ADR_TASK_DIR"`));
  const agent = { ...base, id: 'env', command: ['sh', '-c', 'printf %s "$HOME" > home.txt; printf %s "$ADR_TASK_DIR" > taskdir.txt'] };
  const [r] = await runSuite({ suiteDir: dir, agents: [agent], reps: 1, out });
  assert.equal(r.error, null);
  assert.equal(r.passed, true);
  const [shared] = await runSuite({ suiteDir: dir, agents: [{ ...agent, share_home: true }], reps: 1, out });
  assert.equal(shared.passed, false);
  assert.equal(shared.agent.share_home, true);
  await rm(dir, { recursive: true, force: true });
});

test('a timeout stops the whole process tree at the budget', async () => {
  const { dir, out } = await tinySuite(['budget:', '  max_minutes: 0.01', ...grader('true')]);
  const late = path.join(dir, 'late.txt');
  // A wrapper shell with a background child that would write a file later.
  const agent = { ...base, id: 'sleeper', command: ['sh', '-c', `(sleep 2; echo late > ${late}) & sleep 30`] };
  const started = Date.now();
  const [r] = await runSuite({ suiteDir: dir, agents: [agent], reps: 1, out });
  assert.ok(Date.now() - started < 5000, 'returned at the budget, not when the children finished');
  assert.equal(r.timed_out, true);
  assert.equal(r.passed, false);
  assert.equal(r.error, null);
  assert.ok(r.wall_seconds < 3);
  await new Promise((resolve) => setTimeout(resolve, 2500));
  assert.equal(existsSync(late), false, 'the background child was killed');
  await rm(dir, { recursive: true, force: true });
});

test('an agent that cannot start is an error, never a pass', async () => {
  // The grader passes on the untouched starting state, so only the error stops a false pass.
  const { dir, out } = await tinySuite(grader('test -f seed.txt'));
  const agent = { ...base, id: 'missing', command: ['no-such-agent-cli-xyz'] };
  const [r] = await runSuite({ suiteDir: dir, agents: [agent], reps: 1, out });
  assert.match(r.error, /agent could not start/);
  assert.equal(r.passed, undefined);
  await rm(dir, { recursive: true, force: true });
});

test('an agent that exits with an error code is graded, and the code is recorded', async () => {
  const { dir, out } = await tinySuite(grader('test -f seed.txt'));
  const agent = { ...base, id: 'exit3', command: ['sh', '-c', 'echo boom >&2; exit 3'] };
  const [r] = await runSuite({ suiteDir: dir, agents: [agent], reps: 1, out });
  assert.equal(r.error, null);
  assert.equal(r.agent_exit_code, 3);
  assert.match(r.agent_stderr_tail, /boom/);
  await rm(dir, { recursive: true, force: true });
});

test('a failed setup or a grader that cannot run is an error', async () => {
  const a = await tinySuite(['setup: exit 7', 'teardown: "true"', ...grader('true')]);
  const agent = { ...base, id: 'noop', command: ['true'] };
  const [setup] = await runSuite({ suiteDir: a.dir, agents: [agent], reps: 1, out: a.out });
  assert.match(setup.error, /setup failed \(exit 7\)/);
  assert.equal(setup.passed, undefined);
  const b = await tinySuite(grader('no-such-grader-command-xyz'));
  const [g] = await runSuite({ suiteDir: b.dir, agents: [agent], reps: 1, out: b.out });
  assert.match(g.error, /grader g could not run \(exit 127\)/);
  await rm(a.dir, { recursive: true, force: true });
  await rm(b.dir, { recursive: true, force: true });
});

test('setup and teardown run, and a failed teardown is recorded', async () => {
  const { dir, out } = await tinySuite(['setup: echo ready > setup.txt', 'teardown: exit 9', ...grader('test -f setup.txt')]);
  const [r] = await runSuite({ suiteDir: dir, agents: [{ ...base, id: 'noop', command: ['true'] }], reps: 1, out });
  assert.equal(r.passed, true);
  assert.equal(r.teardown_error, 'teardown exit 9');
  await rm(dir, { recursive: true, force: true });
});

test('placeholders are substituted in one pass and the prompt is passed through intact', () => {
  const prompt = "Charge $$5 and echo $& then {prompt_file} and $'x";
  const values = { prompt, prompt_file: '/p', harness_dir: '/h', suite_dir: '/s' };
  assert.equal(substitute('{prompt}', values), prompt);
  assert.equal(substitute('--file={prompt_file} {suite_dir} {harness_dir} {other}', values), '--file=/p /s /h {other}');
});

test('selecting no tasks or misconfiguring an agent fails loudly', async () => {
  const ok = { ...base, id: 'a', command: ['true'] };
  await assert.rejects(runSuite({ suiteDir, agents: [ok], reps: 1, out: path.join(os.tmpdir(), 'adr-none.jsonl'), only: ['nope'] }), /No tasks selected/);
  assert.throws(() => validateAgents([{ ...ok, version: undefined }]), /`version` is required/);
  assert.throws(() => validateAgents([{ ...ok, permission_mode: '' }]), /`permission_mode` is required/);
  assert.throws(() => validateAgents([ok, ok]), /used twice/);
  assert.throws(() => validateAgents([]), /No agents/);
});

test('task validation rejects tasks the specification does not allow', () => {
  const t = { id: 'x', title: 'x', stage: 'complete', prompt: 'p' };
  assert.throws(() => validateTask({ ...t, graders: [{ id: 'g', run: 'true', required: false }] }, '.'), /required graders/);
  assert.throws(() => validateTask({ ...t, stage: 'select' }, '.'), /classify/);
  assert.throws(() => validateTask({ ...t, stage: 'nope' }, '.'), /stage/);
});
